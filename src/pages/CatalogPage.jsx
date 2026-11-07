import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COUPONS, createPayment } from '../api/paymentApi'
import CouponCard from '../components/CouponCard'

export default function CatalogPage() {
  const navigate = useNavigate()
  const [pendingId, setPendingId] = useState(null)
  const [error, setError] = useState(null)
  const inFlight = useRef(false)

  async function handlePay(couponId) {
    if (inFlight.current) return
    inFlight.current = true
    setPendingId(couponId)
    setError(null)

    try {
      const { paymentUrl } = await createPayment(couponId)
      navigate(paymentUrl)
    } catch (e) {
      setError(e.message)
      setPendingId(null)
      inFlight.current = false
    }
  }

  return (
    <div className="page">
      <h1>Купоны</h1>
      {error && <p className="error">{error}</p>}
      <div className="grid">
        {COUPONS.map((coupon) => (
          <CouponCard
            key={coupon.id}
            coupon={coupon}
            loading={pendingId === coupon.id}
            disabled={pendingId !== null}
            onPay={handlePay}
          />
        ))}
      </div>
    </div>
  )
}
