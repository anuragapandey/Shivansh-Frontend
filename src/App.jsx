import { useMemo, useState } from 'react'
import AuthModal from './components/auth/AuthModal.jsx'
import CartDrawer from './components/cart/CartDrawer.jsx'
import ProductCard from './components/home/ProductCard.jsx'
import Footer from './components/layout/Footer.jsx'
import Navbar from './components/layout/Navbar.jsx'
import { useCart } from './context/useCart.js'
import { categories, categoryTiles, flavorShowcases, products, reviews } from './data/products.js'

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#f7d96a]">
      <div className="mx-auto grid max-w-[96rem] gap-8 px-3 py-8 sm:px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-6 lg:py-12">
        <div className="flex flex-col justify-center">
          <p className="w-fit rounded-full bg-[#8f2118] px-4 py-2 text-xs font-black uppercase tracking-wide text-white shadow">
            Real product photos | 160g to 1kg packs
          </p>
          <h1 className="mt-5 max-w-2xl text-5xl font-black leading-[0.95] text-[#32150e] sm:text-6xl">
            Shivansh Banana Chips
          </h1>
          <p className="mt-5 max-w-xl text-lg font-bold leading-8 text-[#684437]">
            Classic yellow, mari masala, black pepper, peri peri, and tomato chips with clear pack weight, extra weight, savings, and COD-ready ordering.
          </p>
          <div className="mt-6 grid max-w-xl grid-cols-3 gap-3">
            {['+840g on 1kg', 'Rs. 28/100g', 'Save up to Rs. 80'].map((item) => (
              <div key={item} className="rounded-xl border border-[#c9962c] bg-white/75 px-3 py-3 text-center text-sm font-black text-[#32150e] shadow-sm">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#catalog" className="rounded-full bg-[#32150e] px-7 py-4 text-sm font-black text-white">
              Shop Packs
            </a>
            <a href="#flavors" className="rounded-full border-2 border-[#32150e] px-7 py-4 text-sm font-black text-[#32150e]">
              Compare Flavors
            </a>
          </div>
        </div>
        <div className="grid min-h-[340px] place-items-center rounded-3xl border border-[#e0b94b] bg-[#fffaf0] p-4 shadow-[0_25px_70px_rgba(90,43,21,0.16)]">
          <div className="grid w-full grid-cols-2 gap-3">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="rounded-2xl bg-white p-3 shadow-sm">
                <img src={product.image} alt={product.name} className="mx-auto h-28 object-contain" />
                <p className="mt-2 truncate text-center text-sm font-black text-[#32150e]">{product.name}</p>
                <p className="text-center text-xs font-bold text-[#916451]">From Rs. {product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function CategoryStrip({ onSelect }) {
  return (
    <section className="bg-[#fff8e7] py-8">
      <div className="overflow-hidden border-y border-[#ead7af] py-4">
        <div className="marquee-left flex w-max gap-6 whitespace-nowrap text-lg font-black text-[#8f2118]">
          {Array.from({ length: 8 }).flatMap(() =>
            ['Classic', 'Masala', 'Pepper', 'Spicy', 'Tomato', 'Family Packs', 'Party Packs'].map((item) => (
              <span key={`${item}-${Math.random()}`}>{item} |</span>
            )),
          )}
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-[96rem] px-3 sm:px-5 lg:px-6">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-3xl font-black text-[#32150e]">Shop by Category</h2>
          <a href="#catalog" className="text-sm font-black text-[#8f2118]">View All</a>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
          {categoryTiles.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onSelect(categories.includes(category) ? category : 'All')}
              className="grid w-32 shrink-0 gap-3 text-center"
            >
              <span className="grid aspect-square place-items-center rounded-full border-4 border-[#f5b72f] bg-white shadow-sm">
                <span className="text-4xl font-black text-[#8f2118]">{category.charAt(0)}</span>
              </span>
              <span className="text-sm font-black text-[#32150e]">{category}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function FlavorShowcase() {
  const { addToCart } = useCart()

  return (
    <section id="flavors" className="bg-[#fffaf0] px-3 py-12 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-[96rem]">
        <p className="text-sm font-black uppercase tracking-wide text-[#8f2118]">Watch and pick your crunch</p>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {flavorShowcases.map((flavor) => {
            const product = products.find((item) => item.id === flavor.productId) || products[0]
            return (
              <article key={flavor.name} className="overflow-hidden rounded-[28px] bg-[#f7df8b] shadow-[0_18px_50px_rgba(90,43,21,0.10)]">
                <div className="grid grid-cols-3 gap-2 p-4">
                  {[0, 1, 2].map((item) => (
                    <img key={item} src={product.image} alt={flavor.name} className="h-28 w-full rounded-2xl bg-white object-contain p-2" />
                  ))}
                </div>
                <div className="bg-white p-5">
                  <h3 className="text-2xl font-black text-[#32150e]">{flavor.name}</h3>
                  <p className="mt-2 min-h-20 text-sm font-bold leading-6 text-[#684437]">{flavor.description}</p>
                  <button type="button" onClick={() => addToCart(product)} className="mt-4 rounded-full bg-[#8f2118] px-5 py-3 text-sm font-black text-white">
                    Buy Now
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Reviews() {
  return (
    <section className="bg-[#fff8e7] px-3 py-12 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-[96rem]">
        <p className="text-sm font-black uppercase tracking-wide text-[#8f2118]">Crunchy Customer Feedback</p>
        <h2 className="mt-2 text-4xl font-black text-[#32150e]">Let customers speak for us</h2>
        <p className="mt-2 text-lg font-black text-[#684437]">Customers rate us 4.6/5 based on 116923 reviews.</p>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {reviews.map(([title, quote, name]) => (
            <article key={`${title}-${name}`} className="rounded-[24px] border border-[#ead7af] bg-white p-5 shadow-sm">
              <p className="text-xl font-black text-[#32150e]">{title}</p>
              <p className="mt-3 text-sm font-bold leading-6 text-[#684437]">{quote}</p>
              <div className="mt-5 flex items-center justify-between text-sm font-black text-[#8f2118]">
                <span>{name}</span>
                <span>02/03/2026</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function PromoBanner() {
  return (
    <section className="bg-[#32150e] px-3 py-12 text-white sm:px-5 lg:px-6">
      <div className="mx-auto grid max-w-[96rem] overflow-hidden rounded-3xl bg-[#8f2118] md:grid-cols-2">
        <div className="grid place-items-center bg-[#f5b72f] p-8">
          <img src={products[7].image} alt="Peri Peri Party Pack" className="h-72 object-contain" />
        </div>
        <div className="flex flex-col justify-center p-8 md:p-12">
          <p className="text-sm font-black uppercase tracking-wide text-[#f7df8b]">Bulk value pack</p>
          <h2 className="mt-3 text-4xl font-black leading-tight md:text-6xl">1kg pack gives +840g extra over trial size.</h2>
          <a href="#catalog" className="mt-7 w-fit rounded-full bg-[#f5b72f] px-7 py-4 text-sm font-black text-[#32150e]">
            Shop Now
          </a>
        </div>
      </div>
    </section>
  )
}

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase()
    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch)
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  const bestSellers = products.filter((product) => product.isBestseller).slice(0, 8)
  const valuePacks = products.slice(0, 4)

  return (
    <div className="min-h-screen bg-[#fff8e7]">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <main>
        <Hero />
        <CategoryStrip onSelect={setSelectedCategory} />

        <section id="catalog" className="mx-auto max-w-[96rem] px-3 py-12 sm:px-5 lg:px-6">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-[#8f2118]">Best Sellers</p>
              <h2 className="mt-1 text-4xl font-black text-[#32150e]">Pick flavor, then pick weight</h2>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-black ${
                    selectedCategory === category
                      ? 'border-[#8f2118] bg-[#8f2118] text-white'
                      : 'border-[#ead7af] bg-white text-[#32150e]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(selectedCategory === 'All' ? bestSellers : filteredProducts).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <FlavorShowcase />

        <section className="mx-auto max-w-[96rem] px-3 py-12 sm:px-5 lg:px-6">
          <div className="mb-7 flex items-end justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-[#8f2118]">Value Packs</p>
              <h2 className="mt-1 text-4xl font-black text-[#32150e]">More weight, better price</h2>
            </div>
            <a href="#catalog" className="hidden text-sm font-black text-[#8f2118] sm:block">View all</a>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {valuePacks.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <PromoBanner />
        <Reviews />
      </main>
      <Footer />
      <CartDrawer />
      <AuthModal />
    </div>
  )
}

export default App
