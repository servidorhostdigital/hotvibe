/**
 * Motor de Inteligência e NLP para o Chat da Live Room
 * Interpreta intenções, perguntas, respostas, elogios, xingamentos, pedidos de foto/vídeo,
 * dúvidas de pagamento e contexto dinâmico sem precisar de API externa de IA.
 */

export interface ChatContext {
  userName: string | null
  chatStep: number
  isVip: boolean
  previewsLeft: number
  city?: string | null
}

export interface ChatDecision {
  responseText: string
  nextStep: number
  extractedName?: string | null
  extractedCity?: string | null
  triggerPreview?: boolean
  openVipModal?: boolean
}

// Dicionários semânticos
const GREETINGS = ['oi', 'oie', 'ola', 'olá', 'eai', 'eae', 'opa', 'bom dia', 'boa tarde', 'boa noite', 'salve', 'fala', 'coé', 'opa eai']
const POSITIVES = ['sim', 'quero', 'estou', 'to', 'tô', 'bora', 'vamos', 'claro', 'com certeza', 'manda', 'mostra', 'pode ser', 'adoro', 'demais', 'obvio', 'óbvio', 'agora', 'topo', 'com ctz', 'ss', 'simm']
const NEGATIVES = ['não', 'nao', 'nunca', 'jamais', 'nem', 'sai', 'não quero', 'nao quero', 'deixa', 'para', 'mentira', 'nn']
const COMPLIMENTS = ['linda', 'gostosa', 'delicia', 'delícia', 'maravilhosa', 'perfeita', 'princesa', 'deusa', 'tesao', 'tesão', 'gata', 'maravilhosa', 'boazuda', 'deliciosa', 'sexy', 'perfeita']
const CITIES_COMMON = ['sao paulo', 'são paulo', 'sp', 'rio', 'rio de janeiro', 'rj', 'bh', 'belo horizonte', 'curitiba', 'brasilia', 'brasília', 'salvador', 'fortaleza', 'recife', 'porto alegre', 'goiania', 'goiânia', 'manaus', 'campinas', 'florianopolis', 'florianópolis']
const ASKING_AGE = ['quantos anos', 'sua idade', 'qual sua idade', 'idade']
const ASKING_LOCATION_MODEL = ['de onde voce é', 'de onde você é', 'onde mora', 'onde voce mora', 'qual sua cidade', 'onde vc mora', 'de onde vc é']
const ASKING_PAYMENT = ['como paga', 'quanto custa', 'valor', 'pix', 'como funciona', 'é pago', 'preco', 'preço', 'tem que pagar']
const ASKING_PHOTO_VIDEO = ['manda foto', 'manda video', 'manda nudes', 'manda nude', 'mostra a', 'tira a roupa', 'pelada', 'nua', 'mostra peito', 'mostra bct', 'foto', 'video', 'nudes', 'nude', 'previa', 'prévia']
const SKEPTICAL = ['é gravado', 'é fake', 'é robô', 'e robo', 'bot', 'é de verdade', 'ao vivo mesmo', 'ta gravado', 'tá gravado', 'vc é real', 'voce é real']

