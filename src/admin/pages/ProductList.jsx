import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Package,
  Filter
} from 'lucide-react'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

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

  const fetchProducts = async () => {
    if (!supabase) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:product_categories(id, name, slug, color)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFeatured = async (product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ featured: !product.featured })
        .eq('id', product.id)

      if (error) throw error
      fetchProducts()
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Erreur: ' + error.message)
    }
  }

  const toggleStock = async (product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ in_stock: !product.in_stock })
        .eq('id', product.id)

      if (error) throw error
      fetchProducts()
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Erreur: ' + error.message)
    }
  }

  const deleteProduct = async (product) => {
    if (!confirm(`Supprimer "${product.title}" ?`)) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id)

      if (error) throw error
      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Erreur: ' + error.message)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF'
    }).format(price / 100)
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase()) ||
      product.excerpt?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || product.category?.id === categoryFilter
    const matchesType = typeFilter === 'all' || product.product_type === typeFilter
    return matchesSearch && matchesCategory && matchesType
  })

  const productTypes = [
    { value: 'all', label: 'Tous les types' },
    { value: 'book', label: 'Livres' },
    { value: 'ebook', label: 'E-books' },
    { value: 'goodie', label: 'Goodies' }
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Boutique</h1>
          <p className="text-gray-600 mt-1">{products.length} produit(s)</p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={20} />
          Nouveau produit
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">Toutes les categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {productTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouve</h3>
          <p className="text-gray-500 mb-4">
            {search || categoryFilter !== 'all' || typeFilter !== 'all'
              ? 'Essayez de modifier vos filtres'
              : 'Commencez par ajouter votre premier produit'}
          </p>
          {!search && categoryFilter === 'all' && typeFilter === 'all' && (
            <Link
              to="/admin/products/new"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
            >
              <Plus size={20} />
              Ajouter un produit
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] bg-gray-100">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-300" />
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-2">
                  {product.featured && (
                    <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                      En vedette
                    </span>
                  )}
                  {!product.in_stock && (
                    <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                      Rupture
                    </span>
                  )}
                </div>

                {/* Category badge */}
                {product.category && (
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 ${product.category.color || 'bg-gray-400'} text-white text-xs font-medium rounded-full`}>
                      {product.category.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                  {product.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.original_price && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(product.original_price)}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 capitalize">
                    {product.product_type}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleFeatured(product)}
                    className={`p-2 rounded-lg transition-colors ${
                      product.featured
                        ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100'
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title={product.featured ? 'Retirer de la vedette' : 'Mettre en vedette'}
                  >
                    {product.featured ? <Star size={18} /> : <StarOff size={18} />}
                  </button>
                  <button
                    onClick={() => toggleStock(product)}
                    className={`p-2 rounded-lg transition-colors ${
                      product.in_stock
                        ? 'text-green-500 bg-green-50 hover:bg-green-100'
                        : 'text-red-500 bg-red-50 hover:bg-red-100'
                    }`}
                    title={product.in_stock ? 'Marquer en rupture' : 'Marquer en stock'}
                  >
                    {product.in_stock ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <Link
                    to={`/admin/products/${product.id}`}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    onClick={() => deleteProduct(product)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
