import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'diana-cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  // Charger le panier depuis localStorage au montage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setItems(parsed)
        }
      }
    } catch (e) {
      console.error('Erreur chargement panier:', e)
    }
  }, [])

  // Sauvegarder dans localStorage a chaque changement
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (e) {
      console.error('Erreur sauvegarde panier:', e)
    }
  }, [items])

  const addItem = useCallback((product, quantity = 1) => {
    setItems(currentItems => {
      const existingIndex = currentItems.findIndex(item => item.product.id === product.id)

      if (existingIndex > -1) {
        // Produit existe deja, incrementer la quantite
        const updated = [...currentItems]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        }
        return updated
      }

      // Nouveau produit
      return [...currentItems, { product, quantity }]
    })
  }, [])

  const removeItem = useCallback((productId) => {
    setItems(currentItems => currentItems.filter(item => item.product.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) {
      removeItem(productId)
      return
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    )
  }, [removeItem])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])
  const toggleCart = useCallback(() => setIsOpen(prev => !prev), [])

  // Calculs derives
  const itemCount = useMemo(() =>
    items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  )

  const total = useMemo(() =>
    items.reduce((sum, item) => {
      const price = item.product.selectedFormat?.price || item.product.price || 0
      return sum + (price * item.quantity)
    }, 0),
    [items]
  )

  const value = useMemo(() => ({
    items,
    itemCount,
    total,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart
  }), [items, itemCount, total, isOpen, addItem, removeItem, updateQuantity, clearCart, openCart, closeCart, toggleCart])

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart doit etre utilise dans un CartProvider')
  }
  return context
}

export default CartContext
