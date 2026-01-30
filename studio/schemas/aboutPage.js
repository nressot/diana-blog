import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons'

export default defineType({
  name: 'aboutPage',
  title: 'Page A Propos',
  type: 'document',
  icon: UserIcon,
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'story', title: 'Mon Histoire'},
    {name: 'values', title: 'Valeurs'},
    {name: 'milestones', title: 'Parcours'},
    {name: 'cta', title: 'Appel a l\'action'},
  ],
  fields: [
    // Hero
    defineField({
      name: 'hero',
      title: 'Section Hero',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({
          name: 'title',
          title: 'Titre',
          type: 'string',
          initialValue: 'A propos de moi',
        }),
        defineField({
          name: 'subtitle',
          title: 'Sous-titre',
          type: 'text',
          rows: 2,
          initialValue: 'Decouvrez mon parcours, ma passion pour l\'ecriture et ce qui anime ma plume au quotidien.',
        }),
      ],
    }),

    // Story
    defineField({
      name: 'story',
      title: 'Mon Histoire',
      type: 'object',
      group: 'story',
      fields: [
        defineField({
          name: 'title',
          title: 'Titre de section',
          type: 'string',
          initialValue: 'Mon histoire',
        }),
        defineField({
          name: 'paragraphs',
          title: 'Paragraphes',
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
          description: 'Racontez votre histoire en plusieurs paragraphes',
        }),
      ],
    }),

    // Values
    defineField({
      name: 'valuesSection',
      title: 'Section Valeurs',
      type: 'object',
      group: 'values',
      fields: [
        defineField({
          name: 'title',
          title: 'Titre de section',
          type: 'string',
          initialValue: 'Mes valeurs',
        }),
        defineField({
          name: 'values',
          title: 'Valeurs',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'icon',
                  title: 'Icone',
                  type: 'string',
                  options: {
                    list: [
                      {title: 'Plume (PenTool)', value: 'PenTool'},
                      {title: 'Livre (BookOpen)', value: 'BookOpen'},
                      {title: 'Coeur (Heart)', value: 'Heart'},
                      {title: 'Trophee (Award)', value: 'Award'},
                      {title: 'Etoile (Star)', value: 'Star'},
                      {title: 'Ampoule (Lightbulb)', value: 'Lightbulb'},
                      {title: 'Utilisateurs (Users)', value: 'Users'},
                      {title: 'Globe (Globe)', value: 'Globe'},
                    ],
                  },
                }),
                defineField({
                  name: 'title',
                  title: 'Titre',
                  type: 'string',
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
                  title: 'title',
                  subtitle: 'description',
                },
              },
            },
          ],
        }),
      ],
    }),

    // Milestones
    defineField({
      name: 'milestonesSection',
      title: 'Section Parcours',
      type: 'object',
      group: 'milestones',
      fields: [
        defineField({
          name: 'title',
          title: 'Titre de section',
          type: 'string',
          initialValue: 'Mon parcours',
        }),
        defineField({
          name: 'milestones',
          title: 'Etapes',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'year',
                  title: 'Annee',
                  type: 'string',
                }),
                defineField({
                  name: 'title',
                  title: 'Titre',
                  type: 'string',
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
                  title: 'title',
                  subtitle: 'year',
                },
              },
            },
          ],
        }),
      ],
    }),

    // CTA
    defineField({
      name: 'cta',
      title: 'Appel a l\'action',
      type: 'object',
      group: 'cta',
      fields: [
        defineField({
          name: 'title',
          title: 'Titre',
          type: 'string',
          initialValue: 'Envie d\'echanger ?',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 2,
          initialValue: 'Je suis toujours heureuse de recevoir vos messages, que ce soit pour discuter litterature, partager vos impressions ou simplement echanger.',
        }),
        defineField({
          name: 'buttonText',
          title: 'Texte du bouton',
          type: 'string',
          initialValue: 'Me contacter',
        }),
        defineField({
          name: 'buttonLink',
          title: 'Lien du bouton',
          type: 'string',
          initialValue: '/contact',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Page A Propos',
        subtitle: 'Configuration de la page A propos',
      }
    },
  },
})
