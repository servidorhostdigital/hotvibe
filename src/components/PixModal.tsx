import React from 'react'
import { Copy, Check, X, Loader2 } from 'lucide-react'

interface PixModalProps {
  isOpen: boolean
  onClose: () => void
  modelName: string
  loading: boolean
  error: string | null
  pixData: {
    copiaCola: string
    transactionId: string
    qrcode?: string | null
  } | null
  copied: boolean
  onCopy: () => void
  onSimulateSuccess?: () => void
}

export const PixModal: React.FC<PixModalProps> = ({
  isOpen,
  onClose,
  modelName,
  loading,
  error,
  pixData,
  copied,
  onCopy,
  onSimulateSuccess
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-all"
        onClick={onClose}
      />

      {/* Mensagens Flutuantes (Aparecem apenas quando o PIX é gerado) */}
      {pixData && !loading && !error && (
        <div className="absolute top-10 left-4 z-20 flex flex-col gap-3 animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm border border-zinc-800/50 rounded-full py-2 px-4 w-fit">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#d946ef] to-[#8b5cf6] flex items-center justify-center text-[10px] font-bold text-white">
              {modelName.charAt(0)}
            </div>
            <span className="text-white text-xs font-medium">Oii bebê, tô te esperando aqui 😈</span>
          </div>
          
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm border border-zinc-800/50 rounded-full py-2 px-4 w-fit animate-in fade-in slide-in-from-left-4 duration-500 delay-300 fill-mode-backwards">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#d946ef] to-[#8b5cf6] flex items-center justify-center text-[10px] font-bold text-white">
              {modelName.charAt(0)}
            </div>
            <span className="text-white text-xs font-medium">Assim que você pagar eu faço TUDO com você 🔥</span>
          </div>
        </div>
      )}

      {/* Modal Container */}
      <div className="bg-[#121214] border border-zinc-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 text-center">
        
        {/* Botão Fechar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition"
        >
          <X size={20} />
        </button>

        {/* Badge Superior */}
        <div className="flex justify-center mb-4">
          <div className="bg-[#ff0033] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_10px_rgba(255,0,51,0.5)]">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            PAGAMENTO PENDENTE
          </div>
        </div>

        {/* Título */}
        <h3 className="text-xl font-black text-white uppercase tracking-wide leading-tight mb-2">
          🔥 {modelName} COMEÇOU!
        </h3>
        <p className="text-zinc-400 text-xs mb-6">
          Vídeo chamada iniciada... Realize o pagamento para participar!
        </p>

        {/* Passos */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 mb-6 font-medium">
          <div className="flex items-center gap-1">
            <span className="bg-zinc-800 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold">1</span>
            Copie o código
          </div>
          <span>→</span>
          <div className="flex items-center gap-1">
            <span className="bg-zinc-800 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold">2</span>
            Cole no App do Banco
          </div>
        </div>

        {/* Conteúdo de Carregamento / Erro / Sucesso */}
        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center gap-3">
            <Loader2 size={32} className="text-[#a855f7] animate-spin" />
            <p className="text-sm font-semibold text-zinc-300">Gerando seu PIX...</p>
          </div>
        ) : error ? (
          <div className="py-6 bg-red-950/40 border border-red-800/50 rounded-2xl p-4 mb-4">
            <p className="text-red-400 text-xs mb-3">{error}</p>
            <button 
              onClick={onClose}
              className="bg-zinc-800 text-white text-xs font-bold py-2 px-4 rounded-xl hover:bg-zinc-700 transition"
            >
              Tentar novamente
            </button>
          </div>
        ) : pixData ? (
          <>
            {/* Botão de Copiar PIX com Gradiente Rosa/Roxo */}
            <button
              onClick={onCopy}
              className={`w-full py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-[0_0_25px_rgba(168,85,247,0.35)] ${
                copied 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-gradient-to-r from-[#d946ef] via-[#a855f7] to-[#8b5cf6] text-white hover:opacity-95 active:scale-[0.98]'
              }`}
            >
              {copied ? (
                <>
                  <Check size={18} />
                  <span>✅ CÓDIGO PIX COPIADO!</span>
                </>
              ) : (
                <>
                  <Copy size={18} />
                  <span>CLIQUE PARA COPIAR O PIX</span>
                </>
              )}
            </button>

            {/* Status de Aguardo */}
            <div className="flex items-center justify-center gap-2 mt-5 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Aguardando pagamento...</span>
            </div>
          </>
        ) : null}

      </div>
    </div>
  )
}
