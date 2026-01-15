import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import CartItem from './CartItem'

function formatPrice(priceInCents) {
  if (!priceInCents) return 'CHF 0,00'
  const francs = (priceInCents / 100).toFixed(2).replace('.', ',')
  return `CHF ${francs}`
}

export default function CartSidebar() {
  const { items, isOpen, closeCart, total, clearCart, itemCount } = useCart()

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeCart])

  // Bloquer le scroll du body quand ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-cream-50 dark:bg-neutral-900 z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-primary-600" />
                <h2 className="font-semibold text-lg">
                  Mon Panier
                  {itemCount > 0 && (
                    <span className="text-neutral-500 font-normal ml-1">
                      ({itemCount})
                    </span>
                  )}
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-full hover:bg-cream-200 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Fermer le panier"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenu */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-full bg-cream-200 dark:bg-neutral-800 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-neutral-400" />
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                    Votre panier est vide
                  </p>
                  <Link
                    to="/boutique"
                    onClick={closeCart}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400 font-medium inline-flex items-center gap-1"
                  >
                    Decouvrir la boutique
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div>
                  {items.map((item) => (
                    <CartItem
                      key={item.product.id}
                      product={item.product}
                      quantity={item.quantity}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer avec total et actions */}
            {items.length > 0 && (
              <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-cream-100/50 dark:bg-neutral-900/50">
                {/* Sous-total */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Sous-total
                  </span>
                  <span className="text-xl font-bold text-neutral-900 dark:text-white">
                    {formatPrice(total)}
                  </span>
                </div>

                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                  Frais de livraison calcules a l'etape suivante
                </p>

                {/* Boutons */}
                <div className="space-y-3">
                  <button
                    className="w-full py-3.5 px-6 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    Passer commande
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex gap-3">
                    <Link
                      to="/boutique"
                      onClick={closeCart}
                      className="flex-1 py-2.5 px-4 border border-neutral-300 dark:border-neutral-700 text-center rounded-xl hover:bg-cream-200 dark:hover:bg-neutral-800 transition-colors text-sm font-medium"
                    >
                      Continuer
                    </Link>
                    <button
                      onClick={clearCart}
                      className="py-2.5 px-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors text-sm font-medium"
                    >
                      Vider
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
