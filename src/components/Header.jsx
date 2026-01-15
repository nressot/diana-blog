import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Liens cliquables
  const clickableLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Ma boutique', path: '/boutique-demo' },
  ]

  // Liens desactives (non cliquables)
  const disabledLinks = ['Blog', 'A propos', 'Contact']

  return (
    <header className="sticky top-0 z-50 bg-cream-100/90 backdrop-blur-lg border-b border-neutral-200/50">
      <div className="container-custom">
        <div className="flex h-20 items-center justify-between">
          <div></div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {clickableLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors link-hover uppercase tracking-wide ${
                    isActive
                      ? 'text-primary-600'
                      : 'hover:opacity-60'
                  }`
                }
                style={({ isActive }) => isActive ? {} : { color: '#1c1a17' }}
              >
                {link.name}
              </NavLink>
            ))}
            {disabledLinks.map((name) => (
              <span
                key={name}
                className="text-sm font-medium uppercase tracking-wide text-neutral-400 cursor-not-allowed"
              >
                {name}
              </span>
            ))}
          </nav>

          {/* Actions - vide */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-full hover:bg-cream-300 transition-colors lg:hidden"
              aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="py-4 border-t border-neutral-200 lg:hidden">
            <div className="flex flex-col gap-2">
              {clickableLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'hover:bg-cream-300'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              {disabledLinks.map((name) => (
                <span
                  key={name}
                  className="px-4 py-3 rounded-xl text-base font-medium text-neutral-400 cursor-not-allowed"
                >
                  {name}
                </span>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
