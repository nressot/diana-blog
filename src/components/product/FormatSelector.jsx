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
    <div className="mb-6">
      <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-3 block">
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
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                  : isAvailable
                    ? 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700'
                    : 'border-neutral-100 dark:border-neutral-800 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`font-medium text-sm ${
                  isSelected
                    ? 'text-primary-700 dark:text-primary-400'
                    : 'text-neutral-700 dark:text-neutral-300'
                }`}>
                  {format.label}
                </span>
                <Icon className={`w-4 h-4 ${
                  isSelected
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-neutral-400'
                }`} />
              </div>

              <p className={`text-lg font-bold ${
                isSelected
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-neutral-900 dark:text-white'
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
