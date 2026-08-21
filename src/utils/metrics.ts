/**
 * Utilitário de telemetria e métricas do funil Hotlive
 * Registra eventos em tempo real no localStorage para alimentar o Painel de Métricas
 */

export interface MetricEvent {
  id: string
  timestamp: number
  date: string
  type: 
    | 'visit' 
    | 'message_sent' 
    | 'preview_click' 
    | 'vip_modal_open' 
    | 'offer_trigger' 
    | 'pix_generated' 
    | 'pix_paid'
  sessionId: string
  data?: {
    utm_source?: string
    utm_campaign?: string
    utm_medium?: string
    utm_term?: string
    utm_content?: string
    slug?: string
    valor?: number
    plano?: string
    txid?: string
    offerId?: string
    step?: number
    messageText?: string
    previewRemaining?: number
    [key: string]: any
  }
}

export interface FunnelSummary {
  totalVisits: number
  uniqueVisitors: number
  totalInteractions: number
  totalPreviews: number
  vipModalOpens: number
  pixGeneratedCount: number
  pixPaidCount: number
  totalRevenue: number
  conversionRatePix: number
  conversionRatePaid: number
  recentEvents: MetricEvent[]
  eventsByType: Record<string, number>
  byUtmSource: Record<string, { visits: number; pixGenerated: number; paid: number; revenue: number }>
  byPlan: Record<string, { count: number; paid: number; revenue: number }>
}

const STORAGE_KEY = 'hotlive_metrics_events'
const VISITOR_KEY = 'hotlive_session_id'

// Obtém ou cria ID único da sessão do visitante
export function getOrCreateSessionId(): string {
  let sessionId = sessionStorage.getItem(VISITOR_KEY)
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36)
    sessionStorage.setItem(VISITOR_KEY, sessionId)
  }
  return sessionId
}

// Salva um evento de métrica
export function trackEvent(
  type: MetricEvent['type'], 
  data?: MetricEvent['data']
) {
  try {
    const sessionId = getOrCreateSessionId()
    const now = new Date()
    
    // Captura parâmetros de UTM se disponíveis
    let utmParams: Record<string, string> = {}
    try {
      const stored = sessionStorage.getItem('captured_utms') || localStorage.getItem('captured_utms') || ''
      if (stored) {
        utmParams = Object.fromEntries(new URLSearchParams(stored))
      }
    } catch {}

    const newEvent: MetricEvent = {
      id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      timestamp: Date.now(),
      date: now.toISOString(),
      type,
      sessionId,
      data: {
        ...utmParams,
        ...data
      }
    }

    const raw = localStorage.getItem(STORAGE_KEY)
    const list: MetricEvent[] = raw ? JSON.parse(raw) : []
    
    // Limita aos últimos 2000 eventos para não estourar localStorage
    list.unshift(newEvent)
    if (list.length > 2000) {
      list.length = 2000
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))

    // Dispara evento nativo de storage para sincronizar abas do painel abertas
    window.dispatchEvent(new CustomEvent('hotlive_metric_updated', { detail: newEvent }))
  } catch (e) {
    console.warn('[Metrics] Erro ao registrar evento:', e)
  }
}

// Recupera todos os eventos
export function getStoredEvents(): MetricEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// Limpa todas as métricas salvas
export function clearStoredEvents(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new CustomEvent('hotlive_metric_updated'))
  } catch {}
}

// Gera métricas agregadas para o painel
export function calculateFunnelSummary(events: MetricEvent[]): FunnelSummary {
  const uniqueSessionIds = new Set<string>()
  let totalVisits = 0
  let totalInteractions = 0
  let totalPreviews = 0
  let vipModalOpens = 0
  let pixGeneratedCount = 0
  let pixPaidCount = 0
  let totalRevenue = 0

  const eventsByType: Record<string, number> = {}
  const byUtmSource: Record<string, { visits: number; pixGenerated: number; paid: number; revenue: number }> = {}
  const byPlan: Record<string, { count: number; paid: number; revenue: number }> = {}

  // Processa cronologicamente inverso (eventos já estão mais recentes primeiro)
  for (const evt of events) {
    uniqueSessionIds.add(evt.sessionId)
    eventsByType[evt.type] = (eventsByType[evt.type] || 0) + 1

    const source = (evt.data?.utm_source || evt.data?.src || 'Direto / Orgânico').trim()
    if (!byUtmSource[source]) {
      byUtmSource[source] = { visits: 0, pixGenerated: 0, paid: 0, revenue: 0 }
    }

    switch (evt.type) {
      case 'visit':
        totalVisits++
        byUtmSource[source].visits++
        break
      case 'message_sent':
        totalInteractions++
        break
      case 'preview_click':
        totalPreviews++
        break
      case 'vip_modal_open':
        vipModalOpens++
        break
      case 'pix_generated': {
        pixGeneratedCount++
        byUtmSource[source].pixGenerated++
        const plano = evt.data?.plano || 'vip'
        if (!byPlan[plano]) byPlan[plano] = { count: 0, paid: 0, revenue: 0 }
        byPlan[plano].count++
        break
      }
      case 'pix_paid': {
        pixPaidCount++
        const val = Number(evt.data?.valor) || 0
        totalRevenue += val
        byUtmSource[source].paid++
        byUtmSource[source].revenue += val
        const plano = evt.data?.plano || 'vip'
        if (!byPlan[plano]) byPlan[plano] = { count: 0, paid: 0, revenue: 0 }
        byPlan[plano].paid++
        byPlan[plano].revenue += val
        break
      }
    }
  }

  const conversionRatePix = totalVisits > 0 ? (pixGeneratedCount / totalVisits) * 100 : 0
  const conversionRatePaid = pixGeneratedCount > 0 ? (pixPaidCount / pixGeneratedCount) * 100 : 0

  return {
    totalVisits,
    uniqueVisitors: uniqueSessionIds.size,
    totalInteractions,
    totalPreviews,
    vipModalOpens,
    pixGeneratedCount,
    pixPaidCount,
    totalRevenue,
    conversionRatePix,
    conversionRatePaid,
    recentEvents: events.slice(0, 50),
    eventsByType,
    byUtmSource,
    byPlan
  }
}
