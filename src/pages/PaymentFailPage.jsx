import StatusView from '../components/StatusView'

export default function PaymentFailPage() {
  return (
    <div className="page">
      <StatusView status="failed" />
    </div>
  )
}
