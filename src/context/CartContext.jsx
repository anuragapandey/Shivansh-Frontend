import { useCallback, useEffect, useMemo, useState } from 'react'
import { CartContext } from './cartContextObject.js'

const CART_STORAGE_KEY = 'shivansh-snacks-cart'

const readStoredCart = () => {
  try {
    const value = localStorage.getItem(CART_STORAGE_KEY)
    return value ? JSON.parse(value) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(readStoredCart)
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = useCallback((product, quantity = 1) => {
    const payload = {
      id: product.id,
      name: product.name,
      price: product.price,
      weight: product.weight,
      image: product.image,
      qty: quantity,
    }

    setCartItems((items) => {
      const existing = items.find((item) => item.id === payload.id)
      if (!existing) return [...items, payload]

      return items.map((item) =>
        item.id === payload.id ? { ...item, qty: item.qty + quantity } : item,
      )
    })
    setIsCartOpen(true)
  }, [])

  const updateQuantity = useCallback((id, quantity) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(0, quantity) } : item,
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
