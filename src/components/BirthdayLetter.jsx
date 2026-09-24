import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import SectionTitle from './SectionTitle'
import { birthdayData as d } from '../data/birthdayData'

export default function BirthdayLetter() {
  const lines = d.birthdayMessage
  return (
    <section id="letter" className="relative z-10 px-4 py-16 md:py-24 scroll-mt-4" aria-labelledby="letter-title">
      <SectionTitle id="letter-title">{d.letterTitle}</SectionTitle>

      <motion.article
        initial={{ opacity: 0, y: 40, rotate: -1.5 }}
        whileInView={{ opacity: 1, y: 0, rotate: -0.6 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9 }}
        className="paper relative max-w-xl mx-auto rounded-[20px] px-6 sm:px-10 pt-14 pb-10"
      >
        {/* wax seal */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-[#E4507F] to-[#A82B5C] grid place-items-center shadow-lg ring-4 ring-cream">
          <Heart size={24} className="text-white heartbeat" fill="currentColor" aria-hidden="true" />
        </div>

        <div className="font-script text-[1.55rem] sm:text-[1.75rem] leading-[1.45] text-plum space-y-4">
          {lines.map((line, i) => {
            const last = i === lines.length - 1
            return (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className={i === 0 ? 'font-bold text-rosedeep' : last ? 'font-bold text-rosedeep text-[1.8rem] sm:text-[2.1rem] pt-2' : ''}
              >
                {line}
              </motion.p>
            )
          })}
          {d.letterSignature && <p className="text-right text-mauve pt-4">— {d.letterSignature}</p>}
        </div>
      </motion.article>
    </section>
  )
}
