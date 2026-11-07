import { useSearchParams } from 'react-router-dom'
import { usePaymentStatus } from '../hooks/usePaymentStatus'
import StatusView from '../components/StatusView'

// вернул пользователя на /payment/success, но это ещё не доказательство оплаты
// результат только по статусу из бэка.
export default function PaymentResultPage() {
  const [params] = useSearchParams()
  const orderId = params.get('orderId')
  const { status, couponCode, retry } = usePaymentStatus(orderId)

  return (
    <div className="page">
      <StatusView status={status} couponCode={couponCode} orderId={orderId} onRetry={retry} />
    </div>
  )
}
