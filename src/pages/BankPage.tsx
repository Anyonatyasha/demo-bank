import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { confirmByBank, getOrderStatus } from '../api/paymentApi'
import type { Order } from '../types'

export default function BankPage() {
  const [params] = useSearchParams()
  const orderId = params.get('orderId')

  if (!orderId) {
    return <div className="bank"><p>Заказ не найден</p></div>
  }

  return <BankPayment orderId={orderId} />

}
function BankPayment({ orderId }: { orderId: string }) {
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null | undefined>() // undefined = загрузка, null = не найден
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    let cancelled = false
    getOrderStatus(orderId).then((o) => {
      if (!cancelled) setOrder(o)
    })
    return () => {
      cancelled = true
    }
  }, [orderId])

  function pay() {
    setBusy(true)
    confirmByBank(orderId, 'success')
    navigate(`/payment/success?orderId=${orderId}`)
  }

  function decline() {
    setBusy(true)
    confirmByBank(orderId, 'failed')
    navigate(`/payment/fail?orderId=${orderId}`)
  }

  function noResponse() {
    // Вебхук не придёт: статус останется pending, таймаут
    setBusy(true)
    navigate(`/payment/success?orderId=${orderId}`)
  }

  if (order === undefined) return <div className="bank"><p>Загрузка…</p></div>
  if (order === null) return <div className="bank"><p>Заказ не найден</p></div>

  return (
    <div className="bank">
      <div className="bank-card">
        <div className="bank-logo">Демо-банк</div>
        <p className="muted">Оплата заказа {order.orderId}</p>
        <p>{order.title}</p>
        <p className="amount">{order.amount.toLocaleString('ru-RU')} ₽</p>

        <div className="bank-actions">
          <button onClick={pay} disabled={busy}>Оплатить успешно</button>
          <button className="danger" onClick={decline} disabled={busy}>Отклонить</button>
          <button className="secondary" onClick={noResponse} disabled={busy}>Банк не ответил</button>
        </div>
      </div>
    </div>
  )
}
