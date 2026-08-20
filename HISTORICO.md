# Histórico de Alterações

## 20/08/2026 - 11:30
- Ajustado os textos e largura dos botões no cabeçalho em `Criativo/gerador-story.html`:
  - "Baixar Img" e "Baixar Vídeo (5s)" com maior largura e espaçamento.

## 20/08/2026 - 11:25
- Ajustado o layout em `Criativo/gerador-story.html`:
  - Botões de ação rápida ("PNG" e "Vídeo (5s)") posicionados alinhados diretamente na frente do cabeçalho "Configurações" para melhor usabilidade em telas menores.

## 20/08/2026 - 11:20
- Restaurado o design original dos ícones de chamada (estilo clássico WhatsApp/iOS) em `Criativo/gerador-story.html`, desenhados com precisão vetorial no Canvas HD.

## 20/08/2026 - 11:15
- Refatoração completa do gerador de criativos (`Criativo/gerador-story.html`) usando Canvas nativo:
  - Resolução nativa em Full HD (1080x1920 para Story, 1080x1080 para Feed).
  - Animação de zoom suave (Ken Burns) e pulso nos botões renderizada diretamente no Canvas.
  - Exportação de vídeo MP4/WebM sem cortes ou distorções nos textos.
  - Exportação de imagem PNG em alta qualidade.

## 20/08/2026 - 11:10
- Corrigido o efeito de zoom na gravação de vídeo em `Criativo/gerador-story.html`:
  - O zoom agora é aplicado **apenas na imagem de fundo**.
  - Os textos, botões e gradientes permanecem fixos e nítidos por cima da imagem, evitando cortes e distorções na interface durante a animação.

## 20/08/2026 - 11:05
- Atualizada a função de gerar vídeo em `Criativo/gerador-story.html`:
  - Agora você pode subir apenas a **imagem (foto)** da modelo.
  - Ao clicar em **"Gravar Vídeo"**, o gerador aplica um efeito de zoom/movimento suave (Ken Burns) e renderiza um vídeo animado de 5 segundos pronto para download no formato de vídeo (MP4/WebM), além do botão padrão de baixar em PNG.

## 20/08/2026 - 11:00
- Adicionado suporte a vídeo e gravação no gerador de criativos (`Criativo/gerador-story.html`):
  - Suporte a upload de vídeo direto para o background (a modelo se movimenta em tempo real).
  - Botão de gravação de vídeo de 5 segundos em formato de vídeo para download direto.

## 20/08/2026 - 10:55
- Adicionado suporte a múltiplos formatos no gerador de criativos (`Criativo/gerador-story.html`):
  - Formato Story / Reels / TikTok (1080x1920 - 9:16).
  - Formato Feed / Post (1080x1080 - 1:1 quadrado).

## 20/08/2026 - 10:52
- Realizado commit e push das alterações (ajuste de delay de digitação, título e favicon) para o repositório no GitHub.

## 20/08/2026 - 10:50
- Atualizado o título da página para "Hotlive Ao vivo" em [index.html](live-funnel/index.html).
- Criado e adicionado um favicon de fogo (🔥) em SVG para combinar com o estilo "hot".

## 20/08/2026 - 10:48
- Aumentado o tempo de digitação da modelo em [LiveRoom.tsx](live-funnel/src/pages/LiveRoom.tsx) para 75ms por caractere (mínimo 2.5s, máximo 8s), tornando a simulação de digitação mais realista e proporcional ao tamanho da mensagem.

## 20/08/2026 - 10:45
- Ajuste de sincronização de digitação do chat com os movimentos da modelo:
  - Otimizado o delay dinâmico de digitação em [LiveRoom.tsx](live-funnel/src/pages/LiveRoom.tsx) (entre 2.2s e 4.5s com base no comprimento da mensagem) para corresponder ao tempo real em que a modelo digita no celular durante o vídeo.

## 20/08/2026 - 10:40
- Removido áudio ambiente de fundo em [LiveRoom.tsx](live-funnel/src/pages/LiveRoom.tsx).

## 20/08/2026 - 10:28
- Removido gatilho de áudio de notificação do chat.

