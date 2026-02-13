import { useState, useRef } from 'react'
import { Upload, X, Move } from 'lucide-react'

const POSITION_OPTIONS = [
  { value: 'top', label: 'Haut' },
  { value: 'center', label: 'Centre' },
  { value: 'bottom', label: 'Bas' }
]

export default function ImageUpload({
  currentImage,
  onUpload,
  onRemove,
  imagePosition = 'center',
  onPositionChange
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showPositionSelector, setShowPositionSelector] = useState(false)
  const fileInputRef = useRef(null)

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

  if (currentImage) {
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
            <button
              type="button"
              onClick={() => setShowPositionSelector(!showPositionSelector)}
              className="p-1.5 bg-white/90 text-gray-700 rounded-full hover:bg-white transition-colors shadow-sm"
              title="Ajuster le cadrage"
            >
              <Move size={16} />
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              title="Supprimer l'image"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Selecteur de position */}
        {showPositionSelector && onPositionChange && (
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600 mr-2">Cadrage vertical :</span>
            <div className="flex gap-1">
              {POSITION_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onPositionChange(option.value)}
                  className={`
                    px-3 py-1.5 text-sm rounded-md transition-colors
                    ${imagePosition === option.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
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
