import { useState } from 'react'
import { apiRequest } from '../../lib/api.js'
import { Facebook, Instagram, Mail, MapPin, Phone } from '../../lib/icons.jsx'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const subscribe = async (event) => {
    event.preventDefault()
    setMessage('')

    try {
      await apiRequest('/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
      setEmail('')
      setMessage('Subscribed for exclusive offers.')
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <footer className="bg-[#32150e] text-[#fff8e7]">
      <div className="mx-auto grid max-w-[96rem] gap-10 px-3 py-12 sm:px-5 lg:grid-cols-[1.1fr_0.7fr_0.7fr_1fr] lg:px-6">
        <div>
          <h2 className="text-4xl font-black">Shivansh Snacks</h2>
          <p className="mt-4 max-w-sm text-sm font-bold leading-6 text-[#ead7af]">
            Fresh Kerala-style chips, mixtures, sweets, and festival snacks with COD and fast local order handling.
          </p>
          <form onSubmit={subscribe} className="mt-6">
            <label className="text-xl font-black">Sign up for Exclusive Offers!</label>
            <div className="mt-3 flex overflow-hidden rounded-full bg-white p-1">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="min-w-0 flex-1 px-4 text-sm font-bold text-[#32150e] outline-none"
                placeholder="E-mail"
                required
              />
              <button type="submit" className="rounded-full bg-[#f5b72f] px-5 py-3 text-sm font-black text-[#32150e]">
                Subscribe
              </button>
            </div>
            {message && <p className="mt-2 text-sm font-bold text-[#f7df8b]">{message}</p>}
          </form>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-wide text-[#f7df8b]">Quick Links</h3>
          <div className="mt-4 grid gap-3 text-sm font-bold text-[#ead7af]">
            {['Products', 'Branches', 'About Us', 'Blogs', 'Career', "See FAQ's"].map((link) => (
              <a key={link} href="#catalog" className="hover:text-white">{link}</a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-wide text-[#f7df8b]">Product Links</h3>
          <div className="mt-4 grid gap-3 text-sm font-bold text-[#ead7af]">
            {['All Products', 'Banana Chips', 'Potato Chips', 'Tapioca Chips', 'Chikkies', 'Halwa'].map((link) => (
              <a key={link} href="#catalog" className="hover:text-white">{link}</a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-wide text-[#f7df8b]">Customer Support</h3>
          <div className="mt-4 grid gap-4 text-sm font-bold leading-6 text-[#ead7af]">
            <a href="tel:+917038585188" className="flex items-center gap-3 hover:text-white">
              <Phone className="h-5 w-5 text-[#f5b72f]" />
              +91 70385 85188
            </a>
            <a href="mailto:shivanshsnacks@gmail.com" className="flex items-center gap-3 hover:text-white">
              <Mail className="h-5 w-5 text-[#f5b72f]" />
              shivanshsnacks@gmail.com
            </a>
            <p className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#f5b72f]" />
              Shop No. 9, Maurya Compound, Virar Fata, Palghar 401308.
            </p>
          </div>
          <div className="mt-5 flex gap-3">
            {[Instagram, Facebook].map((Icon, index) => (
              <a key={index} href="https://www.instagram.com/" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-[#f5b72f] hover:text-[#32150e]">
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs font-bold text-[#ead7af]">
        Copyright 2026 Shivansh Snacks. Privacy Policy | Refund Policy | Terms of Service | Shipping Policy | Legal Notice
      </div>
    </footer>
  )
}
