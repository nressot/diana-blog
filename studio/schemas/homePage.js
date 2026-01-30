import {defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons'

export default defineType({
  name: 'homePage',
  title: 'Page Accueil',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'sections', title: 'Sections'},
    {name: 'newsletter', title: 'Newsletter'},
  ],
  fields: [
    // Hero Section
    defineField({
      name: 'hero',
      title: 'Section Hero',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({
          name: 'titleLine1',
          title: 'Titre ligne 1',
          type: 'string',
          description: 'Ex: "Des mots qui"',
          initialValue: 'Des mots qui',
        }),
        defineField({
          name: 'titleLine2',
          title: 'Titre ligne 2',
          type: 'string',
          description: 'Ex: "voyagent,"',
          initialValue: 'voyagent,',
        }),
        defineField({
          name: 'titleLine3',
          title: 'Titre ligne 3',
          type: 'string',
          description: 'Ex: "des histoires qui"',
          initialValue: 'des histoires qui',
        }),
        defineField({
          name: 'typewriterWords',
          title: 'Mots animes (effet machine a ecrire)',
          type: 'array',
          of: [{type: 'string'}],
          description: 'Liste de mots qui s\'affichent en boucle',
          initialValue: ['restent', 'inspirent', 'touchent', 'resonnent', 'captivent'],
        }),
        defineField({
          name: 'subtitle',
          title: 'Sous-titre',
          type: 'text',
          rows: 3,
          description: 'Texte d\'introduction sous le titre principal',
        }),
        defineField({
          name: 'primaryCta',
          title: 'Bouton principal',
          type: 'object',
          fields: [
            {name: 'text', title: 'Texte', type: 'string', initialValue: 'Lire mes articles'},
            {name: 'link', title: 'Lien', type: 'string', initialValue: '/blog'},
          ],
        }),
        defineField({
          name: 'secondaryCta',
          title: 'Bouton secondaire',
          type: 'object',
          fields: [
            {name: 'text', title: 'Texte', type: 'string', initialValue: 'Qui suis-je ?'},
            {name: 'link', title: 'Lien', type: 'string', initialValue: '/about'},
          ],
        }),
        defineField({
          name: 'heroImage',
          title: 'Image Hero',
          type: 'image',
          options: {hotspot: true},
        }),
      ],
    }),

    // Section Titles
    defineField({
      name: 'sections',
      title: 'Titres des Sections',
      type: 'object',
      group: 'sections',
      fields: [
        defineField({
          name: 'featured',
          title: 'Section A la une',
          type: 'object',
          fields: [
            {name: 'title', title: 'Titre', type: 'string', initialValue: 'A la une'},
            {name: 'subtitle', title: 'Sous-titre', type: 'string', initialValue: 'Ma derniere pensee'},
          ],
        }),
        defineField({
          name: 'categories',
          title: 'Section Categories',
          type: 'object',
          fields: [
            {name: 'title', title: 'Titre', type: 'string', initialValue: 'Categories'},
            {name: 'subtitle', title: 'Sous-titre', type: 'string', initialValue: 'Explorez par theme'},
          ],
        }),
        defineField({
          name: 'latestArticles',
          title: 'Section Derniers Articles',
          type: 'object',
          fields: [
            {name: 'title', title: 'Titre', type: 'string', initialValue: 'Derniers articles'},
            {name: 'subtitle', title: 'Sous-titre', type: 'string', initialValue: 'Mes ecrits les plus recents'},
          ],
        }),
        defineField({
          name: 'author',
          title: 'Section Auteur',
          type: 'object',
          fields: [
            {name: 'title', title: 'Titre', type: 'string', initialValue: 'Qui je suis'},
            {name: 'subtitle', title: 'Sous-titre', type: 'string', initialValue: 'Quelques mots sur moi'},
          ],
        }),
      ],
    }),

    // Newsletter
    defineField({
      name: 'newsletter',
      title: 'Section Newsletter',
      type: 'object',
      group: 'newsletter',
      fields: [
        defineField({
          name: 'title',
          title: 'Titre',
          type: 'string',
          initialValue: 'Restez connecte a mes ecrits',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 2,
          initialValue: 'Une newsletter mensuelle avec mes derniers articles, des reflexions exclusives et des recommandations litteraires.',
        }),
        defineField({
          name: 'placeholder',
          title: 'Placeholder du champ email',
          type: 'string',
          initialValue: 'Votre adresse email',
        }),
        defineField({
          name: 'buttonText',
          title: 'Texte du bouton',
          type: 'string',
          initialValue: 'S\'abonner',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Page Accueil',
        subtitle: 'Configuration de la page d\'accueil',
      }
    },
  },
})
