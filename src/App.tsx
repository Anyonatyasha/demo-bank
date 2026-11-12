import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import CatalogPage from './pages/CatalogPage'
import BankPage from './pages/BankPage'
import PaymentResultPage from './pages/PaymentResultPage'
import PaymentFailPage from './pages/PaymentFailPage'
import OrdersPage from './pages/OrdersPage'

export default function App() {
  return (
    <BrowserRouter>
      <header className="header">
        <Link to="/">Покупка купона</Link>
        <Link to="/orders">Мои покупки</Link>
      </header>
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/bank" element={<BankPage />} />
        <Route path="/payment/success" element={<PaymentResultPage />} />
        <Route path="/payment/fail" element={<PaymentFailPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="*" element={<p>Страница не найдена</p>} />
      </Routes>
    </BrowserRouter>
  )
}
