import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'product',
  title: 'Produit',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description courte',
      type: 'text',
      rows: 3,
      description: 'Resume affiche dans les listes de produits',
    }),
    defineField({
      name: 'content',
      title: 'Description detaillee',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'Citation', value: 'blockquote'},
          ],
          lists: [
            {title: 'Liste a puces', value: 'bullet'},
            {title: 'Liste numerotee', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Gras', value: 'strong'},
              {title: 'Italique', value: 'em'},
              {title: 'Souligne', value: 'underline'},
              {title: 'Code', value: 'code'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Lien',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              title: 'Texte alternatif',
              type: 'string',
            },
            {
              name: 'caption',
              title: 'Legende',
              type: 'string',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'price',
      title: 'Prix (en centimes)',
      type: 'number',
      description: 'Ex: 1990 pour 19,90 euros',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'originalPrice',
      title: 'Prix original (en centimes)',
      type: 'number',
      description: 'Pour afficher une promotion - laisser vide si pas de promo',
    }),
    defineField({
      name: 'image',
      title: 'Image principale',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Texte alternatif',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie d\'images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              title: 'Texte alternatif',
              type: 'string',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'category',
      title: 'Categorie',
      type: 'reference',
      to: [{type: 'productCategory'}],
    }),
    defineField({
      name: 'available',
      title: 'Disponible',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'featured',
      title: 'Produit mis en avant',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'stripeProductId',
      title: 'ID Produit Stripe',
      type: 'string',
      description: 'Identifiant du produit dans Stripe',
    }),
    defineField({
      name: 'stripePriceId',
      title: 'ID Prix Stripe',
      type: 'string',
      description: 'Identifiant du prix dans Stripe',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    // Champs specifiques librairie
    defineField({
      name: 'productType',
      title: 'Type de produit',
      type: 'string',
      options: {
        list: [
          {title: 'Livre papier', value: 'book'},
          {title: 'Ebook', value: 'ebook'},
          {title: 'Goodie', value: 'goodie'},
          {title: 'Bundle', value: 'bundle'},
        ],
        layout: 'radio',
      },
      initialValue: 'book',
    }),
    defineField({
      name: 'bookMeta',
      title: 'Metadonnees du livre',
      type: 'object',
      hidden: ({document}) => !['book', 'ebook'].includes(document?.productType),
      fields: [
        {name: 'isbn', title: 'ISBN', type: 'string'},
        {name: 'pages', title: 'Nombre de pages', type: 'number'},
        {name: 'format', title: 'Format', type: 'string', description: 'Ex: 14x21cm, Poche, Grand format'},
        {name: 'publisher', title: 'Editeur', type: 'string'},
        {name: 'publicationDate', title: 'Date de publication', type: 'date'},
        {name: 'language', title: 'Langue', type: 'string', initialValue: 'Francais'},
        {name: 'readingTime', title: 'Temps de lecture (minutes)', type: 'number'},
        {name: 'genres', title: 'Genres', type: 'array', of: [{type: 'string'}], options: {layout: 'tags'}},
      ],
    }),
    defineField({
      name: 'series',
      title: 'Serie/Collection',
      type: 'object',
      fields: [
        {name: 'name', title: 'Nom de la serie', type: 'string'},
        {name: 'volume', title: 'Tome/Volume', type: 'number'},
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Extrait du livre',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Extrait a afficher sur la page produit',
    }),
    defineField({
      name: 'formats',
      title: 'Formats disponibles',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {name: 'id', title: 'ID', type: 'string', validation: Rule => Rule.required()},
          {name: 'label', title: 'Label affiche', type: 'string', validation: Rule => Rule.required()},
          {name: 'formatType', title: 'Type', type: 'string', options: {list: ['paperback', 'hardcover', 'ebook', 'audiobook']}},
          {name: 'price', title: 'Prix (centimes)', type: 'number', validation: Rule => Rule.required().positive()},
          {name: 'originalPrice', title: 'Prix original (centimes)', type: 'number'},
          {name: 'stripePriceId', title: 'Stripe Price ID', type: 'string'},
          {name: 'inStock', title: 'En stock', type: 'boolean', initialValue: true},
        ],
        preview: {
          select: {label: 'label', price: 'price'},
          prepare({label, price}) {
            return {title: label, subtitle: price ? `${(price/100).toFixed(2)} EUR` : ''}
          }
        }
      }],
    }),
    defineField({
      name: 'author',
      title: 'Auteur',
      type: 'reference',
      to: [{type: 'author'}],
    }),
    defineField({
      name: 'relatedProducts',
      title: 'Produits lies (manuels)',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'product'}]}],
    }),
  ],
  orderings: [
    {
      title: 'Date de publication (recent)',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Prix (croissant)',
      name: 'priceAsc',
      by: [{field: 'price', direction: 'asc'}],
    },
    {
      title: 'Prix (decroissant)',
      name: 'priceDesc',
      by: [{field: 'price', direction: 'desc'}],
    },
    {
      title: 'Titre (A-Z)',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      price: 'price',
      available: 'available',
      category: 'category.name',
      media: 'image',
    },
    prepare({title, price, available, category, media}) {
      const priceFormatted = price ? `${(price / 100).toFixed(2)} euros` : 'Prix non defini'
      const status = available ? '' : ' [Indisponible]'
      return {
        title: `${title}${status}`,
        subtitle: `${priceFormatted} | ${category || 'Sans categorie'}`,
        media,
      }
    },
  },
})
