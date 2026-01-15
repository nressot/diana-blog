import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight, Loader2 } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { useProducts, useProductCategories, useFeaturedProducts } from '../lib/useProducts'

/* Floating Stars Component - SVG stars inspired by bg-stars-v2 */
function FloatingStars() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute w-5 h-5 text-white/50 animate-float-slow" style={{ top: '15%', left: '8%' }} viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0 L9 6 L8 8 L7 6 Z M8 16 L7 10 L8 8 L9 10 Z M0 8 L6 7 L8 8 L6 9 Z M16 8 L10 9 L8 8 L10 7 Z" />
      </svg>
      <svg className="absolute w-6 h-6 text-white/40 animate-float-medium" style={{ top: '25%', right: '12%' }} viewBox="0 0 20 20" fill="currentColor">
        <polygon points="10,0 12,7 20,7 14,11 16,19 10,14 4,19 6,11 0,7 8,7" />
      </svg>
      <svg className="absolute w-4 h-4 text-white/55 animate-float-fast" style={{ top: '60%', left: '15%' }} viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0 L9 6 L8 8 L7 6 Z M8 16 L7 10 L8 8 L9 10 Z M0 8 L6 7 L8 8 L6 9 Z M16 8 L10 9 L8 8 L10 7 Z" />
      </svg>
      <svg className="absolute w-7 h-7 text-white/30 animate-float-slow" style={{ top: '40%', right: '20%' }} viewBox="0 0 20 20" fill="currentColor">
        <polygon points="10,0 12,7 20,7 14,11 16,19 10,14 4,19 6,11 0,7 8,7" />
      </svg>
      <svg className="absolute w-3 h-3 text-white/60 animate-twinkle" style={{ top: '70%', right: '8%' }} viewBox="0 0 8 8" fill="currentColor">
        <circle cx="4" cy="4" r="2" />
      </svg>
      <svg className="absolute w-5 h-5 text-white/45 animate-float-medium" style={{ top: '80%', left: '25%' }} viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0 L9 6 L8 8 L7 6 Z M8 16 L7 10 L8 8 L9 10 Z M0 8 L6 7 L8 8 L6 9 Z M16 8 L10 9 L8 8 L10 7 Z" />
      </svg>
      <svg className="absolute w-4 h-4 text-white/50 animate-float-fast" style={{ top: '20%', left: '45%' }} viewBox="0 0 20 20" fill="currentColor">
        <polygon points="10,0 12,7 20,7 14,11 16,19 10,14 4,19 6,11 0,7 8,7" />
      </svg>
      <svg className="absolute w-3 h-3 text-white/55 animate-twinkle-delayed" style={{ top: '50%', left: '60%' }} viewBox="0 0 8 8" fill="currentColor">
        <circle cx="4" cy="4" r="2" />
      </svg>
      <svg className="absolute w-6 h-6 text-white/35 animate-float-slow" style={{ top: '35%', left: '75%' }} viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0 L9 6 L8 8 L7 6 Z M8 16 L7 10 L8 8 L9 10 Z M0 8 L6 7 L8 8 L6 9 Z M16 8 L10 9 L8 8 L10 7 Z" />
      </svg>
      <svg className="absolute w-5 h-5 text-white/45 animate-float-medium" style={{ top: '10%', right: '35%' }} viewBox="0 0 20 20" fill="currentColor">
        <polygon points="10,0 12,7 20,7 14,11 16,19 10,14 4,19 6,11 0,7 8,7" />
      </svg>
      <svg className="absolute w-2 h-2 text-white/65 animate-twinkle" style={{ top: '85%', right: '40%' }} viewBox="0 0 8 8" fill="currentColor">
        <circle cx="4" cy="4" r="2" />
      </svg>
    </div>
  )
}

export default function Boutique() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const { data: products, loading: loadingProducts } = useProducts()
  const { data: categories } = useProductCategories()
  const { data: featuredProducts } = useFeaturedProducts()

  const filteredProducts = (products || []).filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === 'all' ||
      product.category.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const featured = featuredProducts?.[0]

  return (
    <div className="min-h-screen">
      {/* Filter Bar - Minimal */}
      <section className="sticky top-20 z-30 border-b border-neutral-200 dark:border-neutral-800 bg-cream-50/95 dark:bg-primary-950/95 backdrop-blur-sm">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4">
            {/* Categories */}
            <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 text-sm transition-colors whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'font-medium'
                    : 'hover:text-primary-600 dark:hover:text-primary-300'
                }`}
                style={{ color: '#1c1a17' }}
              >
                Tout voir
              </button>
              {(categories || []).map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 text-sm transition-colors whitespace-nowrap ${
                    selectedCategory === category.name
                      ? 'font-medium'
                      : 'hover:text-primary-600 dark:hover:text-primary-300'
                  }`}
                  style={{ color: '#1c1a17' }}
                >
                  {category.name}
                </button>
              ))}
            </nav>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-4 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 border border-cream-300 dark:border-neutral-700 bg-cream-50 dark:bg-neutral-800 rounded-lg focus:border-primary-500 dark:focus:border-neutral-500 outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Product - Editorial Hero */}
      {selectedCategory === 'all' && !searchTerm && featured && (
        <section className="py-16 lg:py-24">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Image */}
              <Link
                to={`/boutique/${featured.slug}`}
                className="group block aspect-[3/4] overflow-hidden bg-neutral-100 dark:bg-neutral-900"
              >
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </Link>

              {/* Content */}
              <div className="lg:py-12">
                <p className="text-xs tracking-[0.2em] uppercase text-primary-600 dark:text-primary-400 mb-4">
                  A la une
                </p>
                <Link to={`/boutique/${featured.slug}`}>
                  <h2 className="text-2xl lg:text-4xl font-bold mb-6 hover:text-primary-600 transition-colors">
                    {featured.title}
                  </h2>
                </Link>
                <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed mb-8 max-w-lg">
                  {featured.excerpt}
                </p>

                <div className="flex items-center gap-8 mb-8">
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Prix</p>
                    <p className="text-2xl font-bold">
                      CHF {(featured.price / 100).toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                  {featured.originalPrice && (
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Avant</p>
                      <p className="text-xl text-neutral-400 line-through">
                        CHF {(featured.originalPrice / 100).toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  )}
                </div>

                <Link
                  to={`/boutique/${featured.slug}`}
                  className="inline-flex items-center gap-3 text-sm font-medium tracking-wide uppercase hover:gap-4 transition-all"
                >
                  Decouvrir
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Products Grid - Editorial Asymmetric */}
      <section className="py-16 lg:py-24 bg-terracotta-warm text-white relative">
        <FloatingStars />
        <div className="container-custom relative z-10">
          {/* Section Header */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white">
                {selectedCategory === 'all' ? 'Mes ouvrages' : selectedCategory}
              </h2>
              <p className="text-white/70 mt-2">
                {filteredProducts.length} {filteredProducts.length > 1 ? 'produits' : 'produit'}
              </p>
            </div>
          </div>

          {loadingProducts ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-6 h-6 animate-spin text-white/60" />
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="editorial"
                  size={index === 0 && selectedCategory === 'all' ? 'large' : 'default'}
                  onColoredBackground={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-white/70 mb-4">
                Aucun produit ne correspond a votre recherche.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
                className="text-sm font-medium underline underline-offset-4 text-white hover:text-white/80 transition-colors"
              >
                Voir tous mes produits
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA - Minimal */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-4">
              Livraison
            </p>
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Livraison offerte des CHF 35
            </h3>
            <p className="text-neutral-500">
              Expedition sous 48h en Suisse
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
