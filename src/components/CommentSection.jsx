import { useState } from 'react'
import { MessageCircle, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useComments, useSubmitComment } from '../lib/useComments'
import { isSanityConfigured } from '../lib/sanity'
import CommentCard from './CommentCard'

export default function CommentSection({ articleId }) {
  const { comments, loading: loadingComments, refetch } = useComments(articleId)
  const { submitComment, loading: submitting, error: submitError, success, reset } = useSubmitComment()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: '',
  })
  const [formErrors, setFormErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Effacer l'erreur du champ modifie
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }))
    }

    // Reset du succes si l'utilisateur modifie le formulaire
    if (success) {
      reset()
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.name.trim()) {
      errors.name = 'Le nom est requis'
    }

    if (!formData.content.trim()) {
      errors.content = 'Le commentaire est requis'
    } else if (formData.content.trim().length < 3) {
      errors.content = 'Le commentaire doit contenir au moins 3 caracteres'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Adresse email invalide'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const submitted = await submitComment({
      articleId,
      name: formData.name,
      email: formData.email,
      content: formData.content,
    })

    if (submitted) {
      setFormData({ name: '', email: '', content: '' })
      // Rafraichir la liste des commentaires
      refetch()
    }
  }

  // Si Sanity n'est pas configure, afficher un empty state
  if (!isSanityConfigured) {
    return (
      <section className="mt-12 pt-8 border-t border-neutral-200">
        {/* En-tete */}
        <div className="flex items-center gap-2 mb-8">
          <MessageCircle className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold">Commentaires</h2>
        </div>

        {/* Empty state */}
        <div className="text-center py-12 px-6 bg-cream-100 rounded-2xl border border-neutral-200">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
          <h3 className="text-lg font-semibold text-neutral-700 mb-2">
            Les commentaires arrivent bientot
          </h3>
          <p className="text-neutral-500 max-w-md mx-auto">
            La section commentaires est en cours de configuration.
            Revenez bientot pour partager votre avis sur cet article !
          </p>
        </div>
      </section>
    )
  }

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

      {/* Formulaire */}
      <div className="mb-8 p-6 bg-cream-100 rounded-2xl border border-neutral-200">
        <h3 className="text-lg font-semibold mb-4">Ajouter un commentaire</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nom */}
            <div>
              <label htmlFor="comment-name" className="block text-sm font-medium mb-1.5">
                Votre nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="comment-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jean Dupont"
                disabled={submitting}
                className={`w-full px-4 py-2.5 rounded-lg border bg-white
                  ${formErrors.name
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-neutral-300 focus:ring-primary-500'
                  }
                  focus:outline-none focus:ring-2 focus:border-transparent
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors`}
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="comment-email" className="block text-sm font-medium mb-1.5">
                Votre email <span className="text-neutral-400 text-xs">(optionnel)</span>
              </label>
              <input
                type="email"
                id="comment-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jean@exemple.fr"
                disabled={submitting}
                className={`w-full px-4 py-2.5 rounded-lg border bg-white
                  ${formErrors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-neutral-300 focus:ring-primary-500'
                  }
                  focus:outline-none focus:ring-2 focus:border-transparent
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors`}
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>
          </div>

          {/* Commentaire */}
          <div>
            <label htmlFor="comment-content" className="block text-sm font-medium mb-1.5">
              Votre commentaire <span className="text-red-500">*</span>
            </label>
            <textarea
              id="comment-content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Partagez votre avis..."
              rows={4}
              disabled={submitting}
              className={`w-full px-4 py-2.5 rounded-lg border bg-white resize-none
                ${formErrors.content
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-neutral-300 focus:ring-primary-500'
                }
                focus:outline-none focus:ring-2 focus:border-transparent
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors`}
            />
            {formErrors.content && (
              <p className="mt-1 text-sm text-red-500">{formErrors.content}</p>
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
                text-white font-medium rounded-lg transition-colors
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
            <CommentCard key={comment._id} comment={comment} />
          ))
        )}
      </div>
    </section>
  )
}
