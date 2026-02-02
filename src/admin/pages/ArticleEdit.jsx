import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase, uploadImage } from '../../lib/supabase'
import { prepareForEditor } from '../../lib/contentConverter'
import { useAuth } from '../../context/AuthContext'
import RichTextEditor from '../components/RichTextEditor'
import ImageUpload from '../components/ImageUpload'
import {
  ArrowLeft,
  Save,
  Eye,
  Trash2,
  Image as ImageIcon
} from 'lucide-react'

export default function ArticleEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const isNew = id === 'new'

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState([])
  const [currentAuthor, setCurrentAuthor] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image_url: '',
    category_id: '',
    author_id: '',
    read_time: 5,
    featured: false,
    status: 'draft'
  })

  useEffect(() => {
    fetchCategories()
    if (!isNew) {
      fetchArticle()
    } else if (user) {
      // Pour un nouvel article, l'auteur est automatiquement l'utilisateur connecte
      setFormData(prev => ({ ...prev, author_id: user.id }))
      fetchAuthorInfo(user.id)
    }
  }, [id, user])

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          author:authors(id, name, avatar_url, role)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      if (data) {
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          excerpt: data.excerpt || '',
          content: prepareForEditor(data.content || ''),
          image_url: data.image_url || '',
          category_id: data.category_id || '',
          author_id: data.author_id || '',
          read_time: data.read_time || 5,
          featured: data.featured || false,
          status: data.status || 'draft'
        })
        // Recuperer les infos de l'auteur de l'article
        if (data.author) {
          setCurrentAuthor(data.author)
        } else if (data.author_id) {
          fetchAuthorInfo(data.author_id)
        }
      }
    } catch (error) {
      console.error('Error fetching article:', error)
      alert('Article non trouve')
      navigate('/admin/articles')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('id, name')
      .order('name')

    setCategories(data || [])
  }

  const fetchAuthorInfo = async (authorId) => {
    if (!authorId) return
    const { data } = await supabase
      .from('authors')
      .select('id, name, avatar_url, role')
      .eq('id', authorId)
      .single()

    if (data) {
      setCurrentAuthor(data)
    }
  }

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (e) => {
    const title = e.target.value
    setFormData(prev => ({
      ...prev,
      title,
      slug: isNew ? generateSlug(title) : prev.slug
    }))
  }

  const handleSubmit = async (e, publishNow = false) => {
    e?.preventDefault()
    setSaving(true)

    try {
      const dataToSave = {
        ...formData,
        status: publishNow ? 'published' : formData.status,
        published_at: publishNow ? new Date().toISOString() : formData.published_at
      }

      if (isNew) {
        const { data, error } = await supabase
          .from('articles')
          .insert([dataToSave])
          .select()
          .single()

        if (error) throw error
        navigate(`/admin/articles/${data.id}`)
      } else {
        const { error } = await supabase
          .from('articles')
          .update(dataToSave)
          .eq('id', id)

        if (error) throw error
      }

      alert(isNew ? 'Article cree !' : 'Article mis a jour !')
    } catch (error) {
      console.error('Error saving article:', error)
      alert('Erreur lors de la sauvegarde: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Supprimer cet article definitivement ?')) return

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id)

      if (error) throw error
      navigate('/admin/articles')
    } catch (error) {
      console.error('Error deleting article:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const handleImageUpload = async (file) => {
    try {
      const url = await uploadImage(file)
      setFormData(prev => ({ ...prev, image_url: url }))
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Erreur upload image')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/articles')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isNew ? 'Nouvel article' : 'Modifier l\'article'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {!isNew && (
            <>
              <a
                href={`/article/${formData.slug}`}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Eye size={18} />
                Voir
              </a>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 size={18} />
                Supprimer
              </button>
            </>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Top Section - Title & Metadata */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Title & Slug */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
                  placeholder="Titre de l'article"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                  placeholder="slug-de-l-article"
                  required
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Extrait
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 h-[132px]"
                placeholder="Court resume de l'article..."
              />
            </div>
          </div>
        </div>

        {/* Middle Section - Image + Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Section - Left Half */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-medium text-gray-900 mb-4">Image de couverture</h3>
            <ImageUpload
              currentImage={formData.image_url}
              onUpload={handleImageUpload}
              onRemove={() => setFormData(prev => ({ ...prev, image_url: '' }))}
            />
          </div>

          {/* Settings Grid - Right Half (2x2) */}
          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <label className="block text-xs font-medium text-gray-500 mb-2">Categorie</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              >
                <option value="">Aucune</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Author - Affiche l'auteur (admin connecte) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <label className="block text-xs font-medium text-gray-500 mb-2">Auteur</label>
              <div className="flex items-center gap-3">
                {currentAuthor?.avatar_url ? (
                  <img
                    src={currentAuthor.avatar_url}
                    alt={currentAuthor.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 text-sm font-medium">
                      {(currentAuthor?.name || profile?.display_name || 'A')[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-sm font-medium text-gray-900">
                  {currentAuthor?.name || profile?.display_name || 'Chargement...'}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <label className="block text-xs font-medium text-gray-500 mb-2">Statut</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publie</option>
              </select>
            </div>

            {/* En vedette */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <label className="block text-xs font-medium text-gray-500 mb-3">Mise en avant</label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  En vedette
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Content Section - Full Width */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Contenu de l'article
          </label>
          <RichTextEditor
            content={formData.content}
            onChange={(content) => setFormData(prev => ({ ...prev, content }))}
            onReadTimeChange={(readTime) => setFormData(prev => ({ ...prev, read_time: readTime }))}
          />
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="sticky bottom-4 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              {formData.status === 'draft' ? 'Brouillon' : 'Publie'}
            </div>
            <div className="flex items-center gap-3">
              {formData.status === 'draft' && (
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
                >
                  Publier maintenant
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 font-medium"
              >
                <Save size={18} />
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
