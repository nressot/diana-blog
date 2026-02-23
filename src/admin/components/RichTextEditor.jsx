import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import CharacterCount from '@tiptap/extension-character-count'
import Youtube from '@tiptap/extension-youtube'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { uploadImage } from '../../lib/supabase'
import { ImageExtension } from './extensions/ImageExtension'
import { FontFamilyExtension, FONT_FAMILIES } from './extensions/FontFamilyExtension'
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
  Palette,
  ChevronDown,
  ChevronRight,
  Upload,
  Maximize2,
  Minimize2,
  Copy,
  Scissors,
  ClipboardPaste,
  Trash2
} from 'lucide-react'

// Options de taille d'image
const IMAGE_SIZES = [
  { name: 'Petite', value: 'small', desc: 'Dans le texte' },
  { name: 'Moyenne', value: 'medium', desc: '50% largeur' },
  { name: 'Grande', value: 'large', desc: '75% largeur' },
  { name: 'Pleine largeur', value: 'full', desc: '100%' },
]

// Options d'alignement d'image
const IMAGE_ALIGNMENTS = [
  { name: 'Gauche', value: 'left', icon: AlignLeft },
  { name: 'Centre', value: 'center', icon: AlignCenter },
  { name: 'Droite', value: 'right', icon: AlignRight },
]

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

// Couleurs de texte
const TEXT_COLORS = [
  { name: 'Noir', value: '#000000' },
  { name: 'Gris fonce', value: '#374151' },
  { name: 'Gris', value: '#6B7280' },
  { name: 'Rouge', value: '#DC2626' },
  { name: 'Orange', value: '#EA580C' },
  { name: 'Jaune', value: '#CA8A04' },
  { name: 'Vert', value: '#16A34A' },
  { name: 'Bleu', value: '#2563EB' },
  { name: 'Violet', value: '#7C3AED' },
  { name: 'Rose', value: '#DB2777' },
  { name: 'Terracotta', value: '#C2410C' },
  { name: 'Turquoise', value: '#0891B2' },
]

