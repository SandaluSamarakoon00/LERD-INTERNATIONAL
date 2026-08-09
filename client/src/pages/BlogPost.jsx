import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { toEmbedUrl } from '../utils/blogBlocks'
import '../styles/Blog.css'

const API = import.meta.env.VITE_API_URL

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-LK', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogPost() {
  const { id } = useParams()
  const [blog,    setBlog]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`${API}/api/blogs/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setBlog(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="blogpost-page"><div className="blogpost-notfound">Loading…</div></div>
  }

  if (!blog) {
    return (
      <div className="blogpost-page">
        <div className="blogpost-notfound">
          <h2>Post not found</h2>
          <p>This blog post may have been removed or is no longer available.</p>
          <Link to="/blog" className="blogpost-back" style={{ marginTop: '20px', justifyContent: 'center' }}>
            <ArrowLeft size={14} /> Back to Journal
          </Link>
        </div>
      </div>
    )
  }

  const hasBlocks  = Array.isArray(blog.blocks) && blog.blocks.length > 0
  const paragraphs = hasBlocks ? [] : (blog.content || '').split(/\n\s*\n/).filter(Boolean)

  return (
    <div className="blogpost-page">
      <div className="blogpost-container">

        <Link to="/blog" className="blogpost-back">
          <ArrowLeft size={14} /> Back to Journal
        </Link>

        <div className="blogpost-header">
          <p className="blogpost-date">{formatDate(blog.createdAt)}</p>
          <h1 className="blogpost-title">{blog.title}</h1>
          <p className="blogpost-author">By <strong>{blog.author || 'LERD Team'}</strong></p>
        </div>

        {blog.coverImage && (
          <div className="blogpost-cover">
            <img src={blog.coverImage} alt={blog.title} />
          </div>
        )}

        <div className="blogpost-content">
          {hasBlocks ? (
            blog.blocks.map((b, i) => {
              if (b.type === 'text') {
                return b.text
                  .split(/\n\s*\n/)
                  .filter(Boolean)
                  .map((p, j) => <p key={`${i}-${j}`}>{p}</p>)
              }
              if (b.type === 'image') {
                return (
                  <figure key={i} className="blogpost-block-image">
                    <img src={b.url} alt={b.caption || blog.title} />
                    {b.caption && <figcaption>{b.caption}</figcaption>}
                  </figure>
                )
              }
              if (b.type === 'video') {
                const embedUrl = b.source === 'embed' ? toEmbedUrl(b.url) : null
                return (
                  <figure key={i} className="blogpost-block-video">
                    {embedUrl ? (
                      <iframe src={embedUrl} title={b.caption || 'Video'} allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
                    ) : (
                      <video src={b.url} controls />
                    )}
                    {b.caption && <figcaption>{b.caption}</figcaption>}
                  </figure>
                )
              }
              return null
            })
          ) : (
            paragraphs.map((p, i) => <p key={i}>{p}</p>)
          )}
        </div>

      </div>
    </div>
  )
}
