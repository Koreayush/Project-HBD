import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { birthdayData as d } from '../data/birthdayData'

export default function Hero() {
  return (
    <header className="relative z-10 min-h-[100svh] flex flex-col items-center justify-center px-5 text-center overflow-hidden">
      {/* the one big gesture: an oversized outlined "23" behind the name */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
        className="absolute inset-0 flex items-center justify-center select-none"
      >
        <span className="font-display font-semibold text-outline leading-none text-[15rem] sm:text-[22rem] md:text-[30rem]">
          {d.age}
        </span>
      </motion.div>

      <div className="relative">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9 }}
          className="font-display italic font-medium text-3xl sm:text-4xl md:text-5xl text-plum"
        >
          {d.heroTitle}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 0.7, duration: 1.1 }}
          className="font-script font-bold text-7xl sm:text-9xl md:text-[10rem] leading-[1.05] py-2 bg-gradient-to-r from-rosedeep via-[#D5648F] to-[#8E6FD1] bg-clip-text text-transparent"
        >
          <span className="whitespace-nowrap">{d.name}<span className="text-rosedeep text-4xl sm:text-6xl md:text-7xl align-middle ml-1"> ❤️</span></span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="font-body text-lg sm:text-xl text-mauve max-w-sm sm:max-w-md mx-auto mt-2"
        >
          {d.heroSubtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.9 }}
          className="flex items-center justify-center gap-4 text-4xl mt-8"
          aria-hidden="true"
        >
          {['🎂', '✨', '❤️'].map((e, i) => (
            <motion.span key={e}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}>
              {e}
            </motion.span>
          ))}
        </motion.div>
      </div>

      <motion.a
        href="#letter"
        aria-label="Scroll to your letter"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 2.4 }, y: { duration: 2, repeat: Infinity, delay: 2.4 } }}
        className="absolute bottom-6 text-rosedeep p-3"
      >
        <ChevronDown size={32} />
      </motion.a>
    </header>
  )
}
