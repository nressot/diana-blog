import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'author',
  title: 'Auteur',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'Ex: Ecrivaine & Blogueuse',
    }),
    defineField({
      name: 'avatar',
      title: 'Photo de profil',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'bio',
      title: 'Biographie',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'stats',
      title: 'Statistiques',
      type: 'object',
      fields: [
        {name: 'articles', title: 'Nombre d\'articles', type: 'number'},
        {name: 'readers', title: 'Lecteurs (ex: 12.5k)', type: 'string'},
        {name: 'years', title: 'Annees d\'experience', type: 'number'},
      ],
    }),
    defineField({
      name: 'social',
      title: 'Reseaux sociaux',
      type: 'object',
      fields: [
        {name: 'twitter', title: 'Twitter', type: 'url'},
        {name: 'instagram', title: 'Instagram', type: 'url'},
        {name: 'linkedin', title: 'LinkedIn', type: 'url'},
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'avatar',
    },
  },
})
