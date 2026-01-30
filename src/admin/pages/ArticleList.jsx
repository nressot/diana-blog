import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Star,
  MoreVertical,
  X
} from 'lucide-react'

const MAX_FEATURED = 2

export default function ArticleList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [articles, setArticles] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Modal pour choisir l'article a retirer de la vedette
  const [showFeaturedModal, setShowFeaturedModal] = useState(false)
  const [pendingFeaturedId, setPendingFeaturedId] = useState(null)

  useEffect(() => {
    fetchArticles()
    fetchCategories()
  }, [statusFilter, categoryFilter])

  const fetchArticles = async () => {
    if (!supabase) {
      setLoading(false)
      return
    }

    try {
      let query = supabase
        .from('articles')
        .select(`
          *,
          category:categories(id, name, color),
          author:authors(id, name)
        `)
        .order('created_at', { ascending: false })

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      if (categoryFilter !== 'all') {
        query = query.eq('category_id', categoryFilter)
      }

      const { data, error } = await query

      if (error) throw error
      setArticles(data || [])
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    if (!supabase) return

    const { data } = await supabase
      .from('categories')
      .select('id, name')
      .order('name')

    setCategories(data || [])
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet article ?')) return

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id)

      if (error) throw error
      setArticles(articles.filter(a => a.id !== id))
    } catch (error) {
      console.error('Error deleting article:', error)
      alert('Erreur lors de la suppression')
    }
  }

  // Obtenir les articles actuellement en vedette
  const featuredArticles = articles.filter(a => a.featured)

  const toggleFeatured = async (id, currentValue) => {
    try {
      // Si on desactive la vedette, pas de limite
      if (currentValue) {
        const { error } = await supabase
          .from('articles')
          .update({ featured: false })
          .eq('id', id)

        if (error) throw error

        setArticles(articles.map(a =>
          a.id === id ? { ...a, featured: false } : a
        ))
        return
      }

      // Si on active la vedette, verifier la limite
      if (featuredArticles.length >= MAX_FEATURED) {
        // Afficher le modal pour choisir quel article retirer
        setPendingFeaturedId(id)
        setShowFeaturedModal(true)
        return
      }

      // Sinon, activer directement
      const { error } = await supabase
        .from('articles')
        .update({ featured: true })
        .eq('id', id)

      if (error) throw error

      setArticles(articles.map(a =>
        a.id === id ? { ...a, featured: true } : a
      ))
    } catch (error) {
      console.error('Error updating article:', error)
    }
  }

  // Remplacer un article en vedette par un autre
  const replaceFeatured = async (articleToRemoveId) => {
    if (!pendingFeaturedId) return

    try {
      // Retirer l'ancien article de la vedette
      const { error: removeError } = await supabase
        .from('articles')
        .update({ featured: false })
        .eq('id', articleToRemoveId)

      if (removeError) throw removeError

      // Ajouter le nouvel article en vedette
      const { error: addError } = await supabase
        .from('articles')
        .update({ featured: true })
        .eq('id', pendingFeaturedId)

      if (addError) throw addError

      // Mettre a jour l'etat local
      setArticles(articles.map(a => {
        if (a.id === articleToRemoveId) return { ...a, featured: false }
        if (a.id === pendingFeaturedId) return { ...a, featured: true }
        return a
      }))

      // Fermer le modal
      setShowFeaturedModal(false)
      setPendingFeaturedId(null)
    } catch (error) {
      console.error('Error replacing featured article:', error)
    }
  }

  const cancelFeaturedModal = () => {
    setShowFeaturedModal(false)
    setPendingFeaturedId(null)
  }

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
          <p className="text-gray-600 mt-1">{articles.length} article(s)</p>
        </div>
        <Link
          to="/admin/articles/new"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={20} />
          Nouvel article
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="all">Tous les statuts</option>
          <option value="published">Publies</option>
          <option value="draft">Brouillons</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="all">Toutes categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredArticles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Article
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {article.image_url && (
                          <img
                            src={article.image_url}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">{article.title}</p>
                            {article.featured && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {article.excerpt}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {article.category && (
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${article.category.color} text-white`}>
                          {article.category.name}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${
                        article.status === 'published'
                          ? 'bg-green-600 text-white'
                          : 'bg-amber-500 text-white'
                      }`}>
                        {article.status === 'published' ? 'Publie' : 'Brouillon'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(article.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleFeatured(article.id, article.featured)}
                          className={`p-2 rounded-lg transition-colors ${
                            article.featured
                              ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                          title={article.featured ? 'Retirer de la une' : 'Mettre en une'}
                        >
                          <Star size={18} />
                        </button>
                        <Link
                          to={`/article/${article.slug}`}
                          target="_blank"
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Voir"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          to={`/admin/articles/${article.id}`}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>Aucun article trouve</p>
          </div>
        )}
      </div>

      {/* Modal pour choisir l'article a retirer de la vedette */}
      {showFeaturedModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Limite atteinte ({MAX_FEATURED} articles max)
              </h3>
              <button
                onClick={cancelFeaturedModal}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Vous avez deja {MAX_FEATURED} articles en vedette. Selectionnez celui a retirer pour ajouter le nouveau :
              </p>
              <div className="space-y-3">
                {featuredArticles.map(article => (
                  <button
                    key={article.id}
                    onClick={() => replaceFeatured(article.id)}
                    className="w-full flex items-center gap-4 p-3 rounded-lg border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-colors text-left"
                  >
                    {article.image_url && (
                      <img
                        src={article.image_url}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{article.title}</p>
                      <p className="text-sm text-gray-500 truncate">{article.excerpt}</p>
                    </div>
                    <Star className="w-5 h-5 text-yellow-500 fill-current flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={cancelFeaturedModal}
                className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
