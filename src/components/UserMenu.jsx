import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { User, LogIn, LogOut, MessageSquare, Settings, ChevronDown, Shield, Package } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAvatarColor, getInitials } from '../lib/avatarUtils'

export default function UserMenu() {
  const navigate = useNavigate()
  const { user, profile, isAuthenticated, isAdmin, signOut, displayName, avatarUrl, loading } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      setIsOpen(false)
      navigate('/')
    } catch (err) {
      console.error('Error signing out:', err)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full bg-neutral-200 animate-pulse" />
    )
  }

  // Not authenticated - show login button
  if (!isAuthenticated) {
    return (
      <Link
        to="/connexion"
        className="flex items-center gap-2 px-4 py-2 text-neutral-700 hover:text-primary-600 transition-colors"
      >
        <LogIn className="w-5 h-5" />
        <span className="hidden sm:inline">Connexion</span>
      </Link>
    )
  }

  // Get initials and color from shared utility
  const initials = getInitials(displayName)
  const avatarColor = getAvatarColor(displayName)

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-neutral-100 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-10 h-10 rounded-full object-cover border-2 border-neutral-200"
          />
        ) : (
          <div className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white font-medium text-sm`}>
            {initials}
          </div>
        )}
        <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform hidden sm:block ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50"
          >
            {/* User info header */}
            <div className="px-4 py-3 border-b border-neutral-100">
              <p className="font-medium text-neutral-900 truncate">{displayName}</p>
              <p className="text-sm text-neutral-500 truncate">{user?.email}</p>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full">
                  <Shield className="w-3 h-3" />
                  Administrateur
                </span>
              )}
            </div>

            {/* Menu items */}
            <div className="py-1">
              {isAdmin ? (
                /* Admin menu - Administration instead of Mes commentaires */
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  <Settings className="w-5 h-5 text-neutral-400" />
                  Administration
                </Link>
              ) : (
                /* Regular user menu - Mes commentaires */
                <Link
                  to="/mes-commentaires"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-neutral-400" />
                  Mes commentaires
                </Link>
              )}

              <Link
                to="/mes-commandes"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                <Package className="w-5 h-5 text-neutral-400" />
                Mes commandes
              </Link>

              <Link
                to="/profil"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                <User className="w-5 h-5 text-neutral-400" />
                Mon profil
              </Link>
            </div>

            {/* Sign out */}
            <div className="border-t border-neutral-100 pt-1">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Deconnexion
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
