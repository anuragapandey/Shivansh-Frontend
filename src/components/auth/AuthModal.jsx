import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { Lock, Mail, Phone, User, X } from '../../lib/icons.jsx'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[6-9]\d{9}$/

export default function AuthModal() {
  const { isAuthOpen, closeAuth, login, signup } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState(initialForm)
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  if (!isAuthOpen) return null

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setFieldErrors((current) => ({ ...current, [field]: '' }))
    setError('')
  }

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setFieldErrors({})
    setError('')
  }

  const validateForm = () => {
    const errors = {}
    const email = form.email.trim().toLowerCase()
    const password = form.password.trim()

    if (!emailPattern.test(email)) {
      errors.email = 'Enter a valid email address.'
    }

    if (!password) {
      errors.password = 'Enter your password.'
    } else if (mode === 'signup' && (password.length < 8 || password.length > 16)) {
      errors.password = 'Password must be 8 to 16 characters.'
    } else if (mode === 'signup' && !/[a-z]/.test(password)) {
      errors.password = 'Password must include a lowercase letter.'
    } else if (mode === 'signup' && !/[A-Z]/.test(password)) {
      errors.password = 'Password must include an uppercase letter.'
    } else if (mode === 'signup' && !/\d/.test(password)) {
      errors.password = 'Password must include a number.'
    } else if (mode === 'signup' && !/[^A-Za-z0-9]/.test(password)) {
      errors.password = 'Password must include a special character.'
    }

    if (mode === 'signup') {
      if (form.name.trim().length < 2) {
        errors.name = 'Enter your full name.'
      }

      if (!phonePattern.test(form.phone.trim())) {
        errors.phone = 'Enter a valid 10 digit Indian mobile number.'
      }
    }

    setFieldErrors(errors)
    if (Object.keys(errors).length) {
      setError(Object.values(errors)[0])
      return false
    }

    return true
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      if (mode === 'login') {
        await login({ email: form.email.trim().toLowerCase(), password: form.password })
      } else {
        await signup({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          password: form.password,
        })
      }
      setForm(initialForm)
      setFieldErrors({})
    } catch (apiError) {
      const message = apiError.message || 'Something went wrong.'
      setError(message.replace('Email not confirmed', 'Please sign up again or contact support to activate this email.'))
    } finally {
      setLoading(false)
    }
  }

  const inputWrapClass = (field) =>
    `flex items-center gap-3 rounded-lg border px-3 py-2 transition ${
      fieldErrors[field] ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
    }`

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-[#0F172A]/55 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-[#0F172A]">
              {mode === 'login' ? 'Login' : 'Create Account'}
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Continue securely to checkout and order updates.
            </p>
          </div>
          <button
            type="button"
            onClick={closeAuth}
            className="grid h-10 w-10 place-items-center rounded-full border border-slate-200"
            aria-label="Close login"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 rounded-full bg-slate-100 p-1">
          {['login', 'signup'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => switchMode(item)}
              className={`rounded-full px-4 py-2 text-sm font-black capitalize ${
                mode === item ? 'bg-white text-[#0F172A] shadow-sm' : 'text-slate-500'
              }`}
            >
              {item === 'signup' ? 'Create' : 'Login'}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          {mode === 'signup' && (
            <label className={inputWrapClass('name')}>
              <User className="h-5 w-5 text-slate-400" />
              <input
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                className="w-full outline-none"
                placeholder="Full name"
                autoComplete="name"
                required
              />
            </label>
          )}
          <label className={inputWrapClass('email')}>
            <Mail className="h-5 w-5 text-slate-400" />
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              className="w-full outline-none"
              placeholder="Email"
              autoComplete="email"
              required
            />
          </label>
          {mode === 'signup' && (
            <label className={inputWrapClass('phone')}>
              <Phone className="h-5 w-5 text-slate-400" />
              <input
                value={form.phone}
                onChange={(event) => updateField('phone', event.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full outline-none"
                placeholder="10 digit mobile number"
                autoComplete="tel"
                inputMode="numeric"
              />
            </label>
          )}
          <label className={inputWrapClass('password')}>
            <Lock className="h-5 w-5 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
              className="w-full outline-none"
              placeholder="Password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-[#0F172A]"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.8 10.8 0 0 1 12 20C7 20 2.73 16.89 1 12a11.7 11.7 0 0 1 5.06-5.94" />
                  <path d="M10.58 10.58A2 2 0 0 0 12 14a2 2 0 0 0 1.42-.58" />
                  <path d="M9.9 4.24A10.9 10.9 0 0 1 12 4c5 0 9.27 3.11 11 8a11.8 11.8 0 0 1-2.16 3.19" />
                  <path d="m2 2 20 20" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </label>
        </div>

        {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-[#DC2626]">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-full bg-[#EAB308] px-5 py-3 text-sm font-black text-[#0F172A] disabled:opacity-60"
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
        </button>
      </form>
    </div>
  )
}
