import { Type, Image as ImageIcon, Video, ChevronUp, ChevronDown, Trash2, Link2, Upload } from 'lucide-react'
import { newBlock } from '../../utils/blogBlocks'

// Ordered content-block editor for blog posts.
// Blocks render top-to-bottom in this exact order on the public post page,
// so admins add text/image/video blocks and reorder them with the arrows
// to place media at the start, middle, or end of the article.
export default function BlogContentEditor({ blocks, onChange }) {

  function update(id, patch) {
    onChange(blocks.map(b => (b.id === id ? { ...b, ...patch } : b)))
  }

  function remove(id) {
    onChange(blocks.filter(b => b.id !== id))
  }

  function move(id, dir) {
    const i = blocks.findIndex(b => b.id === id)
    const j = i + dir
    if (j < 0 || j >= blocks.length) return
    const next = [...blocks]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  function add(type) {
    onChange([...blocks, newBlock(type)])
  }

  function handleImageFile(id, file) {
    if (!file) return
    update(id, { file, url: URL.createObjectURL(file) })
  }

  function handleVideoFile(id, file) {
    if (!file) return
    update(id, { file, url: URL.createObjectURL(file), source: 'upload' })
  }

  return (
    <div className="blog-editor">
      {blocks.length === 0 && (
        <p style={{ fontSize: '12px', color: '#7A5C3A', marginBottom: '12px' }}>
          No content blocks yet — add text, images, or a video below. Reorder them with the arrows
          to control where they appear in the post.
        </p>
      )}

      <div className="blog-editor-blocks">
        {blocks.map((b, i) => (
          <div key={b.id} className="blog-editor-block">
            <div className="blog-editor-block__head">
              <span className="blog-editor-block__type">
                {b.type === 'text' && <><Type size={13} /> Text</>}
                {b.type === 'image' && <><ImageIcon size={13} /> Image</>}
                {b.type === 'video' && <><Video size={13} /> Video</>}
              </span>
              <div className="blog-editor-block__controls">
                <button type="button" className="blog-editor-icon-btn" disabled={i === 0}
                  onClick={() => move(b.id, -1)} title="Move up">
                  <ChevronUp size={14} />
                </button>
                <button type="button" className="blog-editor-icon-btn" disabled={i === blocks.length - 1}
                  onClick={() => move(b.id, 1)} title="Move down">
                  <ChevronDown size={14} />
                </button>
                <button type="button" className="blog-editor-icon-btn blog-editor-icon-btn--danger"
                  onClick={() => remove(b.id)} title="Remove">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {b.type === 'text' && (
              <textarea className="admin-input admin-textarea" rows={5}
                placeholder="Write a paragraph… leave a blank line between paragraphs."
                value={b.text} onChange={e => update(b.id, { text: e.target.value })} />
            )}

            {b.type === 'image' && (
              <div className="blog-editor-media">
                <div className="admin-upload-box admin-main-upload" style={{ minHeight: '140px' }}>
                  {b.url ? (
                    <img src={b.url} alt="" className="admin-img-preview-main" style={{ height: '140px' }} />
                  ) : (
                    <>
                      <Upload size={20} style={{ color: '#B8860B' }} />
                      <p className="admin-upload-text">Add image</p>
                      <p className="admin-upload-hint">PNG, JPG up to 5MB</p>
                    </>
                  )}
                  <input type="file" accept="image/*" className="admin-upload-input"
                    onChange={e => handleImageFile(b.id, e.target.files[0])} />
                </div>
                <input className="admin-input" placeholder="Caption (optional)"
                  value={b.caption} onChange={e => update(b.id, { caption: e.target.value })} />
              </div>
            )}

            {b.type === 'video' && (
              <div className="blog-editor-media">
                <div className="blog-editor-video-tabs">
                  <button type="button"
                    className={`blog-editor-tab ${b.source !== 'upload' ? 'blog-editor-tab--active' : ''}`}
                    onClick={() => update(b.id, { source: 'embed', file: null, url: '' })}>
                    <Link2 size={12} /> Embed Link
                  </button>
                  <button type="button"
                    className={`blog-editor-tab ${b.source === 'upload' ? 'blog-editor-tab--active' : ''}`}
                    onClick={() => update(b.id, { source: 'upload', url: '' })}>
                    <Upload size={12} /> Upload File
                  </button>
                </div>

                {b.source === 'upload' ? (
                  b.url ? (
                    <div className="blog-editor-video-preview">
                      <video src={b.url} controls style={{ width: '100%', maxHeight: '220px', borderRadius: '8px' }} />
                      <button type="button" className="admin-img-remove-main"
                        style={{ position: 'absolute', top: '6px', right: '6px' }}
                        onClick={() => update(b.id, { url: '', file: null })}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="admin-upload-box admin-main-upload" style={{ minHeight: '100px' }}>
                      <Upload size={20} style={{ color: '#B8860B' }} />
                      <p className="admin-upload-text">Upload video</p>
                      <p className="admin-upload-hint">MP4 up to ~50MB</p>
                      <input type="file" accept="video/*" className="admin-upload-input"
                        onChange={e => handleVideoFile(b.id, e.target.files[0])} />
                    </div>
                  )
                ) : (
                  <input className="admin-input" placeholder="Paste a YouTube, Vimeo, or direct video URL"
                    value={b.url} onChange={e => update(b.id, { url: e.target.value })} />
                )}

                <input className="admin-input" placeholder="Caption (optional)"
                  value={b.caption} onChange={e => update(b.id, { caption: e.target.value })} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="blog-editor-add-row">
        <button type="button" className="admin-btn-secondary" onClick={() => add('text')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Type size={13} /> Add Text
        </button>
        <button type="button" className="admin-btn-secondary" onClick={() => add('image')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ImageIcon size={13} /> Add Image
        </button>
        <button type="button" className="admin-btn-secondary" onClick={() => add('video')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Video size={13} /> Add Video
        </button>
      </div>
    </div>
  )
}
