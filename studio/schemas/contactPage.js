import {defineField, defineType} from 'sanity'
import {EnvelopeIcon} from '@sanity/icons'

export default defineType({
  name: 'contactPage',
  title: 'Page Contact',
  type: 'document',
  icon: EnvelopeIcon,
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'info', title: 'Informations'},
    {name: 'form', title: 'Formulaire'},
    {name: 'faq', title: 'FAQ'},
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
          initialValue: 'Contactez-moi',
        }),
        defineField({
          name: 'subtitle',
          title: 'Sous-titre',
          type: 'text',
          rows: 2,
          initialValue: 'Une question, une collaboration ou simplement envie d\'echanger ? N\'hesitez pas a me contacter.',
        }),
      ],
    }),

    // Contact Info
    defineField({
      name: 'contactInfo',
      title: 'Informations de contact',
      type: 'array',
      group: 'info',
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
                  {title: 'Email (Mail)', value: 'Mail'},
                  {title: 'Localisation (MapPin)', value: 'MapPin'},
                  {title: 'Horloge (Clock)', value: 'Clock'},
                  {title: 'Telephone (Phone)', value: 'Phone'},
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
              name: 'value',
              title: 'Valeur',
              type: 'string',
            }),
            defineField({
              name: 'href',
              title: 'Lien (optionnel)',
              type: 'string',
              description: 'Ex: mailto:email@exemple.com',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'value',
            },
          },
        },
      ],
    }),

    // Social Links
    defineField({
      name: 'socialSection',
      title: 'Reseaux sociaux',
      type: 'object',
      group: 'info',
      fields: [
        defineField({
          name: 'title',
          title: 'Titre de section',
          type: 'string',
          initialValue: 'Retrouvez-moi sur',
        }),
        defineField({
          name: 'links',
          title: 'Liens',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'platform',
                  title: 'Plateforme',
                  type: 'string',
                  options: {
                    list: [
                      {title: 'Instagram', value: 'Instagram'},
                      {title: 'Twitter/X', value: 'Twitter'},
                      {title: 'LinkedIn', value: 'Linkedin'},
                      {title: 'Facebook', value: 'Facebook'},
                      {title: 'YouTube', value: 'Youtube'},
                    ],
                  },
                }),
                defineField({
                  name: 'url',
                  title: 'URL',
                  type: 'url',
                }),
                defineField({
                  name: 'handle',
                  title: 'Nom d\'utilisateur',
                  type: 'string',
                  description: 'Ex: @diana_ecrit',
                }),
              ],
              preview: {
                select: {
                  title: 'platform',
                  subtitle: 'handle',
                },
              },
            },
          ],
        }),
      ],
    }),

    // Form
    defineField({
      name: 'form',
      title: 'Formulaire de contact',
      type: 'object',
      group: 'form',
      fields: [
        defineField({
          name: 'title',
          title: 'Titre du formulaire',
          type: 'string',
          initialValue: 'Envoyez-moi un message',
        }),
        defineField({
          name: 'nameLabel',
          title: 'Label champ nom',
          type: 'string',
          initialValue: 'Nom complet',
        }),
        defineField({
          name: 'emailLabel',
          title: 'Label champ email',
          type: 'string',
          initialValue: 'Email',
        }),
        defineField({
          name: 'subjectLabel',
          title: 'Label champ sujet',
          type: 'string',
          initialValue: 'Sujet',
        }),
        defineField({
          name: 'messageLabel',
          title: 'Label champ message',
          type: 'string',
          initialValue: 'Message',
        }),
        defineField({
          name: 'submitText',
          title: 'Texte du bouton envoyer',
          type: 'string',
          initialValue: 'Envoyer le message',
        }),
        defineField({
          name: 'successMessage',
          title: 'Message de succes',
          type: 'text',
          rows: 2,
          initialValue: 'Message envoye ! Je vous repondrai dans les plus brefs delais.',
        }),
      ],
    }),

    // FAQ
    defineField({
      name: 'faqSection',
      title: 'Questions frequentes',
      type: 'object',
      group: 'faq',
      fields: [
        defineField({
          name: 'title',
          title: 'Titre de section',
          type: 'string',
          initialValue: 'Questions frequentes',
        }),
        defineField({
          name: 'items',
          title: 'Questions/Reponses',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'question',
                  title: 'Question',
                  type: 'string',
                }),
                defineField({
                  name: 'answer',
                  title: 'Reponse',
                  type: 'text',
                  rows: 3,
                }),
              ],
              preview: {
                select: {
                  title: 'question',
                },
              },
            },
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Page Contact',
        subtitle: 'Configuration de la page Contact',
      }
    },
  },
})
