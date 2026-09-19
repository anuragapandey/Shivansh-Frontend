import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useCart } from '../../context/useCart.js'
import { apiRequest } from '../../lib/api.js'
import { Mail, MapPin, Minus, Plus, ShieldCheck, ShoppingCart, Trash2, X } from '../../lib/icons.jsx'
import { loadRazorpayCheckout } from '../../lib/razorpay.js'

const FREE_SHIPPING_THRESHOLD = 999
const WHATSAPP_PHONE = '917038585188'
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[6-9]\d{9}$/
const pincodePattern = /^\d{6}$/

const initialCustomer = {
  name: '',
  email: '',
  phone: '',
  address1: '',
  address2: '',
  pincode: '',
}

const buildMapsUrl = (latitude, longitude) => `https://www.google.com/maps?q=${latitude},${longitude}`

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
  const { user, openAuth } = useAuth()
  const [customer, setCustomer] = useState(initialCustomer)
  const [location, setLocation] = useState(null)
  const [otp, setOtp] = useState('')
  const [otpEmail, setOtpEmail] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isOtpVerified, setIsOtpVerified] = useState(false)
  const [checkoutStatus, setCheckoutStatus] = useState('')
  const [checkoutError, setCheckoutError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOtpBusy, setIsOtpBusy] = useState(false)
  const [isLocating, setIsLocating] = useState(false)

  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const amountLeft = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0)

  useEffect(() => {
    if (!user) return

    const email = user.email || ''
    const metadata = user.user_metadata || {}
    setCustomer((current) => ({
      ...current,
      name: current.name || metadata.name || '',
      email,
      phone: current.phone || metadata.phone || '',
    }))
    setOtpEmail(email.trim().toLowerCase())
    setIsOtpSent(false)
    setIsOtpVerified(true)
    setOtp('')
  }, [user])

  const setField = (field, value) => {
    setCustomer((current) => ({ ...current, [field]: value }))
    setFieldErrors((current) => ({ ...current, [field]: '' }))
    if (field === 'email') {
      setIsOtpSent(false)
      setIsOtpVerified(false)
      setOtp('')
      setOtpEmail('')
    }
  }

  const validateCustomer = ({ requireOtp = false } = {}) => {
    const errors = {}
    const email = customer.email.trim().toLowerCase()

    if (customer.name.trim().length < 2) errors.name = 'Enter full name.'
    if (!emailPattern.test(email)) errors.email = 'Enter a valid email.'
    if (!phonePattern.test(customer.phone.trim())) errors.phone = 'Enter valid 10 digit Indian mobile number.'
    if (customer.address1.trim().length < 5) errors.address1 = 'Enter house / street address.'
    if (!pincodePattern.test(customer.pincode.trim())) errors.pincode = 'Enter valid 6 digit pincode.'
    if (user && user.email?.trim().toLowerCase() !== email) errors.email = 'Use your logged-in email for checkout.'
    if (!user && requireOtp && (!isOtpVerified || otpEmail !== email)) errors.otp = 'Verify email OTP before payment.'

    setFieldErrors(errors)
    if (Object.keys(errors).length) {
      setCheckoutError(Object.values(errors)[0])
      return false
    }

    return true
  }

  const deliveryAddress = () => {
    const address1 = customer.address1.trim()
    const address2 = customer.address2.trim()
    const pincode = customer.pincode.trim()
    return {
      address1,
      address2,
      pincode,
      fullAddress: [address1, address2, pincode].filter(Boolean).join(', '),
      ...(location || {}),
    }
  }

  const handleUseCurrentLocation = () => {
    setCheckoutStatus('')
    setCheckoutError('')

    if (!navigator.geolocation) {
      setCheckoutError('Location is not supported in this browser.')
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        setLocation({
          latitude,
          longitude,
          accuracy: Math.round(accuracy),
          mapsUrl: buildMapsUrl(latitude, longitude),
        })
        setCheckoutStatus('Exact location captured. Google Maps link will be saved with the order.')
        setIsLocating(false)
      },
      () => {
        setCheckoutError('Location permission denied or unavailable. You can still enter address manually.')
        setIsLocating(false)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    )
  }

  const handleSendOtp = async () => {
    setCheckoutStatus('')
    setCheckoutError('')
    const email = customer.email.trim().toLowerCase()

    if (!emailPattern.test(email)) {
      setFieldErrors((current) => ({ ...current, email: 'Enter a valid email first.' }))
      setCheckoutError('Enter a valid email first.')
      return
    }

    setIsOtpBusy(true)
    try {
      await apiRequest('/otp/send', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
      setOtpEmail(email)
      setIsOtpSent(true)
      setIsOtpVerified(false)
      setCheckoutStatus('OTP sent to your email. Check inbox or spam folder.')
    } catch (error) {
      setCheckoutError(error.message)
    } finally {
      setIsOtpBusy(false)
    }
  }

  const handleVerifyOtp = async () => {
    setCheckoutStatus('')
    setCheckoutError('')
    const email = customer.email.trim().toLowerCase()

    if (!/^\d{6}$/.test(otp.trim())) {
      setFieldErrors((current) => ({ ...current, otp: 'Enter the 6 digit OTP.' }))
      setCheckoutError('Enter the 6 digit OTP.')
      return
    }

    setIsOtpBusy(true)
    try {
      await apiRequest('/otp/verify', {
        method: 'POST',
        body: JSON.stringify({ email, otp: otp.trim() }),
      })
      setOtpEmail(email)
      setIsOtpVerified(true)
      setFieldErrors((current) => ({ ...current, otp: '' }))
      setCheckoutStatus('Email verified. You can continue to payment.')
    } catch (error) {
      setCheckoutError(error.message)
    } finally {
      setIsOtpBusy(false)
    }
  }

  const handleCheckout = async () => {
    setCheckoutStatus('')
    setCheckoutError('')

    if (cartItems.length === 0) {
      setCheckoutError('Cart is empty.')
      return
    }

    if (!user) {
      setCheckoutError('Please login or create an account before payment.')
      openAuth()
      return
    }

    if (!validateCustomer({ requireOtp: true })) {
      return
    }

    setIsSubmitting(true)

    const checkoutPayload = {
      items: cartItems.map(({ id, productId, flavorId, weightInGrams, qty }) => ({
        id,
        productId,
        flavorId,
        weightInGrams,
        qty,
      })),
      customerDetails: {
        name: customer.name.trim(),
        email: customer.email.trim().toLowerCase() || user?.email || '',
        phone: customer.phone.trim(),
      },
      deliveryAddress: deliveryAddress(),
      source: 'web',
    }

    try {
      const sdkLoaded = await loadRazorpayCheckout()
      if (!sdkLoaded) {
        throw new Error('Payment gateway could not load. Please check your network and try again.')
      }

      const order = await apiRequest('/payment/create-order', {
        method: 'POST',
        body: JSON.stringify(checkoutPayload),
      })

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Shivansh Snacks',
        description: `Order ${order.orderNumber}`,
        order_id: order.razorpayOrderId,
        prefill: {
          name: customer.name.trim(),
          email: customer.email.trim().toLowerCase(),
          contact: customer.phone.trim(),
        },
        notes: {
          internal_order_id: order.orderId,
          order_number: order.orderNumber,
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },
        theme: {
          color: '#0F172A',
        },
        handler: async (response) => {
          setCheckoutStatus('Payment received. Verifying securely...')
          await apiRequest('/payment/verify-payment', {
            method: 'POST',
            body: JSON.stringify({
              orderId: order.orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })
          clearCart()
          closeCart()
          window.location.assign(`/order-success/${order.orderId}`)
        },
        modal: {
          ondismiss: () => {
            setCheckoutError('Payment was cancelled. Your pending order was not charged.')
            setIsSubmitting(false)
          },
        },
      })

      razorpay.on('payment.failed', (response) => {
        setCheckoutError(response.error?.description || 'Payment failed. Please try again.')
        setIsSubmitting(false)
      })

      setCheckoutStatus(`Opening secure payment for Rs. ${order.amountInRupees}...`)
      razorpay.open()
    } catch (error) {
      setCheckoutError(error.message)
      setIsSubmitting(false)
    }
  }

  const handleWhatsAppOrder = () => {
    setCheckoutStatus('')
    setCheckoutError('')

    if (!validateCustomer()) {
      return
    }

    const address = deliveryAddress()
    const itemLines = cartItems
      .map((item) => `${item.name} (${item.weight}) x ${item.qty} = Rs. ${item.price * item.qty}`)
      .join('\n')
    const message = [
      'Hello Shivansh Snacks, I want to place this order:',
      '',
      itemLines,
      '',
      `Total: Rs. ${subtotal}`,
      `Name: ${customer.name}`,
      `Mobile: ${customer.phone}`,
      `Email: ${customer.email}`,
      `Address 1: ${address.address1}`,
      `Address 2: ${address.address2 || 'N/A'}`,
      `Pincode: ${address.pincode}`,
      address.mapsUrl ? `Location: ${address.mapsUrl}` : '',
    ].filter(Boolean).join('\n')

    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  const inputClass = (field) =>
    `rounded-lg border px-3 py-2 text-sm font-semibold outline-none transition focus:border-[#EAB308] ${
      fieldErrors[field] ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
    }`

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
                <span>{amountLeft === 0 ? 'Free shipping unlocked' : `Add Rs. ${amountLeft} for free shipping`}</span>
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
                    <img src={item.image} alt={item.name} className="h-20 w-[72px] rounded-md object-cover" />
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-black text-[#0F172A]">{item.flavorName || item.name}</h3>
                          <p className="text-xs font-bold text-slate-500">{item.weightLabel || item.weight}</p>
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

              <div className="mt-5 grid gap-2">
                <input
                  value={customer.name}
                  onChange={(event) => setField('name', event.target.value)}
                  className={inputClass('name')}
                  placeholder="Full name"
                  autoComplete="name"
                />
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(event) => setField('email', event.target.value)}
                    className={inputClass('email')}
                    placeholder="Gmail / Email"
                    autoComplete="email"
                    readOnly={Boolean(user)}
                  />
                  {!user && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isOtpBusy || isOtpVerified}
                      className="grid h-10 min-w-24 place-items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-[#0F172A] transition hover:bg-slate-50 disabled:opacity-60"
                    >
                      {isOtpVerified ? <ShieldCheck className="h-4 w-4 text-green-700" /> : isOtpBusy ? 'Wait' : 'Send OTP'}
                    </button>
                  )}
                </div>
                {!user && isOtpSent && !isOtpVerified && (
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <input
                      value={otp}
                      onChange={(event) => {
                        setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))
                        setFieldErrors((current) => ({ ...current, otp: '' }))
                      }}
                      className={inputClass('otp')}
                      placeholder="6 digit email OTP"
                      inputMode="numeric"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={isOtpBusy}
                      className="rounded-lg bg-[#0F172A] px-4 text-xs font-black text-white transition hover:bg-slate-800 disabled:opacity-60"
                    >
                      Verify
                    </button>
                  </div>
                )}
                {isOtpVerified && (
                  <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-xs font-black text-green-700">
                    <Mail className="h-4 w-4" />
                    {user ? 'Email verified from login' : 'Email verified'}
                  </div>
                )}
                <input
                  value={customer.phone}
                  onChange={(event) => setField('phone', event.target.value.replace(/\D/g, '').slice(0, 10))}
                  className={inputClass('phone')}
                  placeholder="Mobile number"
                  autoComplete="tel"
                  inputMode="numeric"
                />
                <input
                  value={customer.address1}
                  onChange={(event) => setField('address1', event.target.value)}
                  className={inputClass('address1')}
                  placeholder="Address 1 - house, street, area"
                  autoComplete="address-line1"
                />
                <input
                  value={customer.address2}
                  onChange={(event) => setField('address2', event.target.value)}
                  className={inputClass('address2')}
                  placeholder="Address 2 - landmark, city"
                  autoComplete="address-line2"
                />
                <input
                  value={customer.pincode}
                  onChange={(event) => setField('pincode', event.target.value.replace(/\D/g, '').slice(0, 6))}
                  className={inputClass('pincode')}
                  placeholder="Pincode"
                  autoComplete="postal-code"
                  inputMode="numeric"
                />
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-black text-[#0F172A] transition hover:bg-slate-50 disabled:opacity-60"
                >
                  <MapPin className="h-4 w-4" />
                  {isLocating ? 'Getting location...' : location ? 'Update exact location' : 'Use current location'}
                </button>
                {location && (
                  <a
                    href={location.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700"
                  >
                    Google Maps location saved, accuracy about {location.accuracy}m
                  </a>
                )}
              </div>
            </div>

            <div className="border-t border-slate-200 bg-white p-4">
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
                disabled={isSubmitting || !isOtpVerified}
                className="w-full rounded-full bg-[#0F172A] px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800 active:scale-95 disabled:opacity-60"
              >
                {isSubmitting ? 'Opening Payment...' : user ? (isOtpVerified ? 'Proceed to Checkout' : 'Verify Email OTP First') : 'Login to Pay'}
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
