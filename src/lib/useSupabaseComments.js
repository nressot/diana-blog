/**
 * Hooks pour gerer les commentaires avec Supabase
 */

import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'

/**
 * Hook pour recuperer les commentaires approuves d'un article avec leurs reponses
 */
export function useComments(articleId) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchComments = useCallback(async (isRefetch = false) => {
    if (!supabase || !articleId) {
      setLoading(false)
      return
    }

    // Pour un refetch, on ne remet pas loading a true pour eviter le flash
    if (!isRefetch) {
      setLoading(true)
    }

    // Timeout de securite - 10 secondes max
    const timeout = setTimeout(() => {
      console.warn('Comments fetch timeout')
      setLoading(false)
    }, 10000)

    try {
      const { data, error: fetchError } = await supabase
        .from('comments')
        .select('*')
        .eq('article_id', articleId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      clearTimeout(timeout)

      if (fetchError) throw fetchError

      // Separer les commentaires parents et les reponses
      const allComments = data || []
      const parentComments = allComments.filter(c => !c.parent_id)
      const replies = allComments.filter(c => c.parent_id)

      // Adapter les donnees et attacher les reponses aux commentaires parents
      const adaptedComments = parentComments.map(comment => {
        const commentReplies = replies
          .filter(r => r.parent_id === comment.id)
          .map(reply => ({
            id: reply.id,
            name: reply.author_name,
            email: reply.author_email,
            avatarUrl: reply.author_avatar,
            content: reply.content,
            createdAt: reply.created_at,
            userId: reply.user_id,
            parentId: reply.parent_id
          }))

        return {
          id: comment.id,
          name: comment.author_name,
          email: comment.author_email,
          avatarUrl: comment.author_avatar,
          content: comment.content,
          createdAt: comment.created_at,
          userId: comment.user_id,
          replies: commentReplies
        }
      })

      setComments(adaptedComments)
      setError(null)
    } catch (err) {
      clearTimeout(timeout)
      console.error('Erreur lors de la recuperation des commentaires:', err.message)
      setError(err)
      // Ne pas vider les commentaires existants en cas d'erreur sur refetch
      if (!isRefetch) {
        setComments([])
      }
    } finally {
      setLoading(false)
    }
  }, [articleId])

  // Fonction refetch qui ne cause pas de loading flash
  const refetch = useCallback(() => {
    return fetchComments(true)
  }, [fetchComments])

  useEffect(() => {
    fetchComments(false)
  }, [fetchComments])

  return { comments, loading, error, refetch }
}

/**
 * Hook pour compter les commentaires approuves d'un article
 */
export function useCommentCount(articleId) {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase || !articleId) {
      setLoading(false)
      return
    }

    const fetchCount = async () => {
      try {
        setLoading(true)
        const { count: total, error } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('article_id', articleId)
          .eq('status', 'approved')

        if (error) throw error
        setCount(total || 0)
      } catch (err) {
        console.error('Erreur lors du comptage des commentaires:', err.message)
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
 * Hook pour recuperer les commentaires recents (tous articles confondus)
 */
export function useRecentComments(limit = 3) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    const fetchRecentComments = async () => {
      try {
        const { data, error } = await supabase
          .from('comments')
          .select(`
            id,
            content,
            author_name,
            author_avatar,
            created_at,
            article_id,
            articles(slug, title)
          `)
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(limit)

        if (error) throw error

        const adaptedComments = (data || []).map(comment => ({
          id: comment.id,
          author: comment.author_name,
          avatar: comment.author_avatar,
          comment: comment.content,
          articleSlug: comment.articles?.slug,
          articleTitle: comment.articles?.title
        }))

        setComments(adaptedComments)
      } catch (err) {
        console.error('Erreur lors de la recuperation des commentaires recents:', err.message)
        setComments([])
      } finally {
        setLoading(false)
      }
    }

    fetchRecentComments()
  }, [limit])

  return { comments, loading }
}

/**
 * Hook pour soumettre un nouveau commentaire ou une reponse
 */
export function useSubmitComment() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const submitComment = useCallback(async ({
    articleId,
    articleTitle,
    articleSlug,
    name,
    email,
    content,
    userId,
    avatarUrl,
    parentId = null,
    parentAuthor = null
  }) => {
    if (!supabase) {
      setError(new Error('Supabase non configure'))
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

      const commentData = {
        article_id: articleId,
        author_name: name.trim(),
        author_email: email ? email.trim() : '',
        author_avatar: avatarUrl || null,
        content: content.trim(),
        user_id: userId || null,
        parent_id: parentId || null,
        status: 'approved' // Les commentaires sont directement approuves
      }

      const { error: insertError } = await supabase
        .from('comments')
        .insert([commentData])

      if (insertError) throw insertError

      // Envoyer la notification email a Diana
      if (articleTitle && articleSlug) {
        try {
          await fetch('/.netlify/functions/notify-new-comment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              articleTitle,
              articleSlug,
              authorName: name.trim(),
              authorEmail: email ? email.trim() : '',
              content: content.trim(),
              isReply: !!parentId,
              parentAuthor
            })
          })
        } catch (notifError) {
          // Ne pas bloquer la soumission du commentaire si la notification echoue
          console.error('Erreur lors de l\'envoi de la notification:', notifError)
        }
      }

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
