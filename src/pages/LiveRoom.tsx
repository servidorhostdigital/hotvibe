import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Send, Eye, Download } from 'lucide-react'
import { buildUrlWithUtms, captureAndPersistUtms } from '../utils/utm'
import { usePixCheckout } from '../hooks/usePixCheckout'
import { PixModal } from '../components/PixModal'

// Configuração das Ofertas
const OFFERS = [
  { 
    id: 'front', 
    triggerTime: 60, // 1 minuto (Front-end)
    title: 'Acesso VIP Privado', 
    price: '9,90', 
    copy: 'A prévia acabou! Desbloqueie a câmera sem censura para continuarmos nossa conversa quente.',
    benefits: ['Câmera sem censura', 'Chat liberado', 'Áudio original'] 
  },
  { 
    id: 'upsell_reconexao', 
    triggerTime: 450, // 7 minutos e 30 segundos (450s)
    title: 'Conexão Perdida ⚠️', 
    price: '9,90', 
    badge: 'ESTABILIDADE DO SERVIDOR 📶',
    copy: 'Sua conexão com a sala privada caiu por sobrecarga de tráfego. Pague a taxa de reconexão prioritária para continuar assistindo sem interrupções.',
    benefits: ['Reconexão instantânea', 'Servidor prioritário anti-queda', 'Qualidade 1080p sem travamentos'] 
  },
  { 
    id: 'upsell_1', 
    triggerTime: 600, // 10 minutos (Upsell 1 - Brinquedo)
    title: 'Controle o Brinquedo', 
    price: '29,90', 
    copy: 'Eu tô usando um brinquedinho... Quer assumir o controle dele e me fazer enlouquecer?',
    benefits: ['Controle do Lovense', 'Nível máximo liberado', 'Reações ao vivo'] 
  },
  { 
    id: 'upsell_2', 
    triggerTime: 960, // 16 minutos (Upsell 2 - WhatsApp)
    title: 'WhatsApp Privado', 
    price: '49,90', 
    copy: 'Quer meu número pessoal pra gente continuar no sigilo? Ganhe uma chamada de vídeo grátis e fotos diárias.',
    benefits: ['Meu WhatsApp real', 'Chamada de vídeo grátis', 'Fotos exclusivas diariamente'] 
  }
]

