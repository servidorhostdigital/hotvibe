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
      // Chamada real para a API MonsterPay
      const response = await fetch(`${CONFIG.monsterpay.apiUrl}/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CONFIG.monsterpay.apiKey,
          'x-secret-key': CONFIG.monsterpay.secretKey
        },
        body: JSON.stringify({
          amount: valor,
          customer_name: CONFIG.customerDefaults.name,
          customer_email: CONFIG.customerDefaults.email,
          description: plano,
          ...tracking
        })
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Erro ao gerar PIX.')
      }

      setPixData({
        qrcode: data.pix_qr_code || null,
        copiaCola: data.pix_code,
        transactionId: data.id
      })
    } catch (err: any) {
      setError(err.message || 'Não foi possível conectar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  // Polling para verificar o status do pagamento
  useEffect(() => {
    if (!pixData || !pixData.transactionId) return

    let interval: ReturnType<typeof setInterval>

    const checkStatus = async () => {
      try {
        const response = await fetch(`${CONFIG.monsterpay.apiUrl}/payment-status/${pixData.transactionId}`, {
          headers: {
            'x-api-key': CONFIG.monsterpay.apiKey,
            'x-secret-key': CONFIG.monsterpay.secretKey
          }
        })
        const data = await response.json()

        if (data.status === 'paid') {
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
