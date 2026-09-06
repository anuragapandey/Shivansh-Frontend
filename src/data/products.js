import bananaYellow from '../assets/products/banana-yellow.jpg'
import bananaYellowLong from '../assets/products/banana-yellow-long.jfif'
import blackPepper from '../assets/products/black-pepper.webp'
import blackPepperLong from '../assets/products/black-pepper-long.jpg'
import mari from '../assets/products/mari.webp'
import mariLong from '../assets/products/mari-long.webp'
import periPeri from '../assets/products/peri-peri.jpeg'
import periPeriLong from '../assets/products/peri-peri-long.webp'
import tomato from '../assets/products/tomato.webp'
import tomatoPack from '../assets/products/tomato-pack.webp'

export const categories = ['All', 'Classic', 'Masala', 'Pepper', 'Spicy', 'Tomato']

export const categoryTiles = [
  'Classic',
  'Masala',
  'Pepper',
  'Spicy',
  'Tomato',
  'Family Packs',
  'Travel Packs',
  'Party Packs',
]

const sizeOptions = [
  { weight: '160g', price: 50, originalPrice: 70, extraWeight: '0g' },
  { weight: '200g', price: 65, originalPrice: 85, extraWeight: '+40g' },
  { weight: '400g', price: 120, originalPrice: 160, extraWeight: '+240g' },
  { weight: '1kg', price: 280, originalPrice: 360, extraWeight: '+840g' },
]

const productRows = [
  {
    id: 'classic-yellow-banana-chips',
    name: 'Yellow Banana Chips',
    category: 'Classic',
    image: bananaYellow,
    hoverImage: bananaYellowLong,
    accent: '#f3c84a',
    rating: 4.9,
    isBestseller: true,
    tag: 'Coconut oil fried',
    description: 'Thin salted banana chips with a clean Kerala-style crunch.',
  },
  {
    id: 'nendran-salted-long-cut',
    name: 'Nendran Long Cut Chips',
    category: 'Classic',
    image: bananaYellowLong,
    hoverImage: bananaYellow,
    accent: '#f7d96a',
    rating: 4.8,
    isBestseller: true,
    tag: 'Long slice',
    description: 'Long-cut nendran chips made for bigger bites and sharing packs.',
  },
  {
    id: 'mari-masala-banana-chips',
    name: 'Mari Masala Banana Chips',
    category: 'Masala',
    image: mari,
    hoverImage: mariLong,
    accent: '#dd9d35',
    rating: 4.7,
    isBestseller: true,
    tag: 'Chatpata masala',
    description: 'A warm masala coating with balanced spice and a crisp finish.',
  },
  {
    id: 'mari-long-banana-chips',
    name: 'Mari Long Cut Banana Chips',
    category: 'Masala',
    image: mariLong,
    hoverImage: mari,
    accent: '#d8912d',
    rating: 4.7,
    isBestseller: false,
    tag: 'Family favorite',
    description: 'Masala long-cut chips for tea-time, tiffin boxes, and travel.',
  },
  {
    id: 'black-pepper-banana-chips',
    name: 'Black Pepper Banana Chips',
    category: 'Pepper',
    image: blackPepper,
    hoverImage: blackPepperLong,
    accent: '#6b5f4b',
    rating: 4.8,
    isBestseller: true,
    tag: 'Pepper punch',
    description: 'Crisp banana chips finished with bold black pepper seasoning.',
  },
  {
    id: 'black-pepper-diet-cut',
    name: 'Diet Black Pepper Chips',
    category: 'Pepper',
    image: blackPepperLong,
    hoverImage: blackPepper,
    accent: '#95856b',
    rating: 4.6,
    isBestseller: false,
    tag: 'Light bite',
    description: 'Peppery chips with a lighter profile and clean savory notes.',
  },
  {
    id: 'peri-peri-banana-chips',
    name: 'Peri Peri Banana Chips',
    category: 'Spicy',
    image: periPeri,
    hoverImage: periPeriLong,
    accent: '#d84a26',
    rating: 4.9,
    isBestseller: true,
    tag: 'Hot seller',
    description: 'Extra-thin banana chips with a fiery peri peri masala kick.',
  },
  {
    id: 'peri-peri-party-pack',
    name: 'Peri Peri Party Pack',
    category: 'Spicy',
    image: periPeriLong,
    hoverImage: periPeri,
    accent: '#e76632',
    rating: 4.8,
    isBestseller: true,
    tag: 'Party size',
    description: 'A larger peri peri pack for movie nights and get-togethers.',
  },
  {
    id: 'tomato-banana-chips',
    name: 'Tomato Banana Chips',
    category: 'Tomato',
    image: tomato,
    hoverImage: tomatoPack,
    accent: '#ca3426',
    rating: 4.7,
    isBestseller: true,
    tag: 'Tangy tomato',
    description: 'Sweet-tangy tomato flavored banana wafers with a bright finish.',
  },
  {
    id: 'tomato-family-pack',
    name: 'Tomato Family Pack',
    category: 'Tomato',
    image: tomatoPack,
    hoverImage: tomato,
    accent: '#b92f25',
    rating: 4.6,
    isBestseller: false,
    tag: 'Family pack',
    description: 'Tomato banana chips packed for sharing with family and friends.',
  },
]

export const products = productRows.map((product, index) => {
  const defaultOption = sizeOptions[index % 2]
  const savings = defaultOption.originalPrice - defaultOption.price
  const grams = Number(defaultOption.weight.replace(/\D/g, '')) || 1000
  const pricePer100g = Math.round((defaultOption.price / grams) * 100)

  return {
    ...product,
    ...defaultOption,
    options: sizeOptions,
    savings,
    pricePer100g,
    spicyLevel: product.category === 'Classic' ? 1 : product.category === 'Pepper' ? 2 : 3,
  }
})

export const flavorShowcases = [
  {
    name: 'Classic Yellow',
    description: 'Salted, thin, simple, and the safest pick for bulk orders.',
    productId: 'classic-yellow-banana-chips',
  },
  {
    name: 'Peri Peri Heat',
    description: 'A sharper spicy option for younger customers and party combos.',
    productId: 'peri-peri-banana-chips',
  },
  {
    name: 'Tomato Tang',
    description: 'Sweet-tangy flavor with a bright red masala finish.',
    productId: 'tomato-banana-chips',
  },
]

export const reviews = [
  ['Fresh and Crispy', 'The chips arrived crisp, clean, and properly packed.', 'Lalitha'],
  ['Good Weight Options', '160g for trial and 1kg for home stock is perfect.', 'Esha'],
  ['Masala Is Balanced', 'Spice level is tasty without becoming too strong.', 'Sita'],
  ['Looks Premium', 'Photos and packaging feel much better for online ordering.', 'Nisha'],
  ['Kids Loved Tomato', 'Tomato flavor was the first packet to finish.', 'Tanvi'],
  ['Worth Reordering', 'The bigger pack has good value for regular snacking.', 'Rekha'],
]
