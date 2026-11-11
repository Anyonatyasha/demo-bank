const STORAGE_KEY = 'demo-bank:orders'
const CREATE_DELAY = 800 // задержка ответа на создание платежа
const STATUS_DELAY = 300 // задержка ответа на запрос статуса
const WEBHOOK_DELAY = 3000 // через сколько присылает вебхук

export const COUPONS = [
  { id: 'coffee', title: 'Кофейня', amount: 500 },
  { id: 'cinema', title: 'Кинотеатр', amount: 1000 },
  { id: 'books', title: 'Книжный', amount: 2500 },
  { id: 'spa', title: 'СПА', amount: 5000 },
]

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getOrders() {
  await delay(STATUS_DELAY)
  const orders = readOrders()
  return Object.values(orders).map(applyWebhookIfDue).sort((a, b) => b.createdAt - a.createdAt)
}

function readOrders() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}
  } catch {
    return {}
  }
}

function saveOrder(order) {
  const orders = readOrders()
  orders[order.orderId] = order
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

function generateId(prefix) {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`.toUpperCase()
}

/** Создаёт заказ со статусом pending и возвращает ссылку на оплату. */
export async function createPayment(couponId) {
  const coupon = COUPONS.find((c) => c.id === couponId)
  if (!coupon) throw new Error('Купон не найден')

  const orderId = generateId('ORD-')
  saveOrder({
    orderId,
    couponId,
    title: coupon.title,
    amount: coupon.amount,
    status: 'pending',
    couponCode: null,
    webhook: null,
    createdAt: Date.now(),
  })

  await delay(CREATE_DELAY)
  return { orderId, paymentUrl: `/bank?orderId=${orderId}` }
}

/**
 * Вызывается со страницы банка. Статус меняется не сразу, а через 3 секунды:
 * имитация вебхука, который приходит позже
 */
export function confirmByBank(orderId, result) {
  const order = readOrders()[orderId]
  if (!order || order.status !== 'pending') return

  saveOrder({ ...order, webhook: { result, at: Date.now() + WEBHOOK_DELAY } })

  setTimeout(() => {
    const current = readOrders()[orderId]
    if (current) applyWebhookIfDue(current)
  }, WEBHOOK_DELAY)
}

/** Возвращает текущий заказ (status: pending | success | failed) или null. */
export async function getOrderStatus(orderId) {
  await delay(STATUS_DELAY)
  const order = readOrders()[orderId]
  if (!order) return null
  return applyWebhookIfDue(order)
}

function applyWebhookIfDue(order) {
  if (order.status !== 'pending' || !order.webhook) return order
  if (Date.now() < order.webhook.at) return order

  const updated = {
    ...order,
    status: order.webhook.result,
    couponCode: order.webhook.result === 'success' ? generateId('CPN-') : null,
    webhook: null,
  }
  saveOrder(updated)
  return updated
}

