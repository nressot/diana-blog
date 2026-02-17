import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Package, Save, AlertTriangle, CheckCircle, Search, RefreshCw } from 'lucide-react'

export default function StockManagement() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [changes, setChanges] = useState({})
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    if (!supabase) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, title, slug, image, in_stock, formats, product_type')
        .order('title')

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStockChange = (productId, formatIndex, field, value) => {
    setChanges(prev => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {}),
        [formatIndex]: {
          ...(prev[productId]?.[formatIndex] || {}),
          [field]: value
        }
      }
    }))
    setSaveSuccess(false)
  }

  const handleGlobalStockChange = (productId, inStock) => {
    setChanges(prev => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {}),
        globalInStock: inStock
      }
    }))
    setSaveSuccess(false)
  }

  const getEffectiveValue = (product, formatIndex, field) => {
    const change = changes[product.id]?.[formatIndex]?.[field]
    if (change !== undefined) return change

    const format = product.formats?.[formatIndex]
    return format?.[field]
  }

  const getEffectiveGlobalStock = (product) => {
    const change = changes[product.id]?.globalInStock
    if (change !== undefined) return change
    return product.in_stock
  }

  const hasChanges = Object.keys(changes).length > 0

  const saveChanges = async () => {
    setSaving(true)
    setSaveSuccess(false)

    try {
      for (const [productId, productChanges] of Object.entries(changes)) {
        const product = products.find(p => p.id === productId)
        if (!product) continue

        const updates = {}

        // Handle global in_stock change
        if (productChanges.globalInStock !== undefined) {
          updates.in_stock = productChanges.globalInStock
        }

        // Handle format-level changes
        if (product.formats && product.formats.length > 0) {
          const updatedFormats = product.formats.map((format, index) => {
            const formatChanges = productChanges[index]
            if (!formatChanges) return format

            const newFormat = { ...format }
            if (formatChanges.stock !== undefined) {
              newFormat.stock = formatChanges.stock
              // Auto-update inStock based on stock quantity
              if (formatChanges.stock !== null) {
                newFormat.inStock = formatChanges.stock > 0
              }
            }
            if (formatChanges.inStock !== undefined) {
              newFormat.inStock = formatChanges.inStock
            }
            return newFormat
          })

          updates.formats = updatedFormats

          // Update global in_stock based on any format being in stock
          if (updates.in_stock === undefined) {
            updates.in_stock = updatedFormats.some(f => f.inStock !== false)
          }
        }

        if (Object.keys(updates).length > 0) {
          updates.updated_at = new Date().toISOString()

          const { error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', productId)

          if (error) throw error
        }
      }

      // Refresh data and clear changes
      await fetchProducts()
      setChanges({})
      setSaveSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Error saving changes:', error)
      alert('Erreur lors de la sauvegarde: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getLowStockCount = () => {
    let count = 0
    products.forEach(product => {
      if (product.formats) {
        product.formats.forEach(format => {
          if (format.stock !== null && format.stock !== undefined && format.stock <= 5 && format.stock > 0) {
            count++
          }
        })
      }
    })
    return count
  }

  const getOutOfStockCount = () => {
    let count = 0
    products.forEach(product => {
      if (!product.in_stock) {
        count++
      } else if (product.formats) {
        product.formats.forEach(format => {
          if (format.inStock === false || format.stock === 0) {
            count++
          }
        })
      }
    })
    return count
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
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-7 h-7" />
            Gestion des Stocks
          </h1>
          <p className="text-gray-500 mt-1">Gerez rapidement les quantites en stock de vos produits</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw size={18} />
            Actualiser
          </button>
          <button
            onClick={saveChanges}
            disabled={!hasChanges || saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      {/* Success message */}
      {saveSuccess && (
        <div className="flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
          <CheckCircle size={20} />
          Modifications enregistrees avec succes !
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500">Total produits</div>
          <div className="text-2xl font-bold text-gray-900">{products.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <AlertTriangle size={14} className="text-yellow-500" />
            Stock faible (5 ou moins)
          </div>
          <div className="text-2xl font-bold text-yellow-600">{getLowStockCount()}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <AlertTriangle size={14} className="text-red-500" />
            Rupture de stock
          </div>
          <div className="text-2xl font-bold text-red-600">{getOutOfStockCount()}</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Products table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Format
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantite
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => {
              const hasFormats = product.formats && product.formats.length > 0
              const rowSpan = hasFormats ? product.formats.length : 1

              if (!hasFormats) {
                // Product without formats
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-10 h-12 object-cover rounded"
                          />
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{product.title}</div>
                          <div className="text-xs text-gray-500">{product.product_type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      -
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      -
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={getEffectiveGlobalStock(product)}
                          onChange={(e) => handleGlobalStockChange(product.id, e.target.checked)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className={`text-sm ${getEffectiveGlobalStock(product) ? 'text-green-600' : 'text-red-600'}`}>
                          {getEffectiveGlobalStock(product) ? 'En stock' : 'Rupture'}
                        </span>
                      </label>
                    </td>
                  </tr>
                )
              }

              // Product with formats - render multiple rows
              return product.formats.map((format, formatIndex) => (
                <tr key={`${product.id}-${formatIndex}`} className="hover:bg-gray-50">
                  {formatIndex === 0 && (
                    <td className="px-6 py-4 whitespace-nowrap" rowSpan={rowSpan}>
                      <div className="flex items-center gap-3">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-10 h-12 object-cover rounded"
                          />
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{product.title}</div>
                          <div className="text-xs text-gray-500">{product.product_type}</div>
                        </div>
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{format.label || format.formatType}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={getEffectiveValue(product, formatIndex, 'stock') ?? ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? null : parseInt(e.target.value)
                        handleStockChange(product.id, formatIndex, 'stock', value)
                      }}
                      placeholder="Illimite"
                      min="0"
                      className={`w-24 px-3 py-1 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        (getEffectiveValue(product, formatIndex, 'stock') ?? Infinity) <= 5
                          ? 'border-yellow-300 bg-yellow-50'
                          : 'border-gray-300'
                      } ${
                        getEffectiveValue(product, formatIndex, 'stock') === 0
                          ? 'border-red-300 bg-red-50'
                          : ''
                      }`}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={getEffectiveValue(product, formatIndex, 'inStock') !== false}
                        onChange={(e) => handleStockChange(product.id, formatIndex, 'inStock', e.target.checked)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className={`text-sm ${
                        getEffectiveValue(product, formatIndex, 'inStock') !== false
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {getEffectiveValue(product, formatIndex, 'inStock') !== false ? 'En stock' : 'Rupture'}
                      </span>
                    </label>
                  </td>
                </tr>
              ))
            })}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucun produit trouve
          </div>
        )}
      </div>

      {/* Pending changes indicator */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 bg-primary-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
          <span>Modifications non sauvegardees</span>
          <button
            onClick={saveChanges}
            disabled={saving}
            className="px-3 py-1 bg-white text-primary-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      )}
    </div>
  )
}
