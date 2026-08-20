// =========================================================================
// ARQUIVO DE CONFIGURAÇÃO GERAL DO FUNIL E PAGAMENTOS
// =========================================================================

export const CONFIG = {
  // 1. CREDENCIAIS DA FURIONPAY (https://api.furionpay.com/integration)
  furionpay: {
    apiUrl: 'https://pmxpimpctlqhpgjibnrs.supabase.co/functions/v1',
    apiKey: 'fp_live_ustZF0qYEjDcDdmNxZIrGIrcFwjU5KNL' // Cole sua API Key (ex: fp_live_...) aqui
  },

  // 2. CONFIGURAÇÃO DE DADOS PADRÃO DO CLIENTE
  customerDefaults: {
    name: 'Cliente Live',
    email: 'cliente@live.com',
    phone: '11988887777',
    document: '12345678900'
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
