import { Link } from 'react-router-dom'
import { Heart, Twitter, Instagram, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    navigation: [
      { name: 'Accueil', path: '/' },
      { name: 'Blog', path: '/blog' },
      { name: 'Ma boutique', path: '/boutique' },
      { name: 'A propos', path: '/about' },
      { name: 'Contact', path: '/contact' },
    ],
    categories: [
      { name: 'Fiction', path: '/blog?category=fiction' },
      { name: 'Poésie', path: '/blog?category=poesie' },
      { name: 'Réflexions', path: '/blog?category=reflexions' },
      { name: 'Voyages', path: '/blog?category=voyages' },
    ],
    legal: [
      { name: 'Mentions légales', path: '/legal' },
      { name: 'Politique de confidentialité', path: '/privacy' },
    ],
  }

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:contact@diana.com', label: 'Email' },
  ]

  return (
    <footer className="bg-cream-200 bg-neutral-900 border-t border-neutral-200 border-neutral-800">
      {/* Main Footer */}
      <div className="container-custom py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Social Links */}
          <div className="col-span-2 lg:col-span-2">
            <p className="text-neutral-600 text-neutral-400 mb-6 max-w-sm">
              Ecrivaine passionnée, je partage ici mes mots, mes histoires et mes réflexions sur le monde qui nous entoure.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-cream-300 bg-neutral-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-neutral-600 text-neutral-400 hover:text-neutral-900 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Catégories */}
          <div>
            <h4 className="font-semibold mb-4">Catégories</h4>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-neutral-600 text-neutral-400 hover:text-neutral-900 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="font-semibold mb-4">Légal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-neutral-600 text-neutral-400 hover:text-neutral-900 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-neutral-200 border-neutral-800">
        <div className="container-custom py-6">
          <p className="text-center text-sm text-neutral-600 text-neutral-400">
            {currentYear} Fait avec <Heart className="w-4 h-4 inline text-rose-500" /> et beaucoup de cafe.
          </p>
        </div>
      </div>
    </footer>
  )
}
