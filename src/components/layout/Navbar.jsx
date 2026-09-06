import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useCart } from '../../context/useCart.js'
import { Menu, Search, ShoppingCart, User, X } from '../../lib/icons.jsx'

const productLinks = [
  'All Products',
  'Snack Squad',
  'Banana Chips',
  'Potato Chips',
  'Tapioca Chips',
  'Mixture',
  'Murukku',
  'Pakoda',
  'Chikkies',
  'Puffed Snacks',
  'Halwa',
  'Varkey',
]

const businessLinks = ['Authorised Retailer', 'Export', 'Distribution', 'Institution', 'Corporate Orders', 'Career']

export default function Navbar({ searchQuery, onSearchChange }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { totalItems, openCart } = useCart()
  const { user, openAuth, logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 bg-[#fff8e7] text-[#32150e] shadow-sm">
      <div className="overflow-hidden bg-[#8f2118] py-2 text-xs font-black uppercase tracking-wide text-white">
        <div className="marquee-left flex w-max gap-8 whitespace-nowrap">
          {Array.from({ length: 10 }).map((_, index) => (
            <span key={index}>FREE SHIPPING ON ORDERS ABOVE Rs. 499 | CASH ON DELIVERY AVAILABLE</span>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-[96rem] items-center gap-4 px-3 py-4 sm:px-5 lg:px-6">
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="grid h-11 w-11 place-items-center rounded-full border border-[#ead7af] bg-white lg:hidden"
          aria-label="Open menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <a href="#" className="text-2xl font-black tracking-wide text-[#8f2118]" aria-label="Shivansh Snacks home">
          Shivansh Snacks
        </a>

        <nav className="hidden items-center gap-7 text-sm font-black lg:flex">
          <a href="#">Home</a>
          <div className="group relative py-3">
            <button type="button" className="font-black">Products</button>
            <div className="invisible absolute left-0 top-full grid w-[520px] grid-cols-3 gap-2 rounded-[18px] border border-[#ead7af] bg-[#fffaf0] p-5 opacity-0 shadow-2xl transition group-hover:visible group-hover:opacity-100">
              {productLinks.map((link) => (
                <a key={link} href="#catalog" className="rounded-full px-3 py-2 text-sm hover:bg-[#f7df8b]">
                  {link}
                </a>
              ))}
            </div>
          </div>
          <a href="#combos">Combos</a>
          <a href="#branches">Branches</a>
          <div className="group relative py-3">
            <button type="button" className="font-black">Business</button>
            <div className="invisible absolute left-0 top-full grid w-64 gap-1 rounded-[18px] border border-[#ead7af] bg-[#fffaf0] p-4 opacity-0 shadow-2xl transition group-hover:visible group-hover:opacity-100">
              {businessLinks.map((link) => (
                <a key={link} href="#business" className="rounded-full px-3 py-2 text-sm hover:bg-[#f7df8b]">
                  {link}
                </a>
              ))}
            </div>
          </div>
          <a href="#about">About Us</a>
        </nav>

        <div className="ml-auto hidden w-full max-w-xs items-center gap-2 rounded-full border border-[#ead7af] bg-white px-4 py-2 md:flex">
          <Search className="h-4 w-4 text-[#916451]" />
          <input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-[#916451]"
            placeholder="Search snacks..."
          />
        </div>

        <button
          type="button"
          onClick={user ? logout : openAuth}
          className="grid h-11 w-11 place-items-center rounded-full border border-[#ead7af] bg-white"
          aria-label={user ? 'Logout' : 'Login'}
        >
          <User className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={openCart}
          className="relative grid h-11 w-11 place-items-center rounded-full bg-[#f5b72f] text-[#32150e]"
          aria-label={`Open cart with ${totalItems} items`}
        >
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#8f2118] px-1 text-xs font-black text-white">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      <div className="border-t border-[#ead7af] px-4 pb-4 md:hidden">
        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2">
          <Search className="h-4 w-4 text-[#916451]" />
          <input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-full bg-transparent text-sm font-bold outline-none"
            placeholder="Search snacks..."
          />
        </div>
      </div>

      {isMenuOpen && (
        <nav className="grid gap-2 border-t border-[#ead7af] bg-[#fffaf0] px-4 py-4 text-sm font-black lg:hidden">
          {['Home', 'Products', 'Combos', 'Branches', 'Business', 'About Us'].map((link) => (
            <a key={link} href="#catalog" onClick={() => setIsMenuOpen(false)} className="rounded-full bg-white px-4 py-3">
              {link}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
