import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../../context/CartContext'

function formatPrice(priceInCents) {
  if (!priceInCents) return 'CHF 0,00'
  const francs = (priceInCents / 100).toFixed(2).replace('.', ',')
  return `CHF ${francs}`
}

export default function CartItem({ product, quantity }) {
  const { updateQuantity, removeItem } = useCart()

  const price = product.selectedFormat?.price || product.price || 0
  const formatLabel = product.selectedFormat?.label

  return (
    <div className="flex gap-4 py-4 border-b border-neutral-200 dark:border-neutral-800 last:border-0">
      {/* Image */}
      <div className="w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-cream-200 dark:bg-neutral-800">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm line-clamp-2 mb-1">
          {product.title}
        </h3>

        {formatLabel && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
            {formatLabel}
          </p>
        )}

        <p className="text-sm font-semibold text-primary-600 dark:text-primary-500">
          {formatPrice(price)}
        </p>

        {/* Controles quantite */}
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <button
              onClick={() => updateQuantity(product.id, quantity - 1)}
              className="p-1.5 hover:bg-cream-200 dark:hover:bg-neutral-800 transition-colors rounded-l-lg"
              aria-label="Diminuer la quantite"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 text-sm font-medium min-w-[2rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(product.id, quantity + 1)}
              className="p-1.5 hover:bg-cream-200 dark:hover:bg-neutral-800 transition-colors rounded-r-lg"
              aria-label="Augmenter la quantite"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => removeItem(product.id)}
            className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors"
            aria-label="Supprimer du panier"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Export pour usage dans CartSidebar sans import supplementaire
function ShoppingBag(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}
