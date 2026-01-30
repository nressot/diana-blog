import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import {
  Check,
  X,
  Trash2,
  AlertTriangle,
  MessageSquare,
  Filter
} from 'lucide-react'

export default function Comments() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all')

  useEffect(() => {
    fetchComments()
  }, [statusFilter])

  const fetchComments = async () => {
    if (!supabase) {
      setLoading(false)
      return
    }

    try {
      let query = supabase
        .from('comments')
        .select(`
          *,
          article:articles(id, title, slug)
        `)
        .order('created_at', { ascending: false })

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ status })
        .eq('id', id)

      if (error) throw error
      setComments(comments.map(c =>
        c.id === id ? { ...c, status } : c
      ))
    } catch (error) {
      console.error('Error updating comment:', error)
      alert('Erreur lors de la mise a jour')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce commentaire ?')) return

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id)

      if (error) throw error
      setComments(comments.filter(c => c.id !== id))
    } catch (error) {
      console.error('Error deleting comment:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-600 text-white">
            <Check size={12} />
            {`Approuv\u00e9`}
          </span>
        )
      case 'spam':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-600 text-white">
            <AlertTriangle size={12} />
            Spam
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500 text-white">
            En attente
          </span>
        )
    }
  }

  const pendingCount = comments.filter(c => c.status === 'pending').length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commentaires</h1>
          <p className="text-gray-600 mt-1">
            {comments.length} commentaire(s)
            {pendingCount > 0 && ` - ${pendingCount} en attente`}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'pending', 'approved', 'spam'].map((status) => (
          <button
            key={status}
            onClick={() => {
              setStatusFilter(status)
              if (status !== 'all') {
                setSearchParams({ status })
              } else {
                setSearchParams({})
              }
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === status
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status === 'all' && 'Tous'}
            {status === 'pending' && 'En attente'}
            {status === 'approved' && `Approuv\u00e9s`}
            {status === 'spam' && 'Spam'}
          </button>
        ))}
      </div>

      {/* Comments List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {comments.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {comments.map((comment) => (
              <li key={comment.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      {comment.author_avatar ? (
                        <img
                          src={comment.author_avatar}
                          alt={comment.author_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-700 font-medium">
                            {comment.author_name[0].toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {comment.author_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {comment.author_email}
                        </p>
                      </div>
                      {getStatusBadge(comment.status)}
                    </div>

                    <p className="text-gray-700 mb-2">{comment.content}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        {new Date(comment.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {comment.article && (
                        <a
                          href={`/article/${comment.article.slug}`}
                          target="_blank"
                          className="text-primary-600 hover:text-primary-700"
                        >
                          Sur: {comment.article.title}
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {comment.status !== 'approved' && (
                      <button
                        onClick={() => updateStatus(comment.id, 'approved')}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Approuver"
                      >
                        <Check size={18} />
                      </button>
                    )}
                    {comment.status !== 'spam' && (
                      <button
                        onClick={() => updateStatus(comment.id, 'spam')}
                        className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Marquer spam"
                      >
                        <AlertTriangle size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun commentaire</p>
          </div>
        )}
      </div>
    </div>
  )
}
