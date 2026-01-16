import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Eye, MessageCircle, Clock, Share2, Twitter, Facebook, Linkedin, Link as LinkIcon, Loader2 } from 'lucide-react'
import { PortableText } from '@portabletext/react'
import ArticleCard from '../components/ArticleCard'
import AuthorCard from '../components/AuthorCard'
import CommentSection from '../components/CommentSection'
import { useArticle, useArticles } from '../lib/useArticles'
import { portableTextComponents } from '../lib/PortableTextComponents'
import { urlFor } from '../lib/sanity'

export default function Article() {
  const { slug } = useParams()
  const { article, loading, usingSanity } = useArticle(slug)
  const { data: allArticles } = useArticles()

  // Affichage de chargement
  if (loading) {
    return (
      <div className="py-16 lg:py-24 text-center">
        <div className="container-custom">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-600" />
          <p className="text-neutral-600 mt-4">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="py-16 lg:py-24 text-center">
        <div className="container-custom">
          <h1 className="text-2xl font-semibold mb-4">Article non trouve</h1>
          <p className="text-neutral-600 mb-8">
            L'article que vous recherchez n'existe pas.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au blog
          </Link>
        </div>
      </div>
    )
  }

  // Articles lies (meme categorie)
  const relatedArticles = (allArticles || [])
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3)

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  // Determiner l'image a afficher
  const imageUrl = article.image || 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=800&h=600&fit=crop'

  // Determiner l'auteur a afficher
  const author = article.author || {
    name: 'Diana',
    role: 'Ecrivaine & Blogueuse',
    avatar: '/author-avatar.jpg',
    bio: 'Passionnee par les mots depuis toujours, je partage ici mes reflexions, mes recits et mes decouvertes litteraires.'
  }

  return (
    <div key={slug}>
      {/* Hero Section */}
      <section className="relative">
        <div className="aspect-[21/9] lg:aspect-[3/1]">
          <img
            src={imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="container-custom pb-8 lg:pb-12">
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-6 mb-4">
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Retour au blog
                  </Link>
                  <span className={`${article.categoryColor || 'bg-neutral-500'} text-white text-sm font-medium px-3 py-1 rounded-full`}>
                    {article.category}
                  </span>
                </div>
                <h1
                  className="text-4xl lg:text-6xl font-bold text-white mb-4"
                  style={{ textShadow: '0 2px 12px rgba(0,0,0,0.6), 0 4px 24px rgba(0,0,0,0.4)' }}
                >
                  {article.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-white/80">
                  <div className="flex items-center gap-3">
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-medium text-white">{author.name}</span>
                  </div>
                  <span>{article.date}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {article.readTime}
                  </span>
                  {article.views > 0 && (
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {article.views} vues
                    </span>
                  )}
                  {article.comments > 0 && (
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {article.comments} commentaires
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-8 lg:py-10">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <article className="prose-content text-lg max-w-none">
                {/* Rendu du contenu - Portable Text (Sanity) ou texte brut (statique) */}
                {usingSanity && Array.isArray(article.content) ? (
                  <PortableText value={article.content} components={portableTextComponents} />
                ) : (
                  // Fallback pour le contenu statique (texte brut avec parsing basique)
                  <div>
                    {(article.content || article._raw?.content || '').split('\n\n').map((paragraph, index) => {
                      if (paragraph.startsWith('## ')) {
                        return <h2 key={index}>{paragraph.replace('## ', '')}</h2>
                      }
                      if (paragraph.startsWith('> ')) {
                        return <blockquote key={index}>{paragraph.replace('> ', '')}</blockquote>
                      }
                      if (paragraph.startsWith('- ')) {
                        const items = paragraph.split('\n').map(item => item.replace('- ', ''))
                        return (
                          <ul key={index}>
                            {items.map((item, i) => <li key={i}>{item}</li>)}
                          </ul>
                        )
                      }
                      if (paragraph.startsWith('---')) {
                        return <hr key={index} />
                      }
                      if (paragraph.startsWith('*') && paragraph.endsWith('*')) {
                        return <p key={index}><em>{paragraph.replace(/\*/g, '')}</em></p>
                      }
                      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                        const lines = paragraph.split('\n')
                        return (
                          <div key={index} className="whitespace-pre-line">
                            {lines.map((line, i) => (
                              <p key={i}>{line.replace(/\*\*/g, '')}</p>
                            ))}
                          </div>
                        )
                      }
                      return <p key={index}>{paragraph}</p>
                    })}
                  </div>
                )}
              </article>

              {/* Share Section */}
              <div className="mt-12 pt-8 border-t border-neutral-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-neutral-500" />
                    <span className="font-medium">Partager cet article</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${article.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center hover:bg-[#4267B2] hover:text-white transition-colors"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                    <a
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${article.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center hover:bg-[#0077B5] hover:text-white transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => navigator.clipboard.writeText(shareUrl)}
                      className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center hover:bg-cream-300 transition-colors"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Comment Section */}
              <CommentSection articleId={article._id || article.id} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-8">
                <AuthorCard variant="sidebar" />

                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                  <div className="bg-cream-200 rounded-2xl p-6 border border-neutral-200">
                    <h3 className="font-semibold mb-4">Articles similaires</h3>
                    <div className="space-y-4">
                      {relatedArticles.map((relatedArticle) => (
                        <ArticleCard
                          key={relatedArticle.id}
                          article={relatedArticle}
                          variant="horizontal"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Articles */}
      <section className="py-8 lg:py-10 bg-cream-200">
        <div className="container-custom">
          <h2 className="text-2xl font-semibold mb-8">Autres articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(allArticles || [])
              .filter((a) => a.id !== article.id)
              .slice(0, 3)
              .map((otherArticle) => (
                <ArticleCard key={otherArticle.id} article={otherArticle} />
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}
