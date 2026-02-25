import { useState, useEffect, useCallback } from 'react'

const API_URL = '/.netlify/functions/site-access'
const SESSION_KEY = 'diana_site_access'

export function useSiteAccess() {
  const [isPublic, setIsPublic] = useState(null) // null = loading
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Verifier l'etat du site au chargement
  useEffect(() => {
    const checkSiteStatus = async () => {
      try {
        // Verifier d'abord si on a un acces en session
        const sessionAccess = sessionStorage.getItem(SESSION_KEY)
        if (sessionAccess === 'granted') {
          setHasAccess(true)
        }

        // Verifier l'etat public/prive du site
        const response = await fetch(API_URL)
        const data = await response.json()

        setIsPublic(data.isPublic)

        // Si le site est public, tout le monde a acces
        if (data.isPublic) {
          setHasAccess(true)
        }
      } catch (err) {
        console.error('Error checking site status:', err)
        setError('Erreur de connexion')
        // En cas d'erreur, on considere le site comme prive par securite
        setIsPublic(false)
      } finally {
        setLoading(false)
      }
    }

    checkSiteStatus()
  }, [])

  // Verifier le mot de passe pour acceder au site
  const verifyPassword = useCallback(async (password) => {
    setError(null)
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, action: 'verify' })
      })

      const data = await response.json()

      if (response.ok && data.accessGranted) {
        sessionStorage.setItem(SESSION_KEY, 'granted')
        setHasAccess(true)
        return { success: true }
      }

      setError(data.error || 'Mot de passe incorrect')
      return { success: false, error: data.error }
    } catch (err) {
      console.error('Error verifying password:', err)
      setError('Erreur de connexion')
      return { success: false, error: 'Erreur de connexion' }
    }
  }, [])

  // Rendre le site public definitivement
  const makePublic = useCallback(async (adminPassword) => {
    setError(null)
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword, action: 'make_public' })
      })

      const data = await response.json()

      if (response.ok && data.isPublic) {
        setIsPublic(true)
        setHasAccess(true)
        sessionStorage.removeItem(SESSION_KEY)
        return { success: true }
      }

      setError(data.error || 'Mot de passe admin incorrect')
      return { success: false, error: data.error }
    } catch (err) {
      console.error('Error making site public:', err)
      setError('Erreur de connexion')
      return { success: false, error: 'Erreur de connexion' }
    }
  }, [])

  return {
    isPublic,
    hasAccess,
    loading,
    error,
    verifyPassword,
    makePublic,
    clearError: () => setError(null)
  }
}
