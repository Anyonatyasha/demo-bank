export default function CouponCard({ coupon, loading, disabled, onPay }) {
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
