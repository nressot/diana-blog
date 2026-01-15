import { ShoppingBag } from 'lucide-react'
import { useCart } from '../../context/CartContext'

export default function CartIcon() {
  const { itemCount, toggleCart } = useCart()

  return (
    <button
      onClick={toggleCart}
      className="relative p-2.5 rounded-full hover:bg-cream-300 dark:hover:bg-neutral-800 transition-colors"
      aria-label={`Panier (${itemCount} articles)`}
    >
      <ShoppingBag className="w-5 h-5" />
      {itemCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 flex items-center justify-center px-1.5 bg-primary-600 text-white text-xs font-medium rounded-full">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  )
}
