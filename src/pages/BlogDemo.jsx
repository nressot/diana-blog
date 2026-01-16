import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Search, ChevronLeft, ChevronRight, BookOpen, Feather, Users, Sparkles, PenTool, Loader2, ArrowRight, Clock, Eye, MessageCircle, UserPlus, Quote, BookMarked, Mail, Heart, LayoutGrid, Filter } from 'lucide-react'
import ArticleCard from '../components/ArticleCard'
import AuthorCard from '../components/AuthorCard'
import { useArticles, useCategories, useFeaturedArticles } from '../lib/useArticles'

/* SignupCTA Component - CTA pour inscription aux commentaires */
function SignupCTA({ variant = 'default', className = '' }) {
  if (variant === 'editorial') {
    return (
      <div className={`border-y border-neutral-200 py-12 my-16 ${className}`}>
        <div className="max-w-xl mx-auto text-center">
          <Mail className="w-8 h-8 text-primary-600 mx-auto mb-4" />
          <h3 className="text-2xl font-serif mb-3">Rejoignez les lecteurs</h3>
          <p className="text-neutral-600 mb-6 leading-relaxed">
            Inscrivez-vous pour commenter les articles et recevoir mes reflexions litteraires.
          </p>
          <a
            href="#inscription"
            className="inline-flex items-center gap-2 px-8 py-3 border border-neutral-900 text-neutral-900 font-medium hover:bg-neutral-900 hover:text-white transition-all"
          >
            S'inscrire gratuitement
          </a>
        </div>
      </div>
    )
  }

  if (variant === 'bento') {
    return (
      <div className={`bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-8 text-white flex flex-col justify-between ${className}`}>
        <div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
            <UserPlus className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Participez</h3>
          <p className="text-primary-100 text-sm leading-relaxed">
            Rejoignez la communaute pour commenter et echanger.
          </p>
        </div>
        <a
          href="#inscription"
          className="inline-flex items-center gap-2 mt-6 text-sm font-medium hover:gap-3 transition-all"
        >
          S'inscrire <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    )
  }

  if (variant === 'minimal') {
    return (
      <div className={`bg-cream-100 rounded-lg p-6 ${className}`}>
        <p className="text-sm text-neutral-600 mb-3">
          Envie de reagir?
        </p>
        <a
          href="#inscription"
          className="text-primary-600 font-medium hover:underline underline-offset-4"
        >
          Inscrivez-vous pour commenter
        </a>
      </div>
    )
  }

  if (variant === 'story') {
    return (
      <div className={`relative overflow-hidden rounded-3xl bg-primary-50 border border-primary-100 p-8 lg:p-12 ${className}`}>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-200 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-300 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-lg">
          <Feather className="w-10 h-10 text-primary-600 mb-6" />
          <h3 className="text-2xl lg:text-3xl font-semibold mb-4 text-neutral-900">Faites partie de l'histoire</h3>
          <p className="text-neutral-600 mb-8 leading-relaxed">
            Rejoignez ma communaute de lecteurs. Commentez, echangez, partagez vos reflexions sur mes ecrits.
          </p>
          <a
            href="#inscription"
            className="inline-flex items-center gap-3 px-6 py-3 border border-primary-600 text-primary-600 font-medium rounded-full hover:bg-primary-100 transition-colors"
          >
            Rejoindre la communaute
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    )
  }

  if (variant === 'community') {
    return (
      <div className={`bg-cream-50 border border-cream-200 rounded-2xl p-6 ${className}`}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold mb-1">Rejoignez la discussion</h4>
            <p className="text-sm text-neutral-600 mb-4">
              243 lecteurs participent deja aux echanges
            </p>
            <a
              href="#inscription"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-primary-600 text-primary-600 text-sm font-medium rounded-full hover:bg-primary-50 transition-colors"
            >
              S'inscrire gratuitement
            </a>
          </div>
        </div>
      </div>
    )
  }

  return null
}

/* Empty State Component */
function EmptyState({ onReset }) {
  return (
    <div className="text-center py-24">
      <BookOpen className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
      <p className="text-neutral-600 mb-4">
        Aucun article ne correspond a votre recherche.
      </p>
      <button
        onClick={onReset}
        className="text-sm font-medium text-primary-600 hover:underline underline-offset-4"
      >
        Voir tous les articles
      </button>
    </div>
  )
}

const VARIANTS = [
  { id: 'classic', name: 'Classique', description: 'Version principale', icon: LayoutGrid },
  { id: 'editorial', name: 'Editorial Immersif', description: 'Style magazine litteraire', icon: BookOpen },
  { id: 'bento', name: 'Bento Grid', description: 'Grille moderne Apple', icon: Sparkles },
  { id: 'minimal', name: 'Reader-First', description: 'Lisibilite maximale', icon: Feather },
  { id: 'story', name: 'Visual Story', description: 'Scrolling immersif', icon: PenTool },
  { id: 'community', name: 'Community Hub', description: 'Focus engagement', icon: Users },
]

export default function BlogDemo() {
  const { variant = 'classic' } = useParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const { data: articles, loading: loadingArticles } = useArticles()
  const { data: categories } = useCategories()
  const { data: featuredArticles } = useFeaturedArticles()

  const filteredArticles = (articles || []).filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === 'all' ||
      article.category.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const currentIndex = VARIANTS.findIndex(v => v.id === variant)
  const prevVariant = VARIANTS[currentIndex - 1]
  const nextVariant = VARIANTS[currentIndex + 1]

  const renderVariant = () => {
    const props = {
      articles: filteredArticles,
      allArticles: articles,
      categories,
      featuredArticles,
      selectedCategory,
      setSelectedCategory,
      searchTerm,
      setSearchTerm,
      loading: loadingArticles,
    }

    switch (variant) {
      case 'editorial':
        return <EditorialImmersifLayout {...props} />
      case 'bento':
        return <BentoGridLayout {...props} />
      case 'minimal':
        return <ReaderFirstLayout {...props} />
      case 'story':
        return <VisualStoryLayout {...props} />
      case 'community':
        return <CommunityHubLayout {...props} />
      default:
        return <ClassicLayout {...props} />
    }
  }

  return (
    <div className="min-h-screen">
      {/* Floating Variant Selector */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-cream-50/95 backdrop-blur-sm rounded-full shadow-lg border border-cream-300 px-2 py-2">
        <div className="flex items-center gap-1">
          {prevVariant && (
            <Link
              to={`/blog/${prevVariant.id}`}
              className="p-2 rounded-full text-neutral-400 hover:text-primary-600 hover:bg-cream-200 transition-all"
              title={prevVariant.name}
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}

          {VARIANTS.map((v) => (
            <Link
              key={v.id}
              to={`/blog/${v.id}`}
              className={`p-2.5 rounded-full transition-all ${
                v.id === variant
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-neutral-500 hover:text-primary-600 hover:bg-cream-200'
              }`}
              title={v.name}
            >
              <v.icon className="w-4 h-4" />
            </Link>
          ))}

          {nextVariant && (
            <Link
              to={`/blog/${nextVariant.id}`}
              className="p-2 rounded-full text-neutral-400 hover:text-primary-600 hover:bg-cream-200 transition-all"
              title={nextVariant.name}
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {renderVariant()}
    </div>
  )
}

/* ============================================
   VARIANT 1: EDITORIAL IMMERSIF
   Style magazine litteraire: New Yorker, Paris Review
   - Colonne unique centree, grandes marges
   - Drop caps, pull quotes, typographie soignee
   - Focus sur la lecture immersive
   ============================================ */
function EditorialImmersifLayout({ articles, allArticles, categories, featuredArticles, selectedCategory, setSelectedCategory, searchTerm, setSearchTerm, loading }) {
  const featured = featuredArticles?.[0]
  const recentArticles = articles.slice(0, 6)

  return (
    <div className="bg-cream-50">
      {/* Masthead */}
      <header className="border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-2">Le journal de</p>
          <h1 className="text-4xl lg:text-5xl font-serif font-medium tracking-tight">Diana</h1>
          <p className="mt-4 text-neutral-600 font-serif italic">
            Reflexions litteraires et carnets d'ecriture
          </p>
        </div>

        {/* Navigation categories - style journal */}
        <nav className="border-t border-neutral-200">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-center gap-8 py-4 overflow-x-auto">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`text-sm tracking-wide transition-colors whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'text-neutral-900 font-medium'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Tous les articles
              </button>
              {(categories || []).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`text-sm tracking-wide transition-colors whitespace-nowrap ${
                    selectedCategory === cat.name
                      ? 'text-neutral-900 font-medium'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Featured Article - Style editorial */}
      {featured && selectedCategory === 'all' && !searchTerm && (
        <article className="max-w-4xl mx-auto px-6 py-16 border-b border-neutral-200">
          <Link to={`/article/${featured.slug}`} className="group block">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-primary-600 mb-4">{featured.category}</p>
                <h2 className="text-3xl lg:text-4xl font-serif leading-tight mb-6 group-hover:text-primary-600 transition-colors">
                  {featured.title}
                </h2>
                <p className="text-lg text-neutral-600 leading-relaxed mb-6 font-serif">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-6 text-sm text-neutral-500">
                  <span>{featured.date}</span>
                  <span>{featured.readTime}</span>
                </div>
              </div>
            </div>
          </Link>
        </article>
      )}

      {/* Articles List - Style editorial simple */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
          </div>
        ) : recentArticles.length > 0 ? (
          <div className="space-y-16">
            {recentArticles.map((article, index) => (
              <article key={article.id} className="group">
                <Link to={`/article/${article.slug}`} className="block">
                  {index === 0 && (
                    <div className="aspect-[21/9] overflow-hidden mb-8">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="max-w-2xl">
                    <p className="text-xs tracking-[0.2em] uppercase text-primary-600 mb-3">{article.category}</p>
                    <h3 className="text-2xl lg:text-3xl font-serif leading-tight mb-4 group-hover:text-primary-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-neutral-600 leading-relaxed mb-4 font-serif">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-neutral-500">
                      <span>{article.date}</span>
                      <span className="w-1 h-1 rounded-full bg-neutral-300" />
                      <span>{article.readTime}</span>
                      <span className="w-1 h-1 rounded-full bg-neutral-300" />
                      <span>{article.comments} commentaires</span>
                    </div>
                  </div>
                </Link>
                {index === 2 && <SignupCTA variant="editorial" />}
              </article>
            ))}
          </div>
        ) : (
          <EmptyState onReset={() => { setSearchTerm(''); setSelectedCategory('all'); }} />
        )}
      </section>
    </div>
  )
}

/* ============================================
   VARIANT 2: BENTO GRID
   Style Apple/moderne: cards de tailles variees
   - Hierarchie visuelle claire
   - Mix de grandes et petites cards
   - Design epure et moderne
   ============================================ */
function BentoGridLayout({ articles, allArticles, categories, featuredArticles, selectedCategory, setSelectedCategory, searchTerm, setSearchTerm, loading }) {
  const featured = featuredArticles?.[0]
  const secondFeatured = featuredArticles?.[1]
  const regularArticles = articles.filter(a => a.id !== featured?.id && a.id !== secondFeatured?.id).slice(0, 6)

  return (
    <div className="bg-cream-100 min-h-screen">
      {/* Header compact */}
      <header className="bg-cream-50 border-b border-cream-200">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Le Blog</h1>
              <p className="text-sm text-neutral-500 mt-1">Explorez mes ecrits</p>
            </div>
            <div className="relative w-64 hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-4 text-sm bg-cream-100 border-0 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>

          {/* Categories pills */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto scrollbar-hide pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-cream-200 hover:bg-cream-300'
              }`}
            >
              Tous
            </button>
            {(categories || []).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                  selectedCategory === cat.name
                    ? 'bg-neutral-900 text-white'
                    : 'bg-cream-200 hover:bg-cream-300'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Bento Grid */}
      <section className="container-custom py-8">
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]">
            {/* Grande card featured - 2x2 */}
            {featured && (
              <Link
                to={`/article/${featured.slug}`}
                className="group md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden"
              >
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-end">
                  <span className={`${featured.categoryColor} text-white text-xs font-medium px-3 py-1 rounded-full w-fit mb-4`}>
                    {featured.category}
                  </span>
                  <h2 className="text-2xl lg:text-3xl font-semibold text-white mb-3 group-hover:text-primary-300 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-white/80 text-sm line-clamp-2 mb-4 hidden lg:block">{featured.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-white/70">
                    <span>{featured.readTime}</span>
                    <span>{featured.comments} commentaires</span>
                  </div>
                </div>
              </Link>
            )}

            {/* Card moyenne - 2x1 */}
            {secondFeatured && (
              <Link
                to={`/article/${secondFeatured.slug}`}
                className="group md:col-span-2 relative rounded-3xl overflow-hidden bg-cream-50"
              >
                <div className="absolute inset-0 flex">
                  <div className="w-2/5 h-full">
                    <img
                      src={secondFeatured.image}
                      alt={secondFeatured.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-center">
                    <span className="text-xs text-primary-600 font-medium mb-2">{secondFeatured.category}</span>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {secondFeatured.title}
                    </h3>
                    <p className="text-sm text-neutral-500 line-clamp-2">{secondFeatured.excerpt}</p>
                  </div>
                </div>
              </Link>
            )}

            {/* Cards regulieres */}
            {regularArticles.slice(0, 2).map((article) => (
              <Link
                key={article.id}
                to={`/article/${article.slug}`}
                className="group relative rounded-3xl overflow-hidden bg-cream-50 p-5 flex flex-col"
              >
                <span className={`${article.categoryColor} text-white text-xs font-medium px-2.5 py-1 rounded-full w-fit mb-3`}>
                  {article.category}
                </span>
                <h3 className="text-base font-semibold mb-2 group-hover:text-primary-600 transition-colors line-clamp-3 flex-1">
                  {article.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-neutral-500 mt-auto">
                  <span>{article.readTime}</span>
                </div>
              </Link>
            ))}

            {/* CTA Bento */}
            <SignupCTA variant="bento" className="row-span-2" />

            {/* Cards avec images */}
            {regularArticles.slice(2, 4).map((article) => (
              <Link
                key={article.id}
                to={`/article/${article.slug}`}
                className="group relative rounded-3xl overflow-hidden"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:text-primary-300 transition-colors">
                    {article.title}
                  </h3>
                </div>
              </Link>
            ))}

            {/* Stats card */}
            <div className="rounded-3xl bg-neutral-900 p-6 flex flex-col justify-between text-white">
              <BookMarked className="w-8 h-8 text-primary-400" />
              <div>
                <p className="text-3xl font-bold">{allArticles?.length || 0}</p>
                <p className="text-sm text-neutral-400">articles publies</p>
              </div>
            </div>

            {/* Derniers articles */}
            {regularArticles.slice(4, 6).map((article) => (
              <Link
                key={article.id}
                to={`/article/${article.slug}`}
                className="group rounded-3xl bg-cream-50 p-5 flex flex-col"
              >
                <h3 className="text-sm font-medium group-hover:text-primary-600 transition-colors line-clamp-3 flex-1">
                  {article.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-neutral-500 mt-3">
                  <span>{article.date}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState onReset={() => { setSearchTerm(''); setSelectedCategory('all'); }} />
        )}
      </section>
    </div>
  )
}

/* ============================================
   VARIANT 3: READER-FIRST MINIMAL
   Style Austin Kleon / Seth Godin
   - Blog comme homepage
   - Lisibilite maximale
   - Design ultra-epure
   ============================================ */
function ReaderFirstLayout({ articles, allArticles, categories, featuredArticles, selectedCategory, setSelectedCategory, searchTerm, setSearchTerm, loading }) {

  return (
    <div className="bg-cream-50 min-h-screen">
      {/* Header ultra-minimal */}
      <header className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-xl font-medium mb-2">Diana</h1>
        <p className="text-neutral-500 text-sm">Ecrivaine. Mes reflexions, au fil des jours.</p>
      </header>

      {/* Search & Filter - inline minimal */}
      <div className="max-w-2xl mx-auto px-6 mb-12">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-6 pr-4 text-sm bg-transparent border-b border-neutral-200 focus:border-neutral-900 outline-none transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`text-sm transition-colors whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'text-neutral-900 underline underline-offset-4'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Tous
            </button>
            {(categories || []).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`text-sm transition-colors whitespace-nowrap ${
                  selectedCategory === cat.name
                    ? 'text-neutral-900 underline underline-offset-4'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles - liste ultra simple */}
      <main className="max-w-2xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
          </div>
        ) : articles.length > 0 ? (
          <div className="space-y-12">
            {articles.map((article, index) => (
              <article key={article.id}>
                <Link to={`/article/${article.slug}`} className="group block">
                  <time className="text-xs text-neutral-500 uppercase tracking-wider">{article.date}</time>
                  <h2 className="text-xl lg:text-2xl font-medium mt-2 mb-3 group-hover:text-primary-600 transition-colors leading-snug">
                    {article.title}
                  </h2>
                  <p className="text-neutral-600 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-4 mt-4 text-sm text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {article.comments}
                    </span>
                  </div>
                </Link>

                {/* CTA apres 3 articles */}
                {index === 2 && (
                  <div className="mt-12 pt-12 border-t border-neutral-200">
                    <SignupCTA variant="minimal" />
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <EmptyState onReset={() => { setSearchTerm(''); setSelectedCategory('all'); }} />
        )}
      </main>
    </div>
  )
}

/* ============================================
   VARIANT 4: VISUAL STORY
   Style immersif avec scrolling
   - Full-bleed images
   - Storytelling visuel
   - Experience de lecture cinematique
   ============================================ */
function VisualStoryLayout({ articles, allArticles, categories, featuredArticles, selectedCategory, setSelectedCategory, searchTerm, setSearchTerm, loading }) {
  const featured = featuredArticles?.[0]

  return (
    <div className="bg-cream-50 min-h-screen">
      {/* Hero immersif plein ecran */}
      {featured && (
        <section className="relative h-screen flex items-end">
          <div className="absolute inset-0">
            <img
              src={featured.image}
              alt={featured.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
          </div>

          <div className="relative z-10 container-custom pb-24">
            <span className={`${featured.categoryColor} text-white text-sm font-medium px-4 py-1.5 rounded-full inline-block mb-6`}>
              {featured.category}
            </span>
            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-semibold max-w-4xl leading-tight mb-6 text-white">
              {featured.title}
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mb-8 leading-relaxed">
              {featured.excerpt}
            </p>
            <Link
              to={`/article/${featured.slug}`}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-neutral-900 font-medium rounded-full hover:bg-primary-100 transition-colors"
            >
              Lire l'article
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/70">
            <span className="text-xs uppercase tracking-widest">Defiler</span>
            <div className="w-px h-12 bg-gradient-to-b from-white/70 to-transparent" />
          </div>
        </section>
      )}

      {/* Filter bar sticky */}
      <section className="sticky top-20 z-30 bg-cream-50/95 backdrop-blur-sm border-b border-cream-200">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'text-neutral-900 font-medium'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Tous
              </button>
              {(categories || []).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`text-sm whitespace-nowrap transition-colors ${
                    selectedCategory === cat.name
                      ? 'text-neutral-900 font-medium'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 h-9 pl-10 pr-4 text-sm bg-cream-100 border-0 rounded-full text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Articles en mode story */}
      <section className="py-24">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
            </div>
          ) : articles.length > 0 ? (
            <div className="space-y-32">
              {articles.filter(a => a.id !== featured?.id).slice(0, 5).map((article, index) => (
                <article key={article.id} className="group">
                  <Link to={`/article/${article.slug}`} className="block">
                    <div className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                      <div className={`aspect-[4/3] overflow-hidden rounded-2xl ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className={index % 2 === 1 ? 'lg:col-start-1 lg:text-right' : ''}>
                        <span className="text-xs tracking-widest uppercase text-primary-600 mb-4 block">{article.category}</span>
                        <h2 className="text-3xl lg:text-4xl font-semibold mb-6 leading-tight text-neutral-900 group-hover:text-primary-600 transition-colors">
                          {article.title}
                        </h2>
                        <p className="text-neutral-600 text-lg leading-relaxed mb-6">
                          {article.excerpt}
                        </p>
                        <div className={`flex items-center gap-6 text-sm text-neutral-500 ${index % 2 === 1 ? 'lg:justify-end' : ''}`}>
                          <span>{article.date}</span>
                          <span>{article.readTime}</span>
                          <span>{article.comments} commentaires</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}

              {/* CTA Story */}
              <SignupCTA variant="story" />
            </div>
          ) : (
            <EmptyState onReset={() => { setSearchTerm(''); setSelectedCategory('all'); }} />
          )}
        </div>
      </section>
    </div>
  )
}

/* ============================================
   VARIANT 5: COMMUNITY HUB
   Focus sur l'engagement et la communaute
   - Commentaires mis en avant
   - Newsletter prominent
   - Interactions sociales
   ============================================ */
function CommunityHubLayout({ articles, allArticles, categories, featuredArticles, selectedCategory, setSelectedCategory, searchTerm, setSearchTerm, loading }) {
  const featured = featuredArticles?.[0]
  const popularByComments = [...(allArticles || [])].sort((a, b) => (b.comments || 0) - (a.comments || 0)).slice(0, 3)

  return (
    <div className="bg-cream-50 min-h-screen">
      {/* Header avec stats communaute */}
      <header className="bg-primary-600 text-white">
        <div className="container-custom py-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-semibold mb-2">Le Blog</h1>
              <p className="text-primary-100">Rejoignez la conversation litteraire</p>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold">{allArticles?.length || 0}</p>
                <p className="text-xs text-white/80 uppercase tracking-wider">Articles</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">
                  {(allArticles || []).reduce((sum, a) => sum + (a.comments || 0), 0)}
                </p>
                <p className="text-xs text-white/80 uppercase tracking-wider">Commentaires</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">243</p>
                <p className="text-xs text-white/80 uppercase tracking-wider">Membres</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Categories + Search */}
      <section className="sticky top-20 z-30 bg-cream-50/95 backdrop-blur-sm border-b border-cream-200">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-cream-200 hover:bg-cream-300'
                }`}
              >
                Tous
              </button>
              {(categories || []).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                    selectedCategory === cat.name
                      ? 'bg-primary-600 text-white'
                      : 'bg-cream-200 hover:bg-cream-300'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-56 h-10 pl-10 pr-4 text-sm bg-cream-100 border-0 rounded-full focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container-custom py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex justify-center py-24">
                <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
              </div>
            ) : articles.length > 0 ? (
              <div className="space-y-6">
                {articles.map((article) => (
                  <article key={article.id} className="group bg-cream-50 rounded-2xl overflow-hidden border border-cream-200 hover:border-primary-300 transition-all">
                    <Link to={`/article/${article.slug}`} className="block">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-48 lg:w-56 shrink-0">
                          <div className="aspect-[16/10] sm:aspect-auto sm:h-full overflow-hidden">
                            <img
                              src={article.image}
                              alt={article.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        </div>
                        <div className="flex-1 p-5">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`${article.categoryColor} text-white text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                              {article.category}
                            </span>
                            <span className="text-xs text-neutral-500">{article.date}</span>
                          </div>
                          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-sm text-neutral-600 line-clamp-2 mb-4">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-neutral-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {article.readTime}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5" />
                                {article.views}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-primary-600">
                              <MessageCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">{article.comments}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState onReset={() => { setSearchTerm(''); setSelectedCategory('all'); }} />
            )}
          </div>

          {/* Sidebar communaute */}
          <div className="space-y-6">
            {/* CTA inscription */}
            <SignupCTA variant="community" />

            {/* Articles les plus commentes */}
            <div className="bg-cream-50 rounded-2xl p-6 border border-cream-200">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-5 h-5 text-primary-600" />
                <h3 className="font-semibold">Les plus commentes</h3>
              </div>
              <div className="space-y-4">
                {popularByComments.map((article, index) => (
                  <Link
                    key={article.id}
                    to={`/article/${article.slug}`}
                    className="group flex items-start gap-3"
                  >
                    <span className="text-2xl font-bold text-primary-600/30 shrink-0 w-6">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-xs text-neutral-500 mt-1">
                        {article.comments} commentaires
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent comments preview */}
            <div className="bg-cream-50 rounded-2xl p-6 border border-cream-200">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary-600" />
                <h3 className="font-semibold">Discussions recentes</h3>
              </div>
              <div className="space-y-4">
                {/* Simulated recent comments */}
                {[
                  { user: 'Marie L.', text: 'Magnifique reflexion sur...', article: 'La poesie du quotidien' },
                  { user: 'Thomas B.', text: 'Je suis completement d\'accord avec...', article: 'Ecrire en silence' },
                  { user: 'Claire D.', text: 'Cela me rappelle une lecture...', article: 'Les mots voyageurs' },
                ].map((comment, index) => (
                  <div key={index} className="pb-4 border-b border-cream-200 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary-600">{comment.user[0]}</span>
                      </div>
                      <span className="text-sm font-medium">{comment.user}</span>
                    </div>
                    <p className="text-sm text-neutral-600 line-clamp-2 ml-8">
                      "{comment.text}"
                    </p>
                    <p className="text-xs text-neutral-400 mt-1 ml-8">
                      sur {comment.article}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Author card */}
            <AuthorCard variant="sidebar" />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================
   VARIANT 0: CLASSIC
   Version originale du blog
   - Hero avec recherche
   - Filtres par categorie
   - Grille articles + sidebar
   ============================================ */
function ClassicLayout({ articles, allArticles, categories, featuredArticles, selectedCategory, setSelectedCategory, searchTerm, setSearchTerm, loading }) {

  return (
    <div>
      {/* Hero Section */}
      <section className="py-8 lg:py-10 bg-gradient-to-b from-cream-200 to-transparent">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-semibold mb-6">
              Le Blog
            </h1>
            <p className="text-lg text-neutral-600 mb-8">
              Explorez mes articles, reflexions et creations litteraires.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-full border border-neutral-200 bg-cream-50 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 border-b border-neutral-200">
        <div className="container-custom">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex items-center gap-2 text-sm text-neutral-500 shrink-0">
              <Filter className="w-4 h-4" />
              Filtrer:
            </div>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-cream-200 hover:bg-cream-300'
              }`}
            >
              Tous
            </button>
            {(categories || []).map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.name
                    ? 'bg-neutral-900 text-white'
                    : 'bg-cream-200 hover:bg-cream-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-8 lg:py-10">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {loading ? (
                <div className="flex justify-center py-24">
                  <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                </div>
              ) : articles.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <EmptyState onReset={() => { setSearchTerm(''); setSelectedCategory('all'); }} />
              )}

              {/* Pagination */}
              {articles.length > 0 && (
                <div className="flex justify-center mt-12">
                  <div className="flex items-center gap-2">
                    <button className="w-10 h-10 rounded-full bg-neutral-900 text-white font-medium">
                      1
                    </button>
                    <button className="w-10 h-10 rounded-full hover:bg-cream-300 font-medium transition-colors">
                      2
                    </button>
                    <button className="w-10 h-10 rounded-full hover:bg-cream-300 font-medium transition-colors">
                      3
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-8">
                {/* Author Card */}
                <AuthorCard variant="sidebar" />

                {/* Categories */}
                <div className="bg-cream-200 rounded-2xl p-6 border border-neutral-200">
                  <h3 className="font-semibold mb-4">Categories</h3>
                  <div className="space-y-2">
                    {(categories || []).map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-colors ${
                          selectedCategory === category.name
                            ? 'bg-primary-100 text-primary-700'
                            : 'hover:bg-cream-300'
                        }`}
                      >
                        <span>{category.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${category.color} text-white`}>
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Articles */}
                <div className="bg-cream-200 rounded-2xl p-6 border border-neutral-200">
                  <h3 className="font-semibold mb-4">Articles populaires</h3>
                  <div className="space-y-4">
                    {(allArticles || [])
                      .slice()
                      .sort((a, b) => (b.views || 0) - (a.views || 0))
                      .slice(0, 4)
                      .map((article) => (
                        <ArticleCard key={article.id} article={article} variant="horizontal" />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
