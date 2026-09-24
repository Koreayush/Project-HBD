import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Smile, HeartHandshake, Laugh, PartyPopper, Sun, Coffee, Sparkles, Heart, Camera } from 'lucide-react'
import SectionTitle from './SectionTitle'
import { birthdayData as d } from '../data/birthdayData'

const ICONS = { Smile, HeartHandshake, Laugh, PartyPopper, Sun, Coffee, Sparkles, Heart, Camera }
const TINTS = ['bg-blush', 'bg-lilac', 'bg-peach']

export default function Reasons() {
  const [openIdx, setOpenIdx] = useState(null)
  return (
    <section className="relative z-10 px-4 py-16 md:py-24 max-w-4xl mx-auto" aria-labelledby="reasons-title">
      <SectionTitle id="reasons-title" sub={d.reasonsSubtitle}>{d.reasonsTitle}</SectionTitle>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 items-start">
        {d.reasons.map((r, i) => {
          const Icon = ICONS[r.icon] ?? Heart
          const isOpen = openIdx === i
          return (
            <motion.button
              key={i}
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIdx(isOpen ? null : i)}
              initial={{ opacity: 0, y: 30, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
              whileHover={{ y: -6, rotate: i % 2 ? 1.2 : -1.2 }}
              whileTap={{ scale: 0.96 }}
              layout
              className={`glass rounded-3xl p-4 sm:p-6 text-left w-full min-h-[8.5rem] ${isOpen ? 'ring-2 ring-petal' : ''}`}
            >
              <span className={`inline-grid place-items-center w-11 h-11 rounded-2xl ${TINTS[i % 3]} text-rosedeep mb-3`}>
                <Icon size={22} aria-hidden="true" />
              </span>
              <span className="block font-display font-semibold text-xl sm:text-2xl leading-tight text-plum">{r.title}</span>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.span key="t" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="block overflow-hidden text-mauve text-sm sm:text-base leading-relaxed mt-2">
                    {r.text}
                  </motion.span>
                ) : (
                  <span key="h" className="block font-script text-lg text-rosedeep/80 mt-1">tap ♡</span>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}
