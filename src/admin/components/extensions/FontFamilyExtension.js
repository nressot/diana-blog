import { Extension } from '@tiptap/core'

/**
 * Extension TipTap pour le choix de police
 */
export const FontFamilyExtension = Extension.create({
  name: 'fontFamily',

  addOptions() {
    return {
      types: ['textStyle'],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontFamily: {
            default: null,
            parseHTML: element => element.style.fontFamily?.replace(/['"]/g, '') || null,
            renderHTML: attributes => {
              if (!attributes.fontFamily) {
                return {}
              }
              return {
                style: `font-family: ${attributes.fontFamily}`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setFontFamily: (fontFamily) => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontFamily })
          .run()
      },
      unsetFontFamily: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontFamily: null })
          .removeEmptyTextStyle()
          .run()
      },
    }
  },
})

/**
 * Liste des polices disponibles
 */
export const FONT_FAMILIES = [
  { name: 'Par defaut', value: null, preview: 'Be Vietnam Pro, sans-serif' },
  { name: 'Serif classique', value: 'Georgia, serif', preview: 'Georgia, serif' },
  { name: 'Times New Roman', value: 'Times New Roman, serif', preview: 'Times New Roman, serif' },
  { name: 'Garamond', value: 'Garamond, serif', preview: 'Garamond, serif' },
  { name: 'Palatino', value: 'Palatino Linotype, serif', preview: 'Palatino Linotype, serif' },
  { name: 'Arial', value: 'Arial, sans-serif', preview: 'Arial, sans-serif' },
  { name: 'Verdana', value: 'Verdana, sans-serif', preview: 'Verdana, sans-serif' },
  { name: 'Trebuchet', value: 'Trebuchet MS, sans-serif', preview: 'Trebuchet MS, sans-serif' },
  { name: 'Courier', value: 'Courier New, monospace', preview: 'Courier New, monospace' },
  { name: 'Cursive', value: 'Brush Script MT, cursive', preview: 'Brush Script MT, cursive' },
]

export default FontFamilyExtension
