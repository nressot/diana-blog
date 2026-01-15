import { useState, useEffect } from 'react'
import { client } from './sanity'

/**
 * Hook personnalise pour fetcher des donnees Sanity
 * @param {string} query - Query GROQ
 * @param {object} params - Parametres de la query
 * @returns {object} - { data, loading, error }
 */
export function useSanityQuery(query, params = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await client.fetch(query, params)
        setData(result)
        setError(null)
      } catch (err) {
        console.error('Sanity fetch error:', err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [query, JSON.stringify(params)])

  return { data, loading, error }
}

/**
 * Fetch unique (sans hook) pour les cas ou on a besoin du resultat directement
 * @param {string} query - Query GROQ
 * @param {object} params - Parametres de la query
 * @returns {Promise} - Resultat de la query
 */
export async function fetchSanity(query, params = {}) {
  return client.fetch(query, params)
}
