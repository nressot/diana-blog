import { Link } from 'react-router-dom'
import { Eye, MessageCircle, Clock } from 'lucide-react'

export default function ArticleCard({ article, variant = 'default', disabled = false }) {
  if (variant === 'featured') {
    const Wrapper = disabled ? 'div' : Link
    const wrapperProps = disabled ? {} : { to: `/article/${article.slug}` }

    return (
      <article className="group relative overflow-hidden rounded-2xl cursor-pointer">
        <Wrapper {...wrapperProps} className="block">
            <div className="aspect-[16/10] lg:aspect-[21/9] img-zoom">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Strong gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 p-6 lg:p-10 flex flex-col justify-end">
            <span className={`${article.categoryColor || 'bg-neutral-500'} text-white text-xs font-medium px-3 py-1 rounded-full w-fit mb-4`}>
              {article.category}
            </span>
            <h2
              className="text-3xl lg:text-5xl font-bold text-white mb-4 group-hover:text-primary-300 transition-colors"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
            >
              {article.title}
            </h2>
            <p
              className="text-white/90 mb-4 line-clamp-2 max-w-2xl hidden sm:block"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
            >
              {article.excerpt}
            </p>
            <div className="flex items-center gap-4 text-sm text-white/80">
              <span>{article.date}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {article.readTime}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {article.views}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {article.comments}
              </span>
            </div>
          </div>
          </Wrapper>
        </article>
    )
  }

  if (variant === 'horizontal') {
    const Wrapper = disabled ? 'article' : Link
    const wrapperProps = disabled ? {} : { to: `/article/${article.slug}` }

    return (
      <Wrapper {...wrapperProps} className="group flex gap-5 cursor-pointer">
        <div className="shrink-0 w-32 h-24 sm:w-40 sm:h-28 rounded-xl overflow-hidden img-zoom">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <span className={`${article.categoryColor} text-white text-xs font-medium px-2.5 py-0.5 rounded-full w-fit mb-2`}>
            {article.category}
          </span>
          <h3 className="font-semibold group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
            {article.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-neutral-500">
            <span>{article.date}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime}
            </span>
          </div>
        </div>
      </Wrapper>
    )
  }

  // Default variant
  const Wrapper = disabled ? 'article' : Link
  const wrapperProps = disabled ? {} : { to: `/article/${article.slug}` }

  return (
    <Wrapper {...wrapperProps} className="group block card-hover bg-cream-50 rounded-2xl overflow-hidden border border-neutral-200 cursor-pointer">
      <div className="aspect-[16/10] img-zoom">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className={`${article.categoryColor} text-white text-xs font-medium px-2.5 py-0.5 rounded-full`}>
            {article.category}
          </span>
          <span className="text-xs text-neutral-500">
            {article.date}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-neutral-600 line-clamp-2 mb-4">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {article.readTime}
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {article.views}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              {article.comments}
            </span>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
