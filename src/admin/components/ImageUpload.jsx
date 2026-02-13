import { useState, useRef, useCallback } from 'react'
import { Upload, X, Move, Check } from 'lucide-react'

export default function ImageUpload({
  currentImage,
  onUpload,
  onRemove,
  imagePosition = 'center',
  onPositionChange
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isPositioning, setIsPositioning] = useState(false)
  const [tempPosition, setTempPosition] = useState(50)
  const fileInputRef = useRef(null)
  const imageContainerRef = useRef(null)

  // Convertir la position stockee en pourcentage
  const getPositionPercent = useCallback((pos) => {
    if (!pos) return 50
    if (pos === 'top') return 0
    if (pos === 'center') return 50
    if (pos === 'bottom') return 100
    // Format "center XX%"
    const match = pos.match(/(\d+)%/)
    if (match) return parseInt(match[1])
    return 50
  }, [])

  // Convertir le pourcentage en valeur CSS
  const getPositionCSS = useCallback((percent) => {
    if (percent === 0) return 'top'
    if (percent === 50) return 'center'
    if (percent === 100) return 'bottom'
    return `center ${percent}%`
  }, [])

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      await uploadFile(file)
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      await uploadFile(file)
    }
  }

  const uploadFile = async (file) => {
    setIsUploading(true)
    try {
      await onUpload(file)
    } finally {
      setIsUploading(false)
    }
  }

  // Gestion du positionnement par clic/drag
  const handlePositionStart = () => {
    setTempPosition(getPositionPercent(imagePosition))
    setIsPositioning(true)
  }

  const handlePositionMove = (e) => {
    if (!imageContainerRef.current) return

    const rect = imageContainerRef.current.getBoundingClientRect()
    const y = e.clientY - rect.top
    const percent = Math.max(0, Math.min(100, (y / rect.height) * 100))
    setTempPosition(Math.round(percent))
  }

  const handlePositionClick = (e) => {
    handlePositionMove(e)
  }

  const handlePositionConfirm = () => {
    if (onPositionChange) {
      onPositionChange(getPositionCSS(tempPosition))
    }
    setIsPositioning(false)
  }

  const handlePositionCancel = () => {
    setIsPositioning(false)
  }

  if (currentImage) {
    // Mode positionnement
    if (isPositioning) {
      return (
        <div className="space-y-3">
          <div className="text-sm text-gray-600 mb-2">
            Cliquez sur l'image pour definir le point focal vertical
          </div>
          <div
            ref={imageContainerRef}
            className="relative cursor-crosshair rounded-lg overflow-hidden border-2 border-primary-500"
            style={{ height: '300px' }}
            onClick={handlePositionClick}
            onMouseMove={(e) => e.buttons === 1 && handlePositionMove(e)}
          >
            <img
              src={currentImage}
              alt="Cover"
              className="w-full h-full object-cover"
              style={{ objectPosition: `center ${tempPosition}%` }}
              draggable={false}
            />

            {/* Ligne de reference */}
            <div
              className="absolute left-0 right-0 h-0.5 bg-primary-500 pointer-events-none"
              style={{ top: `${tempPosition}%` }}
            >
              <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                {tempPosition}%
              </div>
            </div>

            {/* Indicateurs haut/centre/bas */}
            <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-between py-2 pointer-events-none">
              <span className="text-xs bg-black/50 text-white px-1.5 py-0.5 rounded">Haut</span>
              <span className="text-xs bg-black/50 text-white px-1.5 py-0.5 rounded">Centre</span>
              <span className="text-xs bg-black/50 text-white px-1.5 py-0.5 rounded">Bas</span>
            </div>
          </div>

          {/* Boutons de confirmation */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePositionConfirm}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Check size={16} />
              Appliquer
            </button>
            <button
              type="button"
              onClick={handlePositionCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )
    }

    // Mode normal avec apercu
    return (
      <div className="space-y-3">
        <div className="relative group">
          <img
            src={currentImage}
            alt="Cover"
            className="w-full h-48 object-cover rounded-lg transition-all"
            style={{ objectPosition: imagePosition }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg" />

          {/* Boutons d'action */}
          <div className="absolute top-2 right-2 flex gap-2">
            {onPositionChange && (
              <button
                type="button"
                onClick={handlePositionStart}
                className="p-1.5 bg-white/90 text-gray-700 rounded-full hover:bg-white transition-colors shadow-sm"
                title="Ajuster le cadrage"
              >
                <Move size={16} />
              </button>
            )}
            <button
              type="button"
              onClick={onRemove}
              className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              title="Supprimer l'image"
            >
              <X size={16} />
            </button>
          </div>

          {/* Indicateur de position actuel */}
          {onPositionChange && (
            <div className="absolute bottom-2 left-2 text-xs bg-black/60 text-white px-2 py-1 rounded">
              Position: {imagePosition || 'center'}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-colors
        ${isDragging
          ? 'border-primary-500 bg-primary-50'
          : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        }
        ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />

      <div className="flex flex-col items-center gap-2">
        {isUploading ? (
          <>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="text-sm text-gray-600">Upload en cours...</p>
          </>
        ) : (
          <>
            <div className="p-3 bg-gray-100 rounded-full">
              <Upload className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">
              Glissez une image ou cliquez pour parcourir
            </p>
            <p className="text-xs text-gray-400">
              PNG, JPG, GIF jusqu'a 10MB
            </p>
          </>
        )}
      </div>
    </div>
  )
}
