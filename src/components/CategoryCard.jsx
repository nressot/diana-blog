import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/blog?category=${category.slug}`}
      className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-cream-200 to-cream-100 dark:from-neutral-800 dark:to-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all card-hover"
    >
      <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center mb-4`}>
        <BookOpen className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-semibold text-lg mb-1 group-hover:text-primary-600 transition-colors">
        {category.name}
      </h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        {category.count} articles
      </p>
    </Link>
  )
}
