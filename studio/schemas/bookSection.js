import {defineField, defineType} from 'sanity'
import {BookIcon} from '@sanity/icons'

export default defineType({
  name: 'bookSection',
  title: 'Section Livre',
  type: 'document',
  icon: BookIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Titre de section',
      type: 'string',
      initialValue: 'Mon dernier livre',
    }),
    defineField({
      name: 'bookTitle',
      title: 'Titre du livre',
      type: 'string',
      description: 'Le titre du livre a mettre en avant',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          marks: {
            decorators: [
              {title: 'Gras', value: 'strong'},
              {title: 'Italique', value: 'em'},
            ],
          },
        },
      ],
      description: 'Texte de presentation du livre',
    }),
    defineField({
      name: 'ctaText',
      title: 'Texte du bouton',
      type: 'string',
      initialValue: 'Acheter',
    }),
    defineField({
      name: 'ctaLink',
      title: 'Lien du bouton',
      type: 'string',
      description: 'URL vers la page d\'achat ou reference a un produit',
    }),
    defineField({
      name: 'bookCover',
      title: 'Couverture du livre',
      type: 'image',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          title: 'Texte alternatif',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'geometricShape',
      title: 'Forme geometrique decorative',
      type: 'image',
      description: 'Image decorative optionnelle',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      bookTitle: 'bookTitle',
      media: 'bookCover',
    },
    prepare({title, bookTitle, media}) {
      return {
        title: title || 'Section Livre',
        subtitle: bookTitle || 'Configuration de la section livre',
        media,
      }
    },
  },
})
