import { useState, useEffect } from 'react'
import { CONFIG } from '../config'

interface PixResponse {
  qrcode: string | null
  copiaCola: string
  transactionId: string
  error?: string
}

interface UsePixCheckoutProps {
  slug: string
  tracking: Record<string, string>
  onSuccess: () => void
}

export function usePixCheckout({ tracking, onSuccess }: UsePixCheckoutProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pixData, setPixData] = useState<PixResponse | null>(null)
  const [copied, setCopied] = useState(false)

  // Função para gerar o PIX
  const generatePix = async (valor: number, plano: string) => {
    setLoading(true)
    setError(null)
    setPixData(null)
    setCopied(false)

    try {
      // Endpoint oficial da FurionPay
      if (!CONFIG.furionpay.apiKey || CONFIG.furionpay.apiKey === 'SUA_API_KEY_AQUI') {
        throw new Error('Configure sua API Key da FurionPay em src/config.ts')
      }

      const response = await fetch(`${CONFIG.furionpay.apiUrl}/api-v1-pix-create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CONFIG.furionpay.apiKey}`
        },
        body: JSON.stringify({
          amount: valor,
          description: plano,
          external_reference: `live-${Date.now()}`,
          customer: {
            name: CONFIG.customerDefaults.name,
            email: CONFIG.customerDefaults.email,
            phone: CONFIG.customerDefaults.phone,
            document: CONFIG.customerDefaults.document
          },
          utm: tracking
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success || !data.data) {
        const errorMsg = data?.error?.message || data?.error || 'Erro ao gerar PIX com a FurionPay.'
        throw new Error(errorMsg)
      }

      setPixData({
        qrcode: data.data.qr_code_url || null,
        copiaCola: data.data.pix_code,
        transactionId: data.data.txid
      })
    } catch (err: any) {
      setError(err.message || 'Não foi possível conectar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  // Polling para verificar o status do pagamento na FurionPay
  useEffect(() => {
    if (!pixData || !pixData.transactionId) return

    let interval: ReturnType<typeof setInterval>

    const checkStatus = async () => {
      try {
        if (!CONFIG.furionpay.apiKey || CONFIG.furionpay.apiKey === 'SUA_API_KEY_AQUI') return

        const response = await fetch(`${CONFIG.furionpay.apiUrl}/api-v1-pix-status?txid=${pixData.transactionId}`, {
          headers: {
            'Authorization': `Bearer ${CONFIG.furionpay.apiKey}`
          }
        })
        const data = await response.json()

        if (data?.data?.status === 'paid' || data?.status === 'paid') {
          clearInterval(interval)
          onSuccess()
        }
      } catch (err) {
        console.error('Erro ao verificar status do PIX', err)
      }
    }

    interval = setInterval(checkStatus, 2000)

    // Timeout de 20 minutos (1200 segundos)
    const timeout = setTimeout(() => {
      clearInterval(interval)
    }, 1200 * 1000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [pixData, onSuccess])

  const copyToClipboard = () => {
    if (pixData?.copiaCola) {
      navigator.clipboard.writeText(pixData.copiaCola)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }

  // Função auxiliar para simular pagamento em ambiente de dev
  const simulatePayment = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      onSuccess()
    }
  }

  return {
    loading,
    error,
    pixData,
    copied,
    generatePix,
    copyToClipboard,
    simulatePayment,
    reset: () => {
      setPixData(null)
      setError(null)
      setLoading(false)
    }
  }
}
