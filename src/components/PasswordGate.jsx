import { useState } from 'react'
import { Lock, Eye, EyeOff, Globe, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PasswordGate({ onVerify, onMakePublic, error, clearError }) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [mode, setMode] = useState('view') // 'view' or 'publish'
  const [loading, setLoading] = useState(false)
  const [confirmPublish, setConfirmPublish] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!password.trim()) return

    setLoading(true)

    if (mode === 'view') {
      await onVerify(password)
    } else if (mode === 'publish') {
      if (!confirmPublish) {
        setConfirmPublish(true)
        setLoading(false)
        return
      }
      await onMakePublic(password)
    }

    setLoading(false)
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setPassword('')
    setConfirmPublish(false)
    clearError?.()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-cream-100 to-primary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo / Titre */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-primary-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
          >
            <Lock className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-serif text-neutral-800 mb-2">Le Coven de Diana</h1>
          <p className="text-neutral-500">Site en cours de preparation</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Mode Selector */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => switchMode('view')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                mode === 'view'
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <Eye className="w-4 h-4 inline-block mr-2 -mt-0.5" />
              Voir le site
            </button>
            <button
              type="button"
              onClick={() => switchMode('publish')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                mode === 'publish'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <Globe className="w-4 h-4 inline-block mr-2 -mt-0.5" />
              Publier
            </button>
          </div>

          {/* Description */}
          <AnimatePresence mode="wait">
            <motion.p
              key={mode}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-sm text-neutral-500 mb-6 text-center"
            >
              {mode === 'view' ? (
                <>Entrez le mot de passe pour acceder au site en mode apercu.</>
              ) : (
                <>Entrez le mot de passe admin pour rendre le site public definitivement.</>
              )}
            </motion.p>
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setConfirmPublish(false)
                  clearError?.()
                }}
                placeholder={mode === 'view' ? 'Mot de passe' : 'Mot de passe admin'}
                className="w-full px-4 py-3 pr-12 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Confirm Publish Warning */}
            <AnimatePresence>
              {mode === 'publish' && confirmPublish && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm"
                >
                  <p className="font-medium mb-1">Attention !</p>
                  <p>Cette action est irreversible. Le site sera accessible a tous les visiteurs.</p>
                  <p className="mt-2 font-medium">Cliquez a nouveau sur "Publier" pour confirmer.</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !password.trim()}
              className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                mode === 'view'
                  ? 'bg-primary-500 hover:bg-primary-600 text-white'
                  : confirmPublish
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : mode === 'view' ? (
                <>
                  <Eye className="w-5 h-5" />
                  Acceder au site
                </>
              ) : confirmPublish ? (
                <>
                  <Globe className="w-5 h-5" />
                  Confirmer la publication
                </>
              ) : (
                <>
                  <Globe className="w-5 h-5" />
                  Rendre le site public
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-neutral-400 text-sm mt-6">
          Diana - Blog Litteraire
        </p>
      </motion.div>
    </div>
  )
}
