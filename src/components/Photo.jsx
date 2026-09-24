import { useState } from 'react'
import { Heart } from 'lucide-react'
import { resolvePhoto } from '../lib/assets'

// Image with lazy loading and a pretty placeholder when the file is missing.
export default function Photo({ name, alt = '', className = '', eager = false, contain = false }) {
  const src = resolvePhoto(name)
  const [failed, setFailed] = useState(!src)

  if (failed) {
    return (
      <div className={`photo-placeholder ${className}`} role="img" aria-label={alt || 'Photo placeholder'}>
        <Heart size={22} className="text-rosedeep" fill="currentColor" aria-hidden="true" />
        <span>add {name || 'a photo'}</span>
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      draggable={false}
      className={`${className} ${contain ? 'object-contain' : 'object-cover'}`}
    />
  )
}
