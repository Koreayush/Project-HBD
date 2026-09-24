import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { celebrate } from '../lib/celebrate'
import { birthdayData as d } from '../data/birthdayData'

export default function FinalMessage() {
  const ref = useRef(null)

  useEffect(() => {
    const t1 = setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 250)
    // gentle second celebration that calms down as the message lands
    const t2 = setTimeout(() => celebrate(3800), 1400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const EMOJI = /[\p{Extended_Pictographic}\uFE0F\u200D]+/gu
  const titleText = d.finalTitle.replace(EMOJI, '').trim()
  const titleEmoji = (d.finalTitle.match(EMOJI) || []).join(' ')

  const item = (delay) => ({
    initial: { opacity: 0, y: 24, filter: 'blur(8px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 0.9, delay },
  })

  return (
    <section ref={ref} className="relative z-10 px-5 pt-6 pb-28 text-center max-w-2xl mx-auto" aria-live="polite">
      <motion.h2 {...item(0.1)} className="font-script font-bold text-5xl sm:text-7xl leading-[1.1]">
        <span className="bg-gradient-to-r from-rosedeep via-[#D5648F] to-[#8E6FD1] bg-clip-text text-transparent">{titleText}</span>
        {titleEmoji && <span> {titleEmoji}</span>}
      </motion.h2>

      <motion.p {...item(1)} className="font-display italic text-2xl sm:text-3xl text-plum leading-snug mt-8">
        “{d.finalQuote}”
      </motion.p>

      <motion.p {...item(2)} className="font-script text-3xl sm:text-4xl text-rosedeep mt-8">
        {d.finalLine}
      </motion.p>

      <motion.p {...item(3)} className="font-display font-semibold text-3xl sm:text-4xl text-plum mt-8">
        {d.finalToast}
      </motion.p>

      <motion.div {...item(3.6)} className="mt-10 inline-block">
        <div className="heartbeat" style={{ filter: 'drop-shadow(0 0 16px rgba(255,90,140,.6))' }}>
          <Heart size={64} color="#FF5C93" fill="#FF5C93" aria-hidden="true" />
        </div>
      </motion.div>

      <motion.div {...item(4.2)} className="mt-6">
        <button type="button" onClick={() => celebrate(3000)}
          className="rounded-full glass px-6 py-3 min-h-[48px] font-bold text-plum active:scale-95 transition-transform">
          Celebrate again 🎉
        </button>
      </motion.div>
    </section>
  )
}
