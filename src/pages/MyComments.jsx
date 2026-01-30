import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { MessageSquare, Loader2, ArrowLeft, ExternalLink, Trash2, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function MyComments() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    if (user?.id) {
      fetchComments()
    }
  }, [user?.id])

  const fetchComments = async () => {
    if (!supabase || !user?.id) {
      setLoading(false)
      return
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          status,
          created_at,
          article_id,
          articles (
            id,
            title,
            slug
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setComments(data || [])
    } catch (err) {
      console.error('Error fetching comments:', err)
      setError('Impossible de charger vos commentaires')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (commentId) => {
    if (!supabase || !window.confirm('Voulez-vous vraiment supprimer ce commentaire ?')) {
      return
    }

    setDeleting(commentId)

    try {
      const { error: deleteError } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id)

      if (deleteError) throw deleteError

      setComments(prev => prev.filter(c => c.id !== commentId))
    } catch (err) {
      console.error('Error deleting comment:', err)
      setError('Impossible de supprimer le commentaire')
    } finally {
      setDeleting(null)
    }
  }

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/connexion" replace />
  }

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">Approuve</span>
      case 'pending':
        return <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700">En attente</span>
      case 'spam':
        return <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700">Spam</span>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-cream-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour a l'accueil
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-2">
            Mes commentaires
          </h1>
          <p className="text-neutral-600">
            Retrouvez tous vos commentaires sur le blog
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Comments list */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-12 text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
              <h3 className="text-lg font-semibold text-neutral-700 mb-2">
                Aucun commentaire
              </h3>
              <p className="text-neutral-500 mb-6">
                Vous n'avez pas encore laisse de commentaire sur le blog.
              </p>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors"
              >
                Decouvrir les articles
              </Link>
            </div>
          ) : (
            comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6"
              >
                {/* Article info */}
                {comment.articles && (
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-sm text-neutral-500 mb-1">Commentaire sur</p>
                      <Link
                        to={`/article/${comment.articles.slug}`}
                        className="text-lg font-medium text-neutral-900 hover:text-primary-600 transition-colors inline-flex items-center gap-1"
                      >
                        {comment.articles.title}
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                    {getStatusBadge(comment.status)}
                  </div>
                )}

                {/* Comment content */}
                <div className="bg-cream-50 rounded-xl p-4 mb-4">
                  <p className="text-neutral-700 whitespace-pre-wrap">{comment.content}</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-500">
                    {formatDate(comment.created_at)}
                  </p>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    disabled={deleting === comment.id}
                    className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                  >
                    {deleting === comment.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Supprimer
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Stats */}
        {comments.length > 0 && (
          <div className="mt-8 text-center text-neutral-500">
            {comments.length} commentaire{comments.length > 1 ? 's' : ''} au total
          </div>
        )}
      </motion.div>
    </div>
  )
}
