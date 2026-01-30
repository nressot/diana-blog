import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  // Refs pour eviter les race conditions
  const fetchingProfile = useRef(false)
  const currentUserId = useRef(null)

  // Fetch user profile - avec protection contre les appels multiples
  const fetchProfile = useCallback(async (userId) => {
    if (!supabase || !userId) {
      setProfile(null)
      return null
    }

    // Eviter les appels en double
    if (fetchingProfile.current && currentUserId.current === userId) {
      return profile
    }

    fetchingProfile.current = true
    currentUserId.current = userId

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        setProfile(null)
        return null
      }

      console.log('Profile loaded:', data?.email, 'role:', data?.role)
      setProfile(data)
      return data
    } catch (err) {
      console.error('Error fetching profile:', err)
      setProfile(null)
      return null
    } finally {
      fetchingProfile.current = false
    }
  }, [profile])

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      setInitialized(true)
      return
    }

    let isMounted = true

    // Initialisation unique
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error || !isMounted) {
          if (error) console.error('Error getting session:', error)
          return
        }

        const currentUser = session?.user ?? null
        setUser(currentUser)

        if (currentUser) {
          await fetchProfile(currentUser.id)
        }
      } catch (err) {
        console.error('Auth init error:', err)
      } finally {
        if (isMounted) {
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    initAuth()

    // Ecouter UNIQUEMENT les vrais changements d'auth (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted || !initialized) return

      // Ignorer les events qui ne changent pas vraiment l'etat
      if (event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        return
      }

      console.log('Auth event:', event)

      // SIGNED_IN ou SIGNED_OUT uniquement
      if (event === 'SIGNED_IN') {
        const newUser = session?.user ?? null
        // Verifier si c'est vraiment un nouvel utilisateur
        if (newUser?.id !== user?.id) {
          setUser(newUser)
          if (newUser) {
            await fetchProfile(newUser.id)
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setProfile(null)
        currentUserId.current = null
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, []) // Pas de dependances - s'execute une seule fois

  // Email/Password sign in
  const signInWithEmail = async (email, password) => {
    if (!supabase) throw new Error('Supabase non configure')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    // Mettre a jour immediatement
    if (data.user) {
      setUser(data.user)
      await fetchProfile(data.user.id)
    }

    return data
  }

  // Email/Password sign up
  const signUpWithEmail = async (email, password, displayName) => {
    if (!supabase) throw new Error('Supabase non configure')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: displayName
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) throw error
    return data
  }

  // Google OAuth
  const signInWithGoogle = async () => {
    if (!supabase) throw new Error('Supabase non configure')

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) throw error
    return data
  }

  // Twitter OAuth
  const signInWithTwitter = async () => {
    if (!supabase) throw new Error('Supabase non configure')

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'twitter',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) throw error
    return data
  }

  // Apple OAuth
  const signInWithApple = async () => {
    if (!supabase) throw new Error('Supabase non configure')

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) throw error
    return data
  }

  // Sign out
  const signOut = async () => {
    if (!supabase) throw new Error('Supabase non configure')

    const { error } = await supabase.auth.signOut()
    if (error) throw error

    // Reset immediat
    setUser(null)
    setProfile(null)
    currentUserId.current = null
  }

  // Reset password
  const resetPassword = async (email) => {
    if (!supabase) throw new Error('Supabase non configure')

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`
    })

    if (error) throw error
    return data
  }

  // Update profile
  const updateProfile = async (updates) => {
    if (!supabase || !user) throw new Error('Non authentifie')

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error
    setProfile(data)
    return data
  }

  // Refresh profile
  const refreshProfile = async () => {
    if (user) {
      return await fetchProfile(user.id)
    }
    return null
  }

  const value = {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    isAdmin: profile?.role === 'admin',
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithTwitter,
    signInWithApple,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile,
    displayName: profile?.display_name || user?.email?.split('@')[0] || 'Utilisateur',
    avatarUrl: profile?.avatar_url || null
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
