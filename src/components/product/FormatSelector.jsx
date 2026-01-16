import { Book, Smartphone, Headphones, Package } from 'lucide-react'

function formatPrice(priceInCents) {
  if (!priceInCents) return 'CHF 0,00'
  const francs = (priceInCents / 100).toFixed(2).replace('.', ',')
  return `CHF ${francs}`
}

const formatIcons = {
  paperback: Book,
  hardcover: Book,
  ebook: Smartphone,
  audiobook: Headphones,
  default: Package,
}

export default function FormatSelector({ formats, selectedFormat, onSelect }) {
  if (!formats || formats.length <= 1) {
    return null
  }

  return (
    <div className="mb-8">
      <label className="text-sm font-semibold text-neutral-900 mb-3 block">
        Format
      </label>

      <div className="flex flex-wrap gap-3">
        {formats.map((format) => {
          const isSelected = selectedFormat?.id === format.id
          const isAvailable = format.inStock !== false
          const Icon = formatIcons[format.formatType] || formatIcons.default

          return (
            <button
              key={format.id}
              onClick={() => isAvailable && onSelect(format)}
              disabled={!isAvailable}
              className={`flex-1 min-w-[140px] p-4 rounded-xl border transition-all ${
                isSelected
                  ? 'border-primary-600 bg-primary-50'
                  : isAvailable
                    ? 'border-neutral-200 hover:border-primary-300 bg-transparent'
                    : 'border-neutral-100 opacity-50 cursor-not-allowed bg-transparent'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`font-medium text-sm ${
                  isSelected
                    ? 'text-primary-700'
                    : 'text-neutral-800'
                }`}>
                  {format.label}
                </span>
                <Icon className={`w-4 h-4 ${
                  isSelected
                    ? 'text-primary-600'
                    : 'text-neutral-500'
                }`} />
              </div>

              <p className={`text-lg font-bold ${
                isSelected
                  ? 'text-primary-600'
                  : 'text-neutral-900'
              }`}>
                {formatPrice(format.price)}
              </p>

              {format.originalPrice && format.originalPrice > format.price && (
                <p className="text-sm text-neutral-400 line-through">
                  {formatPrice(format.originalPrice)}
                </p>
              )}

              {!isAvailable && (
                <p className="text-xs text-red-500 mt-1">Indisponible</p>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
