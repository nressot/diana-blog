import { useState, useEffect, useRef } from 'react'
import { supabase, uploadImage } from '../../lib/supabase'
import {
  Book,
  Save,
  RefreshCw,
  Upload,
  X,
  Link as LinkIcon,
  ShoppingBag,
  Image as ImageIcon,
  Eye
} from 'lucide-react'

// Description par defaut
const defaultDescription = [
  "Maxine, qui apres avoir neglige sa vie amoureuse a l'arrivee de sa fille, se lance dans une quete d'amour.",
  "Une histoire d'amour, d'amitie et de courage."
]

export default function BookSection() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [products, setProducts] = useState([])
  const [selectedProductId, setSelectedProductId] = useState(null)

  // Contenu editable
  const [bookData, setBookData] = useState({
    title: 'Mon dernier livre',
    bookTitle: '',
    description: defaultDescription,
    ctaText: 'Acheter',
    ctaLink: '/boutique',
    bookCoverUrl: '',
    geometricShapeUrl: ''
  })

  const [coverUploading, setCoverUploading] = useState(false)
  const [shapeUploading, setShapeUploading] = useState(false)
  const coverInputRef = useRef(null)
  const shapeInputRef = useRef(null)

  useEffect(() => {
    fetchProducts()
    fetchBookData()
  }, [])

  const fetchProducts = async () => {
    if (!supabase) return

    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, title, image, excerpt, slug, price')
        .eq('product_type', 'book')
        .eq('in_stock', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchBookData = async () => {
    if (!supabase) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('pages')
        .select('content')
        .eq('page_key', 'book')
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data?.content) {
        setBookData(prev => ({
          ...prev,
          ...data.content,
          description: data.content.description || defaultDescription
        }))
        setSelectedProductId(data.content.linkedProductId || null)
      }
    } catch (error) {
      console.error('Error fetching book data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProductSelect = (productId) => {
    const product = products.find(p => p.id === productId)
    if (!product) {
      setSelectedProductId(null)
      return
    }

    setSelectedProductId(productId)

    // Auto-remplir avec les donnees du produit
    setBookData(prev => ({
      ...prev,
      bookTitle: product.title,
      bookCoverUrl: product.image || prev.bookCoverUrl,
      ctaLink: `/boutique/${product.slug}`,
      // On peut aussi utiliser l'excerpt comme description si on veut
      // description: product.excerpt ? [product.excerpt] : prev.description
    }))
  }

  const handleSyncFromProduct = () => {
    if (!selectedProductId) return
    const product = products.find(p => p.id === selectedProductId)
    if (!product) return

    setBookData(prev => ({
      ...prev,
      bookTitle: product.title,
      bookCoverUrl: product.image || prev.bookCoverUrl,
      ctaLink: `/boutique/${product.slug}`
    }))
  }

  const handleCoverUpload = async (file) => {
    if (!file) return

    setCoverUploading(true)
    try {
      const url = await uploadImage(file, 'book-covers')
      if (url) {
        setBookData(prev => ({ ...prev, bookCoverUrl: url }))
      }
    } catch (error) {
      console.error('Error uploading cover:', error)
      alert('Erreur lors de l\'upload: ' + error.message)
    } finally {
      setCoverUploading(false)
    }
  }

  const handleShapeUpload = async (file) => {
    if (!file) return

    setShapeUploading(true)
    try {
      const url = await uploadImage(file, 'book-covers')
      if (url) {
        setBookData(prev => ({ ...prev, geometricShapeUrl: url }))
      }
    } catch (error) {
      console.error('Error uploading shape:', error)
      alert('Erreur lors de l\'upload: ' + error.message)
    } finally {
      setShapeUploading(false)
    }
  }

  const handleSave = async () => {
    if (!supabase) return

    setSaving(true)
    try {
      const content = {
        ...bookData,
        linkedProductId: selectedProductId
      }

      const { error } = await supabase
        .from('pages')
        .upsert({
          page_key: 'book',
          content,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'page_key'
        })

      if (error) throw error
      alert('Section livre sauvegardee !')
    } catch (error) {
      console.error('Error saving:', error)
      alert('Erreur: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const updateDescription = (index, value) => {
    setBookData(prev => {
      const newDesc = [...(prev.description || [])]
      newDesc[index] = value
      return { ...prev, description: newDesc }
    })
  }

  const addParagraph = () => {
    setBookData(prev => ({
      ...prev,
      description: [...(prev.description || []), '']
    }))
  }

  const removeParagraph = (index) => {
    setBookData(prev => ({
      ...prev,
      description: prev.description.filter((_, i) => i !== index)
    }))
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF'
    }).format(price / 100)
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary-100 rounded-xl">
            <Book className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mon dernier livre</h1>
            <p className="text-gray-600">Gerez la section livre affichee sur la page d'accueil</p>
          </div>
        </div>
        <div className="flex gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye size={18} />
            Voir le site
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      {/* Synchronisation avec la boutique */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <ShoppingBag className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">Synchronisation avec la boutique</h2>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Selectionnez un livre de votre boutique pour synchroniser automatiquement les informations.
        </p>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Livre de la boutique
            </label>
            <select
              value={selectedProductId || ''}
              onChange={(e) => handleProductSelect(e.target.value || null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">-- Selectionner un livre --</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.title} - {formatPrice(product.price)}
                </option>
              ))}
            </select>
          </div>

          {selectedProductId && (
            <button
              onClick={handleSyncFromProduct}
              className="inline-flex items-center gap-2 px-4 py-2 border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors"
            >
              <RefreshCw size={18} />
              Re-synchroniser
            </button>
          )}
        </div>

        {selectedProductId && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              Lie au produit: <strong>{products.find(p => p.id === selectedProductId)?.title}</strong>
            </p>
          </div>
        )}
      </div>

      {/* Contenu de la section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Contenu de la section</h2>

        <div className="space-y-6">
          {/* Titre de la section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre de la section
            </label>
            <input
              type="text"
              value={bookData.title}
              onChange={(e) => setBookData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Mon dernier livre"
            />
          </div>

          {/* Titre du livre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre du livre
            </label>
            <input
              type="text"
              value={bookData.bookTitle}
              onChange={(e) => setBookData(prev => ({ ...prev, bookTitle: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Le titre de votre livre"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (paragraphes)
            </label>
            <div className="space-y-3">
              {(bookData.description || []).map((para, index) => (
                <div key={index} className="flex gap-2">
                  <textarea
                    value={para}
                    onChange={(e) => updateDescription(index, e.target.value)}
                    rows={3}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder={`Paragraphe ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeParagraph(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg self-start"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addParagraph}
              className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              + Ajouter un paragraphe
            </button>
          </div>

          {/* Bouton CTA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Texte du bouton
              </label>
              <input
                type="text"
                value={bookData.ctaText}
                onChange={(e) => setBookData(prev => ({ ...prev, ctaText: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Acheter"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lien du bouton
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={bookData.ctaLink}
                  onChange={(e) => setBookData(prev => ({ ...prev, ctaLink: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="/boutique/mon-livre"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <ImageIcon className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">Images</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Couverture du livre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Couverture du livre
            </label>
            {bookData.bookCoverUrl ? (
              <div className="relative">
                <img
                  src={bookData.bookCoverUrl}
                  alt="Couverture"
                  className="w-full max-w-xs rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => setBookData(prev => ({ ...prev, bookCoverUrl: '' }))}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={coverUploading}
                  className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Changer l'image
                </button>
              </div>
            ) : (
              <div
                onClick={() => coverInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                  ${coverUploading ? 'border-gray-300 bg-gray-50 cursor-not-allowed' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'}
                `}
              >
                {coverUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    <p className="text-sm text-gray-600">Upload en cours...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 bg-gray-100 rounded-full">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">Cliquez pour ajouter une image</p>
                    <p className="text-xs text-gray-400">PNG, JPG jusqu'a 5MB</p>
                  </div>
                )}
              </div>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleCoverUpload(file)
                e.target.value = ''
              }}
              className="hidden"
            />
          </div>

          {/* Forme geometrique */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Forme geometrique (decoration)
            </label>
            {bookData.geometricShapeUrl ? (
              <div className="relative">
                <img
                  src={bookData.geometricShapeUrl}
                  alt="Forme"
                  className="w-full max-w-xs rounded-lg border border-gray-200 bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setBookData(prev => ({ ...prev, geometricShapeUrl: '' }))}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => shapeInputRef.current?.click()}
                  disabled={shapeUploading}
                  className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Changer l'image
                </button>
              </div>
            ) : (
              <div
                onClick={() => shapeInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                  ${shapeUploading ? 'border-gray-300 bg-gray-50 cursor-not-allowed' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'}
                `}
              >
                {shapeUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    <p className="text-sm text-gray-600">Upload en cours...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 bg-gray-100 rounded-full">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">Forme decorative (optionnel)</p>
                    <p className="text-xs text-gray-400">PNG, SVG transparent</p>
                  </div>
                )}
              </div>
            )}
            <input
              ref={shapeInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleShapeUpload(file)
                e.target.value = ''
              }}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Apercu */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Apercu</h2>

        <div className="rounded-2xl p-6 bg-gray-50 border border-gray-200">
          <div className="grid lg:grid-cols-[1fr,200px] gap-6 items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {bookData.title || 'Mon dernier livre'}
              </h3>
              <div className="text-sm text-gray-600 space-y-2 mb-4">
                {(bookData.description || []).map((para, index) => (
                  <p key={index}>{para || 'Paragraphe...'}</p>
                ))}
              </div>
              <div className="inline-flex items-center justify-center h-9 px-5 rounded-full bg-primary-600 text-white text-sm font-medium">
                {bookData.ctaText || 'Acheter'}
              </div>
            </div>

            <div className="relative w-40 h-56 mx-auto">
              {bookData.geometricShapeUrl && (
                <img
                  src={bookData.geometricShapeUrl}
                  alt=""
                  className="absolute top-8 left-0 w-32 rotate-[-3deg] z-0 opacity-80"
                />
              )}
              {bookData.bookCoverUrl ? (
                <img
                  src={bookData.bookCoverUrl}
                  alt={bookData.bookTitle}
                  className="absolute top-0 left-4 w-28 rotate-[4deg] z-10 rounded shadow-lg"
                />
              ) : (
                <div className="absolute top-0 left-4 w-28 h-40 rotate-[4deg] z-10 rounded bg-gray-200 flex items-center justify-center">
                  <Book className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
