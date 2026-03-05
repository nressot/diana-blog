import { Reply } from 'lucide-react'
import { getAvatarColor, getInitials } from '../lib/avatarUtils'

/**
 * Formate une date en francais
 */
function formatDate(dateString) {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  } catch {
    return ''
  }
}

export default function CommentCard({ comment, onReply, isAuthenticated, isReply = false }) {
  const initials = getInitials(comment.name)
  const avatarColor = getAvatarColor(comment.name)
  const formattedDate = formatDate(comment.createdAt)

  return (
    <div>
      {/* Commentaire principal */}
      <div className={`flex gap-4 p-4 bg-cream-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700 ${isReply ? 'ml-8' : ''}`}>
        {/* Avatar */}
        {comment.avatarUrl ? (
          <img
            src={comment.avatarUrl}
            alt={comment.name}
            className="shrink-0 w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`shrink-0 w-10 h-10 rounded-full ${avatarColor} items-center justify-center ${comment.avatarUrl ? 'hidden' : 'flex'}`}>
          <span className="text-white text-sm font-semibold">{initials}</span>
        </div>

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold" style={{ color: '#1c1a17' }}>
              {comment.name}
            </span>
            <span className="text-xs text-neutral-500">
              {formattedDate}
            </span>
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap mb-2" style={{ color: '#292524' }}>
            {comment.content}
          </p>

          {/* Bouton Repondre - uniquement pour les commentaires parents et si authentifie */}
          {!isReply && isAuthenticated && onReply && (
            <button
              onClick={() => onReply(comment)}
              className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <Reply className="w-3 h-3" />
              Repondre
            </button>
          )}
        </div>
      </div>

      {/* Reponses */}
      {!isReply && comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              isReply={true}
              isAuthenticated={false}
            />
          ))}
        </div>
      )}
    </div>
  )
}
