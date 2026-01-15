import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Search, ArrowRight, Loader2, ChevronLeft, ChevronRight, List, LayoutGrid, Columns, Clock, Sparkles } from 'lucide-react'
import { useProducts, useProductCategories, useFeaturedProducts } from '../lib/useProducts'

/* Floating Stars Component - SVG stars inspired by bg-stars-v2 */
function FloatingStars() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Etoile 4 branches */}
      <svg className="absolute w-5 h-5 text-white/50 animate-float-slow" style={{ top: '15%', left: '8%' }} viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0 L9 6 L8 8 L7 6 Z M8 16 L7 10 L8 8 L9 10 Z M0 8 L6 7 L8 8 L6 9 Z M16 8 L10 9 L8 8 L10 7 Z" />
      </svg>
      {/* Etoile 5 branches */}
      <svg className="absolute w-6 h-6 text-white/40 animate-float-medium" style={{ top: '25%', right: '12%' }} viewBox="0 0 20 20" fill="currentColor">
        <polygon points="10,0 12,7 20,7 14,11 16,19 10,14 4,19 6,11 0,7 8,7" />
      </svg>
      {/* Etoile 4 branches petite */}
      <svg className="absolute w-4 h-4 text-white/55 animate-float-fast" style={{ top: '60%', left: '15%' }} viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0 L9 6 L8 8 L7 6 Z M8 16 L7 10 L8 8 L9 10 Z M0 8 L6 7 L8 8 L6 9 Z M16 8 L10 9 L8 8 L10 7 Z" />
      </svg>
      {/* Etoile 5 branches grande */}
      <svg className="absolute w-7 h-7 text-white/30 animate-float-slow" style={{ top: '40%', right: '20%' }} viewBox="0 0 20 20" fill="currentColor">
        <polygon points="10,0 12,7 20,7 14,11 16,19 10,14 4,19 6,11 0,7 8,7" />
      </svg>
      {/* Point scintillant */}
      <svg className="absolute w-3 h-3 text-white/60 animate-twinkle" style={{ top: '70%', right: '8%' }} viewBox="0 0 8 8" fill="currentColor">
        <circle cx="4" cy="4" r="2" />
      </svg>
      {/* Etoile 4 branches moyenne */}
      <svg className="absolute w-5 h-5 text-white/45 animate-float-medium" style={{ top: '80%', left: '25%' }} viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0 L9 6 L8 8 L7 6 Z M8 16 L7 10 L8 8 L9 10 Z M0 8 L6 7 L8 8 L6 9 Z M16 8 L10 9 L8 8 L10 7 Z" />
      </svg>
      {/* Etoile 5 branches petite */}
      <svg className="absolute w-4 h-4 text-white/50 animate-float-fast" style={{ top: '20%', left: '45%' }} viewBox="0 0 20 20" fill="currentColor">
        <polygon points="10,0 12,7 20,7 14,11 16,19 10,14 4,19 6,11 0,7 8,7" />
      </svg>
      {/* Point scintillant 2 */}
      <svg className="absolute w-3 h-3 text-white/55 animate-twinkle-delayed" style={{ top: '50%', left: '60%' }} viewBox="0 0 8 8" fill="currentColor">
        <circle cx="4" cy="4" r="2" />
      </svg>
      {/* Etoile 4 branches */}
      <svg className="absolute w-6 h-6 text-white/35 animate-float-slow" style={{ top: '35%', left: '75%' }} viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0 L9 6 L8 8 L7 6 Z M8 16 L7 10 L8 8 L9 10 Z M0 8 L6 7 L8 8 L6 9 Z M16 8 L10 9 L8 8 L10 7 Z" />
      </svg>
      {/* Etoile 5 branches supplementaire */}
      <svg className="absolute w-5 h-5 text-white/45 animate-float-medium" style={{ top: '10%', right: '35%' }} viewBox="0 0 20 20" fill="currentColor">
        <polygon points="10,0 12,7 20,7 14,11 16,19 10,14 4,19 6,11 0,7 8,7" />
      </svg>
      {/* Point scintillant 3 */}
      <svg className="absolute w-2 h-2 text-white/65 animate-twinkle" style={{ top: '85%', right: '40%' }} viewBox="0 0 8 8" fill="currentColor">
        <circle cx="4" cy="4" r="2" />
      </svg>
    </div>
  )
}

