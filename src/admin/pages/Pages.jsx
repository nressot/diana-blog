import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import {
  Home,
  User,
  Mail,
  Book,
  Save,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  UserCircle,
  Upload,
  X
} from 'lucide-react'

const pageConfigs = [
  { key: 'author', label: 'Auteur', icon: UserCircle },
  { key: 'home', label: 'Page d\'accueil', icon: Home },
  { key: 'about', label: 'A propos', icon: User },
  { key: 'contact', label: 'Contact', icon: Mail },
  { key: 'book', label: 'Section Livre', icon: Book }
]

export default function Pages() {
  const [pages, setPages] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [expandedPage, setExpandedPage] = useState('author')
  const [editedContent, setEditedContent] = useState({})
  const [author, setAuthor] = useState(null)
  const [editedAuthor, setEditedAuthor] = useState(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const avatarInputRef = useRef(null)

  useEffect(() => {
    fetchPages()
    fetchAuthor()
  }, [])

  const fetchAuthor = async () => {
    if (!supabase) return

    try {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .limit(1)

      if (error) throw error

      // Prendre le premier auteur s'il existe
      if (data && data.length > 0) {
        setAuthor(data[0])
        setEditedAuthor(data[0])
      }
    } catch (error) {
      console.error('Error fetching author:', error)
    }
  }

  const handleAvatarUpload = async (file) => {
    if (!supabase || !file) return

    setAvatarUploading(true)
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `author-avatar-${Date.now()}.${fileExt}`

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      // Update edited author with new avatar URL
      setEditedAuthor(prev => ({ ...prev, avatar_url: publicUrl }))
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Erreur lors de l\'upload: ' + error.message)
    } finally {
      setAvatarUploading(false)
    }
  }

  const handleAvatarRemove = () => {
    setEditedAuthor(prev => ({ ...prev, avatar_url: null }))
  }

  const fetchPages = async () => {
    if (!supabase) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')

      if (error) throw error

      const pagesMap = {}
      data?.forEach(page => {
        pagesMap[page.page_key] = page.content
      })

      setPages(pagesMap)
      setEditedContent(pagesMap)
    } catch (error) {
      console.error('Error fetching pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAuthor = async () => {
    setSaving(true)

    try {
      const { error } = await supabase
        .from('authors')
        .update({
          name: editedAuthor.name,
          role: editedAuthor.role,
          bio: editedAuthor.bio,
          avatar_url: editedAuthor.avatar_url,
          stats: editedAuthor.stats,
          social: editedAuthor.social,
          updated_at: new Date().toISOString()
        })
        .eq('id', editedAuthor.id)

      if (error) throw error

      setAuthor(editedAuthor)
      alert('Auteur sauvegarde !')
    } catch (error) {
      console.error('Error saving author:', error)
      alert('Erreur: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSave = async (pageKey) => {
    if (pageKey === 'author') {
      return handleSaveAuthor()
    }

    setSaving(true)

    try {
      const { error } = await supabase
        .from('pages')
        .upsert({
          page_key: pageKey,
          content: editedContent[pageKey],
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'page_key'
        })

      if (error) throw error

      setPages(prev => ({ ...prev, [pageKey]: editedContent[pageKey] }))
      alert('Page sauvegardee !')
    } catch (error) {
      console.error('Error saving page:', error)
      alert('Erreur: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const updateField = (pageKey, path, value) => {
    setEditedContent(prev => {
      const newContent = { ...prev }
      const pathParts = path.split('.')
      let current = newContent[pageKey] = { ...prev[pageKey] }

      for (let i = 0; i < pathParts.length - 1; i++) {
        current[pathParts[i]] = { ...current[pathParts[i]] }
        current = current[pathParts[i]]
      }

      current[pathParts[pathParts.length - 1]] = value
      return newContent
    })
  }

  const updateArrayItem = (pageKey, arrayPath, index, field, value) => {
    setEditedContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev))
      const pathParts = arrayPath.split('.')
      let current = newContent[pageKey]

      for (const part of pathParts) {
        current = current[part]
      }

      if (current && current[index]) {
        current[index][field] = value
      }

      return newContent
    })
  }

  const addArrayItem = (pageKey, arrayPath, template) => {
    setEditedContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev))
      const pathParts = arrayPath.split('.')
      let current = newContent[pageKey]

      for (let i = 0; i < pathParts.length - 1; i++) {
        current = current[pathParts[i]]
      }

      const lastKey = pathParts[pathParts.length - 1]
      if (!current[lastKey]) {
        current[lastKey] = []
      }
      current[lastKey].push(template)

      return newContent
    })
  }

  const removeArrayItem = (pageKey, arrayPath, index) => {
    setEditedContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev))
      const pathParts = arrayPath.split('.')
      let current = newContent[pageKey]

      for (let i = 0; i < pathParts.length - 1; i++) {
        current = current[pathParts[i]]
      }

      const lastKey = pathParts[pathParts.length - 1]
      if (current[lastKey]) {
        current[lastKey].splice(index, 1)
      }

      return newContent
    })
  }

  const updateParagraph = (pageKey, sectionPath, index, value) => {
    setEditedContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev))
      const pathParts = sectionPath.split('.')
      let current = newContent[pageKey]

      for (const part of pathParts) {
        current = current[part]
      }

      if (current) {
        current[index] = value
      }

      return newContent
    })
  }

  const addParagraph = (pageKey, sectionPath) => {
    setEditedContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev))
      const pathParts = sectionPath.split('.')
      let parent = newContent[pageKey]

      for (let i = 0; i < pathParts.length - 1; i++) {
        parent = parent[pathParts[i]]
      }

      const lastKey = pathParts[pathParts.length - 1]
      if (!parent[lastKey]) {
        parent[lastKey] = []
      }
      parent[lastKey].push('')

      return newContent
    })
  }

  const removeParagraph = (pageKey, sectionPath, index) => {
    setEditedContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev))
      const pathParts = sectionPath.split('.')
      let parent = newContent[pageKey]

      for (let i = 0; i < pathParts.length - 1; i++) {
        parent = parent[pathParts[i]]
      }

      const lastKey = pathParts[pathParts.length - 1]
      if (parent[lastKey]) {
        parent[lastKey].splice(index, 1)
      }

      return newContent
    })
  }

  const renderField = (pageKey, label, path, type = 'text', rows = 1) => {
    const pathParts = path.split('.')
    let value = editedContent[pageKey]
    for (const part of pathParts) {
      value = value?.[part]
    }

    return (
      <div key={path}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        {rows > 1 ? (
          <textarea
            value={value || ''}
            onChange={(e) => updateField(pageKey, path, e.target.value)}
            rows={rows}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        ) : (
          <input
            type={type}
            value={value || ''}
            onChange={(e) => updateField(pageKey, path, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        )}
      </div>
    )
  }

  const renderAuthorEditor = () => {
    if (!editedAuthor) return <p className="text-gray-500">Chargement...</p>

    return (
      <div className="space-y-6">
        {/* Informations de base */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-4">Informations de base</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                value={editedAuthor.name || ''}
                onChange={(e) => setEditedAuthor({ ...editedAuthor, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role / Titre</label>
              <input
                type="text"
                value={editedAuthor.role || ''}
                onChange={(e) => setEditedAuthor({ ...editedAuthor, role: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Photo de profil</label>
              {editedAuthor.avatar_url ? (
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={editedAuthor.avatar_url}
                      alt="Avatar"
                      className="w-32 h-32 object-cover rounded-full border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={handleAvatarRemove}
                      className="absolute -top-1 -right-1 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-2">Image actuelle</p>
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={avatarUploading}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Changer l'image
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => avatarInputRef.current?.click()}
                  className={`
                    border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                    ${avatarUploading
                      ? 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-50'
                      : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                    }
                  `}
                >
                  {avatarUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                      <p className="text-sm text-gray-600">Upload en cours...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 bg-gray-100 rounded-full">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600">
                        Cliquez pour ajouter une photo
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG jusqu'a 5MB
                      </p>
                    </div>
                  )}
                </div>
              )}
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleAvatarUpload(file)
                  e.target.value = ''
                }}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-4">Biographie</h4>
          <p className="text-sm text-gray-500 mb-2">Ce texte apparait sous "Passionnee par les mots..." dans la carte auteur</p>
          <textarea
            value={editedAuthor.bio || ''}
            onChange={(e) => setEditedAuthor({ ...editedAuthor, bio: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Passionnee par les mots depuis l'enfance..."
          />
        </div>

        {/* Stats */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-4">Statistiques</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre d'articles</label>
              <input
                type="text"
                value={editedAuthor.stats?.articles || ''}
                onChange={(e) => setEditedAuthor({
                  ...editedAuthor,
                  stats: { ...editedAuthor.stats, articles: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="150+"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lecteurs</label>
              <input
                type="text"
                value={editedAuthor.stats?.readers || ''}
                onChange={(e) => setEditedAuthor({
                  ...editedAuthor,
                  stats: { ...editedAuthor.stats, readers: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="50K+"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Annees d'experience</label>
              <input
                type="text"
                value={editedAuthor.stats?.years || ''}
                onChange={(e) => setEditedAuthor({
                  ...editedAuthor,
                  stats: { ...editedAuthor.stats, years: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="10+"
              />
            </div>
          </div>
        </div>

        {/* Reseaux sociaux */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-4">Reseaux sociaux</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
              <input
                type="text"
                value={editedAuthor.social?.twitter || ''}
                onChange={(e) => setEditedAuthor({
                  ...editedAuthor,
                  social: { ...editedAuthor.social, twitter: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="https://twitter.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
              <input
                type="text"
                value={editedAuthor.social?.instagram || ''}
                onChange={(e) => setEditedAuthor({
                  ...editedAuthor,
                  social: { ...editedAuthor.social, instagram: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
              <input
                type="text"
                value={editedAuthor.social?.linkedin || ''}
                onChange={(e) => setEditedAuthor({
                  ...editedAuthor,
                  social: { ...editedAuthor.social, linkedin: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderPageEditor = (pageKey) => {
    if (pageKey === 'author') {
      return renderAuthorEditor()
    }

    const content = editedContent[pageKey]
    if (!content) return null

    switch (pageKey) {
      case 'home':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-4">Hero</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField(pageKey, 'Titre ligne 1', 'hero.titleLine1')}
                {renderField(pageKey, 'Titre ligne 2', 'hero.titleLine2')}
                {renderField(pageKey, 'Titre ligne 3', 'hero.titleLine3')}
                {renderField(pageKey, 'Sous-titre', 'hero.subtitle', 'text', 3)}
              </div>

              {/* Mots du typewriter */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mots qui s'animent (typewriter)
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Ces mots s'affichent en boucle avec un effet machine a ecrire
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(content.hero?.typewriterWords || []).map((word, index) => (
                    <div key={index} className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg px-3 py-1.5">
                      <input
                        type="text"
                        value={word}
                        onChange={(e) => {
                          const newWords = [...(content.hero?.typewriterWords || [])]
                          newWords[index] = e.target.value
                          updateField(pageKey, 'hero.typewriterWords', newWords)
                        }}
                        className="w-24 bg-transparent border-none outline-none text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newWords = (content.hero?.typewriterWords || []).filter((_, i) => i !== index)
                          updateField(pageKey, 'hero.typewriterWords', newWords)
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newWords = [...(content.hero?.typewriterWords || []), '']
                    updateField(pageKey, 'hero.typewriterWords', newWords)
                  }}
                  className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
                >
                  <Plus size={16} /> Ajouter un mot
                </button>
              </div>
            </div>

            {/* Sections titres */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-4">Titres des sections</h4>
              <div className="space-y-4">
                {/* Section A la une */}
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <span className="text-sm font-medium text-gray-500 mb-2 block">Section "A la une"</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={content.sections?.featured?.title || ''}
                      onChange={(e) => updateField(pageKey, 'sections.featured.title', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Titre"
                    />
                    <input
                      type="text"
                      value={content.sections?.featured?.subtitle || ''}
                      onChange={(e) => updateField(pageKey, 'sections.featured.subtitle', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Sous-titre"
                    />
                  </div>
                </div>

                {/* Section Categories */}
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <span className="text-sm font-medium text-gray-500 mb-2 block">Section "Categories"</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={content.sections?.categories?.title || ''}
                      onChange={(e) => updateField(pageKey, 'sections.categories.title', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Titre"
                    />
                    <input
                      type="text"
                      value={content.sections?.categories?.subtitle || ''}
                      onChange={(e) => updateField(pageKey, 'sections.categories.subtitle', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Sous-titre"
                    />
                  </div>
                </div>

                {/* Section Derniers articles */}
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <span className="text-sm font-medium text-gray-500 mb-2 block">Section "Derniers articles"</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={content.sections?.latestArticles?.title || ''}
                      onChange={(e) => updateField(pageKey, 'sections.latestArticles.title', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Titre"
                    />
                    <input
                      type="text"
                      value={content.sections?.latestArticles?.subtitle || ''}
                      onChange={(e) => updateField(pageKey, 'sections.latestArticles.subtitle', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Sous-titre"
                    />
                  </div>
                </div>

                {/* Section Auteur */}
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <span className="text-sm font-medium text-gray-500 mb-2 block">Section "Qui je suis"</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={content.sections?.author?.title || ''}
                      onChange={(e) => updateField(pageKey, 'sections.author.title', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Titre"
                    />
                    <input
                      type="text"
                      value={content.sections?.author?.subtitle || ''}
                      onChange={(e) => updateField(pageKey, 'sections.author.subtitle', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Sous-titre"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-4">Newsletter</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField(pageKey, 'Titre', 'newsletter.title')}
                {renderField(pageKey, 'Description', 'newsletter.description', 'text', 2)}
                {renderField(pageKey, 'Placeholder', 'newsletter.placeholder')}
                {renderField(pageKey, 'Texte bouton', 'newsletter.buttonText')}
              </div>
            </div>
          </div>
        )

      case 'about':
        return (
          <div className="space-y-6">
            {/* Hero */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-4">Hero</h4>
              <div className="grid grid-cols-1 gap-4">
                {renderField(pageKey, 'Titre', 'hero.title')}
                {renderField(pageKey, 'Sous-titre', 'hero.subtitle', 'text', 2)}
              </div>
            </div>

            {/* Mon histoire */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-4">Mon histoire</h4>
              {renderField(pageKey, 'Titre section', 'story.title')}

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Paragraphes</label>
                <div className="space-y-3">
                  {content.story?.paragraphs?.map((para, index) => (
                    <div key={index} className="flex gap-2">
                      <textarea
                        value={para}
                        onChange={(e) => updateParagraph(pageKey, 'story.paragraphs', index, e.target.value)}
                        rows={3}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder={`Paragraphe ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeParagraph(pageKey, 'story.paragraphs', index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addParagraph(pageKey, 'story.paragraphs')}
                  className="mt-2 flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
                >
                  <Plus size={16} /> Ajouter un paragraphe
                </button>
              </div>
            </div>

            {/* Valeurs */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-4">Mes valeurs</h4>
              {renderField(pageKey, 'Titre section', 'valuesSection.title')}

              <div className="mt-4 space-y-4">
                {content.valuesSection?.values?.map((value, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg border border-gray-200">
                    <span className="text-sm font-medium text-gray-500 mb-2 block">Valeur {index + 1}</span>
                    <div className="grid grid-cols-1 gap-3">
                      <input
                        type="text"
                        value={value.title || ''}
                        onChange={(e) => updateArrayItem(pageKey, 'valuesSection.values', index, 'title', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Titre"
                      />
                      <textarea
                        value={value.description || ''}
                        onChange={(e) => updateArrayItem(pageKey, 'valuesSection.values', index, 'description', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        rows={2}
                        placeholder="Description"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Parcours */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-4">Mon parcours</h4>
              {renderField(pageKey, 'Titre section', 'milestonesSection.title')}

              <div className="mt-4 space-y-4">
                {content.milestonesSection?.milestones?.map((milestone, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-500">Etape {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem(pageKey, 'milestonesSection.milestones', index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={milestone.year || ''}
                        onChange={(e) => updateArrayItem(pageKey, 'milestonesSection.milestones', index, 'year', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Annee"
                      />
                      <input
                        type="text"
                        value={milestone.title || ''}
                        onChange={(e) => updateArrayItem(pageKey, 'milestonesSection.milestones', index, 'title', e.target.value)}
                        className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Titre"
                      />
                      <textarea
                        value={milestone.description || ''}
                        onChange={(e) => updateArrayItem(pageKey, 'milestonesSection.milestones', index, 'description', e.target.value)}
                        className="md:col-span-3 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        rows={2}
                        placeholder="Description"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem(pageKey, 'milestonesSection.milestones', { year: '', title: '', description: '' })}
                  className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
                >
                  <Plus size={16} /> Ajouter une etape
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-4">Appel a l'action</h4>
              <div className="grid grid-cols-1 gap-4">
                {renderField(pageKey, 'Titre', 'cta.title')}
                {renderField(pageKey, 'Description', 'cta.description', 'text', 2)}
                {renderField(pageKey, 'Texte bouton', 'cta.buttonText')}
              </div>
            </div>
          </div>
        )

      case 'contact':
        return (
          <div className="space-y-6">
            {/* Hero */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-4">Hero</h4>
              <div className="grid grid-cols-1 gap-4">
                {renderField(pageKey, 'Titre', 'hero.title')}
                {renderField(pageKey, 'Sous-titre', 'hero.subtitle', 'text', 2)}
              </div>
            </div>

            {/* Informations de contact */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-4">Informations de contact</h4>
              <div className="space-y-4">
                {(content.contactInfo || []).map((info, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-500">Contact {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem(pageKey, 'contactInfo', index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={info.icon || ''}
                        onChange={(e) => updateArrayItem(pageKey, 'contactInfo', index, 'icon', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Icone (Mail, MapPin, Clock, Phone)"
                      />
                      <input
                        type="text"
                        value={info.title || ''}
                        onChange={(e) => updateArrayItem(pageKey, 'contactInfo', index, 'title', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Titre (ex: Email)"
                      />
                      <input
                        type="text"
                        value={info.value || ''}
                        onChange={(e) => updateArrayItem(pageKey, 'contactInfo', index, 'value', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Valeur (ex: diana@example.com)"
                      />
                      <input
                        type="text"
                        value={info.href || ''}
                        onChange={(e) => updateArrayItem(pageKey, 'contactInfo', index, 'href', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Lien (ex: mailto:diana@example.com)"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem(pageKey, 'contactInfo', { icon: 'Mail', title: '', value: '', href: '' })}
                  className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
                >
                  <Plus size={16} /> Ajouter un contact
                </button>
              </div>
            </div>

            {/* Reseaux sociaux */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-4">Reseaux sociaux</h4>
              {renderField(pageKey, 'Titre section', 'socialSection.title')}
              <div className="mt-4 space-y-4">
                {(content.socialSection?.links || []).map((link, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-500">Reseau {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem(pageKey, 'socialSection.links', index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={link.platform || ''}
                        onChange={(e) => updateArrayItem(pageKey, 'socialSection.links', index, 'platform', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Plateforme (Instagram, Twitter...)"
                      />
                      <input
                        type="text"
                        value={link.url || ''}
                        onChange={(e) => updateArrayItem(pageKey, 'socialSection.links', index, 'url', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="URL"
                      />
                      <input
                        type="text"
                        value={link.handle || ''}
                        onChange={(e) => updateArrayItem(pageKey, 'socialSection.links', index, 'handle', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Handle (@nom)"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem(pageKey, 'socialSection.links', { platform: '', url: '', handle: '' })}
                  className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
                >
                  <Plus size={16} /> Ajouter un reseau
                </button>
              </div>
            </div>

            {/* Formulaire */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-4">Formulaire de contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField(pageKey, 'Titre', 'form.title')}
                {renderField(pageKey, 'Label nom', 'form.nameLabel')}
                {renderField(pageKey, 'Label email', 'form.emailLabel')}
                {renderField(pageKey, 'Label sujet', 'form.subjectLabel')}
                {renderField(pageKey, 'Label message', 'form.messageLabel')}
                {renderField(pageKey, 'Texte bouton', 'form.submitText')}
                <div className="md:col-span-2">
                  {renderField(pageKey, 'Message de succes', 'form.successMessage', 'text', 2)}
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-4">Questions frequentes (FAQ)</h4>
              {renderField(pageKey, 'Titre section', 'faqSection.title')}
              <div className="mt-4 space-y-4">
                {(content.faqSection?.items || []).map((faq, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-500">Question {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem(pageKey, 'faqSection.items', index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={faq.question || ''}
                        onChange={(e) => updateArrayItem(pageKey, 'faqSection.items', index, 'question', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Question"
                      />
                      <textarea
                        value={faq.answer || ''}
                        onChange={(e) => updateArrayItem(pageKey, 'faqSection.items', index, 'answer', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        rows={2}
                        placeholder="Reponse"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem(pageKey, 'faqSection.items', { question: '', answer: '' })}
                  className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
                >
                  <Plus size={16} /> Ajouter une question
                </button>
              </div>
            </div>
          </div>
        )

      case 'book':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-4">Section Livre</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField(pageKey, 'Titre section', 'title')}
                {renderField(pageKey, 'Titre du livre', 'bookTitle')}
                {renderField(pageKey, 'Texte bouton', 'ctaText')}
                {renderField(pageKey, 'Lien bouton', 'ctaLink')}
              </div>
            </div>
          </div>
        )

      default:
        return null
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
        <p className="text-gray-600 mt-1">Editez le contenu des pages de votre site</p>
      </div>

      {/* Page Editors */}
      <div className="space-y-4">
        {pageConfigs.map(({ key, label, icon: Icon }) => (
          <div
            key={key}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <button
              onClick={() => setExpandedPage(expandedPage === key ? null : key)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <span className="font-medium text-gray-900">{label}</span>
              </div>
              {expandedPage === key ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedPage === key && (
              <div className="border-t border-gray-200 p-6">
                {renderPageEditor(key)}

                <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleSave(key)}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    <Save size={18} />
                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
