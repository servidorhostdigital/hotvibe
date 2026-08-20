/**
 * Utilitário de preservação e repasse de UTMs e parâmetros de URL
 */

// Chaves comuns de rastreamento
const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'src',
  'sck',
  'fbclid',
  'gclid',
  'ttclid',
  'kwai_pixel_id'
]

/**
 * Captura todos os parâmetros da URL atual e salva no sessionStorage / localStorage
 */
export function captureAndPersistUtms(): URLSearchParams {
  const currentParams = new URLSearchParams(window.location.search)
  const storedParamsStr = sessionStorage.getItem('captured_utms') || localStorage.getItem('captured_utms') || ''
  const storedParams = new URLSearchParams(storedParamsStr)

  // Atualiza com os novos parâmetros da URL atual se existirem
  currentParams.forEach((value, key) => {
    storedParams.set(key, value)
  })

  // Salva de volta
  const resultStr = storedParams.toString()
  if (resultStr) {
    sessionStorage.setItem('captured_utms', resultStr)
    localStorage.setItem('captured_utms', resultStr)
  }

  return storedParams
}

/**
 * Concatena todas as UTMs salvas a um link de destino (checkout / redirecionamento)
 */
export function buildUrlWithUtms(targetUrl: string, extraParams?: Record<string, string>): string {
  if (!targetUrl) return ''

  try {
    const isAbsolute = targetUrl.startsWith('http://') || targetUrl.startsWith('https://')
    const url = new URL(targetUrl, window.location.origin)
    
    // Recupera parâmetros persistidos
    const storedParamsStr = sessionStorage.getItem('captured_utms') || localStorage.getItem('captured_utms') || ''
    const utmParams = new URLSearchParams(storedParamsStr)

    // Adiciona as UTMs preservadas
    utmParams.forEach((val, key) => {
      if (!url.searchParams.has(key)) {
        url.searchParams.set(key, val)
      }
    })

    // Adiciona parâmetros extras opcionais
    if (extraParams) {
      Object.entries(extraParams).forEach(([key, val]) => {
        url.searchParams.set(key, val)
      })
    }

    return isAbsolute ? url.toString() : `${url.pathname}${url.search}${url.hash}`
  } catch (e) {
    console.error('Erro ao processar UTMs para a URL:', targetUrl, e)
    return targetUrl
  }
}
