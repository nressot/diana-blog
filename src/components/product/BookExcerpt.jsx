import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, ChevronDown } from 'lucide-react'

export default function BookExcerpt({ excerpt }) {
  const [isOpen, setIsOpen] = useState(false)

  // Ne pas afficher si pas d'extrait
  if (!excerpt) return null

  return (
    <section className="py-8 mt-2 border-t border-neutral-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full group"
      >
        <h3 className="font-semibold text-lg flex items-center gap-2 text-neutral-900 group-hover:text-primary-600 transition-colors">
          <BookOpen className="w-5 h-5" />
          Lire un extrait
        </h3>
        <ChevronDown
          className={`w-5 h-5 text-neutral-500 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-6 p-6 bg-cream-100 rounded-xl border border-cream-200">
              <p className="font-serif text-lg leading-relaxed italic text-neutral-800 whitespace-pre-line">
                "{excerpt}"
              </p>
              <p className="mt-4 text-sm text-neutral-600 text-right">
                - Extrait du livre
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
