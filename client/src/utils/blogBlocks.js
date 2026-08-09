// Shared helpers for the blog "content block" editor (admin AddBlog / BlogList)
// A post's body is an ordered array of blocks: { type: 'text' | 'image' | 'video', ... }
// Order in the array = order on the page, so admins place images/videos anywhere
// (start, middle, end) just by reordering blocks.

const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export async function uploadToCloudinary(file, resourceType = 'image') {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', UPLOAD_PRESET)
  fd.append('folder', 'lerd-blogs')

  const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`, {
    method: 'POST',
    body:   fd,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Upload failed')
  return data.secure_url
}

let counter = 0
function localId() {
  counter += 1
  return `blk_${Date.now()}_${counter}`
}

export function newBlock(type) {
  return {
    id:      localId(),
    type,                                  // 'text' | 'image' | 'video'
    text:    '',                           // text blocks
    url:     '',                           // image/video blocks — final or preview URL
    file:    null,                         // image/video blocks — pending local file to upload
    caption: '',                           // image/video blocks — optional caption
    source:  type === 'video' ? 'embed' : undefined, // video only: 'embed' (YouTube/Vimeo/link) or 'upload'
  }
}

// Turn blocks coming back from the API (plain data, no local id/file) into editable blocks.
export function blocksFromServer(blocks) {
  if (!Array.isArray(blocks)) return []
  return blocks.map(b => ({ ...newBlock(b.type), ...b, file: null }))
}

// Detect a YouTube/Vimeo link and return an embeddable iframe URL, else null.
export function toEmbedUrl(url) {
  if (!url) return null
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`
  return null
}

// Upload any pending local files (in order) and return clean, JSON-serializable blocks for the API.
export async function resolveBlocksForSubmit(blocks, onProgress) {
  const resolved = []
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i]
    if (b.type === 'text') {
      if (b.text.trim()) resolved.push({ type: 'text', text: b.text })
      continue
    }
    if (b.type === 'image') {
      let url = b.url
      if (b.file) {
        onProgress?.(`Uploading image ${i + 1}…`)
        url = await uploadToCloudinary(b.file, 'image')
      }
      if (url) resolved.push({ type: 'image', url, caption: b.caption || '' })
      continue
    }
    if (b.type === 'video') {
      let url = b.url
      if (b.source === 'upload' && b.file) {
        onProgress?.(`Uploading video ${i + 1}…`)
        url = await uploadToCloudinary(b.file, 'video')
      }
      if (url) resolved.push({ type: 'video', url, caption: b.caption || '', source: b.source || 'embed' })
    }
  }
  return resolved
}