## 20/08/2026 - 10:20
- Atualização do vídeo principal para CDN Cloudinary:
  - Substituído caminho local `/video.mp4` por `https://res.cloudinary.com/hlsmqrui/video/upload/v1787232374/video.mp4` em [LiveRoom.tsx](live-funnel/src/pages/LiveRoom.tsx), garantindo streaming rápido e sem travamentos na Vercel.

## 20/08/2026 - 10:10
- Integração completa com a API FurionPay (https://api.furionpay.com/integration):
  - Configuração do endpoint de criação de PIX (`POST /api-v1-pix-create`) com autenticação via `Authorization: Bearer <API_KEY>`.
  - Configuração do endpoint de status (`GET /api-v1-pix-status?txid=<TXID>`) com polling automático para confirmação em tempo real.
  - Repasse completo dos parâmetros de rastreamento (UTMs) no objeto `utm`.
  - Centralização da configuração e chave de API em [config.ts](live-funnel/src/config.ts).

## 20/08/2026 - 10:00
- Remoção da API e credenciais da MonsterPay:
  - Limpos os campos de credenciais e endpoint no arquivo [config.ts](live-funnel/src/config.ts).
  - Estrutura de checkout e hook [usePixCheckout.ts](live-funnel/src/hooks/usePixCheckout.ts) preparada para receber a nova API de pagamento.

## 19/08/2026 - 21:15
- Simulação completa do funil de pagamento via Playwright:
  - Captura de screenshots de cada etapa do funil (Front-end, Upsell 1, Upsell 2, Upsell 3).
  - Implementação de auto-resume do vídeo após o pagamento de cada oferta.
  - Validação visual do fluxo de upsell dinâmico.

## 19/08/2026 - 20:45
- Implementado o Card de Prévia no Chat:
  - Ao invés de reabrir o modal VIP imediatamente após a prévia, agora um "Card de Prévia" é enviado no chat.
  - O card contém uma área para thumbnail, o texto persuasivo extraído do original ("gostou? isso é só uma provinha... no VIP tem muuuito mais 😈💦").
  - Se for a última prévia, exibe o aviso "🔥 Essa foi sua última prévia! No VIP eu mostro tudo sem limites 💋".
  - O card possui um botão com gradiente rosa/roxo (`bg-gradient-to-r from-[#f43f8e] to-[#a855f7]`) escrito "🔓 LIBERAR VIP" que, ao ser clicado, abre o modal VIP.

## 19/08/2026 - 20:40
- Implementado auto-scroll no chat:
  - Adicionado `useRef` (`messagesEndRef`) no final da lista de mensagens.
  - Criado um `useEffect` que monitora o array de `messages` e o estado `isTyping`.
  - Sempre que uma nova mensagem é enviada ou a modelo começa a digitar, o chat rola automaticamente para baixo de forma suave (`behavior: 'smooth'`).

## 19/08/2026 - 20:35
- Correção definitiva do corte de texto nos balões de chat:
  - Alterado `whitespace-pre-wrap` para `whitespace-normal` para garantir a quebra natural do texto.
  - Adicionado `w-full` no container flex da mensagem e `w-fit` no balão para garantir que ele expanda corretamente.
  - Aumentado o `max-w` para `90%` em telas menores para dar mais espaço ao texto.

## 19/08/2026 - 20:30
- Refatoração visual baseada nos prints originais:
  - **Botão de Prévia**: Movido para fora do modal, agora flutua acima do input de chat com cor laranja (`#ff5a00`), ícone de olho e formato arredondado (`rounded-full`).
  - **Botão Liberar VIP**: Atualizado para roxo/rosa com ícone de cadeado aberto (`🔓 LIBERAR VIP`).
  - **Modal VIP TOTAL (Upgrade Exclusivo)**:
    - Design refeito para ficar idêntico ao print.
    - Título verde (`#00d26a`) "QUER O ACESSO TOTAL? 💦".
    - Lista de benefícios sem fundo, com ícones de estrela amarela (`⭐`) e texto em caixa alta.
    - Badge centralizado de "🔒 SIGILO TOTAL".
    - Preço centralizado (De R$ 35,98 por R$ 17,99).
    - Botão principal vermelho (`#ff2a2a`) "ACESSO COMPLETO (R$ 17,99) 🔥".
    - Botão secundário escuro (`#18181b`) "ACESSO BÁSICO (R$ 12,99)".

## 19/08/2026 - 20:25
- Ocultada a barra de rolagem da área de mensagens do chat:
  - Adicionadas as classes `[&::-webkit-scrollbar]:hidden`, `[-ms-overflow-style:none]` e `[scrollbar-width:none]` para esconder a scrollbar em todos os navegadores, mantendo a funcionalidade de rolagem.

## 19/08/2026 - 20:20
- Corrigido o problema de corte de texto nas mensagens do chat:
  - Adicionadas as classes `break-words` e `whitespace-pre-wrap` aos balões de mensagem.
  - Garante que mensagens longas quebrem as linhas suavemente sem cortar nem vazar para fora do balão.

## 19/08/2026 - 20:15
- Implementada lógica de chat dinâmico e contextual:
  - A modelo agora analisa as palavras-chave da mensagem do usuário (ex: "nome", "cidade", "mora", "sim", "não").
  - Respostas sensuais personalizadas baseadas no que o usuário pergunta (ex: se perguntar o nome, ela responde "Me chamo Nicole, amor... mas você pode me chamar do que quiser quando a gente estiver a sós").
  - O fluxo do funil (4 passos até o paywall) é mantido, mas as respostas se adaptam para parecerem mais reais e persuasivas.

## 19/08/2026 - 20:10
- Implementado o modelo de popup de **Upgrade Exclusivo (VIP TOTAL)** idêntico ao original:
  - Header com tag "Upgrade Exclusivo 💎" e título "QUER O ACESSO TOTAL?".
  - Lista de 4 benefícios específicos: "Tiro a roupa toda e fico nua pra você 😍", "Me masturbo bem gostoso com você ao vivo 💦", "Passo meu WhatsApp pessoal agora 📱", "A gente marca de se ver aí 📍".
  - Botão principal azul "ACESSO COMPLETO (R$ XX,XX) 🔥" e botão secundário "ACESSO BÁSICO (R$ 9,90)".
  - Fundo com blur e estilo glassmorphism escuro idêntico ao LiveCan original.

## 19/08/2026 - 20:05
- Implementada a lógica exata de "Prévias" (Previews) e o Popup VIP original da LiveCan:
  - O usuário tem direito a 2 prévias de 5 segundos cada.
  - Ao clicar em "Ver Prévia", o vídeo roda por 5 segundos e pausa novamente.
  - Após a prévia, a modelo manda uma mensagem de teaser no chat ("liberei umas coisinhas aqui pra você...").
  - O design do Popup VIP foi refeito para ficar idêntico ao original (fundo escuro `#121214`, botão rosa `#f43f8e`, lista de benefícios com ícones de check rosa, preço riscado de R$ 49,90 por R$ 9,90).
  - Adicionado o efeito de blur (`backdrop-blur-xl`) no fundo do vídeo quando o popup VIP está aberto.

## 19/08/2026 - 20:00
- Refatorada a copy do chat interativo inicial para ser muito mais persuasiva e envolvente:
  - Mensagem 1: "eii... tem alguém aí pra bater papo? 🙊"
  - Resposta 1 -> "Nossa, finalmente um homem de verdade por aqui... tava quase fechando a live. Você mora sozinho? 😈"
  - Resposta 2 -> "Que delícia... Eu tô sozinha no meu quarto agora, morrendo de calor. Queria tanto alguém pra me fazer companhia... 🥵"
  - Resposta 3 -> "Sabe de uma coisa? Eu gostei de você. Vou tirar essa blusa e ligar a câmera privada só pra gente... topa? 😏"
  - Resposta 4 -> Aciona a oferta Front-end (Acesso VIP).
- Aumentado o tempo de digitação (typing indicator) entre as mensagens para parecer mais humano e natural (2.5s a 3s).

## 19/08/2026 - 19:55
- Implementado o funil completo de 4 ofertas baseado no tempo do vídeo:
  - **Front-end (1 min):** Acesso VIP Privado (R$ 9,90).
  - **Upsell 1 (5 min):** Show Exclusivo (R$ 19,90).
  - **Upsell 2 (10 min):** Controle o Brinquedo (R$ 29,90).
  - **Upsell 3 (15 min):** WhatsApp Pessoal (R$ 49,90).
- Adicionado evento `onTimeUpdate` no vídeo para pausar automaticamente e exibir a oferta correspondente.
- O chat interativo inicial continua funcionando e, se o usuário chegar na 3ª mensagem antes de 1 minuto, a primeira oferta é antecipada.
- O modal de pagamento agora é dinâmico, exibindo a copy persuasiva, preço e benefícios específicos de cada etapa do funil.

## 19/08/2026 - 19:50
- Ajustado o layout mobile para corresponder perfeitamente ao DevTools do print original:
  - Adicionado o container `absolute bottom-0 left-0 w-full z-30 p-4 pb-6 sm:pb-8 max-w-lg mx-auto`.
  - Estilização do balão do usuário em rosa sólido (`#f43f8e`) alinhado à direita.
  - Adicionada a animação dos 3 pontinhos de digitação (typing indicator).

## 19/08/2026 - 19:45
- Ajustado o layout da barra de conversa no Desktop para ficar alinhada no canto inferior esquerdo com largura fixa (`max-w-[400px]`), exatamente como no print original.

## 19/08/2026 - 19:40
- Ajustado o funil interativo do chat para simular conversa antes de cobrar o VIP:
  - Mensagem 1 (Modelo): "eii... tem alguém aí pra bater papo? 🙊"
  - Resposta 1 (Usuário) -> Modelo responde: "Nossa, finalmente alguém legal por aqui! 😍 De onde você é?"
  - Resposta 2 (Usuário) -> Modelo responde: "Que delícia! Eu tô muito afim de fazer uma chamada de vídeo privada agora... topa? 😈"
  - Resposta 3 (Usuário) -> Aciona o popup de pagamento do VIP (R$ 9,90).
- Suporte a envio de mensagem ao pressionar "Enter" ou clicar no botão de envio.

## 19/08/2026 - 19:35
- Refatoração completa da UI da página da Live para ficar idêntica ao print de referência da LiveCan.
- Removido o chat lateral e adicionado o balão de mensagem flutuante ("eii... tem alguém aí pra bater papo?").
- Atualizado o input de chat para o novo design arredondado com ícone de envio.
- Adicionada a barra superior com badges (ONLINE, Viewers, App, Eye).
- Atualizado o design do Modal VIP (Paywall) com cores verde e vermelho, idêntico ao original.
- Removido o blur do vídeo para que ele fique visível em tela cheia desde o início.

## 19/08/2026 - 19:30
- Adicionado arquivo de vídeo `video.mp4` na pasta `public`.
- Integrado o componente `<video>` nativo com autoPlay, loop, muted e playsInline na tela da live.

## 19/08/2026 - 19:25
- Criação do projeto `live-funnel` utilizando React, Vite e Tailwind CSS.
- Configuração do roteamento com `react-router-dom`.
- Criação da página principal da Live (`/hotlive/:slug`) simulando o funil da LiveCan.
- Implementação do Gate de Idade (+18).
- Implementação do Chat Simulado com mensagens automáticas e auto-scroll.
- Implementação do Modal VIP (Paywall) que aparece após 15 segundos.
- Correção de tipagens do TypeScript e build realizado com sucesso.
## 19/08/2026 - 20:50
- Atualização das respostas do chat:
  - Respostas reescritas para serem mais curtas, diretas e agressivas.
  - Foco em aumentar a persuasão e instigar o lead a responder rapidamente.
  - Adicionadas palavras-chave como 'quero' e 'sim' no passo 2 para melhor captura de intenção.

## 19/08/2026 - 21:00
- Integração dos vídeos de prévia reais:
  - Copiados os vídeos `1.mp4` e `2.mp4` da pasta `previa` para a pasta `public` do projeto como `previa1.mp4` e `previa2.mp4`.
  - Atualizada a lógica do player de vídeo para alternar o `src` entre o vídeo de fundo e os vídeos de prévia quando o usuário clica em 'Ver Prévia'.
  - O áudio do vídeo de prévia é ativado automaticamente durante a exibição.

## 19/08/2026 - 21:10
- Teste de fluxo completo com vídeos reais:
  - O fluxo de chat foi testado com sucesso, interagindo com as novas respostas mais agressivas.
  - Os dois vídeos de prévia (`previa1.mp4` e `previa2.mp4`) foram exibidos corretamente.
  - O card de prévia apareceu no chat após cada vídeo.
  - O botão 'LIBERAR VIP' no segundo card abriu o popup VIP Básico corretamente.

## 19/08/2026 - 21:15
- Refatoração do sistema de prévias:
  - Removido o card de prévia grande que ocupava a tela toda.
  - As prévias agora são exibidas como pequenos vídeos dentro dos próprios balões de chat da modelo, exatamente como no site original.
  - O vídeo de fundo principal não é mais pausado/substituído durante a prévia.
  - Adicionado o botão flutuante 'LIBERAR VIP' que aparece quando as prévias acabam.

## 19/08/2026 - 21:20
- Teste do novo sistema de prévias:
  - O fluxo foi testado novamente com o novo layout de prévias.
  - Os vídeos de prévia agora aparecem corretamente dentro dos balões de chat da modelo.
  - O botão 'LIBERAR VIP' flutuante aparece corretamente após o término das prévias.

## 19/08/2026 - 21:25
- Ajuste no fluxo do VIP:
  - O modal VIP não abre mais automaticamente após o término das prévias.
  - O usuário precisa clicar no botão 'LIBERAR VIP' para abrir o modal.
  - O layout do modal VIP foi atualizado para ficar idêntico ao modelo solicitado (Upgrade Exclusivo, Acesso Total, etc).

## 19/08/2026 - 21:30
- Atualização da copy do Chat:
  - A mensagem inicial agora pergunta o nome e a cidade do usuário com carinho e sensualidade.
  - O chat responde capturando o nome do usuário e usando termos mais sensuais, exóticos e persuasivos (foco em desejo, provocação feminina e excitação).
  - Substituída qualquer gíria ou tom moleque por uma abordagem altamente envolvente voltada para alta conversão no checkout/VIP.

## 19/08/2026 - 21:35
- Ajuste na mensagem inicial e fluxo do Chat:
  - Removida a pergunta dupla. A primeira mensagem agora faz apenas uma pergunta direta e carinhosa: 'Oi, amor... que bom que você entrou. Como você se chama? Quero te conhecer... 💋'.
  - Cada resposta subsequente contém apenas 1 única pergunta/chamada para ação clara e altamente persuasiva.

## 19/08/2026 - 21:40
- Ajuste na mensagem inicial e fluxo do Chat:
  - A mensagem inicial voltou a ser 'eii... tem alguém aí pra bater papo? 🙊'.
  - Adicionado um novo passo no chat (chatStep 1) para perguntar a cidade do usuário: 'Que bom que você me respondeu... Eu tava me sentindo tão sozinha aqui. De qual cidade você é? 💋'.
  - O fluxo foi ajustado para acomodar esse novo passo, mantendo a regra de apenas 1 pergunta por mensagem.

## 19/08/2026 - 21:45
- Ajuste na ordem e copy do Chat:
  - Inicia com: 'eii... tem alguém aí pra bater papo? 🙊'.
  - Passo 1: Pergunta o NOME ('Que bom que você me respondeu... Eu tava me sentindo tão sozinha aqui. Como você se chama? 💋').
  - Passo 2: Pega o nome do usuário e pergunta a CIDADE com tom safadinho e provocador ('Nossa, [Nome]... adorei seu nome. E de qual cidade você é? Quero saber de onde é esse homem que tá me deixando curiosa... 😈').
  - Passo 3: Reage à cidade de forma safada e pergunta se está sozinho ('Hummm, adoro os homens daí... Você tá sozinho aí agora pra gente conversar no sigilo? 🥵').
  - Segue o funil persuasivo até as prévias e VIP.

## 19/08/2026 - 21:50
- Correção de Bug no Chat:
  - Corrigido o travamento que ocorria no último passo do chat (chatStep 5).
  - O `return` prematuro estava impedindo que o estado `isTyping` fosse resetado, deixando os 'três pontinhos' infinitos.
  - Adicionada uma mensagem final ('Clica no botão aqui embaixo pra ver uma provinha...') para guiar o usuário a clicar no botão de prévia, melhorando a conversão.

## 19/08/2026 - 21:55
- Melhoria na Digitação (Delay Dinâmico):
  - O tempo em que a animação de 'digitando...' fica ativa agora é calculado proporcionalmente ao tamanho do texto da resposta (`length * 40ms`, com mínimo de 1.5s).
  - Respostas curtas são enviadas mais rápido e respostas mais longas demoram um pouco mais, dando total realismo como se uma pessoa real estivesse digitando.

## 19/08/2026 - 22:00
- Ajuste no texto do Chat:
  - Removido o trecho 'deitada na cama,' e 'na cama' da mensagem da modelo para manter total coerência com o vídeo de fundo.

## 19/08/2026 - 22:05
- Correção de Bug no Chat (Travamento pós-funil):
  - Corrigido o travamento que ocorria se o usuário tentasse digitar algo após o chatStep 5.
  - O `setIsTyping(false)` agora é executado dentro de um `setTimeout` para garantir que a UI seja atualizada corretamente antes do `return`, evitando que os 'três pontinhos' fiquem travados na tela.

## 19/08/2026 - 22:10
- Push para o GitHub:
  - O repositório completo com todos os códigos, vídeos, prévias, funil e histórico foi enviado com sucesso para: https://github.com/servidorhostdigital/livestore

## 19/08/2026 - 22:15
- Teste do Funil de Upsell:
  - O fluxo foi testado até o final, incluindo a simulação de pagamento do VIP Básico.
  - O vídeo foi avançado para o minuto 5 (300s) para acionar o primeiro Upsell ('Show Exclusivo').
  - O modal de Upsell apareceu corretamente na tela, bloqueando o chat e oferecendo o upgrade.

## 19/08/2026 - 22:15
- Teste do Funil de Upsell:
  - O fluxo foi testado até o final, incluindo a simulação de pagamento do VIP Básico.
  - O vídeo foi avançado para o minuto 5 (300s) para acionar o primeiro Upsell ('Show Exclusivo').
  - O modal de Upsell apareceu corretamente na tela, bloqueando o chat e oferecendo o upgrade.

## 19/08/2026 - 22:25
- Ajuste e Validação do Funil de Upsell:
  - Corrigido o modal dinâmico de Upsell em LiveRoom.tsx para exibir título, cópia, benefícios e preço de cada uma das ofertas (Show Exclusivo R$ 19,90, Controle o Brinquedo R$ 29,90, WhatsApp Pessoal R$ 49,90).
  - Fluxo de liberação automática validado: ao pagar/desbloquear o upsell, o vídeo volta a rodar liberando o conteúdo.


## 19/08/2026 - 21:15
- Simulação completa do funil de pagamento via Playwright:
  - Captura de screenshots de cada etapa do funil (Front-end, Upsell 1, Upsell 2, Upsell 3).
  - Implementação de auto-resume do vídeo após o pagamento de cada oferta.
  - Validação visual do fluxo de upsell dinâmico.

## 19/08/2026 - 21:30
- Modo de simulação contínua do funil ativado no clique:
  - Ao clicar em 'LIBERAR VIP' / 'ACESSO COMPLETO', a compra é confirmada diretamente sem alert bloqueante.
  - Cada etapa de Upsell (Show Exclusivo, Brinquedo, WhatsApp) avança em sequência automática para demonstração prática.

## 19/08/2026 - 21:40
- Ajustado disparo dos Upsells:
  - Removido o adiantamento artificial de tempo e avanço automático forçado.
  - Cada Upsell agora é disparado estritamente quando o vídeo atinge o seu respectivo `triggerTime` no decorrer normal da reprodução.

## 19/08/2026 - 21:45
- Limpeza das prévias ao liberar acesso VIP:
  - O botão de prévia flutuante é ocultado imediatamente.
  - Todos os cards e vídeos de prévia anteriores são removidos do histórico do chat assim que o acesso VIP é liberado.

## 19/08/2026 - 21:50
- Reestruturação da linha do tempo e Upsells:
  - Removido o Upsell de 5 minutos ('Show Exclusivo').
  - Ao liberar o acesso VIP, o vídeo agora pula diretamente para 5:00 (300 segundos), onde a modelo inicia a promessa de entrega do conteúdo.
  - Upsell 1 ('Controle o Brinquedo' - R$ 29,90) configurado para disparar aos 10:00 (600 segundos).
  - Upsell 2 ('WhatsApp Pessoal' - R$ 49,90) configurado para disparar aos 15:00 (900 segundos).

## 19/08/2026 - 21:55
- Atualização do Upsell 2 (WhatsApp):
  - Tempo de disparo alterado de 15 minutos (900s) para 16 minutos (960s).
  - Copy e benefícios atualizados para focar em 'chamada de vídeo grátis' e 'fotos exclusivas diariamente'.

## 19/08/2026 - 22:00
- Correção de travamento no disparo de Upsells:
  - Ajustada a lógica do `handleTimeUpdate` para evitar loops de pausa quando o vídeo atinge o tempo exato do gatilho e a oferta já está ativa.

## 19/08/2026 - 22:05
- Adicionado Upsell de Conexão Perdida:
  - Disparado aos 7:30 de vídeo (450 segundos).
  - Valor: R$ 9,90 com badge 'ESTABILIDADE DO SERVIDOR 📶'.
  - Benefícios: Reconexão instantânea, servidor prioritário anti-queda e qualidade 1080p sem travamentos.

## 19/08/2026 - 22:10
- Ocultação do histórico de conversa:
  - O container de mensagens do chat flutuante agora é ocultado completamente assim que o acesso VIP é liberado (`isVip === true`), mantendo a tela limpa e focada no vídeo da live.

## 19/08/2026 - 22:15
- Sistema Global de Repasse e Preservação de UTMs:
  - Criado o utilitário `src/utils/utm.ts` (`captureAndPersistUtms` e `buildUrlWithUtms`).
  - Suporte completo a `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `src`, `sck`, `fbclid`, `gclid`, `ttclid`, `kwai_pixel_id` e parâmetros de rastreamento customizados.
  - Os parâmetros da URL são automaticamente capturados no carregamento inicial da aplicação e salvos no `sessionStorage` e `localStorage` para persistir em todas as etapas do funil de checkout/upsell.

## 19/08/2026 - 22:25
- Implementação da API de PIX e Modal de Checkout idêntico ao design original:
  - Criado o hook `usePixCheckout` (`src/hooks/usePixCheckout.ts`) conectando às rotas `/hotlive/api/pix/:slug` e `/hotlive/api/pix/status/:slug/:transactionId` com polling automático de confirmação.
  - Criado o componente `PixModal` (`src/components/PixModal.tsx`) com badge 'PAGAMENTO PENDENTE', título dinâmico com o nome da modelo, passos 1 e 2 de instrução, botão gradiente 'CLIQUE PARA COPIAR O PIX' e status pulsante 'Aguardando pagamento...'.
  - Integrado ao modal VIP e a todos os Upsells do funil.

## 19/08/2026 - 22:30
- Atualização da API de PIX para a MonsterPay oficial:
  - Endpoint de criação: POST https://wahkbxkiwdjtlnvvxxrh.supabase.co/functions/v1/monsterpay-api/v1/create-payment
  - Endpoint de consulta: GET https://wahkbxkiwdjtlnvvxxrh.supabase.co/functions/v1/monsterpay-api/v1/payment-status/:id
  - Headers `x-api-key` e `x-secret-key` configuráveis via `VITE_MONSTERPAY_API_KEY` e `VITE_MONSTERPAY_SECRET_KEY` no .env
  - Repasse automático de parâmetros de UTM (utm_source, utm_campaign, utm_medium, utm_content, utm_term, src, sck) no payload de cobrança.

## 19/08/2026 - 22:35
- Criação do arquivo central de configuração `src/config.ts`:
  - Permite configurar de forma rápida as chaves da MonsterPay (`apiKey` e `secretKey`).
  - Permite definir dados padrão do cliente e valores de cada oferta do funil.
  - Hook `usePixCheckout` agora consome diretamente as credenciais e URLs de `src/config.ts`.

## 19/08/2026 - 22:40
- Ativada a chamada real para a API MonsterPay em todos os ambientes (removido fallback de mock em localhost):
  - Agora o PIX gerado é sempre o código real da MonsterPay emitido via chaves da API.
  - O polling de status ativo para conferir pagamentos reais em tempo real.

## 19/08/2026 - 22:42
- Removido o botão de simulação de pagamento (preview) do modal de PIX para evitar confusão em produção.

## 19/08/2026 - 22:45
- Adicionadas mensagens flutuantes de chat no topo esquerdo quando o PIX é gerado:
  - 'Oii bebê, tô te esperando aqui 😈'
  - 'Assim que você pagar eu faço TUDO com você 🔥'
  - Estilização com avatar com a inicial da modelo, fundo semi-transparente com blur e animação suave de entrada.
