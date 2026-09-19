import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext.jsx'
import { CartContext } from './cartContextObject.js'

const CART_STORAGE_KEY = 'shivansh-snacks-cart'

const readStoredCart = (storageKey) => {
  try {
    const value = sessionStorage.getItem(storageKey)
    return value ? JSON.parse(value) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth()
  const storageKey = user?.id ? `${CART_STORAGE_KEY}:${user.id}` : `${CART_STORAGE_KEY}:guest`
  const [cartItems, setCartItems] = useState(() => readStoredCart(storageKey))
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    setCartItems(readStoredCart(storageKey))
    setIsCartOpen(false)
  }, [storageKey])

  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify(cartItems))
  }, [cartItems, storageKey])

  const addToCart = useCallback((product, quantity = 1) => {
    const payload = {
      id: product.id,
      productId: product.productId || 'banana-chips',
      name: product.name,
      flavorId: product.flavorId,
      flavorName: product.flavorName,
      flavorCategory: product.flavorCategory,
      price: product.price,
      unitPrice: product.unitPrice || product.price,
      lineTotal: (product.unitPrice || product.price) * quantity,
      weightInGrams: product.weightInGrams,
      weight: product.weight,
      weightLabel: product.weightLabel || product.weight,
      customWeight: Boolean(product.customWeight),
      image: product.image,
      qty: quantity,
    }

    setCartItems((items) => {
      const existing = items.find((item) => item.id === payload.id)
      if (!existing) return [...items, payload]

      return items.map((item) =>
        item.id === payload.id
          ? { ...item, qty: item.qty + quantity, lineTotal: item.unitPrice * (item.qty + quantity) }
          : item,
      )
    })
    setIsCartOpen(true)
  }, [])

  const updateQuantity = useCallback((id, quantity) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(0, quantity), lineTotal: item.unitPrice * Math.max(0, quantity) } : item,
        )
        .filter((item) => item.qty > 0),
    )
  }, [])

  const removeFromCart = useCallback((id) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }, [])

  const clearCart = useCallback(() => setCartItems([]), [])
  const openCart = useCallback(() => setIsCartOpen(true), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])
  const toggleCart = useCallback(() => setIsCartOpen((open) => !open), [])

  const subtotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.qty, 0),
    [cartItems],
  )

  const totalItems = useMemo(
    () => cartItems.reduce((total, item) => total + item.qty, 0),
    [cartItems],
  )

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      subtotal,
      totalItems,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
    }),
    [
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      subtotal,
      totalItems,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
