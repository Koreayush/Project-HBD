import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Star, Sparkle, Flower2 } from 'lucide-react'

const ICONS = [Heart, Star, Sparkle, Flower2, Heart]
const TINTS = ['#FFB8CE', '#C9B6FF', '#FFC9A8', '#FF8FB1', '#E4DAFF']

// Ambient floating hearts/stars/flowers + desktop-only cursor sparkles.
export default function FloatingEffects({ bright = false }) {
  const items = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        Icon: ICONS[i % ICONS.length],
        left: Math.round((i * 100) / 16 + Math.random() * 5),
        size: 12 + Math.round(Math.random() * 16),
        dur: 16 + Math.random() * 14,
        delay: -Math.random() * 25,
        sway: (Math.random() > 0.5 ? 1 : -1) * (14 + Math.random() * 30),
        color: TINTS[i % TINTS.length],
        o: 0.35 + Math.random() * 0.3,
      })),
    []
  )

  const [sparks, setSparks] = useState([])
  const counter = useRef(0)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return
    let last = 0
    const glyphs = ['✨', '💗', '⭐', '🌸']
    const onMove = (e) => {
      const now = performance.now()
      if (now - last < 110) return
      last = now
      const id = ++counter.current
      setSparks((s) => [...s.slice(-9), { id, x: e.clientX, y: e.clientY, g: glyphs[id % glyphs.length] }])
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <>
      {/* soft gradient backdrop that brightens after the gift */}
      <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: 'linear-gradient(160deg,#FFF8F3 0%,#FFEAF0 40%,#F1EAFF 75%,#FFF1E6 100%)' }} />
      <motion.div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none"
        initial={false}
        animate={{ opacity: bright ? 1 : 0 }}
        transition={{ duration: 2 }}
        style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(255,255,255,.95), rgba(255,214,230,.35) 60%, transparent 80%)' }} />

      <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {items.map(({ id, Icon, left, size, dur, delay, sway, color, o }) => (
          <span key={id} className="float-up absolute top-0"
            style={{ left: `${left}%`, '--dur': `${dur}s`, '--delay': `${delay}s`, '--sway': `${sway}px`, '--o': o }}>
            <Icon size={size} color={color} fill={color} strokeWidth={1.5} />
          </span>
        ))}
      </div>

      <div aria-hidden="true" className="fixed inset-0 z-[70] pointer-events-none overflow-hidden">
        {sparks.map((s) => (
          <motion.span key={s.id}
            initial={{ opacity: 0.9, scale: 0.6, x: s.x - 8, y: s.y - 8 }}
            animate={{ opacity: 0, scale: 1.2, y: s.y - 40, x: s.x - 8 + (s.id % 2 ? 10 : -10) }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            onAnimationComplete={() => setSparks((arr) => arr.filter((a) => a.id !== s.id))}
            className="absolute left-0 top-0 text-sm select-none">
            {s.g}
          </motion.span>
        ))}
      </div>
    </>
  )
}
