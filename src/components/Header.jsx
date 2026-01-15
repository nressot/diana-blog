import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Sun, Moon, Search } from 'lucide-react'
import CartIcon from './cart/CartIcon'
import CartSidebar from './cart/CartSidebar'

export default function Header({ darkMode, toggleDarkMode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: 'Ma boutique', path: '/boutique' },
    { name: 'À propos', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-cream-100/90 dark:bg-neutral-950/90 backdrop-blur-lg border-b border-neutral-200/50 dark:border-neutral-800">
      <div className="container-custom">
        <div className="flex h-20 items-center justify-between">
{/* Logo removed */}
          <div></div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors link-hover uppercase tracking-wide ${
                    isActive
                      ? 'text-primary-600 dark:text-primary-500'
                      : 'dark:text-neutral-300 hover:opacity-60 dark:hover:text-white'
                  }`
                }
                style={({ isActive }) => isActive ? {} : { color: '#1c1a17' }}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2.5 rounded-full hover:bg-cream-300 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Rechercher"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <CartIcon />

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-full hover:bg-cream-300 dark:hover:bg-neutral-800 transition-colors"
              aria-label={darkMode ? 'Mode clair' : 'Mode sombre'}
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-full hover:bg-cream-300 dark:hover:bg-neutral-800 transition-colors lg:hidden"
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

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Rechercher un article..."
                className="w-full h-12 pl-12 pr-4 rounded-full border border-neutral-200 dark:border-neutral-700 bg-cream-200 dark:bg-neutral-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="py-4 border-t border-neutral-200 dark:border-neutral-800 lg:hidden">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-500'
                        : 'hover:bg-cream-300 dark:hover:bg-neutral-800'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </div>

      {/* Cart Sidebar */}
      <CartSidebar />
    </header>
  )
}
