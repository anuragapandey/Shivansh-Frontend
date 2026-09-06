export default function CategoryPills({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" aria-label="Quick filters">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onCategoryChange(category)}
          className={`shrink-0 rounded-full border px-4 py-2 text-sm font-black transition active:scale-95 ${
            selectedCategory === category
              ? 'border-[#0F172A] bg-[#0F172A] text-white'
              : 'border-slate-200 bg-white text-slate-700 hover:border-[#EAB308] hover:text-[#0F172A]'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
