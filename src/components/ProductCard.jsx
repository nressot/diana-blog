import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'

/**
 * Formate un prix en centimes vers un affichage en CHF
 */
function formatPrice(priceInCents) {
  const francs = (priceInCents / 100).toFixed(2).replace('.', ',')
  return `CHF ${francs}`
}

export default function ProductCard({ product, variant = 'default', size = 'default', showAddToCart = false, onColoredBackground = false }) {
  const { addItem, openCart } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    openCart()
  }

  // Editorial variant - Clean magazine style
  if (variant === 'editorial') {
    return (
      <article className={`group ${size === 'large' ? 'md:col-span-2 lg:col-span-2' : ''}`}>
        <Link
          to={`/boutique/${product.slug}`}
          className={`block overflow-hidden bg-neutral-100 dark:bg-neutral-800 mb-6 ${
            size === 'large' ? 'aspect-[4/3]' : 'aspect-[3/4]'
          }`}
        >
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        <div className="space-y-3">
          {/* Category */}
          <p className={`text-xs tracking-[0.15em] uppercase ${onColoredBackground ? 'text-white/60' : 'text-neutral-500'}`}>
            {product.category}
          </p>

          {/* Title */}
          <Link to={`/boutique/${product.slug}`}>
            <h3 className={`font-bold leading-tight transition-colors ${
              size === 'large' ? 'text-xl lg:text-2xl' : 'text-lg lg:text-xl'
            } ${onColoredBackground ? 'text-white group-hover:text-white/80' : 'group-hover:text-primary-600'}`}>
              {product.title}
            </h3>
          </Link>

          {/* Excerpt - only on large */}
          {size === 'large' && (
            <p className={`line-clamp-2 max-w-lg ${onColoredBackground ? 'text-white/70' : 'text-neutral-600 dark:text-neutral-400'}`}>
              {product.excerpt}
            </p>
          )}

          {/* Price & Link */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-baseline gap-3">
              <span className={`text-lg ${onColoredBackground ? 'text-white' : ''}`}>
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className={`text-sm line-through ${onColoredBackground ? 'text-white/50' : 'text-neutral-400'}`}>
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <Link
              to={`/boutique/${product.slug}`}
              className={`text-xs tracking-wider uppercase flex items-center gap-2 transition-colors ${
                onColoredBackground
                  ? 'text-white/70 hover:text-white'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Voir
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </article>
    )
  }

  // Featured variant - Large card for featured section
  if (variant === 'featured') {
    return (
      <article className="group relative overflow-hidden rounded-2xl bg-cream-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            to={`/boutique/${product.slug}`}
            className="block aspect-[4/5] md:aspect-auto md:h-full overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          <div className="p-6 md:p-8 flex flex-col justify-center">
            <span className="text-xs tracking-[0.15em] uppercase text-primary-600 dark:text-primary-400 mb-4">
              {product.category}
            </span>

            <Link to={`/boutique/${product.slug}`}>
              <h2 className="text-xl lg:text-2xl font-bold mb-4 group-hover:text-primary-600 transition-colors">
                {product.title}
              </h2>
            </Link>

            <p className="text-neutral-600 dark:text-neutral-400 mb-6 line-clamp-3">
              {product.excerpt}
            </p>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-2xl font-bold">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-neutral-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <Link
              to={`/boutique/${product.slug}`}
              className="inline-flex items-center gap-3 text-sm font-medium tracking-wide uppercase hover:gap-4 transition-all w-fit"
            >
              Decouvrir
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>
    )
  }

  // Horizontal variant - Sidebar card
  if (variant === 'horizontal') {
    return (
      <article className="group flex gap-4">
        <Link
          to={`/boutique/${product.slug}`}
          className="shrink-0 w-20 h-24 overflow-hidden bg-neutral-100 dark:bg-neutral-800"
        >
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="flex flex-col justify-center min-w-0">
          <Link to={`/boutique/${product.slug}`}>
            <h3 className="font-medium group-hover:text-primary-600 transition-colors line-clamp-2 mb-1">
              {product.title}
            </h3>
          </Link>
          <div className="flex items-baseline gap-2">
            <span className="text-sm">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </article>
    )
  }

  // Default variant - Grid card
  return (
    <article className="group">
      <Link
        to={`/boutique/${product.slug}`}
        className="block aspect-[3/4] overflow-hidden bg-neutral-100 dark:bg-neutral-800 rounded-lg mb-4"
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="space-y-2">
        <p className="text-xs tracking-[0.1em] uppercase text-neutral-500">
          {product.category}
        </p>

        <Link to={`/boutique/${product.slug}`}>
          <h3 className="text-lg font-bold group-hover:text-primary-600 transition-colors line-clamp-2">
            {product.title}
          </h3>
        </Link>

        <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
          {product.excerpt}
        </p>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className="font-medium">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-neutral-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {showAddToCart ? (
            <button
              onClick={handleAddToCart}
              className="text-xs text-neutral-500 hover:text-primary-600 flex items-center gap-1 transition-colors"
            >
              <ShoppingBag className="w-3 h-3" />
              Ajouter
            </button>
          ) : (
            <Link
              to={`/boutique/${product.slug}`}
              className="text-xs text-neutral-500 hover:text-primary-600 flex items-center gap-1 transition-colors"
            >
              Voir
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
