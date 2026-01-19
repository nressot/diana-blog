import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Clock, MessageCircle, ArrowRight, BookOpen, Users, FileText } from 'lucide-react'
import CommunityBanner from '../components/CommunityBanner'
import { useArticles, useCategories } from '../lib/useArticles'

// Donnees simulees pour les discussions recentes
const recentDiscussions = [
  {
    id: 1,
    author: 'Marie L.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    comment: 'Ce texte m\'a profondement touchee, merci pour cette belle reflexion...',
    articleSlug: 'murmures-du-soir',
    articleTitle: 'Les murmures du soir'
  },
  {
    id: 2,
    author: 'Thomas B.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    comment: 'Votre poeme sur les saisons m\'a inspire pour ma propre ecriture.',
    articleSlug: 'poeme-saisons-ame',
    articleTitle: 'Les saisons de l\'ame'
  },
  {
    id: 3,
    author: 'Claire D.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    comment: 'J\'attends la suite avec impatience ! Le gardien est fascinant.',
    articleSlug: 'gardien-mots-oublies',
    articleTitle: 'Le gardien des mots oublies'
  }
]

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const { data: articles } = useArticles()
  const { data: categories } = useCategories()

  // Article featured pour le hero
  const featuredArticle = (articles || []).find(a => a.featured) || (articles || [])[0]

  // Filtrer les articles
  const filteredArticles = (articles || []).filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' ||
                           article.category.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  // Articles les plus commentes
  const mostCommented = [...(articles || [])]
    .sort((a, b) => (b.comments || 0) - (a.comments || 0))
    .slice(0, 3)

  // Stats du blog
  const totalArticles = (articles || []).length
  const totalComments = (articles || []).reduce((acc, a) => acc + (a.comments || 0), 0)

  return (
    <div className="min-h-screen">
      {/* Hero Section - Article Featured */}
      {featuredArticle && (
        <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
          <img
            src={featuredArticle.image}
            alt={featuredArticle.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />

          <div className="absolute inset-0 flex items-end">
            <div className="container-custom pb-10 lg:pb-14">
              <span className={`${featuredArticle.categoryColor || 'bg-neutral-500'} text-white text-xs font-medium px-3 py-1 rounded-full inline-block mb-4`}>
                {featuredArticle.category}
              </span>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 max-w-3xl">
                {featuredArticle.title}
              </h1>
              <p className="text-white/80 mb-5 max-w-2xl line-clamp-2 hidden sm:block">
                {featuredArticle.excerpt}
              </p>
              <Link
                to={`/article/${featuredArticle.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-full hover:bg-primary-700 transition-colors group"
              >
                Lire l'article
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Barre de filtres sticky */}
      <div className="sticky top-20 z-40 bg-cream-50/95 backdrop-blur-sm border-b border-neutral-200">
        <div className="container-custom py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide flex-1">
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

            {/* Recherche */}
            <div className="relative sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-full border border-neutral-200 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section principale */}
      <section className="py-10 lg:py-14">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-10 lg:gap-12">
            {/* Colonne articles - Visual Story */}
            <div className="lg:col-span-2">
              {filteredArticles.length > 0 ? (
                <div className="space-y-12">
                  {filteredArticles.map((article, index) => (
                    <Link
                      key={article.id}
                      to={`/article/${article.slug}`}
                      className={`group grid md:grid-cols-2 gap-6 items-center ${
                        index % 2 === 1 ? 'md:direction-rtl' : ''
                      }`}
                    >
                      {/* Image */}
                      <div className={`aspect-[4/3] rounded-2xl overflow-hidden img-zoom ${
                        index % 2 === 1 ? 'md:order-2' : ''
                      }`}>
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Contenu */}
                      <div className={index % 2 === 1 ? 'md:order-1 md:text-right' : ''}>
                        <span className="text-xs font-medium uppercase tracking-widest text-primary-600 mb-2 block">
                          {article.category}
                        </span>
                        <h2 className="text-2xl lg:text-3xl font-bold mb-3 group-hover:text-primary-600 transition-colors">
                          {article.title}
                        </h2>
                        <p className="text-neutral-600 mb-4 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className={`flex items-center gap-4 text-sm text-neutral-500 ${
                          index % 2 === 1 ? 'md:justify-end' : ''
                        }`}>
                          <span>{article.date}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {article.readTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {article.comments}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-cream-100 rounded-2xl">
                  <p className="text-neutral-500">
                    Aucun article trouve pour votre recherche.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-36 space-y-6">
                {/* Stats du blog */}
                <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 text-white">
                  <h3 className="font-semibold mb-4">Le blog en chiffres</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="text-2xl font-bold">{totalArticles}</div>
                      <div className="text-xs text-white/60">Articles</div>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <div className="text-2xl font-bold">{totalComments}</div>
                      <div className="text-xs text-white/60">Commentaires</div>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="text-2xl font-bold">847</div>
                      <div className="text-xs text-white/60">Membres</div>
                    </div>
                  </div>
                </div>

                {/* Discussions recentes */}
                <div className="bg-cream-100 rounded-2xl p-6 border border-neutral-200">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-primary-600" />
                    Discussions recentes
                  </h3>
                  <div className="space-y-4">
                    {recentDiscussions.map((discussion) => (
                      <Link
                        key={discussion.id}
                        to={`/article/${discussion.articleSlug}`}
                        className="flex gap-3 group"
                      >
                        <img
                          src={discussion.avatar}
                          alt={discussion.author}
                          className="w-10 h-10 rounded-full object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{discussion.author}</p>
                          <p className="text-xs text-neutral-500 line-clamp-2 mb-1">
                            {discussion.comment}
                          </p>
                          <p className="text-xs text-primary-600 group-hover:underline truncate">
                            {discussion.articleTitle}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Articles les plus commentes */}
                <div className="bg-cream-100 rounded-2xl p-6 border border-neutral-200">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary-600" />
                    Plus commentes
                  </h3>
                  <div className="space-y-3">
                    {mostCommented.map((article, index) => (
                      <Link
                        key={article.id}
                        to={`/article/${article.slug}`}
                        className="flex items-start gap-3 group"
                      >
                        <span className="text-2xl font-bold text-primary-600/30 leading-none">
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary-600 transition-colors">
                            {article.title}
                          </h4>
                          <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {article.comments} commentaires
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Categories avec compteurs */}
                <div className="bg-cream-100 rounded-2xl p-6 border border-neutral-200">
                  <h3 className="font-semibold mb-4">Categories</h3>
                  <div className="space-y-2">
                    {(categories || []).map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-colors ${
                          selectedCategory === category.name
                            ? 'bg-primary-100 text-primary-700'
                            : 'hover:bg-cream-200'
                        }`}
                      >
                        <span>{category.name}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs text-white ${category.color}`}>
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banniere Terracotta */}
      <CommunityBanner />
    </div>
  )
}
