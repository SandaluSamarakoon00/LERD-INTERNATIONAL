import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/Blog.css'

const API = import.meta.env.VITE_API_URL

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-LK', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function Blog() {
  const [blogs,   setBlogs]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/api/blogs`)
      .then(r => r.json())
      .then(data => { setBlogs(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="blog-page">

      {/* Header */}
      <div className="blog-header">
        <p className="blog-header__eyebrow">From LERD</p>
        <h1 className="blog-header__title">The Journal</h1>
        <div className="blog-header__line" />
      </div>

      <div className="blog-body">
        {loading ? (
          <div className="blog-empty">Loading posts…</div>
        ) : blogs.length === 0 ? (
          <div className="blog-empty">No posts yet — check back soon.</div>
        ) : (
          <div className="blog-grid">
            {blogs.map(b => (
              <Link key={b.id} to={`/blog/${b.id}`} className="blog-card">
                <div className="blog-card__image-wrap">
                  {b.coverImage
                    ? <img src={b.coverImage} alt={b.title} className="blog-card__image" />
                    : <div className="blog-card__no-image">No image</div>
                  }
                </div>
                <div className="blog-card__info">
                  <p className="blog-card__date">{formatDate(b.createdAt)}</p>
                  <h3 className="blog-card__title">{b.title}</h3>
                  {b.excerpt && <p className="blog-card__excerpt">{b.excerpt}</p>}
                  <p className="blog-card__read-more">Read More →</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
