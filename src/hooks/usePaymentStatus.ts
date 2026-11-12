import { useCallback, useEffect, useState } from 'react'
import { getOrderStatus } from '../api/paymentApi'
import type { PaymentStatus } from '../types'

const POLL_INTERVAL = 2000
const MAX_ATTEMPTS = 10

interface PaymentState {
  status: PaymentStatus
  couponCode: string | null
}
/**
 * Опрашивает статус заказа каждые 2 секунды, максимум 10 попыток.
 * status: loading | success | failed | timeout
 */

export function usePaymentStatus(orderId: string | null) {
  const [state, setState] = useState<PaymentState>({ status: 'loading', couponCode: null })
  const [runId, setRunId] = useState(0)

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined
    let attempts = 0

    async function check() {
      attempts += 1

      try {
        const order = orderId ? await getOrderStatus(orderId) : null
        if (cancelled) return

        if (!order || order.status === 'failed') {
          setState({ status: 'failed', couponCode: null })
          return
        }
        if (order.status === 'success') {
          setState({ status: 'success', couponCode: order.couponCode })
          return
        }
      } catch {
        if (cancelled) return
        // Сетевая ошибка: считаем попытку и пробуем ещё раз
      }

      if (attempts >= MAX_ATTEMPTS) {
        setState({ status: 'timeout', couponCode: null })
        return
      }
      timer = setTimeout(check, POLL_INTERVAL)
    }

    check()

    // Уход со страницы или повторный запуск: останавливаем опрос
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [orderId, runId])

  const retry = useCallback(() => {
    setState({ status: 'loading', couponCode: null })
    setRunId((n) => n + 1)
  }, [])

  return { ...state, retry }
}
