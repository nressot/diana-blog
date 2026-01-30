import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  groups: [
    {name: 'content', title: 'Contenu', default: true},
    {name: 'meta', title: 'Metadonnees'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'meta',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Auteur',
      type: 'reference',
      group: 'meta',
      to: [{type: 'author'}],
    }),
    defineField({
      name: 'category',
      title: 'Categorie',
      type: 'reference',
      group: 'meta',
      to: [{type: 'category'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image principale',
      type: 'image',
      group: 'content',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Texte alternatif',
          type: 'string',
          description: 'Important pour l\'accessibilite et le SEO',
        },
        {
          name: 'caption',
          title: 'Legende',
          type: 'string',
        },
        {
          name: 'credit',
          title: 'Credit photo',
          type: 'string',
          description: 'Photographe ou source',
        },
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Extrait',
      type: 'text',
      group: 'content',
      rows: 3,
      description: 'Court resume affiche dans les listes d\'articles (max 300 caracteres)',
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'content',
      title: 'Contenu',
      type: 'array',
      group: 'content',
      of: [
        // === BLOC TEXTE ENRICHI ===
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Titre H2', value: 'h2'},
            {title: 'Titre H3', value: 'h3'},
            {title: 'Titre H4', value: 'h4'},
            {title: 'Citation', value: 'blockquote'},
            {title: 'Introduction', value: 'lead'},
            {title: 'Petit texte', value: 'small'},
          ],
          lists: [
            {title: 'Liste a puces', value: 'bullet'},
            {title: 'Liste numerotee', value: 'number'},
            {title: 'Liste a cocher', value: 'checklist'},
          ],
          marks: {
            decorators: [
              {title: 'Gras', value: 'strong'},
              {title: 'Italique', value: 'em'},
              {title: 'Souligne', value: 'underline'},
              {title: 'Barre', value: 'strike-through'},
              {title: 'Code', value: 'code'},
              {title: 'Surligne', value: 'highlight'},
              {title: 'Exposant', value: 'sup'},
              {title: 'Indice', value: 'sub'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Lien externe',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) => Rule.uri({
                      scheme: ['http', 'https', 'mailto', 'tel'],
                    }),
                  },
                  {
                    name: 'blank',
                    type: 'boolean',
                    title: 'Ouvrir dans un nouvel onglet',
                    initialValue: true,
                  },
                ],
              },
              {
                name: 'internalLink',
                type: 'object',
                title: 'Lien interne',
                fields: [
                  {
                    name: 'reference',
                    type: 'reference',
                    title: 'Article',
                    to: [{type: 'article'}],
                  },
                ],
              },
              {
                name: 'footnote',
                type: 'object',
                title: 'Note de bas de page',
                fields: [
                  {
                    name: 'text',
                    type: 'text',
                    title: 'Contenu de la note',
                    rows: 3,
                  },
                ],
              },
              {
                name: 'tooltip',
                type: 'object',
                title: 'Info-bulle',
                fields: [
                  {
                    name: 'text',
                    type: 'string',
                    title: 'Texte de l\'info-bulle',
                  },
                ],
              },
            ],
          },
        },

        // === IMAGE ===
        {
          type: 'image',
          name: 'articleImage',
          title: 'Image',
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
            {
              name: 'credit',
              title: 'Credit',
              type: 'string',
            },
            {
              name: 'size',
              title: 'Taille',
              type: 'string',
              options: {
                list: [
                  {title: 'Petite (dans le texte)', value: 'small'},
                  {title: 'Moyenne', value: 'medium'},
                  {title: 'Grande', value: 'large'},
                  {title: 'Pleine largeur', value: 'full'},
                ],
              },
              initialValue: 'large',
            },
            {
              name: 'alignment',
              title: 'Alignement',
              type: 'string',
              options: {
                list: [
                  {title: 'Gauche', value: 'left'},
                  {title: 'Centre', value: 'center'},
                  {title: 'Droite', value: 'right'},
                ],
              },
              initialValue: 'center',
            },
          ],
        },

        // === GALERIE D'IMAGES ===
        {
          type: 'object',
          name: 'gallery',
          title: 'Galerie',
          fields: [
            {
              name: 'images',
              title: 'Images',
              type: 'array',
              of: [
                {
                  type: 'image',
                  options: {hotspot: true},
                  fields: [
                    {name: 'alt', type: 'string', title: 'Texte alternatif'},
                    {name: 'caption', type: 'string', title: 'Legende'},
                  ],
                },
              ],
              validation: (Rule) => Rule.min(2).max(12),
            },
            {
              name: 'layout',
              title: 'Disposition',
              type: 'string',
              options: {
                list: [
                  {title: 'Grille (2 colonnes)', value: 'grid-2'},
                  {title: 'Grille (3 colonnes)', value: 'grid-3'},
                  {title: 'Carrousel', value: 'carousel'},
                  {title: 'Masonry', value: 'masonry'},
                ],
              },
              initialValue: 'grid-2',
            },
            {
              name: 'caption',
              title: 'Legende de la galerie',
              type: 'string',
            },
          ],
          preview: {
            select: {
              images: 'images',
              layout: 'layout',
            },
            prepare({images, layout}) {
              return {
                title: `Galerie (${images?.length || 0} images)`,
                subtitle: layout,
              }
            },
          },
        },

        // === CITATION MISE EN AVANT (Pull Quote) ===
        {
          type: 'object',
          name: 'pullQuote',
          title: 'Citation mise en avant',
          fields: [
            {
              name: 'quote',
              title: 'Citation',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'author',
              title: 'Auteur',
              type: 'string',
            },
            {
              name: 'source',
              title: 'Source (livre, oeuvre...)',
              type: 'string',
            },
            {
              name: 'style',
              title: 'Style',
              type: 'string',
              options: {
                list: [
                  {title: 'Simple', value: 'simple'},
                  {title: 'Avec guillemets decoratifs', value: 'decorative'},
                  {title: 'Encadre', value: 'bordered'},
                  {title: 'Sur fond colore', value: 'highlighted'},
                ],
              },
              initialValue: 'decorative',
            },
          ],
          preview: {
            select: {quote: 'quote', author: 'author'},
            prepare({quote, author}) {
              return {
                title: quote?.substring(0, 50) + '...',
                subtitle: author ? `- ${author}` : 'Citation',
              }
            },
          },
        },

        // === BLOC POESIE ===
        {
          type: 'object',
          name: 'poem',
          title: 'Poeme',
          fields: [
            {
              name: 'title',
              title: 'Titre du poeme',
              type: 'string',
            },
            {
              name: 'content',
              title: 'Texte du poeme',
              type: 'text',
              rows: 10,
              description: 'Les sauts de ligne seront preserves',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'author',
              title: 'Auteur',
              type: 'string',
            },
            {
              name: 'year',
              title: 'Annee',
              type: 'string',
            },
            {
              name: 'alignment',
              title: 'Alignement',
              type: 'string',
              options: {
                list: [
                  {title: 'Gauche', value: 'left'},
                  {title: 'Centre', value: 'center'},
                ],
              },
              initialValue: 'left',
            },
          ],
          preview: {
            select: {title: 'title', author: 'author'},
            prepare({title, author}) {
              return {
                title: title || 'Poeme sans titre',
                subtitle: author ? `par ${author}` : 'Poeme',
              }
            },
          },
        },

        // === BLOC DIALOGUE ===
        {
          type: 'object',
          name: 'dialogue',
          title: 'Dialogue',
          fields: [
            {
              name: 'lines',
              title: 'Repliques',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'speaker',
                      title: 'Personnage',
                      type: 'string',
                    },
                    {
                      name: 'text',
                      title: 'Replique',
                      type: 'text',
                      rows: 2,
                    },
                    {
                      name: 'direction',
                      title: 'Didascalie',
                      type: 'string',
                      description: 'Ex: (en souriant)',
                    },
                  ],
                  preview: {
                    select: {speaker: 'speaker', text: 'text'},
                    prepare({speaker, text}) {
                      return {
                        title: speaker || 'Personnage',
                        subtitle: text?.substring(0, 50),
                      }
                    },
                  },
                },
              ],
            },
            {
              name: 'context',
              title: 'Contexte (optionnel)',
              type: 'text',
              rows: 2,
              description: 'Description de la scene',
            },
          ],
          preview: {
            select: {lines: 'lines'},
            prepare({lines}) {
              return {
                title: `Dialogue (${lines?.length || 0} repliques)`,
                subtitle: 'Scene de dialogue',
              }
            },
          },
        },

        // === ENCADRE / CALLOUT ===
        {
          type: 'object',
          name: 'callout',
          title: 'Encadre',
          fields: [
            {
              name: 'type',
              title: 'Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Information', value: 'info'},
                  {title: 'Conseil', value: 'tip'},
                  {title: 'Avertissement', value: 'warning'},
                  {title: 'Important', value: 'important'},
                  {title: 'Note de l\'auteur', value: 'author-note'},
                  {title: 'Extrait de livre', value: 'book-excerpt'},
                ],
              },
              initialValue: 'info',
            },
            {
              name: 'title',
              title: 'Titre (optionnel)',
              type: 'string',
            },
            {
              name: 'content',
              title: 'Contenu',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'collapsible',
              title: 'Repliable',
              type: 'boolean',
              description: 'Permet de masquer/afficher le contenu',
              initialValue: false,
            },
          ],
          preview: {
            select: {type: 'type', title: 'title', content: 'content'},
            prepare({type, title, content}) {
              const typeLabels = {
                info: 'Info',
                tip: 'Conseil',
                warning: 'Attention',
                important: 'Important',
                'author-note': 'Note auteur',
                'book-excerpt': 'Extrait livre',
              }
              return {
                title: title || typeLabels[type] || 'Encadre',
                subtitle: content?.substring(0, 50),
              }
            },
          },
        },

        // === SEPARATEUR ===
        {
          type: 'object',
          name: 'divider',
          title: 'Separateur',
          fields: [
            {
              name: 'style',
              title: 'Style',
              type: 'string',
              options: {
                list: [
                  {title: 'Ligne simple', value: 'line'},
                  {title: 'Ligne pointillee', value: 'dotted'},
                  {title: 'Trois etoiles', value: 'stars'},
                  {title: 'Ornement floral', value: 'floral'},
                  {title: 'Espace vide', value: 'space'},
                ],
              },
              initialValue: 'stars',
            },
          ],
          preview: {
            select: {style: 'style'},
            prepare({style}) {
              const labels = {
                line: '--- Ligne ---',
                dotted: '... Pointilles ...',
                stars: '* * *',
                floral: '~ Ornement ~',
                space: '[ Espace ]',
              }
              return {
                title: labels[style] || 'Separateur',
              }
            },
          },
        },

        // === VIDEO ===
        {
          type: 'object',
          name: 'video',
          title: 'Video',
          fields: [
            {
              name: 'url',
              title: 'URL de la video',
              type: 'url',
              description: 'YouTube, Vimeo, ou lien direct',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'caption',
              title: 'Legende',
              type: 'string',
            },
            {
              name: 'autoplay',
              title: 'Lecture automatique',
              type: 'boolean',
              initialValue: false,
            },
          ],
          preview: {
            select: {url: 'url', caption: 'caption'},
            prepare({url, caption}) {
              return {
                title: caption || 'Video',
                subtitle: url,
              }
            },
          },
        },

        // === AUDIO ===
        {
          type: 'object',
          name: 'audio',
          title: 'Audio',
          fields: [
            {
              name: 'file',
              title: 'Fichier audio',
              type: 'file',
              options: {
                accept: 'audio/*',
              },
            },
            {
              name: 'externalUrl',
              title: 'Ou URL externe',
              type: 'url',
              description: 'Spotify, SoundCloud, podcast...',
            },
            {
              name: 'title',
              title: 'Titre',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'string',
            },
            {
              name: 'duration',
              title: 'Duree',
              type: 'string',
              description: 'Ex: 5:30',
            },
          ],
          preview: {
            select: {title: 'title', duration: 'duration'},
            prepare({title, duration}) {
              return {
                title: title || 'Audio',
                subtitle: duration ? `Duree: ${duration}` : 'Fichier audio',
              }
            },
          },
        },

        // === BLOC CODE ===
        {
          type: 'object',
          name: 'codeBlock',
          title: 'Bloc de code',
          fields: [
            {
              name: 'language',
              title: 'Langage',
              type: 'string',
              options: {
                list: [
                  {title: 'JavaScript', value: 'javascript'},
                  {title: 'HTML', value: 'html'},
                  {title: 'CSS', value: 'css'},
                  {title: 'Python', value: 'python'},
                  {title: 'Texte brut', value: 'text'},
                ],
              },
              initialValue: 'text',
            },
            {
              name: 'code',
              title: 'Code',
              type: 'text',
              rows: 10,
            },
            {
              name: 'filename',
              title: 'Nom du fichier (optionnel)',
              type: 'string',
            },
          ],
          preview: {
            select: {language: 'language', filename: 'filename'},
            prepare({language, filename}) {
              return {
                title: filename || 'Bloc de code',
                subtitle: language,
              }
            },
          },
        },

        // === TABLEAU ===
        {
          type: 'object',
          name: 'table',
          title: 'Tableau',
          fields: [
            {
              name: 'caption',
              title: 'Titre du tableau',
              type: 'string',
            },
            {
              name: 'rows',
              title: 'Lignes',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'cells',
                      title: 'Cellules',
                      type: 'array',
                      of: [{type: 'string'}],
                    },
                    {
                      name: 'isHeader',
                      title: 'Ligne d\'en-tete',
                      type: 'boolean',
                      initialValue: false,
                    },
                  ],
                  preview: {
                    select: {cells: 'cells', isHeader: 'isHeader'},
                    prepare({cells, isHeader}) {
                      return {
                        title: cells?.join(' | ') || 'Ligne vide',
                        subtitle: isHeader ? 'En-tete' : 'Ligne',
                      }
                    },
                  },
                },
              ],
            },
          ],
          preview: {
            select: {caption: 'caption', rows: 'rows'},
            prepare({caption, rows}) {
              return {
                title: caption || 'Tableau',
                subtitle: `${rows?.length || 0} lignes`,
              }
            },
          },
        },

        // === RECOMMANDATION DE LIVRE ===
        {
          type: 'object',
          name: 'bookRecommendation',
          title: 'Recommandation de livre',
          fields: [
            {
              name: 'title',
              title: 'Titre du livre',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'author',
              title: 'Auteur',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'cover',
              title: 'Couverture',
              type: 'image',
              options: {hotspot: true},
            },
            {
              name: 'description',
              title: 'Pourquoi je le recommande',
              type: 'text',
              rows: 4,
            },
            {
              name: 'link',
              title: 'Lien d\'achat (optionnel)',
              type: 'url',
            },
            {
              name: 'rating',
              title: 'Note (sur 5)',
              type: 'number',
              options: {
                list: [1, 2, 3, 4, 5],
              },
            },
          ],
          preview: {
            select: {title: 'title', author: 'author', cover: 'cover'},
            prepare({title, author, cover}) {
              return {
                title: title,
                subtitle: `par ${author}`,
                media: cover,
              }
            },
          },
        },

        // === FICHIER / DOCUMENT ===
        {
          type: 'object',
          name: 'fileAttachment',
          title: 'Fichier joint',
          fields: [
            {
              name: 'file',
              title: 'Fichier',
              type: 'file',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'title',
              title: 'Nom du fichier',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'string',
            },
          ],
          preview: {
            select: {title: 'title'},
            prepare({title}) {
              return {
                title: title || 'Fichier joint',
                subtitle: 'Document telecharger',
              }
            },
          },
        },

        // === EMBED SOCIAL ===
        {
          type: 'object',
          name: 'socialEmbed',
          title: 'Embed reseau social',
          fields: [
            {
              name: 'platform',
              title: 'Plateforme',
              type: 'string',
              options: {
                list: [
                  {title: 'Twitter/X', value: 'twitter'},
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'TikTok', value: 'tiktok'},
                  {title: 'LinkedIn', value: 'linkedin'},
                ],
              },
            },
            {
              name: 'url',
              title: 'URL du post',
              type: 'url',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {platform: 'platform', url: 'url'},
            prepare({platform, url}) {
              return {
                title: platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : 'Embed social',
                subtitle: url,
              }
            },
          },
        },

        // === NEWSLETTER CTA ===
        {
          type: 'object',
          name: 'newsletterCta',
          title: 'Inscription newsletter',
          fields: [
            {
              name: 'title',
              title: 'Titre',
              type: 'string',
              initialValue: 'Rejoignez mes lecteurs',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
            },
            {
              name: 'buttonText',
              title: 'Texte du bouton',
              type: 'string',
              initialValue: 'S\'inscrire',
            },
            {
              name: 'style',
              title: 'Style',
              type: 'string',
              options: {
                list: [
                  {title: 'Discret', value: 'minimal'},
                  {title: 'Encadre', value: 'bordered'},
                  {title: 'Colore', value: 'colored'},
                ],
              },
              initialValue: 'bordered',
            },
          ],
          preview: {
            select: {title: 'title'},
            prepare({title}) {
              return {
                title: title || 'Inscription newsletter',
                subtitle: 'Bloc CTA',
              }
            },
          },
        },

        // === ARTICLES LIES ===
        {
          type: 'object',
          name: 'relatedArticles',
          title: 'Articles lies',
          fields: [
            {
              name: 'title',
              title: 'Titre de la section',
              type: 'string',
              initialValue: 'A lire aussi',
            },
            {
              name: 'articles',
              title: 'Articles',
              type: 'array',
              of: [
                {
                  type: 'reference',
                  to: [{type: 'article'}],
                },
              ],
              validation: (Rule) => Rule.max(4),
            },
          ],
          preview: {
            select: {title: 'title', articles: 'articles'},
            prepare({title, articles}) {
              return {
                title: title || 'Articles lies',
                subtitle: `${articles?.length || 0} articles`,
              }
            },
          },
        },

        // === ACCORDEON / FAQ ===
        {
          type: 'object',
          name: 'accordion',
          title: 'Accordeon / FAQ',
          fields: [
            {
              name: 'title',
              title: 'Titre de la section',
              type: 'string',
            },
            {
              name: 'items',
              title: 'Elements',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'question',
                      title: 'Question / Titre',
                      type: 'string',
                    },
                    {
                      name: 'answer',
                      title: 'Reponse / Contenu',
                      type: 'text',
                      rows: 4,
                    },
                  ],
                  preview: {
                    select: {question: 'question'},
                    prepare({question}) {
                      return {
                        title: question || 'Element',
                      }
                    },
                  },
                },
              ],
            },
            {
              name: 'allowMultiple',
              title: 'Permettre plusieurs ouverts',
              type: 'boolean',
              initialValue: false,
            },
          ],
          preview: {
            select: {title: 'title', items: 'items'},
            prepare({title, items}) {
              return {
                title: title || 'Accordeon',
                subtitle: `${items?.length || 0} elements`,
              }
            },
          },
        },

        // === TIMELINE ===
        {
          type: 'object',
          name: 'timeline',
          title: 'Chronologie',
          fields: [
            {
              name: 'title',
              title: 'Titre',
              type: 'string',
            },
            {
              name: 'events',
              title: 'Evenements',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'date',
                      title: 'Date',
                      type: 'string',
                    },
                    {
                      name: 'title',
                      title: 'Titre',
                      type: 'string',
                    },
                    {
                      name: 'description',
                      title: 'Description',
                      type: 'text',
                      rows: 2,
                    },
                  ],
                  preview: {
                    select: {date: 'date', title: 'title'},
                    prepare({date, title}) {
                      return {
                        title: title || 'Evenement',
                        subtitle: date,
                      }
                    },
                  },
                },
              ],
            },
          ],
          preview: {
            select: {title: 'title', events: 'events'},
            prepare({title, events}) {
              return {
                title: title || 'Chronologie',
                subtitle: `${events?.length || 0} evenements`,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime',
      group: 'meta',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'readTime',
      title: 'Temps de lecture',
      type: 'string',
      group: 'meta',
      description: 'Ex: 6 min (calcule automatiquement si vide)',
    }),
    defineField({
      name: 'featured',
      title: 'Article mis en avant',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'meta',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),

    // === SEO ===
    defineField({
      name: 'seoTitle',
      title: 'Titre SEO',
      type: 'string',
      group: 'seo',
      description: 'Titre pour les moteurs de recherche (si different du titre)',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Description SEO',
      type: 'text',
      group: 'seo',
      rows: 3,
      description: 'Description pour les moteurs de recherche (si different de l\'extrait)',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'seoImage',
      title: 'Image SEO / Reseaux sociaux',
      type: 'image',
      group: 'seo',
      description: 'Image affichee lors du partage (si differente de l\'image principale)',
    }),
  ],
  orderings: [
    {
      title: 'Date de publication (recent)',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Date de publication (ancien)',
      name: 'publishedAtAsc',
      by: [{field: 'publishedAt', direction: 'asc'}],
    },
    {
      title: 'Titre A-Z',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      category: 'category.name',
      media: 'image',
      featured: 'featured',
    },
    prepare({title, author, category, media, featured}) {
      return {
        title: `${featured ? '* ' : ''}${title}`,
        subtitle: `${category || 'Sans categorie'} | ${author || 'Auteur inconnu'}`,
        media,
      }
    },
  },
})
