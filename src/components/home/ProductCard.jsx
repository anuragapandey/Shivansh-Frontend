import { useState } from 'react'
import { useCart } from '../../context/useCart.js'
import { Heart, PackageCheck, ShoppingBag, Star, X } from '../../lib/icons.jsx'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [quickOpen, setQuickOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(product.options?.[0] || product)

  const handleAdd = (quantity = 1) => {
    addToCart({ ...product, ...selectedOption, id: `${product.id}-${selectedOption.weight}` }, quantity)
    setQuickOpen(false)
  }

  const savings = selectedOption.originalPrice - selectedOption.price
  const grams = Number(selectedOption.weight.replace(/\D/g, '')) || 1000
  const pricePer100g = Math.round((selectedOption.price / grams) * 100)

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#ead7af] bg-[#fffdf7] shadow-[0_14px_38px_rgba(92,45,18,0.09)] transition hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(92,45,18,0.16)]">
      <div className="relative aspect-[4/3] overflow-hidden" style={{ backgroundColor: product.accent }}>
        <img
          src={product.image}
          alt={product.name}
          className="mx-auto h-full w-full object-contain p-5 transition duration-500 group-hover:scale-105 group-hover:opacity-0"
          loading="lazy"
        />
        <img
          src={product.hoverImage || product.image}
          alt=""
          className="absolute inset-0 mx-auto h-full w-full object-contain p-5 opacity-0 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
          loading="lazy"
        />
        {product.isBestseller && (
          <span className="absolute left-3 top-3 rounded-full bg-[#9f1d17] px-3 py-1 text-[11px] font-black uppercase text-white shadow">
            Best Seller
          </span>
        )}
        <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-black uppercase text-[#32150e] shadow">
          {product.tag}
        </span>
        <button
          type="button"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white text-[#682517] shadow transition hover:scale-105"
          aria-label="Add to wishlist"
        >
          <Heart className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setQuickOpen(true)}
          className="absolute inset-x-4 bottom-4 rounded-full bg-[#682517] px-4 py-3 text-sm font-black text-white opacity-100 transition hover:bg-[#8f2118] sm:translate-y-3 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
        >
          + Quick Add
        </button>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="min-h-12 break-words text-base font-black leading-6 text-[#32150e]">{product.name}</h3>
        <div className="mt-2 flex items-center gap-1 text-sm font-black text-[#682517]">
          <Star className="h-4 w-4 fill-[#f5b72f] text-[#f5b72f]" aria-hidden="true" />
          {product.rating}
          <span className="ml-2 inline-flex items-center gap-1 text-xs font-bold text-[#916451]">
            <PackageCheck className="h-3.5 w-3.5" />
            {selectedOption.weight}
          </span>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-1">
          {product.options?.map((option) => (
            <button
              key={option.weight}
              type="button"
              onClick={() => setSelectedOption(option)}
              className={`rounded-full border px-2 py-1 text-[11px] font-black transition ${
                selectedOption.weight === option.weight
                  ? 'border-[#8f2118] bg-[#8f2118] text-white'
                  : 'border-[#ead7af] bg-white text-[#32150e]'
              }`}
            >
              {option.weight}
            </button>
          ))}
        </div>
        <div className="mt-3 rounded-xl bg-[#fff4d4] px-3 py-2 text-xs font-black text-[#684437]">
          Extra weight {selectedOption.extraWeight} | Rs. {pricePer100g}/100g | Save Rs. {savings}
        </div>
        <p className="mt-3 text-sm font-bold text-[#684437]">
          Sale price <span className="text-lg font-black text-[#9f1d17]">Rs. {selectedOption.price}.00</span>
        </p>
        {selectedOption.originalPrice && (
          <p className="text-xs font-bold text-[#916451] line-through">Rs. {selectedOption.originalPrice}.00</p>
        )}
      </div>

      {quickOpen && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-[#32150e]/50 px-4">
          <div className="w-full max-w-sm rounded-[22px] bg-[#fffaf0] p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-[#9f1d17]">Quick Add</p>
                <h3 className="mt-1 text-xl font-black text-[#32150e]">{product.name}</h3>
              </div>
              <button type="button" onClick={() => setQuickOpen(false)} className="grid h-9 w-9 place-items-center rounded-full bg-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 rounded-2xl bg-[#f7df8b] p-4">
              <img src={product.image} alt={product.name} className="mx-auto h-40 object-contain" />
            </div>
            <div className="mt-4 flex items-center justify-between rounded-full border border-[#ead7af] bg-white px-4 py-3">
              <span className="text-sm font-black text-[#32150e]">{selectedOption.weight}</span>
              <span className="text-lg font-black text-[#9f1d17]">Rs. {selectedOption.price}</span>
            </div>
            <button
              type="button"
              onClick={() => handleAdd(1)}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#f5b72f] px-5 py-3 text-sm font-black text-[#32150e]"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </article>
  )
}
