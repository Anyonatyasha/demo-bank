import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getOrders } from '../api/paymentApi'

const STATUS_LABELS = {
  pending: 'В обработке',
  success: 'Оплачен',
  failed: 'Не оплачен',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState(undefined)

  useEffect(() => {
    let cancelled = false

    async function fetchOrders() {
      const data = await getOrders()
      if (!cancelled) {
        setOrders(data)
      }
    }

    fetchOrders()

    return () => {
      cancelled = true
    }
  }, [])

  if (orders === undefined) {
    return (
      <div className="page">
        <p>Загрузка…</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="page">
        <p>
          Покупок пока нет. <Link to="/">В каталог</Link>
        </p>
      </div>
    )
  }
  return (
    <div className="page">
      <h1>Мои покупки</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.orderId}>
            {order.title} | {order.amount.toLocaleString('ru-RU')} ₽ | {STATUS_LABELS[order.status]}{' '}

            {order.status === 'pending' && (
              <Link to={`/payment/success?orderId=${order.orderId}`}>Проверить статус</Link>
            )}

            {order.status === 'success' && (
              <span className="code">{order.couponCode}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
