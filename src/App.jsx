import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { CartProvider } from './context/CartContext'
import CartSidebar from './components/cart/CartSidebar'
import { AuthProvider } from './context/AuthContext'
import ScrollToTop from './components/ScrollToTop'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Legal from './pages/Legal'
import Privacy from './pages/Privacy'
import CGV from './pages/CGV'
// Blog page is now handled by BlogDemo with variants
import Article from './pages/Article'
import Boutique from './pages/Boutique'
import Product from './pages/Product'
import OrderConfirmation, { OrderCanceled } from './pages/OrderConfirmation'
import BackgroundDemo from './pages/BackgroundDemo'
import BoutiqueDemo from './pages/BoutiqueDemo'
import BlogDemo from './pages/BlogDemo'
// Auth pages
import Login from './pages/Login'
import Signup from './pages/Signup'
import AuthCallback from './pages/AuthCallback'
import ResetPassword from './pages/ResetPassword'
import NewPassword from './pages/NewPassword'
import Profile from './pages/Profile'
import MyComments from './pages/MyComments'
import Orders from './pages/Orders'

// Admin imports
import {
  AdminLayout,
  Dashboard,
  ArticleList,
  ArticleEdit,
  Categories,
  Comments,
  Pages,
  ProductList,
  ProductEdit,
  StockManagement,
  OrderList,
  OrderDetail,
  BookSection
} from './admin'

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  // Forcer le mode light
  useEffect(() => {
    document.documentElement.classList.remove('dark')
    localStorage.removeItem('darkMode')
  }, [])

  // Admin routes - separate layout (uses same AuthProvider as public routes)
  if (isAdminRoute) {
    return (
      <AuthProvider>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="articles" element={<ArticleList />} />
            <Route path="articles/:id" element={<ArticleEdit />} />
            <Route path="categories" element={<Categories />} />
            <Route path="comments" element={<Comments />} />
            <Route path="pages" element={<Pages />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/:id" element={<ProductEdit />} />
            <Route path="stock" element={<StockManagement />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="book" element={<BookSection />} />
          </Route>
        </Routes>
      </AuthProvider>
    )
  }

  // Public routes
  return (
    <AuthProvider>
      <CartProvider>
        <CartSidebar />
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cgv" element={<CGV />} />
              <Route path="/blog" element={<BlogDemo />} />
              <Route path="/blog/:variant" element={<BlogDemo />} />
              <Route path="/article/:slug" element={<Article />} />
              <Route path="/boutique" element={<Boutique />} />
              <Route path="/boutique/:slug" element={<Product />} />
              <Route path="/commande-confirmee" element={<OrderConfirmation />} />
              <Route path="/commande-annulee" element={<OrderCanceled />} />
              <Route path="/boutique-demo" element={<BoutiqueDemo />} />
              <Route path="/boutique-demo/:variant" element={<BoutiqueDemo />} />
              <Route path="/demo/bg/:version" element={<BackgroundDemo />} />
              {/* Auth routes */}
              <Route path="/connexion" element={<Login />} />
              <Route path="/inscription" element={<Signup />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/mot-de-passe-oublie" element={<ResetPassword />} />
              <Route path="/nouveau-mot-de-passe" element={<NewPassword />} />
              <Route path="/profil" element={<Profile />} />
              <Route path="/mes-commentaires" element={<MyComments />} />
              <Route path="/mes-commandes" element={<Orders />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
