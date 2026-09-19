import { useEffect, useMemo, useState } from 'react'
import { useCart } from '../../context/useCart.js'
import { apiRequest } from '../../lib/api.js'
import { Heart, PackageCheck, Plus, ShoppingBag, Star } from '../../lib/icons.jsx'

const rupee = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
const DEFAULT_WEIGHTS = [250, 500, 750, 1000, 2000, 3000, 4000, 5000, 10000]
const formatWeight = (grams) => (grams < 1000 ? `${grams}g` : `${Number.isInteger(grams / 1000) ? grams / 1000 : grams / 1000}kg`)

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [config, setConfig] = useState(null)
  const [selectedWeight, setSelectedWeight] = useState(250)
  const [customKg, setCustomKg] = useState(1)
  const [quantity, setQuantity] = useState(1)
  const [quote, setQuote] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    apiRequest('/products/pricing-config')
      .then((payload) => {
        if (!active) return
        setConfig(payload)
      })
      .catch(() => setError('Pricing could not load. Please refresh.'))
    return () => {
      active = false
    }
  }, [])

  const flavors = config?.flavors || []
  const selectedFlavor = flavors.find((flavor) => flavor.id === product.flavorId)
  const isCustom = selectedWeight === 'custom'
  const weightInGrams = isCustom ? Math.round(Number(customKg) * 1000) : Number(selectedWeight)

  useEffect(() => {
    if (!product.flavorId || !weightInGrams || !quantity) return
    let active = true
    setLoading(true)
    setError('')
    apiRequest('/products/quote', {
      method: 'POST',
      body: JSON.stringify({
        productId: 'banana-chips',
        flavorId: product.flavorId,
        weightInGrams,
        packQuantity: quantity,
      }),
    })
      .then((payload) => {
        if (active) setQuote(payload)
      })
      .catch((apiError) => {
        if (active) {
          setQuote(null)
          setError(apiError.message)
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [product.flavorId, weightInGrams, quantity])

  const startingPrice = useMemo(() => {
    if (!config) return product.price || 0
    return Math.min(...Object.values(config.standardPackPrices.regular), ...Object.values(config.standardPackPrices.premium))
  }, [config, product.price])

  const handleAdd = () => {
    if (!quote) return
    addToCart({
      id: `${quote.productId}:${quote.flavorId}:${quote.weightInGrams}`,
      productId: quote.productId,
      name: quote.productName,
      flavorId: quote.flavorId,
      flavorName: quote.flavorName,
      flavorCategory: quote.flavorCategory,
      price: quote.unitPrice,
      unitPrice: quote.unitPrice,
      weight: quote.weightLabel,
      weightLabel: quote.weightLabel,
      weightInGrams: quote.weightInGrams,
      customWeight: quote.customWeight,
      image: product.image,
    }, quantity)
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#ead7af] bg-[#fffdf7] shadow-[0_14px_38px_rgba(92,45,18,0.09)] transition hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(92,45,18,0.16)]">
      <div className="relative aspect-[4/3] overflow-hidden" style={{ backgroundColor: product.accent }}>
        <img src={product.image} alt={product.name} className="mx-auto h-full w-full object-contain p-5 transition duration-500 group-hover:scale-105" loading="lazy" />
        {product.isBestseller && <span className="absolute left-3 top-3 rounded-full bg-[#9f1d17] px-3 py-1 text-[11px] font-black uppercase text-white shadow">Best Seller</span>}
        <button type="button" className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white text-[#682517] shadow transition hover:scale-105" aria-label="Add to wishlist">
          <Heart className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="break-words text-base font-black leading-6 text-[#32150e]">{product.name}</h3>
        <p className="mt-2 min-h-10 text-sm font-bold leading-5 text-[#684437]">{selectedFlavor?.description || product.description}</p>
        <div className="mt-2 flex items-center gap-1 text-sm font-black text-[#682517]">
          <Star className="h-4 w-4 fill-[#f5b72f] text-[#f5b72f]" aria-hidden="true" />
          {product.rating}
          <span className="ml-2 inline-flex items-center gap-1 text-xs font-bold text-[#916451]">
            <PackageCheck className="h-3.5 w-3.5" />
            From {rupee.format(startingPrice)}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-xs font-black uppercase text-[#8f2118]">Flavor</span>
          {selectedFlavor && (
            <span className="rounded-full bg-[#fff4d4] px-2 py-1 text-[10px] font-black uppercase text-[#684437]">
              {selectedFlavor.category}
            </span>
          )}
        </div>
        <div className="mt-2 rounded-lg border border-[#ead7af] bg-white px-3 py-2">
          <p className="text-sm font-black text-[#32150e]">{selectedFlavor?.name || product.name}</p>
          <p className="mt-1 text-xs font-bold text-[#916451]">{selectedFlavor?.description || product.tag}</p>
        </div>

        <label className="mt-3 text-xs font-black uppercase text-[#8f2118]">Weight</label>
        <div className="mt-1 grid grid-cols-5 gap-1">
          {DEFAULT_WEIGHTS.map((weight) => (
            <button key={weight} type="button" onClick={() => setSelectedWeight(weight)} className={`rounded-full border px-2 py-1 text-[11px] font-black transition ${selectedWeight === weight ? 'border-[#8f2118] bg-[#8f2118] text-white' : 'border-[#ead7af] bg-white text-[#32150e]'}`}>
              {formatWeight(weight)}
            </button>
          ))}
          <button type="button" onClick={() => setSelectedWeight('custom')} className={`col-span-2 rounded-full border px-2 py-1 text-[11px] font-black transition ${isCustom ? 'border-[#8f2118] bg-[#8f2118] text-white' : 'border-[#ead7af] bg-white text-[#32150e]'}`}>
            Custom
          </button>
        </div>

        {isCustom && (
          <div className="mt-2 rounded-lg bg-[#fff4d4] p-3">
            <input type="range" min="1" max="10" step="0.25" value={customKg} onChange={(event) => setCustomKg(Number(event.target.value))} className="w-full" />
            <div className="mt-2 flex items-center justify-between text-xs font-black text-[#684437]">
              <span>{customKg} kg</span>
              <input type="number" min="1" max="10" step="0.25" value={customKg} onChange={(event) => setCustomKg(Math.min(10, Math.max(1, Number(event.target.value) || 1)))} className="w-24 rounded-md border border-[#ead7af] px-2 py-1 text-right" />
            </div>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between rounded-lg bg-white px-3 py-2">
          <span className="text-xs font-black text-[#684437]">Packs</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="grid h-7 w-7 place-items-center rounded-full border border-[#ead7af]">-</button>
            <span className="w-6 text-center text-sm font-black">{quantity}</span>
            <button type="button" onClick={() => setQuantity((value) => Math.min(25, value + 1))} className="grid h-7 w-7 place-items-center rounded-full border border-[#ead7af]"><Plus className="h-3.5 w-3.5" /></button>
          </div>
        </div>

        <div className="mt-3 rounded-xl bg-[#fff4d4] px-3 py-2 text-xs font-black text-[#684437]">
          {loading && 'Calculating price...'}
          {!loading && quote && `${quote.flavorName} | ${quote.weightLabel} | ${rupee.format(quote.pricePerKg)}/kg | Total ${rupee.format(quote.subtotal)}`}
          {!loading && error && <span className="text-[#DC2626]">{error}</span>}
        </div>

        <button type="button" onClick={handleAdd} disabled={!quote || loading} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#f5b72f] px-5 py-3 text-sm font-black text-[#32150e] disabled:opacity-60">
          <ShoppingBag className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </article>
  )
}
