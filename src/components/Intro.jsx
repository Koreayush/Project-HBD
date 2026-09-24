import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Gift } from 'lucide-react'
import { birthdayData as d } from '../data/birthdayData'
import { burst, heartBurst } from '../lib/celebrate'

export default function Intro({ onOpen }) {
  const [step, setStep] = useState(0) // 1 heart, 2 line1, 3 line2, 4 button
  const [leaving, setLeaving] = useState(false)

  const stars = useMemo(
    () => Array.from({ length: 46 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      s: 1 + Math.random() * 2.5, dur: 2 + Math.random() * 3, delay: Math.random() * 3,
    })), [])
  const risers = useMemo(
    () => Array.from({ length: 16 }, (_, i) => ({ id: i, x: 5 + Math.random() * 90, s: 14 + Math.random() * 22, delay: Math.random() * 0.6 })), [])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setStep(4); return }
    const t = [
      setTimeout(() => setStep(1), 900),
      setTimeout(() => setStep(2), 2300),
      setTimeout(() => setStep(3), 4000),
      setTimeout(() => setStep(4), 5400),
    ]
    return () => t.forEach(clearTimeout)
  }, [])

  const open = () => {
    if (leaving) return
    setLeaving(true)
    burst({ x: 0.5, y: 0.7 }, 120)
    setTimeout(() => heartBurst({ x: 0.5, y: 0.7 }, 18), 250)
    setTimeout(onOpen, 1700)
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(14px)' }}
      transition={{ duration: 1 }}
      style={{ background: 'linear-gradient(170deg,#2A1838 0%,#4B2A5E 45%,#8A3F78 100%)' }}
    >
      {/* blurred orbs */}
      <motion.div aria-hidden="true" className="absolute -top-20 -left-24 w-72 h-72 rounded-full bg-petal/40 blur-3xl"
        animate={leaving ? { opacity: 0 } : { x: [0, 30, 0], y: [0, 20, 0] }} transition={{ duration: 12, repeat: Infinity }} />
      <motion.div aria-hidden="true" className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-lilac/30 blur-3xl"
        animate={leaving ? { opacity: 0 } : { x: [0, -30, 0], y: [0, -20, 0] }} transition={{ duration: 14, repeat: Infinity }} />
      {/* brightening wash when opening */}
      <motion.div aria-hidden="true" className="absolute inset-0"
        initial={{ opacity: 0 }} animate={{ opacity: leaving ? 1 : 0 }} transition={{ duration: 1.4 }}
        style={{ background: 'linear-gradient(170deg,#FFDDE6,#F1EAFF 60%,#FFF8F3)' }} />

      {stars.map((s) => (
        <span key={s.id} aria-hidden="true" className="twinkle absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, '--dur': `${s.dur}s`, '--delay': `${s.delay}s`, opacity: leaving ? 0 : undefined, transition: 'opacity 1s' }} />
      ))}

      {leaving && risers.map((r) => (
        <motion.span key={r.id} aria-hidden="true" className="absolute bottom-0 text-rosedeep"
          style={{ left: `${r.x}%` }}
          initial={{ y: 40, opacity: 0 }} animate={{ y: '-105vh', opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.8, delay: r.delay, ease: 'easeOut' }}>
          <Heart size={r.s} fill="currentColor" />
        </motion.span>
      ))}

      <div className="relative z-10 flex flex-col items-center max-w-md min-h-[22rem]">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={step >= 1 ? { scale: 1, opacity: 1 } : {}}
          transition={{ type: 'spring', stiffness: 160, damping: 12 }}
          className="mb-8"
        >
          <div className="heartbeat" style={{ filter: 'drop-shadow(0 0 18px rgba(255,140,180,.9))' }}>
            <Heart size={68} color="#FF8FB1" fill="#FF8FB1" aria-hidden="true" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
          animate={step >= 2 ? { opacity: leaving ? 0 : 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.9 }}
          className="font-script text-5xl sm:text-6xl text-white mb-3"
        >
          {d.introLines[0]}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
          animate={step >= 3 ? { opacity: leaving ? 0 : 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.9 }}
          className="font-display italic text-2xl sm:text-3xl text-blush mb-10"
        >
          {d.introLines[1]}
        </motion.p>

        {step >= 4 && (
          <motion.button
            type="button"
            onClick={open}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={leaving ? { scale: [1, 1.15, 0], opacity: [1, 1, 0], rotate: [0, 0, 180] } : { opacity: 1, scale: 1 }}
            transition={leaving ? { duration: 0.9 } : { duration: 0.7 }}
            whileTap={{ scale: 0.94 }}
            className={`${leaving ? '' : 'pulse-glow'} inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-rosedeep to-[#E36C9B] text-white font-bold px-8 py-4 min-h-[56px] text-base sm:text-lg tracking-wide`}
          >
            <Gift size={22} aria-hidden="true" />
            <span className="uppercase">{d.introButton}</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
