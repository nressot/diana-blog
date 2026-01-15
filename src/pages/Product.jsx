import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  ShoppingBag,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { useProduct, useRelatedProducts } from '../lib/useProducts'
import { useCheckout } from '../lib/useCheckout'
import { useCart } from '../context/CartContext'
import ProductTabs from '../components/product/ProductTabs'
import FormatSelector from '../components/product/FormatSelector'
import AuthorSection from '../components/product/AuthorSection'
import BookExcerpt from '../components/product/BookExcerpt'

/**
 * Formate un prix en centimes vers un affichage en CHF
 * @param {number} priceInCents - Prix en centimes
 * @returns {string} Prix formate (ex: "CHF 19,90")
 */
function formatPrice(priceInCents) {
  if (!priceInCents) return 'CHF 0,00'
  const francs = (priceInCents / 100).toFixed(2).replace('.', ',')
  return `CHF ${francs}`
}

export default function Product() {
  const { slug } = useParams()
  const { product, loading } = useProduct(slug)
  const { data: relatedProducts } = useRelatedProducts(
    product?.category,
    product?.id,
    3
  )
  const { checkout, loading: checkoutLoading, error: checkoutError } = useCheckout()
  const { addItem, openCart } = useCart()

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedFormat, setSelectedFormat] = useState(null)

  // Selectionner le premier format disponible par defaut
  useEffect(() => {
    if (product?.formats?.length > 0 && !selectedFormat) {
      setSelectedFormat(product.formats[0])
    }
  }, [product, selectedFormat])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <ShoppingBag className="w-16 h-16 mb-4 text-neutral-300 dark:text-neutral-700" />
        <h1 className="text-2xl font-semibold mb-2">Produit introuvable</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mb-6">
          Le produit que vous recherchez n'existe pas ou a ete supprime.
        </p>
        <Link
          to="/boutique"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour a la boutique
        </Link>
      </div>
    )
  }

  const images = product.images || [product.image]
  const hasMultipleImages = images.length > 1

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  // Prix actuel (selon format selectionne ou prix de base)
  const currentPrice = selectedFormat?.price || product.price
  const currentOriginalPrice = selectedFormat?.originalPrice || product.originalPrice
  const isInStock = selectedFormat ? selectedFormat.inStock !== false : product.inStock

  // Calcul du pourcentage de reduction
  const discountPercentage = currentOriginalPrice
    ? Math.round(
        ((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100
      )
    : null

  // Ajouter au panier
  const handleAddToCart = () => {
    const productWithFormat = {
      ...product,
      selectedFormat: selectedFormat,
      price: currentPrice,
    }
    addItem(productWithFormat)
    openCart()
  }

  // Acheter maintenant
  const handleBuyNow = () => {
    const productForCheckout = selectedFormat
      ? { ...product, price: selectedFormat.price, stripePriceId: selectedFormat.stripePriceId }
      : product
    checkout(productForCheckout)
  }

  return (
    <div>
      {/* Breadcrumb */}
      <section className="py-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="container-custom">
          <Link
            to="/boutique"
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour a la boutique
          </Link>
        </div>
      </section>

      {/* Product Hero */}
      <section className="py-8 lg:py-12">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-cream-100 dark:bg-neutral-800">
                <img
                  src={images[currentImageIndex]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />

                {/* Navigation Arrows */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-neutral-900/90 flex items-center justify-center hover:bg-white dark:hover:bg-neutral-900 transition-colors shadow-lg"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-neutral-900/90 flex items-center justify-center hover:bg-white dark:hover:bg-neutral-900 transition-colors shadow-lg"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Discount Badge */}
                {discountPercentage && (
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-red-500 text-white text-sm font-medium">
                    -{discountPercentage}%
                  </div>
                )}

                {/* Serie Badge */}
                {product.series && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary-600 text-white text-sm font-medium">
                    {product.series.name} - Tome {product.series.volume}
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {hasMultipleImages && (
                <div className="flex gap-3">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-20 h-24 rounded-lg overflow-hidden border transition-colors ${
                        index === currentImageIndex
                          ? 'border-primary-500'
                          : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-600'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="lg:py-4">
              {/* Category */}
              <span
                className={`${product.categoryColor} text-white text-xs font-medium px-3 py-1 rounded-full inline-block mb-4`}
              >
                {product.category}
              </span>

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                {product.title}
              </h1>

              {/* Excerpt */}
              <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-6">
                {product.excerpt}
              </p>

              {/* Format Selector */}
              <FormatSelector
                formats={product.formats}
                selectedFormat={selectedFormat}
                onSelect={setSelectedFormat}
              />

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-3xl font-bold text-primary-600 dark:text-primary-500">
                  {formatPrice(currentPrice)}
                </span>
                {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                  <span className="text-xl text-neutral-400 line-through">
                    {formatPrice(currentOriginalPrice)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                {isInStock ? (
                  <>
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm text-green-600 dark:text-green-400">
                      En stock
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm text-red-600 dark:text-red-400">
                      Rupture de stock
                    </span>
                  </>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={!isInStock}
                  className={`flex-1 inline-flex items-center justify-center gap-2 h-14 px-6 rounded-full font-medium transition-colors border ${
                    isInStock
                      ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      : 'border-neutral-300 dark:border-neutral-700 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  Ajouter au panier
                </button>

                {/* Buy Now */}
                <button
                  onClick={handleBuyNow}
                  disabled={!isInStock || checkoutLoading}
                  className={`flex-1 inline-flex items-center justify-center gap-2 h-14 px-6 rounded-full font-medium transition-colors shadow-lg ${
                    isInStock && !checkoutLoading
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100'
                      : 'bg-neutral-300 dark:bg-neutral-700 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  {checkoutLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Chargement...
                    </>
                  ) : (
                    'Acheter maintenant'
                  )}
                </button>
              </div>

              {/* Checkout Error Message */}
              {checkoutError && (
                <p className="mb-6 text-sm text-red-600 dark:text-red-400">
                  {checkoutError}
                </p>
              )}

              {/* Features */}
              <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <h3 className="font-semibold mb-4">Inclus avec votre achat</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    Livraison gratuite en France metropolitaine
                  </li>
                  <li className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    Dedicace personnalisee sur demande
                  </li>
                  <li className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    Paiement securise par Stripe
                  </li>
                </ul>
              </div>

              {/* Book Excerpt */}
              <BookExcerpt excerpt={product.excerpt_text} />

              {/* Author Section */}
              <AuthorSection />
            </div>
          </div>
        </div>
      </section>

      {/* Product Tabs (Description, Details, Shipping) */}
      <section className="py-8 lg:py-12 bg-cream-200/50 dark:bg-neutral-900/50">
        <div className="container-custom">
          <div className="max-w-4xl">
            <ProductTabs product={product} />
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="py-8 lg:py-12">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-semibold">
                  Vous aimerez aussi
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                  D'autres ouvrages qui pourraient vous plaire
                </p>
              </div>
              <Link
                to="/boutique"
                className="text-sm font-medium text-primary-600 hover:text-primary-700 hidden sm:block"
              >
                Voir tous mes produits
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  showAddToCart
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
