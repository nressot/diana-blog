import { useState, useEffect } from 'react'

/**
 * Hook to analyze image brightness and determine if text should be light or dark
 * @param {string} imageUrl - URL of the image to analyze
 * @returns {object} - { isDark: boolean, isLoading: boolean }
 */
export default function useImageBrightness(imageUrl) {
  const [isDark, setIsDark] = useState(true) // Default to dark (light text)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!imageUrl) {
      setIsLoading(false)
      return
    }

    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        // Sample at lower resolution for performance
        const sampleSize = 50
        canvas.width = sampleSize
        canvas.height = sampleSize

        ctx.drawImage(img, 0, 0, sampleSize, sampleSize)

        const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize)
        const data = imageData.data

        let totalBrightness = 0
        const pixelCount = data.length / 4

        // Calculate average brightness using luminance formula
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          // Perceived brightness formula (weighted RGB)
          const brightness = (0.299 * r + 0.587 * g + 0.114 * b)
          totalBrightness += brightness
        }

        const avgBrightness = totalBrightness / pixelCount
        // If average brightness > 128 (middle), image is light -> use dark text
        setIsDark(avgBrightness < 128)
        setIsLoading(false)
      } catch (error) {
        // If CORS or other error, default to dark background assumption
        console.warn('Could not analyze image brightness:', error)
        setIsDark(true)
        setIsLoading(false)
      }
    }

    img.onerror = () => {
      setIsDark(true)
      setIsLoading(false)
    }

    img.src = imageUrl
  }, [imageUrl])

  return { isDark, isLoading }
}
