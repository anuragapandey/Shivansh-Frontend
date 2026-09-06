import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { Lock, Mail, Phone, User, X } from '../../lib/icons.jsx'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
}

export default function AuthModal() {
  const { isAuthOpen, closeAuth, login, signup } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isAuthOpen) return null

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password })
      } else {
        await signup(form)
      }
      setForm(initialForm)
    } catch (apiError) {
      setError(apiError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-[#0F172A]/55 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-[#0F172A]">
              {mode === 'login' ? 'Login' : 'Create Account'}
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Supabase authentication through the Express API.
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
              onClick={() => setMode(item)}
              className={`rounded-full px-4 py-2 text-sm font-black capitalize ${
                mode === item ? 'bg-white text-[#0F172A] shadow-sm' : 'text-slate-500'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          {mode === 'signup' && (
            <label className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2">
              <User className="h-5 w-5 text-slate-400" />
              <input
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                className="w-full outline-none"
                placeholder="Full name"
                required
              />
            </label>
          )}
          <label className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2">
            <Mail className="h-5 w-5 text-slate-400" />
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              className="w-full outline-none"
              placeholder="Email"
              required
            />
          </label>
          {mode === 'signup' && (
            <label className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2">
              <Phone className="h-5 w-5 text-slate-400" />
              <input
                value={form.phone}
                onChange={(event) => updateField('phone', event.target.value)}
                className="w-full outline-none"
                placeholder="Phone"
              />
            </label>
          )}
          <label className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2">
            <Lock className="h-5 w-5 text-slate-400" />
            <input
              type="password"
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
              className="w-full outline-none"
              placeholder="Password"
              required
            />
          </label>
        </div>

        {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-[#DC2626]">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-full bg-[#EAB308] px-5 py-3 text-sm font-black text-[#0F172A] disabled:opacity-60"
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign Up'}
        </button>
      </form>
    </div>
  )
}
