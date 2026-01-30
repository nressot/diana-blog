import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react'

// Couleurs pastelles
const colorOptions = [
  // Roses & Rouges
  { value: 'bg-rose-200', label: 'Rose clair' },
  { value: 'bg-rose-300', label: 'Rose' },
  { value: 'bg-pink-200', label: 'Pink clair' },
  { value: 'bg-pink-300', label: 'Pink' },
  { value: 'bg-red-200', label: 'Rouge clair' },

  // Violets & Pourpres
  { value: 'bg-fuchsia-200', label: 'Fuchsia clair' },
  { value: 'bg-fuchsia-300', label: 'Fuchsia' },
  { value: 'bg-purple-200', label: 'Pourpre clair' },
  { value: 'bg-purple-300', label: 'Pourpre' },
  { value: 'bg-violet-200', label: 'Violet clair' },
  { value: 'bg-violet-300', label: 'Violet' },

  // Bleus
  { value: 'bg-indigo-200', label: 'Indigo clair' },
  { value: 'bg-indigo-300', label: 'Indigo' },
  { value: 'bg-blue-200', label: 'Bleu clair' },
  { value: 'bg-blue-300', label: 'Bleu' },
  { value: 'bg-sky-200', label: 'Ciel clair' },
  { value: 'bg-sky-300', label: 'Ciel' },
  { value: 'bg-cyan-200', label: 'Cyan clair' },
  { value: 'bg-cyan-300', label: 'Cyan' },

  // Verts
  { value: 'bg-teal-200', label: 'Turquoise clair' },
  { value: 'bg-teal-300', label: 'Turquoise' },
  { value: 'bg-emerald-200', label: 'Emeraude clair' },
  { value: 'bg-emerald-300', label: 'Emeraude' },
  { value: 'bg-green-200', label: 'Vert clair' },
  { value: 'bg-green-300', label: 'Vert' },
  { value: 'bg-lime-200', label: 'Lime clair' },
  { value: 'bg-lime-300', label: 'Lime' },

  // Jaunes & Oranges
  { value: 'bg-yellow-200', label: 'Jaune clair' },
  { value: 'bg-yellow-300', label: 'Jaune' },
  { value: 'bg-amber-200', label: 'Ambre clair' },
  { value: 'bg-amber-300', label: 'Ambre' },
  { value: 'bg-orange-200', label: 'Orange clair' },
  { value: 'bg-orange-300', label: 'Orange' },

  // Neutres
  { value: 'bg-stone-200', label: 'Pierre' },
  { value: 'bg-stone-300', label: 'Pierre fonce' },
  { value: 'bg-gray-200', label: 'Gris clair' },
  { value: 'bg-gray-300', label: 'Gris' },
  { value: 'bg-slate-200', label: 'Ardoise clair' },
  { value: 'bg-slate-300', label: 'Ardoise' }
]

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [isCreating, setIsCreating] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    color: 'bg-gray-200',
    description: ''
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    if (!supabase) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*, articles(count)')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (e) => {
    const name = e.target.value
    setFormData(prev => ({
      ...prev,
      name,
      slug: isCreating ? generateSlug(name) : prev.slug
    }))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      color: 'bg-gray-200',
      description: ''
    })
    setEditingId(null)
    setIsCreating(false)
  }

  const startEdit = (category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      color: category.color,
      description: category.description || ''
    })
    setEditingId(category.id)
    setIsCreating(false)
  }

  const startCreate = () => {
    resetForm()
    setIsCreating(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (isCreating) {
        const { error } = await supabase
          .from('categories')
          .insert([formData])

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('categories')
          .update(formData)
          .eq('id', editingId)

        if (error) throw error
      }

      resetForm()
      fetchCategories()
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Erreur: ' + error.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette categorie ?')) return

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Erreur lors de la suppression')
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">{categories.length} categorie(s)</p>
        </div>
        {!isCreating && !editingId && (
          <button
            onClick={startCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus size={20} />
            Nouvelle categorie
          </button>
        )}
      </div>

      {/* Form */}
      {(isCreating || editingId) && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {isCreating ? 'Nouvelle categorie' : 'Modifier la categorie'}
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Couleur
              </label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                    className={`w-8 h-8 rounded-full ${color.value} ${
                      formData.color === color.value
                        ? 'ring-2 ring-offset-2 ring-primary-500'
                        : ''
                    }`}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Save size={18} />
              Sauvegarder
            </button>
          </div>
        </form>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {categories.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <span className={`w-4 h-4 rounded-full ${category.color}`} />
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-500">
                      {category.description || 'Pas de description'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    {category.articles?.[0]?.count || 0} article(s)
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEdit(category)}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>Aucune categorie</p>
          </div>
        )}
      </div>
    </div>
  )
}
