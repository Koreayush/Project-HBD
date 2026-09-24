import { motion } from 'framer-motion'

export default function SectionTitle({ children, sub, id }) {
  return (
    <div className="text-center mb-10 md:mb-14 px-2">
      <motion.h2
        id={id}
        initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8 }}
        className="font-display font-semibold text-4xl sm:text-5xl md:text-6xl text-plum leading-tight"
      >
        {children}
      </motion.h2>
      {sub && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-script text-2xl md:text-3xl text-rosedeep mt-2"
        >
          {sub}
        </motion.p>
      )}
    </div>
  )
}
