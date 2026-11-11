import { Link } from 'react-router-dom'

export default function StatusView({ status, couponCode, orderId, onRetry }) {
  if (status === 'loading') {
    return (
      <div className="status">
        <div className="spinner" />
        <h2>Платёж обрабатывается</h2>
        <p>Обычно это занимает несколько секунд.</p>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="status">
        <h2>Оплата прошла</h2>
        <p>Ваш код купона:</p>
        <p className="code">{couponCode}</p>
        <Link to="/">В каталог</Link>
      </div>
    )
  }

  if (status === 'timeout') {
    return (
      <div className="status">
        <h2>Не удалось подтвердить платёж</h2>
        <p>Если деньги списались, купон придёт, как только банк подтвердит оплату.</p>
        <div className="actions">
          <button onClick={onRetry}>Проверить снова</button>
          <a
            className="button secondary"
            href={`mailto:support@example.com?subject=Платёж ${orderId ?? ''}`}
          >
            Написать в поддержку
          </a>
        </div>
        <p>Статус заказа можно проверить позже в разделе <Link to="/orders">«Мои покупки»</Link>.</p>
      </div>
    )
  }

  // failed
  return (
    <div className="status">
      <h2>Оплата не прошла</h2>
      <p>Деньги не списаны. Попробуйте ещё раз.</p>
      <Link className="button" to="/">
        Попробовать снова
      </Link>
    </div>
  )
}