function formatPrice(priceInCents) {
  const francs = (priceInCents / 100).toFixed(2).replace('.', ',')
  return `CHF ${francs}`
}

const VARIANTS = [
  { id: 'editorial', name: 'Editorial Minimal', description: 'Style magazine asymetrique', icon: LayoutGrid },
  { id: 'cards', name: 'Cards & Scroll', description: 'Scroll horizontal, cards epaisses', icon: Columns },
  { id: 'list', name: 'List Detail', description: 'Liste detaillee avec descriptions', icon: List },
  { id: 'story', name: 'Story Timeline', description: 'Narration chronologique', icon: Clock },
  { id: 'hybrid', name: 'Hybrid', description: 'Hero compact + grille cards', icon: Sparkles },
]

export default function BoutiqueDemo() {
  const { variant = 'editorial' } = useParams()
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
  const currentIndex = VARIANTS.findIndex(v => v.id === variant)
  const prevVariant = VARIANTS[currentIndex - 1]
  const nextVariant = VARIANTS[currentIndex + 1]
  const currentVariant = VARIANTS[currentIndex] || VARIANTS[0]

  // Scroll to top when variant changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [variant])

  const renderVariant = () => {
    switch (variant) {
      case 'cards':
        return (
          <CardsHorizontalLayout
            products={filteredProducts}
            categories={categories}
            featured={featured}
            featuredProducts={featuredProducts}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            loading={loadingProducts}
          />
        )
      case 'list':
        return (
          <ListDetailLayout
            products={filteredProducts}
            categories={categories}
            featured={featured}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            loading={loadingProducts}
          />
        )
      case 'story':
        return (
          <StoryTimelineLayout
            products={filteredProducts}
            categories={categories}
            featured={featured}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            loading={loadingProducts}
          />
        )
      case 'hybrid':
        return (
          <HybridLayout
            products={filteredProducts}
            categories={categories}
            featured={featured}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            loading={loadingProducts}
          />
        )
      default:
        return (
          <EditorialMinimalLayout
            products={filteredProducts}
            categories={categories}
            featured={featured}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            loading={loadingProducts}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-terracotta-pattern">
      {/* Floating Variant Selector */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-cream-50/95 dark:bg-primary-950/95 backdrop-blur-sm rounded-full shadow-lg border border-cream-300 dark:border-primary-800 px-2 py-2">
        <div className="flex items-center gap-1">
          {prevVariant && (
            <Link
              to={`/boutique-demo/${prevVariant.id}`}
              className="p-2 rounded-full text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-cream-200 dark:hover:bg-primary-900 transition-all"
              title={prevVariant.name}
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}

          {VARIANTS.map((v) => (
            <Link
              key={v.id}
              to={`/boutique-demo/${v.id}`}
              className={`p-2.5 rounded-full transition-all ${
                v.id === variant
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-cream-200 dark:hover:bg-primary-900'
              }`}
              title={v.name}
            >
              <v.icon className="w-4 h-4" />
            </Link>
          ))}

          {nextVariant && (
            <Link
              to={`/boutique-demo/${nextVariant.id}`}
              className="p-2 rounded-full text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-cream-200 dark:hover:bg-primary-900 transition-all"
              title={nextVariant.name}
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Render selected variant */}
      {renderVariant()}
    </div>
  )
}

/* ============================================
   VARIANT 1: EDITORIAL MINIMAL
   Style magazine, grille asymetrique
   ============================================ */
function EditorialMinimalLayout({ products, categories, featured, selectedCategory, setSelectedCategory, searchTerm, setSearchTerm, loading }) {
  return (
    <div>
      {/* Filter Bar */}
      <section className="sticky top-20 z-30 border-b border-cream-300 dark:border-primary-800 bg-cream-50/95 dark:bg-primary-950/95 backdrop-blur-sm">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4">
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
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-4 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 border border-cream-300 dark:border-primary-800 bg-cream-50 dark:bg-primary-900 rounded-lg focus:border-primary-500 dark:focus:border-neutral-500 outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      {selectedCategory === 'all' && !searchTerm && featured && (
        <section className="py-16 lg:py-24 bg-terracotta-warm text-white">
          <FloatingStars />
          <div className="container-custom relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <Link to={`/boutique/${featured.slug}`} className="group block aspect-[3/4] overflow-hidden bg-white/10 rounded-2xl">
                <img src={featured.image} alt={featured.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </Link>
              <div className="lg:py-12">
                <p className="text-xs tracking-[0.2em] uppercase text-primary-200 mb-4">A la une</p>
                <Link to={`/boutique/${featured.slug}`}>
                  <h2 className="text-2xl lg:text-4xl font-semibold mb-6 hover:text-primary-100 transition-colors">{featured.title}</h2>
                </Link>
                <p className="text-primary-100 text-lg leading-relaxed mb-8 max-w-lg">{featured.excerpt}</p>
                <p className="text-2xl font-light mb-8">{formatPrice(featured.price)}</p>
                <Link to={`/boutique/${featured.slug}`} className="inline-flex items-center gap-3 px-6 py-3 bg-white text-primary-700 font-medium rounded-full hover:bg-primary-50 transition-colors">
                  Decouvrir <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Grid */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-2xl lg:text-3xl font-semibold">
                {selectedCategory === 'all' ? 'Mes ouvrages' : selectedCategory}
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mt-2">{products.length} produits</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {products.map((product, index) => (
                <EditorialCard key={product.id} product={product} large={index === 0 && selectedCategory === 'all'} />
              ))}
            </div>
          ) : (
            <EmptyState onReset={() => { setSearchTerm(''); setSelectedCategory('all'); }} />
          )}
        </div>
      </section>
    </div>
  )
}

function EditorialCard({ product, large }) {
  return (
    <article className={`group ${large ? 'md:col-span-2 lg:col-span-2' : ''}`}>
      <Link to={`/boutique/${product.slug}`} className={`block overflow-hidden bg-cream-200 dark:bg-primary-900 rounded-xl mb-6 border border-cream-300 dark:border-primary-800 ${large ? 'aspect-[4/3]' : 'aspect-[3/4]'}`}>
        <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </Link>
      <div className="space-y-3">
        <p className="text-xs tracking-[0.15em] uppercase text-primary-600 dark:text-primary-400">{product.category}</p>
        <Link to={`/boutique/${product.slug}`}>
          <h3 className={`font-medium leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors ${large ? 'text-2xl lg:text-3xl' : 'text-xl lg:text-2xl'}`}>{product.title}</h3>
        </Link>
        <div className="flex items-center justify-between pt-2">
          <span className="text-lg">{formatPrice(product.price)}</span>
          <Link to={`/boutique/${product.slug}`} className="text-xs tracking-wider uppercase text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-2 transition-colors">
            Voir <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </article>
  )
}

/* ============================================
   VARIANT 2: CARDS & HORIZONTAL SCROLL
   Cards epaisses, scroll horizontal pour featured
   ============================================ */
function CardsHorizontalLayout({ products, categories, featured, featuredProducts, selectedCategory, setSelectedCategory, searchTerm, setSearchTerm, loading }) {
  return (
    <>
      {/* Hero compact */}
      <section className="bg-terracotta-warm text-white">
        <FloatingStars />
        <div className="container-custom py-12 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="text-primary-200 text-sm font-medium tracking-wider uppercase mb-2">Ma collection 2024</p>
              <h1 className="text-3xl lg:text-4xl font-semibold">La Boutique</h1>
            </div>
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type="text"
                placeholder="Rechercher un ouvrage..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 pl-12 pr-4 text-sm text-white placeholder-white/60 border border-white/25 bg-white/15 rounded-xl focus:bg-white/25 focus:border-white/50 outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories tabs */}
      <section className="sticky top-20 z-30 bg-cream-50/95 dark:bg-primary-950/95 backdrop-blur-sm border-b border-cream-300 dark:border-primary-800">
        <div className="container-custom">
          <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 text-sm font-medium rounded-xl transition-all ${
                selectedCategory === 'all'
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                  : 'bg-cream-300 dark:bg-primary-900 hover:bg-cream-400 dark:hover:bg-primary-800'
              }`}
              style={{ color: selectedCategory === 'all' ? undefined : '#1c1a17' }}
            >
              Tous mes produits
            </button>
            {(categories || []).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-6 py-3 text-sm font-medium rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === cat.name
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                    : 'bg-cream-300 dark:bg-primary-900 hover:bg-cream-400 dark:hover:bg-primary-800'
                }`}
                style={{ color: selectedCategory === cat.name ? undefined : '#1c1a17' }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured horizontal scroll */}
      {selectedCategory === 'all' && !searchTerm && featuredProducts?.length > 0 && (
        <section className="py-12 pb-16 bg-terracotta-warm text-white relative overflow-visible">
          <FloatingStars />
          <div className="container-custom mb-6 relative z-10">
            <h2 className="text-xl lg:text-2xl font-semibold text-center">A la une</h2>
          </div>
          <div className="container-custom relative z-10">
            <div className="flex gap-6 justify-center flex-wrap">
              {(featuredProducts || []).slice(0, 4).map((product) => (
                <FeaturedHorizontalCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products grid with thick cards */}
      <section className="py-12">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl lg:text-2xl font-semibold">
              {selectedCategory === 'all' ? 'Mes ouvrages' : selectedCategory}
            </h2>
            <span className="text-sm text-neutral-600 dark:text-neutral-400">{products.length} produits</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ThickCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState onReset={() => { setSearchTerm(''); setSelectedCategory('all'); }} />
          )}
        </div>
      </section>
    </>
  )
}

function FeaturedHorizontalCard({ product }) {
  return (
    <Link to={`/boutique/${product.slug}`} className="group flex-shrink-0 w-full sm:w-[400px] lg:w-[480px] mb-4">
      <div className="relative bg-cream-50 dark:bg-primary-900 rounded-3xl overflow-hidden shadow-xl shadow-black/15 dark:shadow-black/40">
        <div className="grid grid-cols-2">
          <div className="aspect-[3/4] overflow-hidden">
            <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
          <div className="p-6 flex flex-col justify-center">
            <p className="text-xs tracking-wider uppercase text-primary-600 dark:text-primary-400 mb-2">{product.category}</p>
            <h3 className="text-lg font-medium mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{product.title}</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-3 mb-4">{product.excerpt}</p>
            <div className="mt-auto">
              <p className="text-2xl font-light text-primary-600 dark:text-primary-400">{formatPrice(product.price)}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

function ThickCard({ product }) {
  return (
    <Link to={`/boutique/${product.slug}`} className="group">
      <div className="bg-cream-50 dark:bg-primary-950 rounded-2xl overflow-hidden border border-cream-200 dark:border-primary-800 transition-all duration-300 hover:shadow-xl hover:shadow-neutral-900/5 dark:hover:shadow-black/30 hover:-translate-y-1">
        <div className="aspect-[4/5] overflow-hidden">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="p-5">
          <p className="text-xs tracking-wider uppercase text-primary-600 dark:text-primary-400 mb-2">{product.category}</p>
          <h3 className="text-base font-medium mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">{product.title}</h3>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-cream-200 dark:border-neutral-800">
            <span className="text-lg font-medium text-primary-600 dark:text-primary-400">{formatPrice(product.price)}</span>
            <span className="text-xs text-neutral-600 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              Voir <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ============================================
   VARIANT 3: LIST DETAIL
   Vue liste avec descriptions completes
   ============================================ */
function ListDetailLayout({ products, categories, featured, selectedCategory, setSelectedCategory, searchTerm, setSearchTerm, loading }) {
  return (
    <>
      {/* Hero minimal */}
      <section className="bg-terracotta-warm text-white relative">
        <FloatingStars />
        <div className="container-custom py-16 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-semibold mb-6">La Boutique</h1>
            <p className="text-lg text-primary-100 mb-8">Decouvrez ma collection complete d'ouvrages et de creations</p>
            {/* Search bar centered */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type="text"
                placeholder="Rechercher dans ma collection..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-14 pl-12 pr-4 text-base text-white placeholder-white/60 bg-white/15 border border-white/25 rounded-2xl focus:bg-white/25 focus:border-white/50 outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories as pills */}
      <section className="sticky top-20 z-30 bg-cream-50/95 dark:bg-primary-950/95 backdrop-blur-sm border-b border-cream-200 dark:border-primary-800">
        <div className="container-custom py-4">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2 text-sm font-medium rounded-full border transition-all ${
                selectedCategory === 'all'
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'border-cream-400 dark:border-primary-800 hover:border-primary-400'
              }`}
              style={{ color: selectedCategory === 'all' ? undefined : '#1c1a17' }}
            >
              Tous
            </button>
            {(categories || []).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-5 py-2 text-sm font-medium rounded-full border transition-all ${
                  selectedCategory === cat.name
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'border-cream-400 dark:border-primary-800 hover:border-primary-400'
                }`}
                style={{ color: selectedCategory === cat.name ? undefined : '#1c1a17' }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* List view */}
      <section className="py-12">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {products.length} {products.length > 1 ? 'resultats' : 'resultat'}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
            </div>
          ) : products.length > 0 ? (
            <div className="space-y-6">
              {products.map((product, index) => (
                <ListCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <EmptyState onReset={() => { setSearchTerm(''); setSelectedCategory('all'); }} />
          )}
        </div>
      </section>
    </>
  )
}

function ListCard({ product, index }) {
  const isEven = index % 2 === 0

  return (
    <Link to={`/boutique/${product.slug}`} className="group block">
      <div className={`bg-cream-50 dark:bg-primary-950 rounded-2xl overflow-hidden border border-cream-200 dark:border-primary-800 hover:border-primary-300 dark:hover:border-primary-700 transition-all hover:shadow-xl ${isEven ? '' : 'lg:flex-row-reverse'}`}>
        <div className={`flex flex-col lg:flex-row ${isEven ? '' : 'lg:flex-row-reverse'}`}>
          {/* Image */}
          <div className="lg:w-80 xl:w-96 flex-shrink-0">
            <div className="aspect-[4/3] lg:aspect-auto lg:h-full overflow-hidden">
              <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 lg:p-8 flex flex-col justify-center">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-primary-600 dark:text-primary-400 mb-2">{product.category}</p>
                <h3 className="text-xl lg:text-2xl font-semibold lg:text-3xl font-light group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{product.title}</h3>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-2xl font-light text-primary-600 dark:text-primary-400">{formatPrice(product.price)}</p>
                {product.originalPrice && (
                  <p className="text-sm text-neutral-400 line-through">{formatPrice(product.originalPrice)}</p>
                )}
              </div>
            </div>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">{product.excerpt}</p>

            <div className="flex items-center gap-4 mt-auto">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:gap-3 transition-all">
                Decouvrir ce produit <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ============================================
   VARIANT 4: STORY TIMELINE
   Presentation narrative chronologique
   ============================================ */
function StoryTimelineLayout({ products, categories, featured, selectedCategory, setSelectedCategory, searchTerm, setSearchTerm, loading }) {
  // Trier par date de creation
  const sortedProducts = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <div className="pt-16">
      {/* Narrative Intro */}
      <section className="py-16 text-center">
        <div className="container-custom max-w-2xl">
          <h1 className="text-3xl lg:text-4xl font-semibold mb-6">Mon parcours litteraire</h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Chaque livre est une etape, une histoire dans mon voyage d'ecriture.
            Decouvrez mes ouvrages au fil du temps.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="sticky top-20 z-30 py-4 border-y border-cream-300 dark:border-neutral-800 bg-cream-50/95 dark:bg-primary-950/95 backdrop-blur-sm">
        <div className="container-custom flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              selectedCategory === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-cream-300 dark:bg-primary-900 hover:bg-cream-400 dark:hover:bg-primary-800'
            }`}
            style={{ color: selectedCategory === 'all' ? undefined : '#1c1a17' }}
          >
            Tout voir
          </button>
          {categories?.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                selectedCategory === cat.name
                  ? 'bg-primary-600 text-white'
                  : 'bg-cream-300 dark:bg-primary-900 hover:bg-cream-400 dark:hover:bg-primary-800'
              }`}
              style={{ color: selectedCategory === cat.name ? undefined : '#1c1a17' }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="container-custom max-w-4xl">
          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
            </div>
          ) : sortedProducts.length === 0 ? (
            <EmptyState onReset={() => { setSearchTerm(''); setSelectedCategory('all'); }} />
          ) : (
            <div className="relative">
              {/* Ligne centrale */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary-200 via-primary-400 to-primary-200 dark:from-primary-800 dark:via-primary-600 dark:to-primary-800 hidden md:block" />

              <div className="space-y-12">
                {sortedProducts.map((product, index) => (
                  <StoryCard key={product.id} product={product} position={index % 2 === 0 ? 'left' : 'right'} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function StoryCard({ product, position }) {
  const year = new Date(product.createdAt).getFullYear()

  return (
    <div className={`relative flex items-center gap-8 ${position === 'right' ? 'md:flex-row-reverse' : ''}`}>
      {/* Date marker */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-primary-600 text-white items-center justify-center font-bold text-sm z-10">
        {year}
      </div>

      {/* Content */}
      <Link
        to={`/boutique/${product.slug}`}
        className={`group flex-1 bg-cream-50 dark:bg-primary-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${
          position === 'right' ? 'md:mr-[calc(50%+2rem)]' : 'md:ml-[calc(50%+2rem)]'
        }`}
      >
        <div className="grid md:grid-cols-2">
          <div className="aspect-[4/3] md:aspect-auto overflow-hidden">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-6 flex flex-col justify-center">
            <span className="md:hidden text-xs text-primary-600 font-bold mb-2">{year}</span>
            <span className={`${product.categoryColor} text-white text-xs px-2 py-1 rounded w-fit mb-3`}>
              {product.category}
            </span>
            <h3 className="text-lg font-medium font-light mb-2 group-hover:text-primary-600 transition-colors">
              {product.title}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-4">
              {product.excerpt}
            </p>
            <span className="font-semibold">{formatPrice(product.price)}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}

/* ============================================
   VARIANT 5: HYBRID
   Hero compact + grille cards
   ============================================ */
function HybridLayout({ products, categories, featured, selectedCategory, setSelectedCategory, searchTerm, setSearchTerm, loading }) {
  return (
    <>
      {/* Compact Hero with Featured Product */}
      {featured && (
        <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
          <div className="absolute inset-0">
            <img src={featured.image} alt={featured.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/80 via-neutral-900/50 to-transparent" />
          </div>

          <div className="relative container-custom h-full flex items-center">
            <div className="max-w-2xl py-8">
              <span className={`${featured.categoryColor} text-white text-sm font-medium px-4 py-1.5 rounded-full inline-block mb-6`}>
                {featured.category}
              </span>
              <h1 className="text-4xl lg:text-6xl font-semibold text-white mb-6 leading-tight">
                {featured.title}
              </h1>
              <p className="text-lg text-neutral-200 mb-8 line-clamp-3 max-w-xl">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-4 mb-8">
                <span className="text-3xl font-light text-white">{formatPrice(featured.price)}</span>
                {featured.originalPrice && (
                  <span className="text-lg text-neutral-400 line-through">{formatPrice(featured.originalPrice)}</span>
                )}
              </div>
              <Link
                to={`/boutique/${featured.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-cream-50 text-neutral-900 font-medium rounded-full hover:bg-cream-100 transition-colors"
              >
                Decouvrir
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Filter Bar */}
      <section className="sticky top-20 z-30 bg-cream-50/95 dark:bg-primary-950/95 backdrop-blur-sm py-4 border-b border-cream-300 dark:border-primary-800">
        <div className="container-custom flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-cream-300 dark:bg-primary-900 hover:bg-cream-400 dark:hover:bg-primary-800'
              }`}
              style={{ color: selectedCategory === 'all' ? undefined : '#1c1a17' }}
            >
              Tous
            </button>
            {categories?.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.name
                    ? 'bg-primary-600 text-white'
                    : 'bg-cream-300 dark:bg-primary-900 hover:bg-cream-400 dark:hover:bg-primary-800'
                }`}
                style={{ color: selectedCategory === cat.name ? undefined : '#1c1a17' }}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 w-48 rounded-full border border-cream-300 dark:border-primary-800 bg-cream-50 dark:bg-primary-900 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>
      </section>

      {/* Products Grid - Cards Style */}
      <section className="py-12">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl lg:text-2xl font-semibold">Mes ouvrages</h2>
            <span className="text-sm text-neutral-600 dark:text-neutral-400">{products.length} produits</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ThickCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState onReset={() => { setSearchTerm(''); setSelectedCategory('all'); }} />
          )}
        </div>
      </section>
    </>
  )
}

/* ============================================
   SHARED COMPONENTS
   ============================================ */
function EmptyState({ onReset }) {
  return (
    <div className="text-center py-24">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cream-200 dark:bg-primary-900 flex items-center justify-center">
        <Search className="w-6 h-6 text-neutral-400" />
      </div>
      <p className="text-neutral-600 dark:text-neutral-400 mb-4">
        Aucun produit ne correspond a votre recherche.
      </p>
      <button
        onClick={onReset}
        className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:hover:text-primary-400 underline underline-offset-4 transition-colors"
      >
        Voir tous mes produits
      </button>
    </div>
  )
}
