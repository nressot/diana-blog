import { useState, useEffect, useRef } from 'react'
import './CssCat.css'

export default function CssCat({ className = "" }) {
  const [isVisible, setIsVisible] = useState(false)
  const catRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
      }
    )

    if (catRef.current) {
      observer.observe(catRef.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  return (
    <div
      ref={catRef}
      className={`css-cat-wrapper ${isVisible ? 'visible' : ''} ${className}`}
    >
      <div className="css-cat">
        <div className="cat-body"></div>
        <div className="cat-head">
          <div className="cat-eyes">
            <div className="cat-eye left"></div>
            <div className="cat-eye right"></div>
          </div>
          <div className="cat-ear left"></div>
          <div className="cat-ear right"></div>
        </div>
        <div className="cat-tail">
          <div className="cat-tail">
            <div className="cat-tail">
              <div className="cat-tail">
                <div className="cat-tail">
                  <div className="cat-tail"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
