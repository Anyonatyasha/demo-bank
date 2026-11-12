import type { Coupon } from '../types'

interface CouponCardProps {
  coupon: Coupon
  loading: boolean
  disabled: boolean
  onPay: (couponId: string) => void
}

export default function CouponCard({ coupon, loading, disabled, onPay }: CouponCardProps) {
  return (
    <div className="card">
      <h3>{coupon.title}</h3>
      <p className="amount">{coupon.amount.toLocaleString('ru-RU')} ₽</p>
      <button onClick={() => onPay(coupon.id)} disabled={disabled}>
        {loading ? 'Создаём платёж…' : 'Оплатить'}
      </button>
    </div>
  )
}
