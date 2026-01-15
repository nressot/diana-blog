import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'productCategory',
  title: 'Categorie de produit',
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'color',
      title: 'Couleur (classe Tailwind)',
      type: 'string',
      description: 'Ex: bg-rose-400, bg-purple-400, bg-amber-600',
      initialValue: 'bg-neutral-500',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      color: 'color',
    },
    prepare({title, color}) {
      return {
        title,
        subtitle: color,
      }
    },
  },
})