export default function RichTextEditor({ content, onChange, onReadTimeChange }) {
  const [openDropdown, setOpenDropdown] = useState(null)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showImageModal, setShowImageModal] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [imageAlignment, setImageAlignment] = useState('center')
  const [imageSize, setImageSize] = useState('large')
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, hasSelection: false, isLink: false, activeSubmenu: null })
  const lastReadTimeRef = useRef(null)
  const onReadTimeChangeRef = useRef(onReadTimeChange)
  const savedSelectionRef = useRef(null)
  const fileInputRef = useRef(null)

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
    ImageExtension,
    TextStyle,
    FontFamilyExtension,
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
    }),
    Color
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
    },
    onSelectionUpdate: ({ editor }) => {
      // Detecter si une image est selectionnee
      const { from } = editor.state.selection
      const node = editor.state.doc.nodeAt(from)
      if (node?.type.name === 'image') {
        setSelectedImage({
          pos: from,
          attrs: node.attrs
        })
      } else {
        setSelectedImage(null)
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
  const closeContextMenu = () => setContextMenu({ show: false, x: 0, y: 0, hasSelection: false, isLink: false, activeSubmenu: null })

  // Gestion du clic droit (menu contextuel)
  const handleContextMenu = useCallback((e) => {
    e.preventDefault()
    if (!editor) return

    // Capturer l'etat de la selection AVANT d'ouvrir le menu
    const hasSelection = !editor.state.selection.empty
    const isLink = editor.isActive('link')

    // Position du menu
    const x = e.clientX
    const y = e.clientY

    setContextMenu({ show: true, x, y, hasSelection, isLink })
  }, [editor])

  // Actions du menu contextuel (utilise l'etat capture a l'ouverture du menu)
  const getContextMenuActions = useCallback(() => {
    if (!editor) return []

    // Utiliser les valeurs capturees au moment du clic droit
    const hasSelection = contextMenu.hasSelection
    const isLink = contextMenu.isLink

    return [
      {
        label: 'Couper',
        icon: Scissors,
        action: () => {
          document.execCommand('cut')
          closeContextMenu()
        },
        disabled: !hasSelection
      },
      {
        label: 'Copier',
        icon: Copy,
        action: () => {
          document.execCommand('copy')
          closeContextMenu()
        },
        disabled: !hasSelection
      },
      {
        label: 'Coller',
        icon: ClipboardPaste,
        action: async () => {
          try {
            const text = await navigator.clipboard.readText()
            editor.chain().focus().insertContent(text).run()
          } catch {
            document.execCommand('paste')
          }
          closeContextMenu()
        }
      },
      { divider: true },
      {
        label: 'Gras',
        icon: Bold,
        action: () => {
          editor.chain().focus().toggleBold().run()
          closeContextMenu()
        },
        isActive: editor.isActive('bold'),
        disabled: !hasSelection
      },
      {
        label: 'Italique',
        icon: Italic,
        action: () => {
          editor.chain().focus().toggleItalic().run()
          closeContextMenu()
        },
        isActive: editor.isActive('italic'),
        disabled: !hasSelection
      },
      {
        label: 'Souligne',
        icon: UnderlineIcon,
        action: () => {
          editor.chain().focus().toggleUnderline().run()
          closeContextMenu()
        },
        isActive: editor.isActive('underline'),
        disabled: !hasSelection
      },
      {
        label: 'Barre',
        icon: Strikethrough,
        action: () => {
          editor.chain().focus().toggleStrike().run()
          closeContextMenu()
        },
        isActive: editor.isActive('strike'),
        disabled: !hasSelection
      },
      { divider: true },
      {
        label: 'Couleur du texte',
        icon: Palette,
        disabled: !hasSelection,
        submenu: 'colors'
      },
      {
        label: 'Surlignage',
        icon: Highlighter,
        disabled: !hasSelection,
        submenu: 'highlight'
      },
      { divider: true },
      {
        label: 'Inserer un lien',
        icon: LinkIcon,
        action: () => {
          setShowLinkModal(true)
          closeContextMenu()
        },
        disabled: !hasSelection
      },
      {
        label: 'Supprimer le lien',
        icon: Unlink,
        action: () => {
          editor.chain().focus().unsetLink().run()
          closeContextMenu()
        },
        show: isLink
      },
      { divider: true },
      {
        label: 'Supprimer la selection',
        icon: Trash2,
        action: () => {
          editor.chain().focus().deleteSelection().run()
          closeContextMenu()
        },
        disabled: !hasSelection,
        danger: true
      }
    ]
  }, [editor, contextMenu.hasSelection, contextMenu.isLink])

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

  // Mettre a jour les attributs d'une image selectionnee
  const updateSelectedImage = useCallback((attrs) => {
    if (!editor || !selectedImage) return

    const { pos } = selectedImage
    const node = editor.state.doc.nodeAt(pos)
    if (!node || node.type.name !== 'image') return

    editor.chain().focus()
      .setNodeSelection(pos)
      .updateAttributes('image', attrs)
      .run()

    setSelectedImage(prev => prev ? { ...prev, attrs: { ...prev.attrs, ...attrs } } : null)
  }, [editor, selectedImage])

  // Gestion des images
  const handleAddImage = useCallback(() => {
    if (imageUrl) {
      editor.chain().focus().setImage({
        src: imageUrl,
        alt: imageAlt,
        alignment: imageAlignment,
        size: imageSize
      }).run()
    }
    setShowImageModal(false)
    setImageUrl('')
    setImageAlt('')
    setImageAlignment('center')
    setImageSize('large')
  }, [editor, imageUrl, imageAlt, imageAlignment, imageSize])

  // Upload d'image depuis l'ordinateur
  const handleFileUpload = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Veuillez selectionner une image valide')
      return
    }

    setIsUploadingImage(true)
    try {
      const url = await uploadImage(file, 'articles')
      if (url) {
        editor.chain().focus().setImage({
          src: url,
          alt: imageAlt || file.name,
          alignment: imageAlignment,
          size: imageSize
        }).run()
        setShowImageModal(false)
        setImageUrl('')
        setImageAlt('')
        setImageAlignment('center')
        setImageSize('large')
      }
    } catch (error) {
      console.error('Erreur upload image:', error)
      alert('Erreur lors de l\'upload de l\'image')
    } finally {
      setIsUploadingImage(false)
    }
  }, [editor, imageAlt, imageAlignment, imageSize])

  const handleFileInputChange = useCallback((e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
    // Reset input pour permettre de re-selectionner le meme fichier
    e.target.value = ''
  }, [handleFileUpload])

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

        {/* Selecteur de police */}
        <DropdownMenu
          trigger={<span className="text-sm font-medium px-1">Police</span>}
          isOpen={openDropdown === 'fontFamily'}
          onToggle={() => toggleDropdown('fontFamily')}
        >
          <div className="max-h-60 overflow-y-auto">
            {FONT_FAMILIES.map(font => (
              <DropdownItem
                key={font.name}
                onMouseDown={() => executeCommand(() => {
                  if (font.value) {
                    editor.commands.setFontFamily(font.value)
                  } else {
                    editor.commands.unsetFontFamily()
                  }
                })}
                isActive={font.value ? editor.isActive('textStyle', { fontFamily: font.value }) : !editor.getAttributes('textStyle').fontFamily}
              >
                <span style={{ fontFamily: font.preview }}>{font.name}</span>
              </DropdownItem>
            ))}
          </div>
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

        {/* Couleur de texte */}
        <DropdownMenu
          trigger={<Palette size={18} />}
          isOpen={openDropdown === 'textColor'}
          onToggle={() => toggleDropdown('textColor')}
        >
          <div className="px-3 py-2">
            <p className="text-xs text-gray-500 mb-2">Couleur du texte</p>
            <div className="grid grid-cols-4 gap-1">
              {TEXT_COLORS.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    executeCommand(() => editor.commands.setColor(color.value))
                  }}
                  className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform flex items-center justify-center"
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {color.value === '#000000' && (
                    <span className="text-white text-xs font-bold">A</span>
                  )}
                </button>
              ))}
            </div>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault()
                executeCommand(() => editor.commands.unsetColor())
              }}
              className="mt-2 text-xs text-gray-500 hover:text-gray-700"
            >
              Reinitialiser
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
      <div className="relative" onContextMenu={handleContextMenu}>
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

        {/* Barre d'outils image */}
        {selectedImage && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex items-center gap-2">
            <span className="text-xs text-gray-500 px-2">Image:</span>

            {/* Alignement */}
            <div className="flex items-center border-r border-gray-200 pr-2">
              {IMAGE_ALIGNMENTS.map(({ name, value, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateSelectedImage({ alignment: value })}
                  className={`p-1.5 rounded transition-colors ${
                    selectedImage.attrs?.alignment === value
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                  title={name}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>

            {/* Taille */}
            <div className="flex items-center gap-1">
              {IMAGE_SIZES.map(({ name, value }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateSelectedImage({ size: value })}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    selectedImage.attrs?.size === value
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                  title={name}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Menu contextuel (clic droit) */}
        {contextMenu.show && (
          <>
            {/* Overlay pour fermer le menu */}
            <div
              className="fixed inset-0 z-40"
              onClick={closeContextMenu}
              onContextMenu={(e) => {
                e.preventDefault()
                closeContextMenu()
              }}
            />
            {/* Menu */}
            <div
              className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[200px]"
              style={{
                left: Math.min(contextMenu.x, window.innerWidth - 220),
                top: Math.min(contextMenu.y, window.innerHeight - 400)
              }}
            >
              {getContextMenuActions()
                .filter(item => item.show !== false)
                .map((item, index) => {
                  if (item.divider) {
                    return <div key={index} className="border-t border-gray-100 my-1" />
                  }
                  const Icon = item.icon

                  // Item avec sous-menu (couleurs)
                  if (item.submenu) {
                    return (
                      <div
                        key={index}
                        className="relative"
                        onMouseEnter={() => !item.disabled && setContextMenu(prev => ({ ...prev, activeSubmenu: item.submenu }))}
                        onMouseLeave={() => setContextMenu(prev => ({ ...prev, activeSubmenu: null }))}
                      >
                        <button
                          type="button"
                          disabled={item.disabled}
                          className={`w-full flex items-center justify-between gap-3 px-4 py-2 text-sm transition-colors
                            ${item.disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}
                          `}
                        >
                          <span className="flex items-center gap-3">
                            <Icon size={16} />
                            <span>{item.label}</span>
                          </span>
                          <ChevronRight size={14} />
                        </button>

                        {/* Sous-menu couleurs */}
                        {contextMenu.activeSubmenu === item.submenu && !item.disabled && (
                          <div className="absolute left-full top-0 ml-1 bg-white rounded-lg shadow-xl border border-gray-200 p-3 min-w-[160px]">
                            <p className="text-xs text-gray-500 mb-2">
                              {item.submenu === 'colors' ? 'Couleur du texte' : 'Surlignage'}
                            </p>
                            <div className="grid grid-cols-4 gap-1.5">
                              {(item.submenu === 'colors' ? TEXT_COLORS : HIGHLIGHT_COLORS).map(color => (
                                <button
                                  key={color.value}
                                  type="button"
                                  onClick={() => {
                                    if (item.submenu === 'colors') {
                                      editor.chain().focus().setColor(color.value).run()
                                    } else {
                                      editor.chain().focus().toggleHighlight({ color: color.value }).run()
                                    }
                                    closeContextMenu()
                                  }}
                                  className="w-7 h-7 rounded border border-gray-200 hover:scale-110 transition-transform flex items-center justify-center"
                                  style={{ backgroundColor: color.value }}
                                  title={color.name}
                                >
                                  {color.value === '#000000' && (
                                    <span className="text-white text-xs font-bold">A</span>
                                  )}
                                </button>
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (item.submenu === 'colors') {
                                  editor.chain().focus().unsetColor().run()
                                } else {
                                  editor.chain().focus().unsetHighlight().run()
                                }
                                closeContextMenu()
                              }}
                              className="mt-2 text-xs text-gray-500 hover:text-gray-700"
                            >
                              Reinitialiser
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  }

                  // Item normal
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={item.action}
                      disabled={item.disabled}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors
                        ${item.disabled ? 'text-gray-300 cursor-not-allowed' : ''}
                        ${item.danger && !item.disabled ? 'text-red-600 hover:bg-red-50' : ''}
                        ${item.isActive && !item.disabled ? 'bg-primary-50 text-primary-700' : ''}
                        ${!item.disabled && !item.danger && !item.isActive ? 'text-gray-700 hover:bg-gray-50' : ''}
                      `}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </button>
                  )
                })}
            </div>
          </>
        )}
      </div>

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

            {/* Input fichier cache */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {/* Zone d'upload */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center mb-4 transition-colors cursor-pointer ${
                isUploadingImage
                  ? 'border-primary-400 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
              }`}
              onClick={() => !isUploadingImage && fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
              onDrop={(e) => {
                e.preventDefault()
                e.stopPropagation()
                const file = e.dataTransfer.files?.[0]
                if (file) handleFileUpload(file)
              }}
            >
              {isUploadingImage ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-gray-600">Upload en cours...</span>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    Glissez une image ici ou <span className="text-primary-600 font-medium">parcourir</span>
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG, GIF jusqu'a 10MB</p>
                </>
              )}
            </div>

            <div className="relative flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm text-gray-400">ou</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://exemple.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  disabled={isUploadingImage}
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
                  disabled={isUploadingImage}
                />
              </div>

              {/* Alignement */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alignement</label>
                <div className="flex gap-2">
                  {IMAGE_ALIGNMENTS.map(({ name, value, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setImageAlignment(value)}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                        imageAlignment === value
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      disabled={isUploadingImage}
                    >
                      <Icon size={16} />
                      <span className="text-sm">{name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Taille */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Taille</label>
                <div className="grid grid-cols-2 gap-2">
                  {IMAGE_SIZES.map(({ name, value, desc }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setImageSize(value)}
                      className={`px-3 py-2 rounded-lg border text-left transition-colors ${
                        imageSize === value
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      disabled={isUploadingImage}
                    >
                      <span className="text-sm font-medium block">{name}</span>
                      <span className="text-xs text-gray-500">{desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isUploadingImage}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleAddImage}
                disabled={isUploadingImage || !imageUrl}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Inserer via URL
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
