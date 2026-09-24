import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import SectionTitle from './SectionTitle'
import { heartBurst } from '../lib/celebrate'
import { birthdayData as d } from '../data/birthdayData'

export default function FriendshipMessage() {
  const [count, setCount] = useState(0)
  const [pops, setPops] = useState([])
  const btn = useRef(null)
  const uid = useRef(0)

  const send = () => {
    setCount((c) => c + 1)
    const id = ++uid.current
    setPops((p) => [...p.slice(-6), { id, dx: (Math.random() - 0.5) * 80 }])
    const r = btn.current?.getBoundingClientRect()
    if (r) heartBurst({ x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight }, 10)
  }

  return (
    <section className="relative z-10 px-4 py-16 md:py-24 max-w-2xl mx-auto text-center" aria-labelledby="friend-title">
      <SectionTitle id="friend-title">{d.friendshipTitle}</SectionTitle>

      <div className="glass rounded-[2rem] px-6 py-10 sm:px-10">
        {d.friendshipMessage.map((line, i) => (
          <motion.p key={i}
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }} transition={{ duration: 0.7, delay: i * 0.1 }}
            className={`font-display text-2xl sm:text-3xl leading-snug text-plum ${i ? 'mt-4' : ''} ${i === 1 ? 'italic text-rosedeep' : ''}`}>
            {line}
          </motion.p>
        ))}

        <div className="relative mt-10 inline-block">
          <div aria-hidden="true" className="absolute inset-x-0 top-0 pointer-events-none">
            <AnimatePresence>
              {pops.map((p) => (
                <motion.span key={p.id} className="absolute left-1/2 top-0 text-rosedeep"
                  initial={{ opacity: 1, y: 0, x: p.dx, scale: 0.6 }}
                  animate={{ opacity: 0, y: -90, scale: 1.3 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  onAnimationComplete={() => setPops((a) => a.filter((x) => x.id !== p.id))}>
                  <Heart size={22} fill="currentColor" />
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          <motion.button ref={btn} type="button" onClick={send} whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rosedeep to-[#E36C9B] text-white font-bold px-7 py-3.5 min-h-[52px] shadow-lg shadow-rosedeep/30">
            <Heart size={20} fill="currentColor" aria-hidden="true" />
            {d.heartButtonLabel}
          </motion.button>
          <p className="mt-3 font-script text-2xl text-mauve" aria-live="polite">
            {count === 0 ? 'go on, tap it' : `${count} ${count === 1 ? 'heart' : 'hearts'} sent 💗`}
          </p>
        </div>
      </div>
    </section>
  )
}
