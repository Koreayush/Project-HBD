import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Star } from 'lucide-react'
import SectionTitle from './SectionTitle'
import { celebrate } from '../lib/celebrate'
import { birthdayData as d } from '../data/birthdayData'

const BALLOON_COLORS = ['#FF8FB1', '#C9B6FF', '#FFC9A8', '#FF5C93', '#B7A1F5', '#FFD0DE']

export default function GiftBox({ onOpened, opened }) {
  const [phase, setPhase] = useState(opened ? 'done' : 'idle') // idle → opening → heart → boom → done
  const [balloons, setBalloons] = useState(false)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const balloonData = useMemo(
    () => Array.from({ length: 10 }, (_, i) => ({
      id: i, x: 4 + i * 9.5 + Math.random() * 3, color: BALLOON_COLORS[i % BALLOON_COLORS.length],
      dur: 5 + Math.random() * 3, delay: Math.random() * 1.2, sway: 12 + Math.random() * 22, size: 54 + Math.random() * 22,
    })), [])
  const sparkles = useMemo(
    () => Array.from({ length: 14 }, (_, i) => ({ id: i, a: (i / 14) * Math.PI * 2, r: 90 + Math.random() * 120 })), [])

  const open = () => {
    if (phase !== 'idle') return
    const t = (fn, ms) => timers.current.push(setTimeout(fn, ms))
    setPhase('opening')
    t(() => setPhase('heart'), 800)
    t(() => { setPhase('boom'); setBalloons(true); celebrate(2500) }, 2000)
    t(() => { setPhase('done'); onOpened() }, 3600)
    t(() => setBalloons(false), 10500)
  }

  const isOpen = phase !== 'idle'
  const overlay = phase === 'opening' || phase === 'heart' || phase === 'boom'

  return (
    <section className="relative z-10 px-4 py-20 md:py-28 text-center" aria-labelledby="gift-title">
      <SectionTitle id="gift-title">{d.giftTitle}</SectionTitle>

      {/* gift */}
      <div className="relative mx-auto w-44 h-52 sm:w-52 sm:h-60 mb-10" aria-hidden="true">
        {isOpen && (
          <motion.div className="absolute left-1/2 top-6 -translate-x-1/2 w-40 h-40 rounded-full"
            initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 0.9, scale: 1.6 }} transition={{ duration: 1 }}
            style={{ background: 'radial-gradient(circle, rgba(255,240,180,.95), rgba(255,184,206,.5) 55%, transparent 72%)' }} />
        )}
        <motion.div className="absolute inset-x-0 bottom-0 top-16 origin-bottom"
          animate={phase === 'idle' ? { rotate: [0, -2.5, 2.5, -2.5, 0], y: [0, -4, 0] } : { y: 6 }}
          transition={phase === 'idle' ? { duration: 2.6, repeat: Infinity, repeatDelay: 1.2 } : { duration: 0.4 }}>
          {/* box body */}
          <div className="absolute inset-x-3 bottom-0 top-9 rounded-b-2xl bg-gradient-to-b from-[#FF9DBB] to-[#E4507F] shadow-[0_20px_30px_-12px_rgba(196,61,114,.6)]">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-9 bg-gradient-to-b from-[#FFF3D6] to-[#FFDCA0]" />
          </div>
          {/* lid */}
          <motion.div className="absolute inset-x-0 top-0 h-11 origin-left"
            animate={isOpen ? { y: -70, rotate: -22, x: -14, opacity: [1, 1, 0.0] } : { y: 0, rotate: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut', times: isOpen ? [0, 0.7, 1] : undefined }}>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-[#FFB3CB] to-[#F0628F] shadow-md">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-9 bg-gradient-to-b from-[#FFF3D6] to-[#FFDCA0]" />
            </div>
            {/* bow */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-7 flex items-end">
              <span className="w-10 h-8 rounded-[60%_40%_60%_40%] border-[6px] border-[#FFDCA0] -rotate-[25deg] -mr-1" />
              <span className="w-10 h-8 rounded-[40%_60%_40%_60%] border-[6px] border-[#FFDCA0] rotate-[25deg] -ml-1" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.button
        type="button"
        onClick={open}
        disabled={phase !== 'idle'}
        whileTap={{ scale: 0.94 }}
        className={`${phase === 'idle' ? 'pulse-glow' : 'opacity-60'} inline-flex items-center rounded-full bg-gradient-to-r from-rosedeep to-[#E36C9B] text-white font-bold px-9 py-4 min-h-[56px] text-base sm:text-lg tracking-wide uppercase`}
      >
        {phase === 'done' ? 'Opened 💝' : d.giftButton}
      </motion.button>

      {/* dim + big heart + sparkles */}
      <AnimatePresence>
        {overlay && (
          <motion.div key="ov" className="fixed inset-0 z-[80] grid place-items-center overflow-hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
            style={{ background: phase === 'boom' ? 'radial-gradient(circle, rgba(255,255,255,.92), rgba(255,214,230,.75))' : 'rgba(30,14,40,.72)', transition: 'background 1s' }}>
            {(phase === 'heart' || phase === 'boom') && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={phase === 'boom' ? { scale: [1, 1.5, 1.2], opacity: 1 } : { scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 140, damping: 11, duration: 0.8 }}>
                <div className="heartbeat" style={{ filter: 'drop-shadow(0 0 30px rgba(255,90,140,.9))' }}>
                  <Heart size={170} color="#FF5C93" fill="#FF5C93" aria-hidden="true" />
                </div>
              </motion.div>
            )}
            {phase === 'boom' && sparkles.map((s) => (
              <motion.span key={s.id} className="absolute text-[#FFC94D]"
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
                animate={{ x: Math.cos(s.a) * s.r, y: Math.sin(s.a) * s.r, opacity: [0, 1, 0], scale: [0.3, 1.2, 0.4] }}
                transition={{ duration: 1.4, ease: 'easeOut' }}>
                <Star size={22} fill="currentColor" aria-hidden="true" />
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* balloons */}
      {balloons && (
        <div aria-hidden="true" className="fixed inset-0 z-[85] pointer-events-none overflow-hidden">
          {balloonData.map((b) => (
            <motion.div key={b.id} className="absolute bottom-0" style={{ left: `${b.x}%` }}
              initial={{ y: 140, x: 0 }}
              animate={{ y: '-115vh', x: [0, b.sway, -b.sway, 0] }}
              transition={{ y: { duration: b.dur, delay: b.delay, ease: 'easeIn' }, x: { duration: b.dur, delay: b.delay, ease: 'easeInOut' } }}>
              <div className="relative" style={{ width: b.size, height: b.size * 1.2 }}>
                <div className="absolute inset-0 rounded-[50%_50%_48%_48%/40%_40%_60%_60%]"
                  style={{ background: `radial-gradient(circle at 32% 28%, #fff9, ${b.color} 45%)`, boxShadow: 'inset -6px -8px 14px rgba(0,0,0,.08)' }} />
                <div className="absolute left-1/2 -bottom-5 w-px h-10 bg-plum/30" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  )
}
