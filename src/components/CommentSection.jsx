import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Send, Loader2, CheckCircle, AlertCircle, LogIn } from 'lucide-react'
import { useComments, useSubmitComment } from '../lib/useSupabaseComments'
import { useAuth } from '../context/AuthContext'
import { getAvatarColor, getInitials } from '../lib/avatarUtils'
import CommentCard from './CommentCard'

export default function CommentSection({ articleId }) {
  const { comments, loading: loadingComments, refetch } = useComments(articleId)
  const { submitComment, loading: submitting, error: submitError, success, reset } = useSubmitComment()
  const { isAuthenticated, user, displayName, avatarUrl } = useAuth()

  const [content, setContent] = useState('')
  const [formError, setFormError] = useState('')

  const handleContentChange = (e) => {
    setContent(e.target.value)
    if (formError) setFormError('')
    if (success) reset()
  }

  const validateForm = () => {
    if (!content.trim()) {
      setFormError('Le commentaire est requis')
      return false
    }
    if (content.trim().length < 3) {
      setFormError('Le commentaire doit contenir au moins 3 caracteres')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    const submitted = await submitComment({
      articleId,
      name: displayName,
      email: user?.email || '',
      content: content.trim(),
      userId: user?.id,
      avatarUrl: avatarUrl // Ajouter l'avatar pour affichage
    })

    if (submitted) {
      setContent('')
      refetch()
    }
  }

  // Get initials and color from shared utility
  const initials = getInitials(displayName)
  const avatarColor = getAvatarColor(displayName)

  return (
    <section className="mt-12 pt-8 border-t border-neutral-200">
      {/* En-tete */}
      <div className="flex items-center gap-2 mb-8">
        <MessageCircle className="w-6 h-6 text-primary-600" />
        <h2 className="text-2xl font-bold">
          Commentaires
          {!loadingComments && (
            <span className="text-neutral-500 text-lg font-normal ml-2">
              ({comments.length})
            </span>
          )}
        </h2>
      </div>

      {/* Formulaire ou invite de connexion */}
      <div className="mb-8 p-6 bg-cream-100 rounded-2xl border border-neutral-200">
        {isAuthenticated ? (
          <>
            {/* Utilisateur connecte - Formulaire simplifie */}
            <div className="flex items-center gap-3 mb-4">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white font-medium text-sm`}>
                  {initials}
                </div>
              )}
              <div>
                <p className="font-medium text-neutral-900">{displayName}</p>
                <p className="text-sm text-neutral-500">Laisser un commentaire</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <textarea
                  value={content}
                  onChange={handleContentChange}
                  placeholder="Partagez votre avis sur cet article..."
                  rows={4}
                  disabled={submitting}
                  className={`w-full px-4 py-3 rounded-xl border bg-white resize-none
                    ${formError
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-neutral-300 focus:ring-primary-500'
                    }
                    focus:outline-none focus:ring-2 focus:border-transparent
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors`}
                />
                {formError && (
                  <p className="mt-1 text-sm text-red-500">{formError}</p>
                )}
              </div>

              {/* Message de succes */}
              {success && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <span className="text-sm">Votre commentaire a ete publie avec succes !</span>
                </div>
              )}

              {/* Message d'erreur */}
              {submitError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="text-sm">
                    Une erreur est survenue. Veuillez reessayer plus tard.
                  </span>
                </div>
              )}

              {/* Bouton de soumission */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700
                    text-white font-medium rounded-xl transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Publier
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Utilisateur non connecte - Invite de connexion */
          <div className="text-center py-6">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
            <h3 className="text-lg font-semibold text-neutral-800 mb-2">
              Connectez-vous pour commenter
            </h3>
            <p className="text-neutral-600 mb-6 max-w-md mx-auto">
              Rejoignez la conversation et partagez votre avis sur cet article.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/connexion"
                state={{ from: { pathname: window.location.pathname } }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors"
              >
                <LogIn className="w-5 h-5" />
                Se connecter
              </Link>
              <Link
                to="/inscription"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-medium rounded-xl transition-colors"
              >
                Creer un compte
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Liste des commentaires */}
      <div className="space-y-4">
        {loadingComments ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
            <span className="ml-2 text-neutral-500">Chargement des commentaires...</span>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Aucun commentaire pour le moment.</p>
            <p className="text-sm">Soyez le premier a partager votre avis !</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentCard key={comment._id || comment.id} comment={comment} />
          ))
        )}
      </div>
    </section>
  )
}
