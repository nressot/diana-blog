import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import CharacterCount from '@tiptap/extension-character-count'
import Youtube from '@tiptap/extension-youtube'
import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Undo,
  Redo,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Minus,
  Youtube as YoutubeIcon,
  Type,
  ChevronDown
} from 'lucide-react'

// Bouton de menu simple - utilise onMouseDown pour garder le focus dans l'editeur
const MenuButton = ({ onAction, isActive, disabled, children, title }) => (
  <button
    type="button"
    onMouseDown={(e) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled && onAction) {
        onAction()
      }
    }}
    disabled={disabled}
    title={title}
    className={`p-2 rounded transition-colors ${
      isActive
        ? 'bg-primary-100 text-primary-700'
        : 'text-gray-600 hover:bg-gray-100'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {children}
  </button>
)

// Separateur
const Divider = () => <div className="w-px h-6 bg-gray-300 mx-1" />

// Dropdown menu
const DropdownMenu = ({ trigger, children, isOpen, onToggle }) => (
  <div className="relative">
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onToggle()
      }}
      className="flex items-center gap-1 p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
    >
      {trigger}
      <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    {isOpen && (
      <div
        className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px] py-1"
        onMouseDown={(e) => e.preventDefault()}
      >
        {children}
      </div>
    )}
  </div>
)

const DropdownItem = ({ onMouseDown, isActive, children }) => (
  <button
    type="button"
    onMouseDown={(e) => {
      e.preventDefault()
      e.stopPropagation()
      onMouseDown()
    }}
    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
      isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
    }`}
  >
    {children}
  </button>
)

// Couleurs de surlignage
const HIGHLIGHT_COLORS = [
  { name: 'Jaune', value: '#FEF08A' },
  { name: 'Vert', value: '#BBF7D0' },
  { name: 'Bleu', value: '#BFDBFE' },
  { name: 'Rose', value: '#FBCFE8' },
  { name: 'Violet', value: '#DDD6FE' },
  { name: 'Orange', value: '#FED7AA' },
]

