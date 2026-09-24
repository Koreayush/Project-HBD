import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Photo from './Photo'
import SectionTitle from './SectionTitle'
import { birthdayData as d } from '../data/birthdayData'

const ASPECTS = ['aspect-[4/5]', 'aspect-square', 'aspect-[3/4]', 'aspect-[5/6]', 'aspect-[4/5]', 'aspect-[1/1]']
const TILTS = [-3, 2.5, -1.5, 3, -2.5, 1.5]

export default function PhotoGallery() {
  const photos = d.photos
  const [open, setOpen] = useState(null)

  const close = useCallback(() => setOpen(null), [])
  const step = useCallback((dir) => setOpen((i) => (i === null ? i : (i + dir + photos.length) % photos.length)), [photos.length])

  useEffect(() => {
    if (open === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open, close, step])

  return (
    <section className="relative z-10 px-4 py-16 md:py-24 max-w-5xl mx-auto" aria-labelledby="gallery-title">
      <SectionTitle id="gallery-title" sub={d.gallerySubtitle}>{d.galleryTitle}</SectionTitle>

      <div className="columns-2 md:columns-3 gap-4 md:gap-7">
        {photos.map((p, i) => {
          const tilt = TILTS[i % TILTS.length]
          return (
            <motion.button
              key={i}
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Open photo: ${p.caption}`}
              initial={{ opacity: 0, y: 40, rotate: tilt * 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: tilt }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08 }}
              whileHover={{ rotate: 0, scale: 1.05, zIndex: 5 }}
              whileTap={{ scale: 0.96, rotate: 0 }}
              className={`relative block w-full mb-5 md:mb-8 break-inside-avoid bg-white p-2 pb-14 sm:p-2.5 sm:pb-16 rounded-[14px] text-left shadow-[0_14px_34px_-14px_rgba(122,90,120,0.55)] ${i % 4 === 1 ? 'md:translate-y-4' : ''}`}
            >
              <Photo name={p.image} alt={p.caption} className={`w-full ${ASPECTS[i % ASPECTS.length]} rounded-lg`} />
              <span className="absolute left-3 right-3 bottom-2 sm:bottom-3 font-script text-lg sm:text-xl leading-tight text-plum text-center line-clamp-2">
                {p.caption}
              </span>
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            key="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-[#2A1838]/80 backdrop-blur-md p-4"
            onClick={close}
          >
            <button type="button" autoFocus onClick={close} aria-label="Close photo"
              className="absolute top-4 right-4 w-12 h-12 grid place-items-center rounded-full bg-white/90 text-plum shadow-lg">
              <X size={24} />
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); step(-1) }} aria-label="Previous photo"
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 grid place-items-center rounded-full bg-white/90 text-plum shadow-lg z-10">
              <ChevronLeft size={26} />
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); step(1) }} aria-label="Next photo"
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 grid place-items-center rounded-full bg-white/90 text-plum shadow-lg z-10">
              <ChevronRight size={26} />
            </button>

            <motion.figure
              initial={{ opacity: 0, scale: 0.88, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.5}
              onDragEnd={(_, info) => {
                if (info.offset.x < -70) step(1)
                else if (info.offset.x > 70) step(-1)
              }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-3 pb-5 shadow-2xl max-w-[min(92vw,520px)] w-full"
            >
              <div key={open} className="lb-swap">
                <Photo name={photos[open].image} alt={photos[open].caption}
                  className="w-full max-h-[68svh] min-h-[260px] rounded-xl" contain eager />
                <figcaption className="font-script text-2xl text-center text-plum mt-3 px-2">
                  {photos[open].caption}
                </figcaption>
              </div>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