export function processUserChat(userMessage: string, context: ChatContext): ChatDecision {
  const msg = userMessage.trim().toLowerCase()
  const currentName = context.userName

  // 1. Extração Inteligente de Nome
  const extractName = (text: string): string | null => {
    const lower = text.toLowerCase().trim()
    const ignoreWords = [
      ...GREETINGS, ...POSITIVES, ...NEGATIVES,
      'como', 'voce', 'você', 'vc', 'chama', 'seu', 'nome', 'quem', 'e', 'é',
      'aqui', 'tudo', 'bem', 'beleza', 'tranquilo', 'joia', 'mora', 'cidade', 'onde'
    ]

    if (lower.includes('sou o ') || lower.includes('sou a ')) {
      const match = lower.match(/sou [oa] (\w+)/)
      if (match) return capitalize(match[1])
    }
    if (lower.includes('meu nome é ') || lower.includes('me chamo ') || lower.includes('chamo ')) {
      const match = lower.match(/(?:meu nome é|me chamo|chamo) (\w+)/)
      if (match) return capitalize(match[1])
    }
    
    // Se for uma ou duas palavras curtas
    const words = lower.split(/\s+/)
    if (words.length <= 2) {
      const validWord = words.find(w => w.length > 2 && !ignoreWords.includes(w))
      if (validWord) return capitalize(validWord)
    }
    return null
  }

  // 2. Extração de Cidade
  const extractCity = (text: string): string | null => {
    const lower = text.toLowerCase()
    if (lower.includes('sou de ') || lower.includes('moro em ') || lower.includes('moro no ') || lower.includes('moro na ')) {
      const match = lower.match(/(?:sou de|moro em|moro no|moro na) ([a-zA-Zá-úÁ-Ú\s]+)/)
      if (match) return capitalize(match[1].trim())
    }
    for (const city of CITIES_COMMON) {
      if (lower.includes(city)) return capitalize(city)
    }
    return null
  }

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()

  const extractedName = !currentName ? extractName(userMessage) : null
  const effectiveName = extractedName || currentName || 'amor'
  const extractedCity = extractCity(userMessage)

  // 3. Flags de Intenção
  const hasGreeting = GREETINGS.some(g => msg === g || msg.startsWith(g + ' ') || msg.endsWith(' ' + g))
  const hasPositive = POSITIVES.some(p => msg.includes(p))
  const hasNegative = NEGATIVES.some(n => msg.includes(n))
  const hasCompliment = COMPLIMENTS.some(c => msg.includes(c))
  const isAskingHerName = ['seu nome', 'qual seu nome', 'como vc se chama', 'como você se chama', 'como você chama', 'como vc chama', 'quem é você', 'quem e vc', 'quem é vc'].some(q => msg.includes(q))
  const isAskingAge = ASKING_AGE.some(q => msg.includes(q))
  const isAskingHerLocation = ASKING_LOCATION_MODEL.some(q => msg.includes(q))
  const isAskingPayment = ASKING_PAYMENT.some(q => msg.includes(q))
  const isAskingPhoto = ASKING_PHOTO_VIDEO.some(q => msg.includes(q))
  const isSkeptical = SKEPTICAL.some(q => msg.includes(q))

  // RESPOSTAS PRIORITÁRIAS / INTERRUPÇÕES DE CONTEXTO

  // Se o usuário duvidar que é real / falar de bot
  if (isSkeptical) {
    return {
      responseText: `Tô ao vivo sim amor, para de bobagem! Olha eu aqui na câmera falando com você... 😈 Agora me fala, como você se chama?`,
      nextStep: Math.max(1, context.chatStep),
      extractedName
    }
  }

  // Se perguntar sobre valores / pagamento
  if (isAskingPayment) {
    return {
      responseText: `O acesso à minha câmera privada VIP tá só R$ 9,90 por PIX liberado na hora! Lá eu tiro tudo sem censura e obedeço seus comandos... Quer que eu abra pra você? 🔥`,
      nextStep: context.chatStep,
      openVipModal: true
    }
  }

  // Se pedir foto/vídeo/nudes diretamente
  if (isAskingPhoto) {
    return {
      responseText: `Ai que apressadinho você, ${effectiveName}... 🥵 Vou te mandar uma provinha aqui no chat agora, clica no botão pra assistir!`,
      nextStep: 5,
      triggerPreview: true,
      extractedName
    }
  }

  // Se perguntar a idade dela
  if (isAskingAge) {
    return {
      responseText: `Eu tenho 21 aninhos... bem novinha e cheia de vontade 🙈 E você, tem quantos anos?`,
      nextStep: context.chatStep,
      extractedName
    }
  }

  // Se perguntar de onde ela é
  if (isAskingHerLocation) {
    return {
      responseText: `Eu moro em Florianópolis amor, pertinho da praia... 🌊 Mas passo a maior parte do tempo aqui no meu quarto quentinho. E você, é de onde?`,
      nextStep: 2,
      extractedName
    }
  }

  // Se perguntar o nome dela
  if (isAskingHerName) {
    if (currentName || extractedName) {
      return {
        responseText: `Meu nome é Nicole... mas você pode me chamar de sua safada, ${effectiveName} 😈🔥 E de onde você é mesmo?`,
        nextStep: 2,
        extractedName
      }
    }
    return {
      responseText: `Meu nome é Nicole... mas na cama os homens me chamam de safada e você pode me chamar como quiser, amor 😈🔥 E você, como se chama?`,
      nextStep: 1
    }
  }

  // Se fizer só um elogio solto
  if (hasCompliment && msg.length < 25 && context.chatStep > 1) {
    return {
      responseText: `Obrigada amor... fico toda arrepiada quando você me elogia assim 🙈 Quer ver o que essa gostosa tá fazendo agora?`,
      nextStep: Math.min(4, context.chatStep + 1),
      extractedName
    }
  }

  // MÁQUINA DE ESTADOS DO FUNIL PRINCIPAL

  switch (context.chatStep) {
    case 0: { // Início
      if (hasGreeting && !extractedName) {
        return {
          responseText: 'Que bom que você me respondeu... Eu tava me sentindo tão sozinha aqui. Como você se chama? 💋',
          nextStep: 1
        }
      }
      if (extractedName) {
        return {
          responseText: `Nossa, ${extractedName}... adorei seu nome. E de qual cidade você é? Quero saber de onde é esse homem que tá me deixando curiosa... 😈`,
          nextStep: 2,
          extractedName
        }
      }
      return {
        responseText: 'Que bom que você me respondeu... Eu tava me sentindo tão sozinha aqui no quarto. Como você se chama, gato? 💋',
        nextStep: 1
      }
    }

    case 1: { // Pegando o Nome
      if (msg.includes('e o seu') || msg.includes('e vc') || msg.includes('e você')) {
        return {
          responseText: `Meu nome é Nicole... mas na cama os homens me chamam de safada 😈🔥 E de qual cidade você é? Quero saber de onde você tá me assistindo...`,
          nextStep: 2,
          extractedName
        }
      }
      return {
        responseText: `Nossa, ${effectiveName}... adorei seu nome. E de qual cidade você é? Quero saber de onde é esse homem que tá me deixando curiosa... 😈`,
        nextStep: 2,
        extractedName
      }
    }

    case 2: { // Pegando a Cidade
      const cityMention = extractedCity ? `aí de ${extractedCity}` : 'daí'
      return {
        responseText: `Hummm, adoro os homens ${cityMention}... Você tá sozinho aí agora no sigilo pra gente conversar bem à vontade? 🥵`,
        nextStep: 3,
        extractedCity
      }
    }

    case 3: { // Sozinho ou Acompanhado?
      if (hasPositive || msg.includes('sozinho') || msg.includes('quarto')) {
        return {
          responseText: `Que delícia, ${effectiveName}... Eu tô aqui toda molhadinha pensando em você. Quer ver onde minha mão tá descendo? 💦`,
          nextStep: 4
        }
      }
      if (hasNegative || msg.includes('gente') || msg.includes('esposa') || msg.includes('mulher') || msg.includes('trabalho')) {
        return {
          responseText: `No sigilo e escondido fica ainda mais gostoso... coloca um fone ou vai pro banheiro. Eu tô bem excitada. Quer ver onde minha mão tá tocando? 💦`,
          nextStep: 4
        }
      }
      return {
        responseText: `Eu tô aqui toda molhadinha pensando em você... Quer ver onde minha mão tá descendo agora? 💦`,
        nextStep: 4
      }
    }

    case 4: { // Quer ver?
      if (hasPositive || msg.includes('veja') || msg.includes('sim') || msg.includes('manda')) {
        return {
          responseText: `Vou tirar minha calcinha bem devagar e abrir a câmera só pra você... Quer me ver todinha ao vivo sem censura? 🤤`,
          nextStep: 5
        }
      }
      if (hasNegative) {
        return {
          responseText: `Ah ${effectiveName}, para de ser tímido comigo... Vou tirar minha calcinha bem devagar e abrir a câmera só pra você. Quer me ver todinha ao vivo? 🤤`,
          nextStep: 5
        }
      }
      return {
        responseText: `Vou tirar minha calcinha bem devagar e abrir a câmera só pra você... Quer me ver todinha ao vivo? 🤤`,
        nextStep: 5
      }
    }

    case 5:
    default: {
      return {
        responseText: `Clica no botão aqui embaixo pra ver uma provinha exclusiva do que eu vou fazer com você... 🔥`,
        nextStep: 6,
        triggerPreview: true
      }
    }
  }
}
