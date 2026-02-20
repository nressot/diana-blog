import Image from '@tiptap/extension-image'

/**
 * Extension TipTap personnalisee pour les images avec support:
 * - Alignement (left, center, right)
 * - Taille (small, medium, large, full)
 */
export const ImageExtension = Image.extend({
  name: 'image',

  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      alignment: {
        default: 'center',
        parseHTML: element => element.getAttribute('data-alignment') || 'center',
        renderHTML: attributes => ({
          'data-alignment': attributes.alignment,
        }),
      },
      size: {
        default: 'large',
        parseHTML: element => element.getAttribute('data-size') || 'large',
        renderHTML: attributes => ({
          'data-size': attributes.size,
        }),
      },
    }
  },

  addNodeView() {
    return ({ node, HTMLAttributes, getPos, editor }) => {
      const dom = document.createElement('figure')
      const img = document.createElement('img')

      // Classes de base
      dom.className = 'image-wrapper my-6'

      // Appliquer l'alignement
      const alignment = node.attrs.alignment || 'center'
      if (alignment === 'left') {
        dom.classList.add('float-left', 'mr-4', 'mb-2')
        dom.style.maxWidth = '50%'
      } else if (alignment === 'right') {
        dom.classList.add('float-right', 'ml-4', 'mb-2')
        dom.style.maxWidth = '50%'
      } else {
        dom.classList.add('mx-auto')
        dom.style.clear = 'both'
      }

      // Appliquer la taille
      const size = node.attrs.size || 'large'
      const sizeClasses = {
        small: 'max-w-xs',
        medium: 'max-w-md',
        large: 'max-w-2xl',
        full: 'max-w-full w-full',
      }

      img.className = `rounded-lg ${sizeClasses[size] || sizeClasses.large}`
      img.src = node.attrs.src
      img.alt = node.attrs.alt || ''

      // Rendre l'image selectionnable
      img.draggable = false
      img.addEventListener('click', () => {
        if (typeof getPos === 'function') {
          const pos = getPos()
          editor.commands.setNodeSelection(pos)
        }
      })

      dom.appendChild(img)

      return {
        dom,
        contentDOM: null,
        update: (updatedNode) => {
          if (updatedNode.type.name !== 'image') return false

          img.src = updatedNode.attrs.src
          img.alt = updatedNode.attrs.alt || ''

          // Reset classes
          dom.className = 'image-wrapper my-6'

          // Re-appliquer l'alignement
          const newAlignment = updatedNode.attrs.alignment || 'center'
          if (newAlignment === 'left') {
            dom.classList.add('float-left', 'mr-4', 'mb-2')
            dom.style.maxWidth = '50%'
          } else if (newAlignment === 'right') {
            dom.classList.add('float-right', 'ml-4', 'mb-2')
            dom.style.maxWidth = '50%'
          } else {
            dom.classList.add('mx-auto')
            dom.style.clear = 'both'
          }

          // Re-appliquer la taille
          const newSize = updatedNode.attrs.size || 'large'
          img.className = `rounded-lg ${sizeClasses[newSize] || sizeClasses.large}`

          return true
        },
      }
    }
  },

  renderHTML({ HTMLAttributes }) {
    const alignment = HTMLAttributes['data-alignment'] || 'center'
    const size = HTMLAttributes['data-size'] || 'large'

    // Classes d'alignement
    let wrapperStyle = ''
    let wrapperClass = 'image-wrapper my-6'

    if (alignment === 'left') {
      wrapperStyle = 'float: left; margin-right: 1rem; margin-bottom: 0.5rem; max-width: 50%;'
    } else if (alignment === 'right') {
      wrapperStyle = 'float: right; margin-left: 1rem; margin-bottom: 0.5rem; max-width: 50%;'
    } else {
      wrapperStyle = 'margin-left: auto; margin-right: auto; clear: both;'
    }

    // Classes de taille
    const sizeStyles = {
      small: 'max-width: 20rem;',
      medium: 'max-width: 28rem;',
      large: 'max-width: 42rem;',
      full: 'max-width: 100%; width: 100%;',
    }

    return [
      'figure',
      {
        class: wrapperClass,
        style: wrapperStyle + (sizeStyles[size] || sizeStyles.large),
        'data-alignment': alignment,
        'data-size': size,
      },
      [
        'img',
        {
          ...HTMLAttributes,
          class: 'rounded-lg',
          style: 'max-width: 100%;',
        },
      ],
    ]
  },

  parseHTML() {
    return [
      {
        tag: 'figure[class*="image-wrapper"]',
        getAttrs: element => {
          const img = element.querySelector('img')
          return {
            src: img?.getAttribute('src'),
            alt: img?.getAttribute('alt'),
            alignment: element.getAttribute('data-alignment') || 'center',
            size: element.getAttribute('data-size') || 'large',
          }
        },
      },
      {
        tag: 'img[src]',
        getAttrs: element => ({
          src: element.getAttribute('src'),
          alt: element.getAttribute('alt'),
          alignment: element.getAttribute('data-alignment') || 'center',
          size: element.getAttribute('data-size') || 'large',
        }),
      },
    ]
  },
})

export default ImageExtension