export default function LiveRoom() {
  const { slug } = useParams<{ slug: string }>()
  const currentSlug = slug || 'nicole'
  const videoRef = useRef<HTMLVideoElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showAgeGate, setShowAgeGate] = useState(false)
  const [isVip, setIsVip] = useState(false)
  const [showVipModal, setShowVipModal] = useState(false)
  const [showPixModal, setShowPixModal] = useState(false)
  const [pendingPlan, setPendingPlan] = useState<string>('vip_total')
  const [chatStep, setChatStep] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [previewsLeft, setPreviewsLeft] = useState(2)
  const [showPreviewButton, setShowPreviewButton] = useState(false)
  const [sessionId] = useState(() => 'sess_' + Math.random().toString(36).substring(2, 12))
  const [messages, setMessages] = useState<Array<{
    id: number | string;
    name: string;
    text: string;
    isModel: boolean;
    previewUrl?: string;
    previewType?: 'video' | 'image' | 'audio';
    previewInfo?: { remaining: number };
    isLastPreview?: boolean;
  }>>([
    { id: 1, name: 'NICOLE OLIVEIRA 🔥', text: 'eii... tem alguém aí pra bater papo? 🙊', isModel: true }
  ])

  // Estado do Funil de Vídeo
  const [unlockedOffers, setUnlockedOffers] = useState<string[]>([])
  const [activeOffer, setActiveOffer] = useState<typeof OFFERS[0] | null>(null)

  // Hook do PIX Checkout
  const pix = usePixCheckout({
    slug: currentSlug,
    sessionId: sessionId,
    tracking: Object.fromEntries(new URLSearchParams(sessionStorage.getItem('captured_utms') || '')),
    onSuccess: () => {
      setShowPixModal(false)
      handlePaymentSuccess()
    }
  })

  // Auto-scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Monitora o tempo do vídeo para disparar as ofertas
  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    const currentTime = videoRef.current.currentTime

    // Verifica se alguma oferta deve ser disparada
    const offerToTrigger = OFFERS.find(
      offer => currentTime >= offer.triggerTime && !unlockedOffers.includes(offer.id)
    )

    // Só pausa e exibe a oferta se ela ainda não estiver ativa
    if (offerToTrigger && activeOffer?.id !== offerToTrigger.id) {
      videoRef.current.pause()
      setActiveOffer(offerToTrigger)
    }
  }

  const handlePaymentSuccess = () => {
    setIsVip(true)
    setShowVipModal(false)
    setShowPreviewButton(false)

    // Remove as mensagens/cards de prévia do chat quando o VIP é liberado
    setMessages(prev => prev.filter(msg => !msg.previewUrl && !msg.previewInfo))

    if (activeOffer) {
      const currentOfferId = activeOffer.id
      setUnlockedOffers(prev => [...prev, currentOfferId])
      setActiveOffer(null)
    } else {
      // Se pagou o Front-end pelo modal VIP, avança o vídeo para 5 minutos (300s)
      setUnlockedOffers(prev => [...prev, 'front'])
      if (videoRef.current) {
        videoRef.current.currentTime = 300 // Inicia a partir de 5 minutos
      }
    }
    
    // Retoma a reprodução do vídeo
    if (videoRef.current) {
      videoRef.current.play()
    }
  }

  const handleOpenPix = (valor: number, plano: string) => {
    setPendingPlan(plano)
    setShowVipModal(false)
    setShowPixModal(true)
    pix.generatePix(valor, plano)
  }

  const handleSendMessage = () => {
    if (!inputValue.trim() || activeOffer || showVipModal) return

    const userMessage = inputValue.trim()
    const userMessageLower = userMessage.toLowerCase()

    // Adiciona a mensagem do usuário
    setMessages(prev => [...prev, { id: Date.now(), name: 'VOCÊ', text: userMessage, isModel: false }])
    setInputValue('')
    setIsTyping(true)

    // Lógica de respostas dinâmicas baseadas no contexto da mensagem do usuário
    let responseText = ''

    if (chatStep === 0) {
      setChatStep(1)
      
      responseText = 'Que bom que você me respondeu... Eu tava me sentindo tão sozinha aqui. Como você se chama? 💋'
      
    } else if (chatStep === 1) {
      setChatStep(2)
      
      // Tenta extrair o nome se o usuário digitou algo como "sou o joão" ou "meu nome é carlos"
      let userName = ''
      const words = userMessage.split(' ')
      if (words.length <= 2) {
        userName = words[0] // Se digitou só o nome
      } else if (userMessageLower.includes('sou o') || userMessageLower.includes('sou a')) {
        const match = userMessageLower.match(/sou [oa] (\w+)/)
        if (match) userName = match[1]
      } else if (userMessageLower.includes('nome é') || userMessageLower.includes('chamo')) {
        const match = userMessageLower.match(/(?:nome é|chamo) (\w+)/)
        if (match) userName = match[1]
      }

      const nameCapitalized = userName ? userName.charAt(0).toUpperCase() + userName.slice(1) : 'amor'

      responseText = `Nossa, ${nameCapitalized}... adorei seu nome. E de qual cidade você é? Quero saber de onde é esse homem que tá me deixando curiosa... 😈`
      
    } else if (chatStep === 2) {
      setChatStep(3)
      
      responseText = 'Hummm, adoro os homens daí... Você tá sozinho aí agora pra gente conversar no sigilo? 🥵'
      
    } else if (chatStep === 3) {
      setChatStep(4)
      
      if (userMessageLower.includes('sim') || userMessageLower.includes('estou') || userMessageLower.includes('sozinho')) {
        responseText = 'Que delícia... Eu tô aqui toda molhadinha pensando em você. Quer ver onde minha mão tá descendo? 💦'
      } else if (userMessageLower.includes('não') || userMessageLower.includes('nao') || userMessageLower.includes('gente')) {
        responseText = 'No sigilo fica ainda mais gostoso... Eu tô aqui bem excitada. Quer ver onde minha mão tá tocando? 💦'
      } else {
        responseText = 'Eu tô aqui toda molhadinha pensando em você. Quer ver onde minha mão tá descendo? 💦'
      }
    } else if (chatStep === 4) {
      setChatStep(5)
      
      if (userMessageLower.includes('quero') || userMessageLower.includes('sim') || userMessageLower.includes('mostra') || userMessageLower.includes('veja')) {
        responseText = 'Vou tirar minha calcinha bem devagar e abrir a câmera só pra você... Quer me ver todinha ao vivo? 🤤'
      } else {
        responseText = 'Vou tirar minha calcinha bem devagar e abrir a câmera só pra você... Quer me ver todinha ao vivo? 🤤'
      }
    } else if (chatStep === 5) {
      // Adiciona uma mensagem final antes de travar o chat aguardando a prévia/VIP
      responseText = 'Clica no botão aqui embaixo pra ver uma provinha do que eu vou fazer com você... 🔥'
      
      // Na sexta mensagem, exibe o botão de prévia se houver
      // O tempo de exibição do botão será baseado no tempo de digitação da mensagem acima
      const typingDelay = Math.max(1500, responseText.length * 40)
      
      setTimeout(() => {
        if (!unlockedOffers.includes('front')) {
          if (videoRef.current) videoRef.current.pause()
          
          // Se ainda tem prévias, mostra o botão de prévia
          if (previewsLeft > 0) {
            setShowPreviewButton(true)
          }
        }
      }, typingDelay + 500)
    } else {
      // Se já passou do passo 5 e o usuário tentar digitar, apenas ignora ou pede pra clicar no botão
      setTimeout(() => {
        setIsTyping(false)
      }, 500)
      return
    }

    // Calcula o delay dinâmico baseado no tamanho do texto (aprox. 40ms por caractere, mínimo de 1.5s)
    const dynamicDelay = Math.max(1500, responseText.length * 40)

    // Envia a resposta da modelo
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        name: 'NICOLE OLIVEIRA 🔥', 
        text: responseText, 
        isModel: true 
      }])
    }, dynamicDelay)
  }

  const handlePreview = () => {
    if (previewsLeft > 0) {
      const isFirst = previewsLeft === 2
      const previewUrl = isFirst ? '/previa1.mp4' : '/previa2.mp4'
      const nextRemaining = previewsLeft - 1
      
      setPreviewsLeft(nextRemaining)
      
      const previewTexts = [
        'Olha como eu fico molhadinha pensando em você... quer ver tudo? Vem pro meu VIP, amor 💋🔥',
        'Isso é só um pedacinho do que eu sei fazer... no VIP eu tiro tudo e faço gostoso pra você 😈💦'
      ]
      const text = isFirst ? previewTexts[0] : previewTexts[1]

      setMessages(prev => [
        ...prev,
        {
          id: 'preview-' + Date.now(),
          name: 'NICOLE OLIVEIRA 🔥',
          text: text,
          isModel: true,
          previewUrl: previewUrl,
          previewType: 'video',
          previewInfo: { remaining: nextRemaining },
          isLastPreview: nextRemaining === 0
        }
      ])

      if (nextRemaining === 0) {
        setShowPreviewButton(false)
        // setShowVipModal(true) // Removido para não abrir automaticamente
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-black relative overflow-hidden font-sans">
      
      {/* Top Bar (Badges) */}
      <div className="absolute top-4 left-4 z-50 flex items-center space-x-2">
        <div className="bg-[#00d26a] text-white text-[10px] font-bold px-2 py-1 rounded-sm tracking-wide">
          ONLINE
        </div>
        <div className="bg-black/40 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/10">
          <Eye size={12} /> 12.4k
        </div>
        <button className="bg-black/40 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/10 hover:bg-black/60 transition">
          <Download size={12} /> App
        </button>
        <button className="bg-black/40 backdrop-blur-md text-white p-1.5 rounded-full flex items-center justify-center border border-white/10 hover:bg-black/60 transition">
          <Eye size={14} />
        </button>
      </div>

      {/* Área do Vídeo */}
      <div className="absolute inset-0 z-0">
        <video 
          ref={videoRef}
          src="/video.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline 
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay escuro no topo e na base para dar contraste aos textos */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none"></div>
      </div>

      {/* Overlay de Blur quando o VIP Modal está aberto */}
      {showVipModal && (
        <div className="absolute inset-0 backdrop-blur-xl bg-black/60 z-10 transition-all duration-500"></div>
      )}

      {/* Área Inferior (Chat e Input) */}
      <div className="absolute bottom-0 left-0 w-full z-30 p-4 pb-6 sm:pb-8 max-w-lg mx-auto flex flex-col justify-end">
        
        {/* Mensagens Flutuantes (Ocultas se for VIP) */}
        {!isVip && (
          <div className="flex flex-col gap-3 mb-4 overflow-y-auto max-h-[50vh] mask-image-to-t [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" style={{ maskImage: 'linear-gradient(to top, black 80%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to top, black 80%, transparent 100%)' }}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isModel ? 'justify-start' : 'justify-end'} w-full`}>
                <div className={`backdrop-blur-md rounded-2xl p-3.5 shadow-lg max-w-[90%] sm:max-w-[85%] w-fit ${msg.isModel ? 'bg-[#18181b]/80 border border-white/10 rounded-bl-sm' : 'bg-[#f43f8e] rounded-br-sm'}`}>
                  {msg.isModel && (
                    <div className="text-[11px] font-bold mb-1 uppercase tracking-wide text-[#ff4b4b]">
                      {msg.name}
                    </div>
                  )}
                  
                  {msg.previewUrl && msg.previewType === 'video' && (
                    <video 
                      src={msg.previewUrl} 
                      className="rounded-xl mb-2 w-full max-w-[280px]" 
                      autoPlay 
                      muted 
                      loop 
                      playsInline 
                    />
                  )}
                  
                  <div className="text-white text-[15px] leading-relaxed break-words whitespace-normal">
                    {msg.text}
                  </div>
                  
                  {msg.previewInfo && (
                    <div className="mt-2 pt-2 border-t border-white/10">
                      <p className="text-[11px] text-pink-400 font-bold">
                        🔥 {msg.previewInfo.remaining > 0 ? `Ainda restam ${msg.previewInfo.remaining} prévia${msg.previewInfo.remaining > 1 ? 's' : ''}!` : 'Essa foi sua última prévia!'}
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        No VIP eu mostro tudo sem limites 💋
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#18181b]/80 backdrop-blur-md border border-white/10 rounded-2xl rounded-bl-sm p-3.5 shadow-lg flex items-center gap-1.5 h-[42px]">
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Botão de Prévia Flutuante (Aparece quando o chat atinge o gatilho e há prévias disponíveis) */}
        {showPreviewButton && previewsLeft > 0 && (
          <div className="flex justify-center mb-4 relative z-50">
            <button 
              onClick={handlePreview}
              className="bg-[#ff5a00] hover:bg-[#e04f00] text-white font-bold py-2.5 px-6 rounded-full flex items-center gap-2 transition text-sm shadow-lg animate-pulse"
            >
              <Eye size={16} />
              Ver Prévia ({previewsLeft} restante{previewsLeft > 1 ? 's' : ''})
            </button>
          </div>
        )}

        {/* Botão LIBERAR VIP Flutuante quando as prévias acabam ou modal ativo */}
        {(showVipModal || previewsLeft === 0) && !isVip && (
          <div className="flex items-center justify-center gap-3 mb-3 relative z-50">
            <button 
              onClick={() => setShowVipModal(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-[#f43f8e] to-[#a855f7] hover:opacity-90 text-white font-black text-base px-8 py-3.5 rounded-full flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-xl"
            >
              <span>🔓</span> LIBERAR VIP
            </button>
          </div>
        )}

        {/* Input de Chat */}
        <div className="bg-[#18181b]/80 backdrop-blur-md border border-white/10 rounded-full px-4 py-3 flex items-center gap-2 shadow-xl relative z-50">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Converse com a Nicole Oliveira..." 
            className="bg-transparent border-none outline-none text-[15px] w-full text-white placeholder:text-zinc-500"
            disabled={!!activeOffer || showVipModal}
          />
          <button 
            className="text-zinc-400 hover:text-white transition p-1 shrink-0"
            onClick={handleSendMessage}
            disabled={!!activeOffer || showVipModal}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Modal VIP (Paywall Original LiveCan) */}
      {showVipModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-[#121214] border border-zinc-800 w-full max-w-sm rounded-2xl p-6 animate-in zoom-in-95 duration-200 shadow-2xl relative">
            
            <button 
              onClick={() => setShowVipModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <div className="inline-block bg-[#00d26a] text-white text-[10px] font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                UPGRADE EXCLUSIVO 💎
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-wider leading-tight">
                QUER O ACESSO <br/><span className="text-[#00d26a]">TOTAL? 💦</span>
              </h3>
            </div>
            
            <div className="bg-[#18181b] border border-white/5 rounded-xl p-4 mb-6">
              <p className="text-zinc-400 text-[10px] mb-4 uppercase tracking-wider">
                LIBERE O <span className="text-[#00d26a] font-bold">VIP COMPLETO</span> E GANHE ACESSO A:
              </p>
              
              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <div className="text-yellow-400 text-sm mt-0.5">⭐</div>
                  <div className="text-white text-xs font-bold uppercase leading-relaxed">TIRO A ROUPA TODA E FICO NUA PRA VOCÊ 😍</div>
                </div>
                
                <div className="flex gap-3 items-start">
                  <div className="text-yellow-400 text-sm mt-0.5">⭐</div>
                  <div className="text-white text-xs font-bold uppercase leading-relaxed">ME MASTURBO BEM GOSTOSO COM VOCÊ AO VIVO 💦</div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="text-yellow-400 text-sm mt-0.5">⭐</div>
                  <div className="text-white text-xs font-bold uppercase leading-relaxed">PASSO MEU WHATSAPP PESSOAL AGORA 📱</div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="text-yellow-400 text-sm mt-0.5">⭐</div>
                  <div className="text-white text-xs font-bold uppercase leading-relaxed">A GENTE MARCA DE SE VER AÍ 📍</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mb-4">
              <div className="border border-[#00d26a]/30 text-[#00d26a] text-[10px] font-bold px-4 py-1.5 rounded-full flex items-center gap-2">
                🔒 SIGILO TOTAL
              </div>
            </div>

            <div className="text-center mb-4">
              <div className="text-[#f43f8e] text-xs font-bold uppercase tracking-widest mb-1">OFERTA ÚNICA</div>
              <div className="text-zinc-500 text-xs line-through">De R$ 35,98</div>
              <div className="text-white font-black text-3xl mt-1">R$ 17,99</div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => handleOpenPix(17.99, 'vip_total')}
                className="w-full bg-[#ff0000] hover:bg-[#cc0000] text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-2 transition text-sm shadow-[0_0_20px_rgba(255,0,0,0.3)]"
              >
                <span className="mr-1">✔️</span> ACESSO COMPLETO (R$ 17,99) 🔥
              </button>

              <button 
                onClick={() => handleOpenPix(12.99, 'vip_basico')}
                className="w-full bg-[#18181b] hover:bg-[#27272a] border border-white/10 text-white font-bold py-3.5 rounded-xl flex items-center justify-center transition text-sm"
              >
                ACESSO BÁSICO (R$ 12,99)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Dinâmico de Ofertas (Upsells) */}
      {activeOffer && activeOffer.id !== 'front' && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 sm:p-4">
          <div className="absolute inset-0 backdrop-blur-xl bg-black/60 z-10 transition-all duration-500"></div>
          <div className="bg-[#121214] border border-zinc-800 w-full max-w-sm rounded-3xl p-6 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 shadow-2xl z-20">
            
            <div className="text-center mb-6">
              <div className={`inline-block ${activeOffer.id === 'upsell_reconexao' ? 'bg-[#ff9900] text-black font-extrabold' : 'bg-[#00d26a] text-white font-bold'} text-[10px] px-3 py-1 rounded-full mb-3 uppercase tracking-wider`}>
                {activeOffer.badge || 'UPGRADE EXCLUSIVO 💎'}
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-wider leading-tight">
                {activeOffer.title}
              </h3>
              <p className="text-zinc-400 text-[11px] mt-3 uppercase tracking-wider">
                {activeOffer.copy}
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              {activeOffer.benefits.map((benefit, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="text-yellow-400 text-lg mt-0.5">⭐</div>
                  <div className="text-white text-xs font-bold uppercase leading-relaxed">{benefit}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mb-4">
              <div className="border border-zinc-700 rounded-full px-4 py-1 flex items-center gap-2">
                <span className="text-zinc-500 text-xs">🔒</span>
                <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">SIGILO TOTAL</span>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="text-[#f43f8e] text-[10px] font-bold uppercase tracking-wider mb-1">OFERTA ESPECIAL</div>
              <div className="text-white font-black text-4xl">R$ {activeOffer.price}</div>
            </div>

            <button 
              onClick={() => {
                const numericPrice = parseFloat(activeOffer.price.replace(',', '.'))
                handleOpenPix(numericPrice, activeOffer.id)
              }}
              className="w-full bg-[#ff2a2a] hover:bg-[#e60000] text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-2 transition text-sm shadow-[0_0_20px_rgba(255,42,42,0.3)] mb-3"
            >
              <span className="mr-1">✓</span> LIBERAR AGORA (R$ {activeOffer.price}) 🔥
            </button>

            <button 
              onClick={() => {
                handlePaymentSuccess() // Pula a oferta
              }}
              className="w-full bg-[#18181b] hover:bg-zinc-800 text-zinc-400 font-bold py-3 rounded-xl transition text-xs"
            >
              Continuar assistindo sem esse upgrade
            </button>
          </div>
        </div>
      )}

      {/* Modal de Checkout PIX idêntico ao print */}
      <PixModal
        isOpen={showPixModal}
        onClose={() => setShowPixModal(false)}
        modelName="NICOLE OLIVEIRA"
        loading={pix.loading}
        error={pix.error}
        pixData={pix.pixData}
        copied={pix.copied}
        onCopy={pix.copyToClipboard}
        onSimulateSuccess={pix.simulatePayment}
      />
    </div>
  )
}
