import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useCart } from '../../context/useCart.js'
import { apiRequest } from '../../lib/api.js'
import { Minus, Plus, ShoppingCart, Trash2, X } from '../../lib/icons.jsx'

const FREE_SHIPPING_THRESHOLD = 999
const WHATSAPP_PHONE = '917038585188'

export default function CartDrawer() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    totalItems,
    isCartOpen,
    closeCart,
  } = useCart()
  const { user } = useAuth()
  const [customer, setCustomer] = useState({
    email: '',
    phone: '',
    location: '',
  })
  const [checkoutStatus, setCheckoutStatus] = useState('')
  const [checkoutError, setCheckoutError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const amountLeft = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0)

  const validateCustomer = () => {
    if (!customer.email || !customer.phone || !customer.location) {
      setCheckoutError('Please enter Gmail, mobile number, and delivery location.')
      return false
    }

    if (customer.location.trim().length < 5) {
      setCheckoutError('Delivery location must be at least 5 characters.')
      return false
    }

    return true
  }

  const handleCheckout = async () => {
    setCheckoutStatus('')
    setCheckoutError('')

    if (!validateCustomer()) {
      return
    }

    setIsSubmitting(true)

    const checkoutPayload = {
      items: cartItems.map(({ id, name, price, weight, qty, image }) => ({
        id,
        name,
        price,
        weight,
        qty,
        image,
      })),
      subtotal,
      currency: 'INR',
      customer: {
        ...customer,
        email: customer.email || user?.email || '',
      },
      source: 'web',
    }

    try {
      const data = await apiRequest(import.meta.env.VITE_CHECKOUT_ENDPOINT || '/checkout', {
        method: 'POST',
        body: JSON.stringify(checkoutPayload),
      })
      setCheckoutStatus(`Order confirmed. Email sent to ${customer.email}. Order ID: ${data.order.id}`)
      clearCart()
    } catch (error) {
      setCheckoutError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWhatsAppOrder = () => {
    setCheckoutStatus('')
    setCheckoutError('')

    if (!validateCustomer()) {
      return
    }

    const itemLines = cartItems
      .map((item) => `${item.name} (${item.weight}) x ${item.qty} = Rs. ${item.price * item.qty}`)
      .join('\n')
    const message = [
      'Hello Shivansh Snacks, I want to place this order:',
      '',
      itemLines,
      '',
      `Total: Rs. ${subtotal}`,
      `Mobile: ${customer.phone}`,
      `Gmail: ${customer.email}`,
      `Location: ${customer.location}`,
    ].join('\n')

    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={`fixed inset-0 z-50 ${isCartOpen ? '' : 'pointer-events-none'}`} aria-hidden={!isCartOpen}>
      <div
        className={`absolute inset-0 bg-[#0F172A]/45 transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeCart}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#FFFDF7] shadow-2xl transition-transform duration-300 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4">
          <div>
            <h2 className="text-xl font-black text-[#0F172A]">Your Cart</h2>
            <p className="text-sm font-semibold text-slate-500">{totalItems} items selected</p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-[#0F172A] transition hover:bg-slate-50 active:scale-95"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="grid flex-1 place-items-center px-6 text-center">
            <div>
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-yellow-100 text-[#0F172A]">
                <ShoppingCart className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-xl font-black text-[#0F172A]">Cart is empty</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Add your favorite banana chips flavor to prepare your order.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="border-b border-slate-200 bg-white px-4 py-4">
              <div className="flex justify-between text-sm font-bold text-slate-600">
                <span>
                  {amountLeft === 0
                    ? 'Free shipping unlocked'
                    : `Add Rs. ${amountLeft} for free shipping`}
                </span>
                <span>Rs. {FREE_SHIPPING_THRESHOLD}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-[#EAB308] transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-[72px_1fr] gap-3 rounded-lg border border-slate-200 bg-white p-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-[72px] rounded-md object-cover"
                    />
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-black text-[#0F172A]">{item.name}</h3>
                          <p className="text-xs font-bold text-slate-500">{item.weight}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-[#DC2626] active:scale-95"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="flex items-center rounded-full border border-slate-200">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.qty - 1)}
                            className="grid h-8 w-8 place-items-center transition active:scale-95"
                            aria-label={`Decrease ${item.name} quantity`}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-black">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.qty + 1)}
                            className="grid h-8 w-8 place-items-center transition active:scale-95"
                            aria-label={`Increase ${item.name} quantity`}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm font-black text-[#0F172A]">Rs. {item.price * item.qty}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 bg-white p-4">
              <div className="mb-4 grid gap-2">
                <input
                  type="email"
                  value={customer.email}
                  onChange={(event) => setCustomer((value) => ({ ...value, email: event.target.value }))}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold outline-none focus:border-[#EAB308]"
                  placeholder="Gmail / Email"
                  required
                />
                <input
                  value={customer.phone}
                  onChange={(event) => setCustomer((value) => ({ ...value, phone: event.target.value }))}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold outline-none focus:border-[#EAB308]"
                  placeholder="Mobile number"
                  required
                />
                <textarea
                  value={customer.location}
                  onChange={(event) => setCustomer((value) => ({ ...value, location: event.target.value }))}
                  className="min-h-20 resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold outline-none focus:border-[#EAB308]"
                  placeholder="Delivery location"
                  required
                />
              </div>
              {checkoutStatus && (
                <p className="mb-3 rounded-lg bg-green-50 px-3 py-2 text-sm font-bold text-green-700">{checkoutStatus}</p>
              )}
              {checkoutError && (
                <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-[#DC2626]">{checkoutError}</p>
              )}
              <div className="mb-3 flex items-center justify-between text-lg font-black text-[#0F172A]">
                <span>Subtotal</span>
                <span>Rs. {subtotal}</span>
              </div>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full rounded-full bg-[#0F172A] px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800 active:scale-95 disabled:opacity-60"
              >
                {isSubmitting ? 'Saving Order...' : 'Confirm Order'}
              </button>
              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="mt-2 w-full rounded-full bg-[#087c45] px-5 py-3 text-sm font-black text-white transition hover:bg-[#066b3b] active:scale-95"
              >
                Order on WhatsApp
              </button>
              <button
                type="button"
                onClick={clearCart}
                className="mt-2 w-full rounded-full px-5 py-2 text-sm font-black text-slate-500 transition hover:bg-slate-50 active:scale-95"
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
