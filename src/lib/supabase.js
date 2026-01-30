import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Admin features will be disabled.')
} else {
  console.log('Supabase configured:', supabaseUrl)
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const isSupabaseConfigured = () => !!supabase

// Helper pour upload d'images
export const uploadImage = async (file, bucket = 'images') => {
  if (!supabase) throw new Error('Supabase not configured')

  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `${fileName}`

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return data.publicUrl
}

// Helper pour supprimer une image
export const deleteImage = async (url, bucket = 'images') => {
  if (!supabase) throw new Error('Supabase not configured')

  const fileName = url.split('/').pop()
  const { error } = await supabase.storage
    .from(bucket)
    .remove([fileName])

  if (error) throw error
}
