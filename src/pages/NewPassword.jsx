import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Lock, Loader2, AlertCircle, CheckCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'
import logoPrincipal from '../assets/brand/logo-principal-light.svg'

export default function NewPassword() {
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caracteres')
      return
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    setLoading(true)

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      })

      if (updateError) throw updateError

      setSuccess(true)

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/connexion')
      }, 3000)
    } catch (err) {
      console.error('Password update error:', err)
      setError(err.message || 'Erreur lors de la mise a jour du mot de passe')
    } finally {
      setLoading(false)
    }
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
              className="h-16 mx-auto"
            />
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-2">
            Nouveau mot de passe
          </h1>
          <p className="text-neutral-600">
            Choisissez votre nouveau mot de passe
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-medium text-neutral-900 mb-2">
                Mot de passe modifie
              </h2>
              <p className="text-neutral-600 mb-6">
                Votre mot de passe a ete mis a jour avec succes.
                Vous allez etre redirige vers la page de connexion...
              </p>
              <Link
                to="/connexion"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
              >
                <ArrowLeft className="w-4 h-4" />
                Aller a la connexion
              </Link>
            </div>
          ) : (
            <>
              {/* Error message */}
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-10 pr-12 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="Minimum 6 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="Confirmez votre mot de passe"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Mise a jour...
                    </>
                  ) : (
                    'Mettre a jour le mot de passe'
                  )}
                </button>
              </form>

              <p className="mt-6 text-center">
                <Link
                  to="/connexion"
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour a la connexion
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
