import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Loader2, BookOpen, Feather, Users, Sparkles, PenTool, LayoutGrid } from 'lucide-react'
import ArticleCard from '../components/ArticleCard'
import CategoryCard from '../components/CategoryCard'
import AuthorCard from '../components/AuthorCard'
import { useArticles, useCategories } from '../lib/useArticles'

const BLOG_VARIANTS = [
  { id: 'editorial', name: 'Editorial Immersif', icon: BookOpen },
  { id: 'bento', name: 'Bento Grid', icon: Sparkles },
  { id: 'minimal', name: 'Reader-First', icon: Feather },
  { id: 'story', name: 'Visual Story', icon: PenTool },
  { id: 'community', name: 'Community Hub', icon: Users },
]

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Fetch depuis Sanity avec fallback vers donnees statiques
  const { data: articles, loading: loadingArticles } = useArticles()
  const { data: categories, loading: loadingCategories } = useCategories()

  const filteredArticles = (articles || []).filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' ||
                           article.category.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

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
              Explorez mes articles, réflexions et créations littéraires.
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
              {filteredArticles.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-neutral-500">
                    Aucun article trouve pour votre recherche.
                  </p>
                </div>
              )}

              {/* Pagination */}
              {filteredArticles.length > 0 && (
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
                    {(articles || [])
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

      {/* Floating Variant Selector */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-1 px-2 py-2 bg-white/95 backdrop-blur-lg rounded-full shadow-lg border border-neutral-200">
          <Link
            to="/blog"
            className="p-2.5 rounded-full bg-primary-600 text-white shadow-md"
            title="Version principale"
          >
            <LayoutGrid className="w-4 h-4" />
          </Link>
          {BLOG_VARIANTS.map((v) => (
            <Link
              key={v.id}
              to={`/blog-demo/${v.id}`}
              className="p-2.5 rounded-full text-neutral-500 hover:text-primary-600 hover:bg-cream-200 transition-all"
              title={v.name}
            >
              <v.icon className="w-4 h-4" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
