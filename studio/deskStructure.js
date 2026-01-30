import {
  HomeIcon,
  UserIcon,
  EnvelopeIcon,
  BookIcon,
  DocumentsIcon,
  TagIcon,
  UsersIcon,
  CommentIcon,
  PackageIcon,
  FolderIcon,
  EyeOpenIcon,
  EditIcon,
} from '@sanity/icons'
import ArticlePreview from './components/ArticlePreview.jsx'

// Helper pour creer des documents singleton (une seule instance)
const singletonListItem = (S, typeName, title, icon) =>
  S.listItem()
    .title(title)
    .icon(icon)
    .child(
      S.document()
        .schemaType(typeName)
        .documentId(typeName)
    )

// Helper pour creer une vue d'article avec apercu
const articleViews = (S) => [
  S.view.form().icon(EditIcon).title('Editeur'),
  S.view.component(ArticlePreview).icon(EyeOpenIcon).title('Apercu'),
]

export const deskStructure = (S) =>
  S.list()
    .title('Contenu')
    .items([
      // === PAGES DU SITE ===
      S.listItem()
        .title('Pages du Site')
        .icon(FolderIcon)
        .child(
          S.list()
            .title('Pages du Site')
            .items([
              singletonListItem(S, 'homePage', 'Accueil', HomeIcon),
              singletonListItem(S, 'aboutPage', 'A Propos', UserIcon),
              singletonListItem(S, 'contactPage', 'Contact', EnvelopeIcon),
              singletonListItem(S, 'bookSection', 'Section Livre', BookIcon),
            ])
        ),

      S.divider(),

      // === BLOG ===
      S.listItem()
        .title('Blog')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('Blog')
            .items([
              // Articles avec apercu
              S.listItem()
                .title('Articles')
                .icon(DocumentsIcon)
                .schemaType('article')
                .child(
                  S.documentTypeList('article')
                    .title('Articles')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                    .child((documentId) =>
                      S.document()
                        .documentId(documentId)
                        .schemaType('article')
                        .views(articleViews(S))
                    )
                ),

              // Categories
              S.listItem()
                .title('Categories')
                .icon(TagIcon)
                .schemaType('category')
                .child(S.documentTypeList('category').title('Categories')),

              // Auteur (singleton - premier auteur)
              S.listItem()
                .title('Auteur')
                .icon(UserIcon)
                .child(
                  S.documentTypeList('author')
                    .title('Auteur')
                    .filter('_type == "author"')
                ),
            ])
        ),

      S.divider(),

      // === COMMENTAIRES ===
      S.listItem()
        .title('Commentaires')
        .icon(CommentIcon)
        .child(
          S.list()
            .title('Commentaires')
            .items([
              // Tous les commentaires
              S.listItem()
                .title('Tous les commentaires')
                .icon(CommentIcon)
                .child(
                  S.documentList()
                    .title('Tous les commentaires')
                    .filter('_type == "comment"')
                    .defaultOrdering([{field: 'createdAt', direction: 'desc'}])
                ),

              // Commentaires publies
              S.listItem()
                .title('Publies')
                .icon(CommentIcon)
                .child(
                  S.documentList()
                    .title('Commentaires publies')
                    .filter('_type == "comment" && (status == "approved" || !defined(status))')
                    .defaultOrdering([{field: 'createdAt', direction: 'desc'}])
                ),

              // Spam
              S.listItem()
                .title('Spam')
                .icon(CommentIcon)
                .child(
                  S.documentList()
                    .title('Commentaires spam')
                    .filter('_type == "comment" && status == "spam"')
                    .defaultOrdering([{field: 'createdAt', direction: 'desc'}])
                ),

              S.divider(),

              // Par article
              S.listItem()
                .title('Par article')
                .icon(DocumentsIcon)
                .child(
                  S.documentTypeList('article')
                    .title('Selectionner un article')
                    .child((articleId) =>
                      S.documentList()
                        .title('Commentaires')
                        .filter('_type == "comment" && article._ref == $articleId')
                        .params({articleId})
                        .defaultOrdering([{field: 'createdAt', direction: 'desc'}])
                    )
                ),
            ])
        ),

      S.divider(),

      // === BOUTIQUE ===
      S.listItem()
        .title('Boutique')
        .icon(PackageIcon)
        .child(
          S.list()
            .title('Boutique')
            .items([
              S.listItem()
                .title('Produits')
                .icon(PackageIcon)
                .schemaType('product')
                .child(
                  S.documentTypeList('product')
                    .title('Produits')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                ),
              S.listItem()
                .title('Categories Produits')
                .icon(TagIcon)
                .schemaType('productCategory')
                .child(S.documentTypeList('productCategory').title('Categories Produits')),
            ])
        ),
    ])
