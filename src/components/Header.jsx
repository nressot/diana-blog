import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import logoSimple from '../assets/brand/logo-simple-dark.svg'
import UserMenu from './UserMenu'
// import CartIcon from './cart/CartIcon' // Boutique desactivee temporairement

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Blog', path: '/blog' },
    // { name: 'Ma boutique', path: '/boutique' }, // Boutique desactivee temporairement
    { name: 'A propos', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-cream-100/90 backdrop-blur-lg border-b border-neutral-200/50">
      <div className="container-custom">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={logoSimple} alt="Le Coven de Diana" className="h-7" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
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
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Cart Icon - Boutique desactivee temporairement */}
            {/* <CartIcon /> */}

            {/* User Menu - Desktop */}
            <div className="hidden lg:block">
              <UserMenu />
            </div>

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
              {navLinks.map((link) => (
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
              {/* User Menu - Mobile */}
              <div className="pt-2 mt-2 border-t border-neutral-200">
                <UserMenu />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
