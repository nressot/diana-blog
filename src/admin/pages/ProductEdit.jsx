import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import {
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  Image,
  Package
} from 'lucide-react'

const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function ProductEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState([])
  const [product, setProduct] = useState({
    title: '',
    slug: '',
    excerpt: '',
    description: '',
    image: '',
    images: [],
    category_id: '',
    price: 0,
    original_price: null,
    featured: false,
    in_stock: true,
    product_type: 'book',
    book_meta: {
      isbn: '',
      pages: '',
      format: '',
      publisher: '',
      publicationDate: '',
      language: 'Francais',
      readingTime: '',
      genres: []
    },
    series: null,
    excerpt_text: '',
    formats: []
  })

  useEffect(() => {
    fetchCategories()
    if (!isNew) {
      fetchProduct()
    }
  }, [id])

  const fetchCategories = async () => {
    if (!supabase) return

    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchProduct = async () => {
    if (!supabase) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (data) {
        setProduct({
          ...data,
          book_meta: data.book_meta || {
            isbn: '',
            pages: '',
            format: '',
            publisher: '',
            publicationDate: '',
            language: 'Francais',
            readingTime: '',
            genres: []
          },
          images: data.images || [],
          formats: data.formats || []
        })
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      alert('Produit non trouve')
      navigate('/admin/products')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setProduct(prev => {
      const updated = { ...prev, [field]: value }

      // Auto-generate slug from title
      if (field === 'title' && (isNew || !prev.slug)) {
        updated.slug = slugify(value)
      }

      return updated
    })
  }

  const handleBookMetaChange = (field, value) => {
    setProduct(prev => ({
      ...prev,
      book_meta: {
        ...prev.book_meta,
        [field]: value
      }
    }))
  }

  const handleGenresChange = (value) => {
    const genres = value.split(',').map(g => g.trim()).filter(Boolean)
    handleBookMetaChange('genres', genres)
  }

  const addFormat = () => {
    setProduct(prev => ({
      ...prev,
      formats: [
        ...prev.formats,
        { id: Date.now().toString(), label: '', formatType: 'paperback', price: 0, originalPrice: null, inStock: true }
      ]
    }))
  }

  const updateFormat = (index, field, value) => {
    setProduct(prev => {
      const formats = [...prev.formats]
      formats[index] = { ...formats[index], [field]: value }
      return { ...prev, formats }
    })
  }

  const removeFormat = (index) => {
    setProduct(prev => ({
      ...prev,
      formats: prev.formats.filter((_, i) => i !== index)
    }))
  }

  const addImage = () => {
    const url = prompt('URL de l\'image:')
    if (url) {
      setProduct(prev => ({
        ...prev,
        images: [...prev.images, url]
      }))
    }
  }

  const removeImage = (index) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const productData = {
        ...product,
        price: parseInt(product.price) || 0,
        original_price: product.original_price ? parseInt(product.original_price) : null,
        category_id: product.category_id || null,
        book_meta: product.product_type === 'goodie' ? null : product.book_meta,
        updated_at: new Date().toISOString()
      }

      if (isNew) {
        delete productData.id
        const { error } = await supabase
          .from('products')
          .insert(productData)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', id)

        if (error) throw error
      }

      alert('Produit sauvegarde !')
      navigate('/admin/products')
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Erreur: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Supprimer ce produit ?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      navigate('/admin/products')
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Erreur: ' + error.message)
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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/products')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isNew ? 'Nouveau produit' : 'Modifier le produit'}
            </h1>
          </div>
        </div>

        {!isNew && (
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={20} />
            Supprimer
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations de base</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
              <input
                type="text"
                value={product.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input
                type="text"
                value={product.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de produit</label>
              <select
                value={product.product_type}
                onChange={(e) => handleChange('product_type', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="book">Livre</option>
                <option value="ebook">E-book</option>
                <option value="goodie">Goodie</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categorie</label>
              <select
                value={product.category_id || ''}
                onChange={(e) => handleChange('category_id', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">-- Selectionner --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (centimes) *</label>
              <input
                type="number"
                value={product.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="1990 = 19.90 CHF"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix barre (centimes)</label>
              <input
                type="number"
                value={product.original_price || ''}
                onChange={(e) => handleChange('original_price', e.target.value || null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="2490 = 24.90 CHF"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Extrait</label>
              <textarea
                value={product.excerpt || ''}
                onChange={(e) => handleChange('excerpt', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Description courte pour les listes"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description complete</label>
              <textarea
                value={product.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Description detaillee du produit"
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={product.featured}
                  onChange={(e) => handleChange('featured', e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">En vedette</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={product.in_stock}
                  onChange={(e) => handleChange('in_stock', e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">En stock</span>
              </label>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image principale</label>
              <input
                type="text"
                value={product.image || ''}
                onChange={(e) => handleChange('image', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="https://..."
              />
            </div>

            {product.image && (
              <img
                src={product.image}
                alt="Preview"
                className="w-32 h-40 object-cover rounded-lg"
              />
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Images supplementaires</label>
              <div className="flex flex-wrap gap-3">
                {product.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Image ${index + 1}`}
                      className="w-24 h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImage}
                  className="w-24 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-primary-500 hover:text-primary-500 transition-colors"
                >
                  <Image size={24} />
                  <span className="text-xs mt-1">Ajouter</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Book Meta (only for books and ebooks) */}
        {product.product_type !== 'goodie' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations livre</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                <input
                  type="text"
                  value={product.book_meta?.isbn || ''}
                  onChange={(e) => handleBookMetaChange('isbn', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pages</label>
                <input
                  type="number"
                  value={product.book_meta?.pages || ''}
                  onChange={(e) => handleBookMetaChange('pages', parseInt(e.target.value) || '')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                <input
                  type="text"
                  value={product.book_meta?.format || ''}
                  onChange={(e) => handleBookMetaChange('format', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="14x21cm, broche"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Editeur</label>
                <input
                  type="text"
                  value={product.book_meta?.publisher || ''}
                  onChange={(e) => handleBookMetaChange('publisher', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de publication</label>
                <input
                  type="date"
                  value={product.book_meta?.publicationDate || ''}
                  onChange={(e) => handleBookMetaChange('publicationDate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temps de lecture (min)</label>
                <input
                  type="number"
                  value={product.book_meta?.readingTime || ''}
                  onChange={(e) => handleBookMetaChange('readingTime', parseInt(e.target.value) || '')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Genres (separes par virgule)</label>
                <input
                  type="text"
                  value={product.book_meta?.genres?.join(', ') || ''}
                  onChange={(e) => handleGenresChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Roman, Fantastique, Jeune adulte"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Extrait texte</label>
                <textarea
                  value={product.excerpt_text || ''}
                  onChange={(e) => handleChange('excerpt_text', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Premier paragraphe du livre..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Formats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Formats disponibles</h2>
            <button
              type="button"
              onClick={addFormat}
              className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
            >
              <Plus size={16} />
              Ajouter un format
            </button>
          </div>

          {product.formats.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucun format defini. Cliquez sur "Ajouter un format" pour commencer.</p>
          ) : (
            <div className="space-y-4">
              {product.formats.map((format, index) => (
                <div key={format.id || index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-500">Format {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeFormat(index)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Label</label>
                      <input
                        type="text"
                        value={format.label || ''}
                        onChange={(e) => updateFormat(index, 'label', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Papier, Numerique..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Type</label>
                      <select
                        value={format.formatType || 'paperback'}
                        onChange={(e) => updateFormat(index, 'formatType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="paperback">Broche</option>
                        <option value="hardcover">Relie</option>
                        <option value="ebook">E-book</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Prix (centimes)</label>
                      <input
                        type="number"
                        value={format.price || 0}
                        onChange={(e) => updateFormat(index, 'price', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={format.inStock !== false}
                          onChange={(e) => updateFormat(index, 'inStock', e.target.checked)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">En stock</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </form>
    </div>
  )
}
