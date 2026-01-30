import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Loader2 } from 'lucide-react'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (!supabase) {
        setError('Supabase non configure')
        return
      }

      try {
        // Get the auth code from the URL
        const { data, error: authError } = await supabase.auth.getSession()

        if (authError) {
          console.error('Auth callback error:', authError)
          setError(authError.message)
          return
        }

        // Check if this is a password recovery
        const type = searchParams.get('type')
        if (type === 'recovery') {
          // Redirect to password reset page (could be implemented later)
          navigate('/connexion?reset=true')
          return
        }

        // Check if user is authenticated
        if (data.session) {
          // Check if user is admin and redirect accordingly
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.session.user.id)
            .single()

          // Get the intended redirect from localStorage or default
          const redirectTo = localStorage.getItem('authRedirectTo') || '/'
          localStorage.removeItem('authRedirectTo')

          // If admin and was trying to access admin area
          if (profile?.role === 'admin' && redirectTo.startsWith('/admin')) {
            navigate(redirectTo)
          } else {
            navigate(redirectTo)
          }
        } else {
          // No session, redirect to login
          navigate('/connexion')
        }
      } catch (err) {
        console.error('Auth callback error:', err)
        setError(err.message)
      }
    }

    handleAuthCallback()
  }, [navigate, searchParams])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center p-8">
          <p className="text-red-600 mb-4">Erreur d'authentification: {error}</p>
          <button
            onClick={() => navigate('/connexion')}
            className="text-primary-600 hover:underline"
          >
            Retour a la connexion
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
        <p className="text-neutral-600">Connexion en cours...</p>
      </div>
    </div>
  )
}
