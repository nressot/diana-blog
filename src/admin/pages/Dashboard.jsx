import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import {
  FileText,
  FolderOpen,
  MessageSquare,
  Plus,
  ShoppingBag,
  BookOpen
} from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    articles: 0,
    categories: 0,
    comments: 0,
    sales: 0
  })
  const [recentArticles, setRecentArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    if (!supabase) {
      setLoading(false)
      return
    }

    try {
      // Fetch stats in parallel
      const [
        { count: articlesCount },
        { count: categoriesCount },
        { count: commentsCount },
        { data: articles }
      ] = await Promise.all([
        supabase.from('articles').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('comments').select('*', { count: 'exact', head: true }),
        supabase.from('articles').select('id, title, slug, status, created_at').order('created_at', { ascending: false }).limit(5)
      ])

      // Fetch sales count (from orders table if exists)
      let salesCount = 0
      try {
        const { count } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'completed')
        salesCount = count || 0
      } catch {
        // Orders table may not exist yet
        salesCount = 0
      }

      setStats({
        articles: articlesCount || 0,
        categories: categoriesCount || 0,
        comments: commentsCount || 0,
        sales: salesCount
      })

      setRecentArticles(articles || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      name: 'Articles',
      value: stats.articles,
      icon: FileText,
      href: '/admin/articles'
    },
    {
      name: 'Categories',
      value: stats.categories,
      icon: FolderOpen,
      href: '/admin/categories'
    },
    {
      name: 'Commentaires',
      value: stats.comments,
      icon: MessageSquare,
      href: '/admin/comments'
    },
    {
      name: 'Ventes',
      value: stats.sales,
      icon: ShoppingBag,
      href: '/admin/orders'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Bienvenue dans votre espace d'administration</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/book"
            className="flex items-center gap-2 px-4 py-2 border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors"
          >
            <BookOpen size={20} />
            Mon dernier livre
          </Link>
          <Link
            to="/admin/articles/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus size={20} />
            Nouvel article
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link
            key={stat.name}
            to={stat.href}
            className="group bg-gradient-to-br from-cream-200 to-cream-100 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 hover:border-primary-500 dark:hover:border-primary-500 card-hover cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
                <stat.icon className="w-7 h-7 text-primary-600 dark:text-primary-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">{stat.value}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{stat.name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Articles */}
      <div className="bg-cream-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="p-5 bg-primary-600 dark:bg-primary-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-white">Articles recents</h2>
            </div>
            <Link
              to="/admin/articles"
              className="text-sm text-white/80 hover:text-white font-medium transition-colors"
            >
              Voir tous
            </Link>
          </div>
        </div>

        {recentArticles.length > 0 ? (
          <div className="divide-y divide-neutral-200/70 dark:divide-neutral-800">
            {recentArticles.map((article) => (
              <Link
                key={article.id}
                to={`/admin/articles/${article.id}`}
                className="flex items-center justify-between p-5 hover:bg-cream-200 dark:hover:bg-neutral-800/50 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-neutral-900 group-hover:text-primary-600 transition-colors truncate">
                    {article.title}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    {new Date(article.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <span className={`ml-4 px-3 py-1.5 rounded-full text-xs font-semibold ${
                  article.status === 'published'
                    ? 'bg-green-600 text-white'
                    : 'bg-amber-500 text-white'
                }`}>
                  {article.status === 'published' ? 'Publie' : 'Brouillon'}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-neutral-400" />
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">Aucun article pour le moment</p>
            <Link
              to="/admin/articles/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              <Plus size={16} />
              Creer votre premier article
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
