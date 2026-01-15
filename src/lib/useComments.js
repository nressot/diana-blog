/**
 * Hooks pour gerer les commentaires avec Sanity
 */

import { useState, useEffect, useCallback } from 'react'
import { client, isSanityConfigured } from './sanity'
import { commentsQuery, commentCountQuery } from './queries'

/**
 * Hook pour recuperer les commentaires d'un article
 */
export function useComments(articleId) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchComments = useCallback(async () => {
    if (!isSanityConfigured || !articleId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const result = await client.fetch(commentsQuery, { articleId })
      setComments(result || [])
      setError(null)
    } catch (err) {
      console.warn('Erreur lors de la recuperation des commentaires:', err.message)
      setError(err)
      setComments([])
    } finally {
      setLoading(false)
    }
  }, [articleId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  return { comments, loading, error, refetch: fetchComments }
}

/**
 * Hook pour compter les commentaires d'un article
 */
export function useCommentCount(articleId) {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSanityConfigured || !articleId) {
      setLoading(false)
      return
    }

    const fetchCount = async () => {
      try {
        setLoading(true)
        const result = await client.fetch(commentCountQuery, { articleId })
        setCount(result || 0)
      } catch (err) {
        console.warn('Erreur lors du comptage des commentaires:', err.message)
        setCount(0)
      } finally {
        setLoading(false)
      }
    }

    fetchCount()
  }, [articleId])

  return { count, loading }
}

/**
 * Hook pour soumettre un nouveau commentaire
 */
export function useSubmitComment() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const submitComment = useCallback(async ({ articleId, name, email, content }) => {
    if (!isSanityConfigured) {
      setError(new Error('Sanity non configure'))
      return false
    }

    if (!articleId || !name || !content) {
      setError(new Error('Champs requis manquants'))
      return false
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      const doc = {
        _type: 'comment',
        article: {
          _type: 'reference',
          _ref: articleId,
        },
        name: name.trim(),
        email: email ? email.trim() : undefined,
        content: content.trim(),
        createdAt: new Date().toISOString(),
      }

      await client.create(doc)
      setSuccess(true)
      return true
    } catch (err) {
      console.error('Erreur lors de la soumission du commentaire:', err)
      setError(err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setError(null)
    setSuccess(false)
  }, [])

  return { submitComment, loading, error, success, reset }
}
