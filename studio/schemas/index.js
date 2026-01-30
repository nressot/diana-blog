import article from './article'
import author from './author'
import category from './category'
import comment from './comment'
import product from './product'
import productCategory from './productCategory'
// Pages singleton
import homePage from './homePage'
import aboutPage from './aboutPage'
import contactPage from './contactPage'
import bookSection from './bookSection'

export const schemaTypes = [
  // Documents principaux
  article,
  author,
  category,
  comment,
  // Produits
  product,
  productCategory,
  // Pages singleton
  homePage,
  aboutPage,
  contactPage,
  bookSection,
]
