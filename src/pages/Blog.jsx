import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Clock, MessageCircle, ArrowRight, BookOpen, Users, FileText } from 'lucide-react'
import CommunityBanner from '../components/CommunityBanner'
import { useSupabaseArticles, useSupabaseCategories, useSupabaseFeaturedArticle } from '../lib/useSupabaseArticles'
import { useRecentComments } from '../lib/useSupabaseComments'
import { getAvatarColor, getInitials } from '../lib/avatarUtils'

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const { data: articles } = useSupabaseArticles()
  const { data: categories } = useSupabaseCategories()
  const { data: featuredArticles, loading: featuredLoading } = useSupabaseFeaturedArticle()
  const { comments: recentDiscussions, loading: discussionsLoading } = useRecentComments(3)

  // Article featured pour le hero (utilise l'article en vedette de Supabase)
  // Ne pas utiliser de fallback pendant le chargement
  const featuredArticle = featuredArticles?.[0]

  // Debug
  console.log('Blog - featuredArticles:', featuredArticles)
  console.log('Blog - featuredArticle:', featuredArticle?.title)
  console.log('Blog - loading:', featuredLoading)

  // Filtrer les articles
  const filteredArticles = (articles || []).filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (article.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase())
    const categoryName = article.category || ''
    const matchesCategory = selectedCategory === 'all' ||
                           categoryName.toLowerCase() === selectedCategory.toLowerCase()
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
    <div className="min-h-screen bg-cream-200">
      {/* Hero avec article featured et stats */}
      {featuredArticle && (
        <section className="relative h-[50vh] min-h-[400px] overflow-hidden group">
          <img
            src={featuredArticle.image}
            alt={featuredArticle.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="container-custom pb-10 lg:pb-14">
              {/* Stats superposees */}
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2 text-white/80">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm font-medium">{totalArticles} articles</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">{totalComments} commentaires</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">847 membres</span>
                </div>
              </div>
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
      <section className="sticky top-20 z-30 bg-cream-200/95 backdrop-blur-sm border-b border-cream-300">
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
                className="w-56 h-10 pl-10 pr-4 text-sm bg-white border-0 rounded-full focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>
        </div>
      </section>

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
                  {discussionsLoading ? (
                    <div className="text-center py-4">
                      <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                  ) : recentDiscussions.length === 0 ? (
                    <div className="text-center py-6">
                      <MessageCircle className="w-10 h-10 mx-auto mb-3 text-neutral-300" />
                      <p className="text-sm text-neutral-500">Aucune discussion pour le moment</p>
                      <p className="text-xs text-neutral-400 mt-1">Soyez le premier a commenter !</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentDiscussions.map((discussion) => (
                        <Link
                          key={discussion.id}
                          to={`/article/${discussion.articleSlug}`}
                          className="flex gap-3 group"
                        >
                          {discussion.avatar ? (
                            <img
                              src={discussion.avatar}
                              alt={discussion.author}
                              className="w-10 h-10 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className={`w-10 h-10 rounded-full ${getAvatarColor(discussion.author)} flex items-center justify-center text-white font-medium text-sm shrink-0`}>
                              {getInitials(discussion.author)}
                            </div>
                          )}
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
                  )}
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
