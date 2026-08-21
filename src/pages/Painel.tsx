import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, 
  DollarSign, 
  QrCode, 
  CheckCircle2, 
  MessageSquare, 
  Eye, 
  TrendingUp, 
  RefreshCw, 
  Trash2, 
  Layers, 
  ArrowUpRight, 
  Radio, 
  Clock, 
  Percent, 
  Compass, 
  Activity
} from 'lucide-react'
import { getStoredEvents, clearStoredEvents, calculateFunnelSummary, MetricEvent, FunnelSummary } from '../utils/metrics'

export default function Painel() {
  const [events, setEvents] = useState<MetricEvent[]>([])
  const [summary, setSummary] = useState<FunnelSummary | null>(null)
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'today' | '7days'>('all')
  const [activeTab, setActiveTab] = useState<'funnel' | 'utms' | 'events' | 'plans'>('funnel')
  const [autoRefresh] = useState(true)

  const loadData = () => {
    let all = getStoredEvents()
    const now = Date.now()

    if (filterPeriod === 'today') {
      const startOfDay = new Date()
      startOfDay.setHours(0, 0, 0, 0)
      all = all.filter(e => e.timestamp >= startOfDay.getTime())
    } else if (filterPeriod === '7days') {
      const past7 = now - 7 * 24 * 60 * 60 * 1000
      all = all.filter(e => e.timestamp >= past7)
    }

    setEvents(all)
    setSummary(calculateFunnelSummary(all))
  }

  useEffect(() => {
    loadData()

    // Listener para eventos disparados na mesma janela ou outras abas
    const handleUpdate = () => loadData()
    window.addEventListener('hotlive_metric_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)

    let interval: ReturnType<typeof setInterval>
    if (autoRefresh) {
      interval = setInterval(loadData, 4000)
    }

    return () => {
      window.removeEventListener('hotlive_metric_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
      if (interval) clearInterval(interval)
    }
  }, [filterPeriod, autoRefresh])

  const handleClear = () => {
    if (window.confirm('Tem certeza de que deseja zerar todas as métricas salvas?')) {
      clearStoredEvents()
      loadData()
    }
  }

  // Gera dados simulados de demonstração caso esteja totalmente vazio para pré-visualização rica
  const handleSeedDemo = () => {
    const mockEvents: MetricEvent[] = [
      { id: '1', timestamp: Date.now() - 3600000 * 5, date: new Date(Date.now() - 3600000 * 5).toISOString(), type: 'visit', sessionId: 'sess_1', data: { utm_source: 'instagram_ads', utm_campaign: 'cbo_escala' } },
      { id: '2', timestamp: Date.now() - 3600000 * 4.9, date: new Date(Date.now() - 3600000 * 4.9).toISOString(), type: 'message_sent', sessionId: 'sess_1', data: { messageText: 'oi linda' } },
      { id: '3', timestamp: Date.now() - 3600000 * 4.8, date: new Date(Date.now() - 3600000 * 4.8).toISOString(), type: 'preview_click', sessionId: 'sess_1', data: { previewRemaining: 1 } },
      { id: '4', timestamp: Date.now() - 3600000 * 4.7, date: new Date(Date.now() - 3600000 * 4.7).toISOString(), type: 'vip_modal_open', sessionId: 'sess_1' },
      { id: '5', timestamp: Date.now() - 3600000 * 4.6, date: new Date(Date.now() - 3600000 * 4.6).toISOString(), type: 'pix_generated', sessionId: 'sess_1', data: { valor: 19.90, plano: 'Acesso VIP', utm_source: 'instagram_ads' } },
      { id: '6', timestamp: Date.now() - 3600000 * 4.5, date: new Date(Date.now() - 3600000 * 4.5).toISOString(), type: 'pix_paid', sessionId: 'sess_1', data: { valor: 19.90, plano: 'Acesso VIP', utm_source: 'instagram_ads' } },
      { id: '7', timestamp: Date.now() - 3600000 * 3, date: new Date(Date.now() - 3600000 * 3).toISOString(), type: 'visit', sessionId: 'sess_2', data: { utm_source: 'tiktok_ads', utm_campaign: 'spark_nicole' } },
      { id: '8', timestamp: Date.now() - 3600000 * 2.9, date: new Date(Date.now() - 3600000 * 2.9).toISOString(), type: 'pix_generated', sessionId: 'sess_2', data: { valor: 19.90, plano: 'Acesso VIP', utm_source: 'tiktok_ads' } },
      { id: '9', timestamp: Date.now() - 3600000 * 1, date: new Date(Date.now() - 3600000 * 1).toISOString(), type: 'visit', sessionId: 'sess_3', data: { utm_source: 'facebook_feed' } },
      { id: '10', timestamp: Date.now() - 3600000 * 0.5, date: new Date(Date.now() - 3600000 * 0.5).toISOString(), type: 'offer_trigger', sessionId: 'sess_3', data: { offerId: 'front' } },
      { id: '11', timestamp: Date.now() - 3600000 * 0.4, date: new Date(Date.now() - 3600000 * 0.4).toISOString(), type: 'pix_generated', sessionId: 'sess_3', data: { valor: 9.90, plano: 'vip_total', utm_source: 'facebook_feed' } },
      { id: '12', timestamp: Date.now() - 3600000 * 0.3, date: new Date(Date.now() - 3600000 * 0.3).toISOString(), type: 'pix_paid', sessionId: 'sess_3', data: { valor: 9.90, plano: 'vip_total', utm_source: 'facebook_feed' } },
    ]
    localStorage.setItem('hotlive_metrics_events', JSON.stringify(mockEvents))
    loadData()
  }

  if (!summary) return null

  // Etapas do Funil
  const funnelSteps = [
    { label: '1. Visitantes da Live', count: summary.totalVisits, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: '2. Interagiram no Chat', count: summary.totalInteractions, icon: MessageSquare, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: '3. Assistiram Prévia', count: summary.totalPreviews, icon: Eye, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: '4. Abriram Modal VIP', count: summary.vipModalOpens, icon: Layers, color: 'text-pink-400', bg: 'bg-pink-500/10' },
    { label: '5. PIX Gerado', count: summary.pixGeneratedCount, icon: QrCode, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: '6. PIX Pago (Venda)', count: summary.pixPaidCount, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ]

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans pb-16">
      {/* Topo / Header */}
      <header className="border-b border-slate-800/80 bg-[#0d1322]/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ff0055] to-[#ff4081] flex items-center justify-center shadow-lg shadow-pink-500/20">
                <Activity className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                  HOTLIVE <span className="text-[10px] px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-400 border border-pink-500/30 uppercase font-bold tracking-wider">Analytics</span>
                </h1>
                <p className="text-xs text-slate-400">Painel de Métricas & Conversão em Tempo Real</p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-semibold text-emerald-400 uppercase">Ao Vivo</span>
            </div>
          </div>

          {/* Controles do Cabeçalho */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
            {/* Filtro de Período */}
            <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
              <button 
                onClick={() => setFilterPeriod('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${filterPeriod === 'all' ? 'bg-pink-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Tudo
              </button>
              <button 
                onClick={() => setFilterPeriod('today')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${filterPeriod === 'today' ? 'bg-pink-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Hoje
              </button>
              <button 
                onClick={() => setFilterPeriod('7days')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${filterPeriod === '7days' ? 'bg-pink-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                7 Dias
              </button>
            </div>

            {/* Ações */}
            <button 
              onClick={loadData}
              title="Atualizar Agora"
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold"
            >
              <RefreshCw className="w-4 h-4 text-slate-400" />
            </button>

            <button 
              onClick={handleClear}
              title="Limpar Métricas"
              className="p-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <Link 
              to="/" 
              target="_blank"
              className="px-3.5 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-pink-600/20 flex items-center gap-1.5 transition-all"
            >
              <Radio className="w-3.5 h-3.5" /> Ver Live
              <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        
        {/* Banner Vazio / Seed */}
        {events.length === 0 && (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 text-center space-y-3">
            <h3 className="text-base font-bold text-white">Nenhum evento registrado ainda</h3>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              Abra a live em outra aba para gerar tráfego real ou clique no botão abaixo para popular dados de demonstração.
            </p>
            <button 
              onClick={handleSeedDemo}
              className="px-4 py-2 bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/40 text-pink-400 text-xs font-bold rounded-xl transition-all"
            >
              Popular com Dados de Teste
            </button>
          </div>
        )}

        {/* CARDS DE KPI PRINCIPAIS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Faturamento Total */}
          <div className="bg-gradient-to-br from-emerald-950/30 via-slate-900/80 to-slate-900/40 border border-emerald-500/20 p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" /> Faturamento
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20">
                {summary.pixPaidCount} vendas
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {summary.totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> PIX aprovados
            </p>
          </div>

          {/* Taxa de Conversão Final */}
          <div className="bg-gradient-to-br from-pink-950/30 via-slate-900/80 to-slate-900/40 border border-pink-500/20 p-5 rounded-2xl relative overflow-hidden group hover:border-pink-500/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
                <Percent className="w-4 h-4" /> Conv. PIX → Venda
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {summary.conversionRatePaid.toFixed(1)}%
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {summary.pixPaidCount} pagos de {summary.pixGeneratedCount} gerados
            </p>
          </div>

          {/* PIX Gerados */}
          <div className="bg-gradient-to-br from-amber-950/30 via-slate-900/80 to-slate-900/40 border border-amber-500/20 p-5 rounded-2xl relative overflow-hidden group hover:border-amber-500/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <QrCode className="w-4 h-4" /> PIX Gerados
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20">
                {summary.conversionRatePix.toFixed(1)}% dos visitantes
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {summary.pixGeneratedCount}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Intenção de compra direta
            </p>
          </div>

          {/* Total de Visitantes */}
          <div className="bg-gradient-to-br from-blue-950/30 via-slate-900/80 to-slate-900/40 border border-blue-500/20 p-5 rounded-2xl relative overflow-hidden group hover:border-blue-500/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <Users className="w-4 h-4" /> Visitantes Únicos
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 font-bold border border-blue-500/20">
                {summary.totalVisits} sessões
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {summary.uniqueVisitors}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Tráfego recebido no funil
            </p>
          </div>

        </div>

        {/* NAVEGAÇÃO DE ABAS DO PAINEL */}
        <div className="flex border-b border-slate-800 space-x-2 sm:space-x-4 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('funnel')}
            className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'funnel'
                ? 'border-pink-500 text-pink-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" /> Funil de Conversão
          </button>

          <button
            onClick={() => setActiveTab('utms')}
            className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'utms'
                ? 'border-pink-500 text-pink-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" /> Origem / UTMs
          </button>

          <button
            onClick={() => setActiveTab('plans')}
            className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'plans'
                ? 'border-pink-500 text-pink-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" /> Planos & Ofertas
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'events'
                ? 'border-pink-500 text-pink-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" /> Feed de Atividade ({events.length})
          </button>
        </div>

        {/* CONTEÚDO DA ABA: FUNIL */}
        {activeTab === 'funnel' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
              <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <Layers className="w-4 h-4 text-pink-400" /> Etapas do Funil da Live
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Acompanhe o caminho do lead desde o carregamento até a confirmação do pagamento
              </p>

              <div className="space-y-4">
                {funnelSteps.map((step, idx) => {
                  const Icon = step.icon
                  const baseCount = summary.totalVisits || 1
                  const pctFromTotal = ((step.count / baseCount) * 100).toFixed(1)
                  const prevCount = idx > 0 ? (funnelSteps[idx - 1].count || 1) : step.count
                  const pctFromPrev = idx > 0 ? ((step.count / prevCount) * 100).toFixed(1) : '100'

                  return (
                    <div key={idx} className="bg-slate-950/60 border border-slate-800/70 p-4 rounded-xl space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${step.bg} flex items-center justify-center ${step.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-bold text-slate-200">{step.label}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-semibold">
                          <span className="text-slate-400">
                            {idx > 0 && <span className="text-slate-500 mr-2">({pctFromPrev}% do passo anterior)</span>}
                            <strong className="text-white text-sm">{step.count}</strong> ações
                          </span>
                          <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-pink-400 font-bold">
                            {pctFromTotal}% do total
                          </span>
                        </div>
                      </div>

                      {/* Barra de Progresso */}
                      <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-500" 
                          style={{ width: `${Math.max(2, Math.min(100, (step.count / baseCount) * 100))}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* CONTEÚDO DA ABA: UTMS */}
        {activeTab === 'utms' && (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Compass className="w-4 h-4 text-pink-400" /> Origem do Tráfego (utm_source / src)
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Desempenho discriminado por canal de anúncio e fonte de tráfego
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="pb-3 px-3">Fonte / Origem</th>
                    <th className="pb-3 px-3">Visitas</th>
                    <th className="pb-3 px-3">PIX Gerados</th>
                    <th className="pb-3 px-3">Vendas Pagas</th>
                    <th className="pb-3 px-3">Conv. PIX</th>
                    <th className="pb-3 px-3 text-right">Faturamento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {Object.entries(summary.byUtmSource).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-500">
                        Nenhuma UTM registrada até o momento
                      </td>
                    </tr>
                  ) : (
                    Object.entries(summary.byUtmSource).map(([src, stat], idx) => {
                      const convPix = stat.visits > 0 ? ((stat.pixGenerated / stat.visits) * 100).toFixed(1) : '0'
                      return (
                        <tr key={idx} className="hover:bg-slate-800/30 transition-all">
                          <td className="py-3 px-3 font-bold text-slate-200">{src}</td>
                          <td className="py-3 px-3 text-slate-300">{stat.visits}</td>
                          <td className="py-3 px-3 text-amber-400 font-semibold">{stat.pixGenerated}</td>
                          <td className="py-3 px-3 text-emerald-400 font-bold">{stat.paid}</td>
                          <td className="py-3 px-3 text-pink-400 font-semibold">{convPix}%</td>
                          <td className="py-3 px-3 text-right font-black text-white">
                            {stat.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CONTEÚDO DA ABA: PLANOS & OFERTAS */}
        {activeTab === 'plans' && (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" /> Vendas por Oferta / Plano
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Distribuição de pedidos e receita por produto ofertado no funil
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(summary.byPlan).length === 0 ? (
                <div className="col-span-full py-8 text-center text-slate-500 text-xs">
                  Nenhum plano com pedido gerado ainda
                </div>
              ) : (
                Object.entries(summary.byPlan).map(([planName, stat], idx) => (
                  <div key={idx} className="bg-slate-950/70 border border-slate-800/80 p-4 rounded-xl space-y-2">
                    <div className="text-sm font-black text-white uppercase tracking-wide">
                      {planName}
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
                      <span className="text-slate-400">PIX Gerados:</span>
                      <span className="font-bold text-amber-400">{stat.count}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">PIX Pagos:</span>
                      <span className="font-bold text-emerald-400">{stat.paid}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
                      <span className="text-slate-400">Total Faturado:</span>
                      <span className="font-black text-white">
                        {stat.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* CONTEÚDO DA ABA: EVENTOS EM TEMPO REAL */}
        {activeTab === 'events' && (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" /> Registro Detalhado de Eventos Recentes
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Logs brutos de interações dos usuários capturados automaticamente
            </p>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {events.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  Nenhum evento registrado ainda
                </div>
              ) : (
                events.map((evt) => {
                  let badge = 'bg-slate-800 text-slate-300'
                  let label: string = evt.type

                  if (evt.type === 'visit') { badge = 'bg-blue-500/20 text-blue-400 border border-blue-500/30'; label = 'Visita na Live' }
                  if (evt.type === 'message_sent') { badge = 'bg-purple-500/20 text-purple-400 border border-purple-500/30'; label = 'Mensagem no Chat' }
                  if (evt.type === 'preview_click') { badge = 'bg-amber-500/20 text-amber-400 border border-amber-500/30'; label = 'Assistiu Prévia' }
                  if (evt.type === 'vip_modal_open') { badge = 'bg-pink-500/20 text-pink-400 border border-pink-500/30'; label = 'Abriu Modal VIP' }
                  if (evt.type === 'pix_generated') { badge = 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'; label = 'PIX Gerado' }
                  if (evt.type === 'pix_paid') { badge = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'; label = 'PIX Pago 🎉' }
                  if (evt.type === 'offer_trigger') { badge = 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'; label = 'Oferta de Vídeo' }

                  return (
                    <div key={evt.id} className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${badge}`}>
                          {label}
                        </span>
                        <div className="space-y-0.5">
                          {evt.data?.messageText && (
                            <span className="text-slate-300 block italic">"{evt.data.messageText}"</span>
                          )}
                          {evt.data?.plano && (
                            <span className="text-slate-300 block font-semibold">
                              Plano: {evt.data.plano} {evt.data?.valor ? `(R$ ${evt.data.valor})` : ''}
                            </span>
                          )}
                          <div className="text-[10px] text-slate-500 flex items-center gap-2">
                            <span>Sessão: {evt.sessionId.substring(0, 10)}...</span>
                            {evt.data?.utm_source && (
                              <span className="text-pink-400/80 font-medium">Origem: {evt.data.utm_source}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 font-mono self-end sm:self-center">
                        {new Date(evt.timestamp).toLocaleTimeString('pt-BR')}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
