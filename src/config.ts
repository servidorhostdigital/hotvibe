// =========================================================================
// ARQUIVO DE CONFIGURAÇÃO GERAL DO FUNIL E PAGAMENTOS
// =========================================================================

export const CONFIG = {
  // 1. CREDENCIAIS DA MONSTERPAY
  // Obtenha suas credenciais em: https://api.monsterpay.top/integracoes
  monsterpay: {
    apiKey: 'mp_live_aaceed2da27e47aaa2948b7cf3017e1d',
    secretKey: 'mp_secret_1fc7d725894848b899617418554ceeee4c36aee55ba545f1',
    apiUrl: 'https://wahkbxkiwdjtlnvvxxrh.supabase.co/functions/v1/monsterpay-api/v1'
  },

  // 2. CONFIGURAÇÃO DE DADOS PADRÃO DO CLIENTE
  customerDefaults: {
    name: 'Cliente Live',
    email: 'cliente@live.com'
  },

  // 3. OFERTAS E VALORES DO FUNIL (em R$)
  offers: {
    vipAccess: {
      id: 'vip-plan',
      title: 'Acesso VIP',
      price: 19.90,
      description: 'Acesso Completo à Live VIP'
    },
    upsellConexao: {
      id: 'upsell-conexao',
      title: 'Reconectar Transmissão',
      price: 9.90,
      description: 'Reconectar Live Exclusiva'
    },
    upsellBrinquedo: {
      id: 'upsell-brinquedo',
      title: 'Controle o Brinquedo Lovense',
      price: 29.90,
      description: 'Controle o Brinquedo Interativo'
    },
    upsellWhatsapp: {
      id: 'upsell-whatsapp',
      title: 'WhatsApp Privado + Chamada de Vídeo',
      price: 49.90,
      description: 'Acesso ao WhatsApp VIP'
    }
  }
}