export default function RichTextEditor({ content, onChange, onReadTimeChange }) {
  const [openDropdown, setOpenDropdown] = useState(null)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showImageModal, setShowImageModal] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const lastReadTimeRef = useRef(null)
  const onReadTimeChangeRef = useRef(onReadTimeChange)
  const savedSelectionRef = useRef(null)

  // Garder la ref a jour
  useEffect(() => {
    onReadTimeChangeRef.current = onReadTimeChange
  }, [onReadTimeChange])

  // Memoize extensions pour eviter les re-creations
  const extensions = useMemo(() => [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4],
        HTMLAttributes: {
          class: 'editor-heading'
        }
      }
    }),
    Image.configure({
      HTMLAttributes: {
        class: 'rounded-lg max-w-full mx-auto'
      }
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-primary-600 underline hover:text-primary-700'
      }
    }),
    Placeholder.configure({
      placeholder: ({ node }) => {
        if (node.type.name === 'heading') {
          return 'Titre...'
        }
        return 'Commencez a ecrire votre article...'
      }
    }),
    Underline,
    Highlight.configure({
      multicolor: true
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph']
    }),
    Subscript,
    Superscript,
    CharacterCount,
    Youtube.configure({
      HTMLAttributes: {
        class: 'w-full aspect-video rounded-lg'
      }
    })
  ], [])

  const editor = useEditor({
    extensions,
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
      // Calculer et remonter le temps de lecture seulement si change
      const text = editor.state.doc.textContent
      const words = text.split(/\s+/).filter(word => word.length > 0).length
      const readTime = Math.max(1, Math.ceil(words / 200))
      if (readTime !== lastReadTimeRef.current && onReadTimeChangeRef.current) {
        lastReadTimeRef.current = readTime
        onReadTimeChangeRef.current(readTime)
      }
    }
  })

  // Calculer le temps de lecture initial au montage
  useEffect(() => {
    if (editor) {
      const text = editor.state.doc.textContent
      const words = text.split(/\s+/).filter(word => word.length > 0).length
      const readTime = Math.max(1, Math.ceil(words / 200))
      if (readTime !== lastReadTimeRef.current && onReadTimeChangeRef.current) {
        lastReadTimeRef.current = readTime
        onReadTimeChangeRef.current(readTime)
      }
    }
  }, [editor])

  const toggleDropdown = (name) => {
    // Sauvegarder la selection avant d'ouvrir le dropdown
    if (editor && openDropdown !== name) {
      savedSelectionRef.current = {
        from: editor.state.selection.from,
        to: editor.state.selection.to
      }
    }
    setOpenDropdown(openDropdown === name ? null : name)
  }

  const closeDropdowns = () => setOpenDropdown(null)

  // Executer une commande en restaurant la selection
  const executeCommand = useCallback((command) => {
    if (!editor) return

    // Focus l'editeur d'abord
    editor.view.focus()

    // Restaurer la selection sauvegardee
    if (savedSelectionRef.current) {
      const { from, to } = savedSelectionRef.current
      editor.chain().setTextSelection({ from, to }).run()
    }

    // Executer la commande
    command()

    // Fermer les dropdowns
    closeDropdowns()
  }, [editor])

  // Gestion des liens
  const handleAddLink = useCallback(() => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
    }
    setShowLinkModal(false)
    setLinkUrl('')
  }, [editor, linkUrl])

  const handleRemoveLink = useCallback(() => {
    editor.chain().focus().unsetLink().run()
  }, [editor])

  // Gestion des images
  const handleAddImage = useCallback(() => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt }).run()
    }
    setShowImageModal(false)
    setImageUrl('')
    setImageAlt('')
  }, [editor, imageUrl, imageAlt])

  // Gestion des videos
  const handleAddVideo = useCallback(() => {
    if (videoUrl) {
      editor.chain().focus().setYoutubeVideo({ src: videoUrl }).run()
    }
    setShowVideoModal(false)
    setVideoUrl('')
  }, [editor, videoUrl])


  if (!editor) {
    return null
  }

  const characterCount = editor.storage.characterCount
  const wordCount = editor.state.doc.textContent.split(/\s+/).filter(word => word.length > 0).length

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden" onClick={closeDropdowns}>
      {/* Styles pour les headings de l'editeur */}
      <style>{`
        .ProseMirror h1 { font-size: 2rem !important; font-weight: 700 !important; margin-top: 1.5rem !important; margin-bottom: 1rem !important; line-height: 1.2 !important; }
        .ProseMirror h2 { font-size: 1.5rem !important; font-weight: 700 !important; margin-top: 1.25rem !important; margin-bottom: 0.75rem !important; line-height: 1.25 !important; }
        .ProseMirror h3 { font-size: 1.25rem !important; font-weight: 600 !important; margin-top: 1rem !important; margin-bottom: 0.5rem !important; line-height: 1.3 !important; }
        .ProseMirror h4 { font-size: 1.125rem !important; font-weight: 600 !important; margin-top: 0.75rem !important; margin-bottom: 0.5rem !important; line-height: 1.4 !important; }
        .ProseMirror p { font-size: 1rem !important; line-height: 1.75 !important; }
      `}</style>
      {/* Toolbar principale */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50" onClick={e => e.stopPropagation()}>
        {/* Historique */}
        <MenuButton
          onAction={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Annuler (Ctrl+Z)"
        >
          <Undo size={18} />
        </MenuButton>
        <MenuButton
          onAction={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Refaire (Ctrl+Y)"
        >
          <Redo size={18} />
        </MenuButton>

        <Divider />

        {/* Styles de texte */}
        <DropdownMenu
          trigger={<Type size={18} />}
          isOpen={openDropdown === 'heading'}
          onToggle={() => toggleDropdown('heading')}
        >
          <DropdownItem
            onMouseDown={() => executeCommand(() => editor.commands.setParagraph())}
            isActive={editor.isActive('paragraph')}
          >
            Paragraphe
          </DropdownItem>
          <DropdownItem
            onMouseDown={() => executeCommand(() => editor.commands.setHeading({ level: 1 }))}
            isActive={editor.isActive('heading', { level: 1 })}
          >
            <span className="text-2xl font-bold">Titre 1</span>
          </DropdownItem>
          <DropdownItem
            onMouseDown={() => executeCommand(() => editor.commands.setHeading({ level: 2 }))}
            isActive={editor.isActive('heading', { level: 2 })}
          >
            <span className="text-xl font-bold">Titre 2</span>
          </DropdownItem>
          <DropdownItem
            onMouseDown={() => executeCommand(() => editor.commands.setHeading({ level: 3 }))}
            isActive={editor.isActive('heading', { level: 3 })}
          >
            <span className="text-lg font-bold">Titre 3</span>
          </DropdownItem>
          <DropdownItem
            onMouseDown={() => executeCommand(() => editor.commands.setHeading({ level: 4 }))}
            isActive={editor.isActive('heading', { level: 4 })}
          >
            <span className="font-bold">Titre 4</span>
          </DropdownItem>
        </DropdownMenu>

        <Divider />

        {/* Formatage de base */}
        <MenuButton
          onAction={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Gras (Ctrl+B)"
        >
          <Bold size={18} />
        </MenuButton>
        <MenuButton
          onAction={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italique (Ctrl+I)"
        >
          <Italic size={18} />
        </MenuButton>
        <MenuButton
          onAction={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Souligne (Ctrl+U)"
        >
          <UnderlineIcon size={18} />
        </MenuButton>
        <MenuButton
          onAction={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title="Barre"
        >
          <Strikethrough size={18} />
        </MenuButton>

        <Divider />

        {/* Surlignage */}
        <DropdownMenu
          trigger={<Highlighter size={18} />}
          isOpen={openDropdown === 'highlight'}
          onToggle={() => toggleDropdown('highlight')}
        >
          <div className="px-3 py-2">
            <p className="text-xs text-gray-500 mb-2">Surlignage</p>
            <div className="grid grid-cols-3 gap-1">
              {HIGHLIGHT_COLORS.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    executeCommand(() => editor.commands.toggleHighlight({ color: color.value }))
                  }}
                  className="w-8 h-6 rounded border border-gray-200 hover:scale-105 transition-transform"
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault()
                executeCommand(() => editor.commands.unsetHighlight())
              }}
              className="mt-2 text-xs text-gray-500 hover:text-gray-700"
            >
              Supprimer
            </button>
          </div>
        </DropdownMenu>

        <Divider />

        {/* Exposant / Indice */}
        <MenuButton
          onAction={() => editor.chain().focus().toggleSuperscript().run()}
          isActive={editor.isActive('superscript')}
          title="Exposant"
        >
          <SuperscriptIcon size={18} />
        </MenuButton>
        <MenuButton
          onAction={() => editor.chain().focus().toggleSubscript().run()}
          isActive={editor.isActive('subscript')}
          title="Indice"
        >
          <SubscriptIcon size={18} />
        </MenuButton>

        <Divider />

        {/* Alignement */}
        <MenuButton
          onAction={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Aligner a gauche"
        >
          <AlignLeft size={18} />
        </MenuButton>
        <MenuButton
          onAction={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Centrer"
        >
          <AlignCenter size={18} />
        </MenuButton>
        <MenuButton
          onAction={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Aligner a droite"
        >
          <AlignRight size={18} />
        </MenuButton>
        <MenuButton
          onAction={() => editor.chain().focus().setTextAlign('justify').run()}
          isActive={editor.isActive({ textAlign: 'justify' })}
          title="Justifier"
        >
          <AlignJustify size={18} />
        </MenuButton>

        <Divider />

        {/* Listes */}
        <MenuButton
          onAction={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Liste a puces"
        >
          <List size={18} />
        </MenuButton>
        <MenuButton
          onAction={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Liste numerotee"
        >
          <ListOrdered size={18} />
        </MenuButton>

        <Divider />

        {/* Citation */}
        <MenuButton
          onAction={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Citation"
        >
          <Quote size={18} />
        </MenuButton>

        {/* Code */}
        <MenuButton
          onAction={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          title="Code inline"
        >
          <Code size={18} />
        </MenuButton>

        {/* Ligne horizontale */}
        <MenuButton
          onAction={() => {
            editor.chain().focus().setHorizontalRule().run()
            // Ajouter un paragraphe apres pour faciliter la navigation/suppression
            editor.chain().focus().createParagraphNear().run()
          }}
          title="Separateur (cliquer dessus + Suppr pour enlever)"
        >
          <Minus size={18} />
        </MenuButton>

        <Divider />

        {/* Lien */}
        <MenuButton
          onAction={() => setShowLinkModal(true)}
          isActive={editor.isActive('link')}
          title="Inserer un lien"
        >
          <LinkIcon size={18} />
        </MenuButton>
        {editor.isActive('link') && (
          <MenuButton
            onAction={handleRemoveLink}
            title="Supprimer le lien"
          >
            <Unlink size={18} />
          </MenuButton>
        )}

        {/* Image */}
        <MenuButton
          onAction={() => setShowImageModal(true)}
          title="Inserer une image"
        >
          <ImageIcon size={18} />
        </MenuButton>

        {/* Video YouTube */}
        <MenuButton
          onAction={() => setShowVideoModal(true)}
          title="Inserer une video YouTube"
        >
          <YoutubeIcon size={18} />
        </MenuButton>
      </div>

      {/* Editeur */}
      <EditorContent
        editor={editor}
        className="prose max-w-none p-4 min-h-[400px] focus:outline-none
          prose-headings:font-serif prose-headings:text-gray-900
          prose-p:text-gray-700 prose-p:leading-relaxed
          prose-blockquote:border-l-primary-500 prose-blockquote:bg-primary-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:italic prose-blockquote:text-gray-700
          prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-xl prose-img:shadow-sm
          prose-hr:border-gray-300 prose-hr:my-6 prose-hr:cursor-pointer
          prose-table:border-collapse prose-th:bg-gray-50
          [&_.ProseMirror-selectednode]:outline [&_.ProseMirror-selectednode]:outline-2 [&_.ProseMirror-selectednode]:outline-primary-500 [&_.ProseMirror-selectednode]:outline-offset-2
          [&_hr]:hover:border-primary-400 [&_hr]:transition-colors"
      />

      {/* Barre de statut */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>{characterCount.characters()} caracteres</span>
          <span>{wordCount} mots</span>
          <span>~{Math.ceil(wordCount / 200)} min de lecture</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Sauvegarde automatique</span>
        </div>
      </div>

      {/* Modal Lien */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowLinkModal(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Inserer un lien</h3>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://exemple.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleAddLink}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Inserer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Image */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowImageModal(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Inserer une image</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://exemple.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Texte alternatif (optionnel)</label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Description de l'image"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Inserer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Video */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowVideoModal(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Inserer une video YouTube</h3>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 mb-4"
              autoFocus
            />
            <p className="text-xs text-gray-500 mb-4">
              Collez l'URL d'une video YouTube
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleAddVideo}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Inserer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
