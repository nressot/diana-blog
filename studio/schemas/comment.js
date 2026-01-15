import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'comment',
  title: 'Commentaire',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom du commenteur',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'Optionnel - ne sera pas affiche publiquement',
    }),
    defineField({
      name: 'content',
      title: 'Contenu du commentaire',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'article',
      title: 'Article',
      type: 'reference',
      to: [{type: 'article'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'createdAt',
      title: 'Date de creation',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  orderings: [
    {
      title: 'Date de creation (recent)',
      name: 'createdAtDesc',
      by: [{field: 'createdAt', direction: 'desc'}],
    },
    {
      title: 'Date de creation (ancien)',
      name: 'createdAtAsc',
      by: [{field: 'createdAt', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'name',
      articleTitle: 'article.title',
      createdAt: 'createdAt',
    },
    prepare({title, articleTitle, createdAt}) {
      const date = createdAt ? new Date(createdAt).toLocaleDateString('fr-FR') : 'Date inconnue'
      return {
        title: title || 'Commentaire anonyme',
        subtitle: `${articleTitle || 'Article inconnu'} | ${date}`,
      }
    },
  },
})
