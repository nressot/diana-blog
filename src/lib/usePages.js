/**
 * Hooks pour récupérer le contenu des pages depuis Supabase
 * Avec fallback vers les données statiques si Supabase n'est pas configuré
 */

import { useState, useEffect } from 'react'
import { supabase } from './supabase'

// Import des données statiques pour fallback
import {
  homePage as staticHomePage,
  aboutPage as staticAboutPage,
  contactPage as staticContactPage,
  bookSection as staticBookSection,
} from '../data/pages'

/**
 * Hook générique pour récupérer une page depuis Supabase
 */
function useSupabasePage(pageKey, fallbackData) {
  const [data, setData] = useState(fallbackData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    const fetchPage = async () => {
      try {
        const { data: pageData, error } = await supabase
          .from('pages')
          .select('content')
          .eq('page_key', pageKey)
          .single()

        if (error) {
          // Si pas de données, utiliser le fallback
          if (error.code === 'PGRST116') {
            console.log(`No data for ${pageKey}, using fallback`)
          } else {
            throw error
          }
        } else if (pageData?.content) {
          setData(pageData.content)
        }
      } catch (err) {
        console.warn(`Error fetching ${pageKey}, using fallback:`, err.message)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPage()
  }, [pageKey])

  return { data, loading, error }
}

/**
 * Récupérer le contenu de la page d'accueil
 */
export function useHomePage() {
  return useSupabasePage('home', staticHomePage)
}

/**
 * Récupérer le contenu de la page À propos
 */
export function useAboutPage() {
  return useSupabasePage('about', staticAboutPage)
}

/**
 * Récupérer le contenu de la page Contact
 */
export function useContactPage() {
  return useSupabasePage('contact', staticContactPage)
}

/**
 * Récupérer le contenu de la section Livre
 */
export function useBookSection() {
  return useSupabasePage('book', staticBookSection)
}
