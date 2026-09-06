import { BadgeCheck, Leaf, PackageCheck, ShieldCheck } from '../../lib/icons.jsx'
import logo from '../../assets/shivansh-logo.jpg'

const trustBadges = [
  { label: 'Pure Coconut Oil', icon: Leaf },
  { label: 'Zero Trans Fat', icon: ShieldCheck },
  { label: 'Vacuum Sealed', icon: PackageCheck },
]

export default function HeroBanner() {
  return (
    <section className="bg-[#0F172A] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-14">
        <div className="flex flex-col justify-center">
          <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-yellow-100">
            <BadgeCheck className="h-4 w-4 text-[#EAB308]" aria-hidden="true" />
            Fresh chips | Sweets | Mixtures | Bulk orders welcome
          </div>
          <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Buy Shivansh Snacks Online
          </h1>
          <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-slate-200 sm:text-lg">
            A crisp storefront inspired by buya1chips.com with banana chips,
            traditional snacks, mixtures, sweets, quick cart, and account login.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {trustBadges.map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-3">
                <Icon className="h-5 w-5 text-[#EAB308]" aria-hidden="true" />
                <span className="text-sm font-bold">{label}</span>
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="#catalog"
              className="inline-flex items-center justify-center rounded-full bg-[#EAB308] px-6 py-3 text-sm font-black text-[#0F172A] shadow-[0_20px_60px_rgba(15,23,42,0.10)] transition hover:bg-yellow-400 active:scale-95"
            >
              Shop Now
            </a>
            <a
              href="https://wa.me/917038585188?text=Hello%20Buy%20A1%20Chips%2C%20I%20want%20to%20place%20an%20order."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-black text-white transition hover:bg-white/10 active:scale-95"
            >
              Order on WhatsApp
            </a>
          </div>
        </div>
        <div className="min-h-[260px] overflow-hidden rounded-lg bg-white lg:min-h-[420px]">
          <img src={logo} alt="Shivansh Snacks product pack" className="h-full w-full object-contain p-3" />
        </div>
      </div>
    </section>
  )
}
