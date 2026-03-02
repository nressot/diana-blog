import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, User, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import logoPrincipal from '../assets/brand/logo-principal-light.svg'

// OAuth provider icons
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const TwitterIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const AppleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
)

export default function Signup() {
  const navigate = useNavigate()
  const { signUpWithEmail, signInWithGoogle, signInWithTwitter, signInWithApple, isAuthenticated } = useAuth()

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/', { replace: true })
    return null
  }

  const handleEmailSignup = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validate password
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      setLoading(false)
      return
    }

    try {
      const data = await signUpWithEmail(email, password, displayName)

      // Subscribe to newsletter if checked
      if (subscribeNewsletter) {
        try {
          await fetch('/.netlify/functions/subscribe-newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, firstName: displayName.split(' ')[0] })
          })
        } catch (newsletterErr) {
          console.error('Newsletter subscription error:', newsletterErr)
          // Don't block signup if newsletter fails
        }
      }

      // Check if email confirmation is required
      if (data?.user && !data?.session) {
        setSuccess(true)
      } else if (data?.session) {
        navigate('/')
      }
    } catch (err) {
      if (err.message.includes('already registered')) {
        setError('Cet email est déjà utilisé')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthLogin = async (provider, signInMethod) => {
    setError('')
    setOauthLoading(provider)

    // Store redirect URL for after OAuth callback
    localStorage.setItem('authRedirectTo', '/')

    try {
      await signInMethod()
    } catch (err) {
      setError(err.message)
      setOauthLoading(null)
    }
  }

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50 py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-2">
              Vérifiez votre email
            </h2>
            <p className="text-neutral-600 mb-6">
              Un email de vérification a été envoyé à <strong>{email}</strong>.
              Cliquez sur le lien dans l'email pour activer votre compte.
            </p>
            <Link
              to="/connexion"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
            >
              Retour à la connexion
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <img
              src={logoPrincipal}
              alt="Le Coven de Diana"
              className="h-64 mx-auto"
            />
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-2">
            Créer un compte
          </h1>
          <p className="text-neutral-600">
            Rejoignez la communauté de lecteurs
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleOAuthLogin('google', signInWithGoogle)}
              disabled={oauthLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors disabled:opacity-50"
            >
              {oauthLoading === 'google' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              <span className="text-neutral-700">Continuer avec Google</span>
            </button>

            {/* Twitter/X désactivé temporairement
            <button
              onClick={() => handleOAuthLogin('twitter', signInWithTwitter)}
              disabled={oauthLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors disabled:opacity-50"
            >
              {oauthLoading === 'twitter' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <TwitterIcon />
              )}
              <span className="text-neutral-700">Continuer avec X</span>
            </button>
            */}

            <button
              onClick={() => handleOAuthLogin('apple', signInWithApple)}
              disabled={oauthLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors disabled:opacity-50"
            >
              {oauthLoading === 'apple' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <AppleIcon />
              )}
              <span className="text-neutral-700">Continuer avec Apple</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-neutral-500">ou</span>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Email form */}
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-neutral-700 mb-1">
                Votre nom
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Votre nom ou pseudo"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Minimum 6 caractères"
                />
              </div>
            </div>

            <p className="text-xs text-neutral-500">
              Un email de vérification vous sera envoyé pour activer votre compte.
            </p>

            {/* Newsletter checkbox */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={subscribeNewsletter}
                onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                className="mt-1 w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-600">
                S'abonner à la newsletter pour recevoir les nouveaux articles et actualités
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Création...
                </>
              ) : (
                'Créer mon compte'
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="mt-6 text-center text-neutral-600">
            Déjà un compte ?{' '}
            <Link to="/connexion" className="text-primary-600 hover:text-primary-700 font-medium">
              Se connecter
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <p className="mt-6 text-center">
          <Link to="/" className="text-neutral-500 hover:text-neutral-700 text-sm">
            Retour à l'accueil
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
