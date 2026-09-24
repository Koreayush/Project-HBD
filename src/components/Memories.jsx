import { motion } from 'framer-motion'
import Photo from './Photo'
import SectionTitle from './SectionTitle'
import { birthdayData as d } from '../data/birthdayData'

export default function Memories() {
  return (
    <section className="relative z-10 px-4 py-16 md:py-24 max-w-3xl mx-auto" aria-labelledby="memories-title">
      <SectionTitle id="memories-title" sub={d.memoriesSubtitle}>{d.memoriesTitle}</SectionTitle>

      <ol className="relative list-none p-0 m-0">
        <span aria-hidden="true" className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-petal to-transparent" />
        {d.memories.map((m, i) => {
          const right = i % 2 === 1
          return (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: right ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8 }}
              className={`relative pl-14 mb-12 md:w-1/2 ${right ? 'md:ml-auto md:pl-10' : 'md:pl-0 md:pr-10'}`}
            >
              <span aria-hidden="true"
                className={`absolute top-8 left-[13px] w-4 h-4 rounded-full bg-rosedeep ring-4 ring-cream ${right ? 'md:left-[-8px]' : 'md:left-auto md:right-[-8px]'}`} />
              <div className="glass rounded-3xl p-3 pb-5">
                <Photo name={m.image} alt={m.title} className="w-full aspect-[4/3] rounded-2xl" />
                <div className="px-2 pt-4">
                  {m.date && <p className="font-script text-xl text-rosedeep leading-none mb-1">{m.date}</p>}
                  <h3 className="font-display font-semibold text-2xl text-plum leading-snug">{m.title}</h3>
                  <p className="text-mauve mt-1.5 leading-relaxed">{m.description}</p>
                </div>
              </div>
            </motion.li>
          )
        })}
      </ol>
    </section>
  )
}
