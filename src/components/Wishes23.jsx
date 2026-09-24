import { motion } from 'framer-motion'
import SectionTitle from './SectionTitle'
import { birthdayData as d } from '../data/birthdayData'

const TINTS = ['from-blush to-white', 'from-lilac to-white', 'from-peach to-white']

export default function Wishes23() {
  const last = d.wishes.length - 1
  return (
    <section className="relative z-10 px-4 py-16 md:py-24 max-w-5xl mx-auto" aria-labelledby="wishes-title">
      <SectionTitle id="wishes-title" sub={d.wishesSubtitle}>{d.wishesTitle}</SectionTitle>

      <ol className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 list-none p-0 m-0">
        {d.wishes.map((w, i) => {
          const isLast = i === last
          return (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 26, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.55, delay: (i % 4) * 0.07 }}
              whileHover={{ y: -4 }}
              className={`relative rounded-3xl p-4 sm:p-5 min-h-[7rem] flex flex-col justify-between border border-white shadow-[0_10px_30px_-14px_rgba(196,61,114,0.35)] ${
                isLast
                  ? 'col-span-2 bg-gradient-to-br from-rosedeep to-[#8E6FD1] text-white items-center text-center justify-center gap-1'
                  : `bg-gradient-to-br ${TINTS[i % 3]}`
              }`}
            >
              <span className={`font-script text-3xl leading-none ${isLast ? 'text-white/80' : 'text-rosedeep'}`}>{i + 1}</span>
              <span className={`font-display font-semibold leading-snug ${isLast ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-[1.4rem] text-plum'}`}>{w}</span>
            </motion.li>
          )
        })}
      </ol>
    </section>
  )
}
