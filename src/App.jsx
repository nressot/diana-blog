import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { CartProvider } from './context/CartContext'
import ScrollToTop from './components/ScrollToTop'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
// Blog page is now handled by BlogDemo with variants
import Article from './pages/Article'
import Boutique from './pages/Boutique'
import Product from './pages/Product'
import BackgroundDemo from './pages/BackgroundDemo'
import BoutiqueDemo from './pages/BoutiqueDemo'
import BlogDemo from './pages/BlogDemo'

function App() {
  // Forcer le mode light
  useEffect(() => {
    document.documentElement.classList.remove('dark')
    localStorage.removeItem('darkMode')
  }, [])

  return (
    <CartProvider>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<BlogDemo />} />
            <Route path="/blog/:variant" element={<BlogDemo />} />
            <Route path="/article/:slug" element={<Article />} />
            <Route path="/boutique" element={<Boutique />} />
            <Route path="/boutique/:slug" element={<Product />} />
            <Route path="/boutique-demo" element={<BoutiqueDemo />} />
            <Route path="/boutique-demo/:variant" element={<BoutiqueDemo />} />
            <Route path="/demo/bg/:version" element={<BackgroundDemo />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </CartProvider>
  )
}

export default App
