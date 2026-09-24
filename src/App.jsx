import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Intro from './components/Intro'
import Hero from './components/Hero'
import BirthdayLetter from './components/BirthdayLetter'
import PhotoGallery from './components/PhotoGallery'
import Memories from './components/Memories'
import Reasons from './components/Reasons'
import FriendshipMessage from './components/FriendshipMessage'
import BirthdayCake from './components/BirthdayCake'
import GiftBox from './components/GiftBox'
import FinalMessage from './components/FinalMessage'
import MusicPlayer from './components/MusicPlayer'
import FloatingEffects from './components/FloatingEffects'

export default function App() {
  const [entered, setEntered] = useState(false)
  const [gifted, setGifted] = useState(false)

  return (
    <>
      <AnimatePresence mode="wait">
        {!entered && <Intro key="intro" onOpen={() => { window.scrollTo(0, 0); setEntered(true) }} />}
      </AnimatePresence>

      {entered && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="relative"
        >
          <FloatingEffects bright={gifted} />
          <Hero />
          <BirthdayLetter />
          <PhotoGallery />
          <Memories />
          <Reasons />
          <FriendshipMessage />
          <BirthdayCake />
          <GiftBox opened={gifted} onOpened={() => setGifted(true)} />
          {gifted && <FinalMessage />}
          <MusicPlayer />
        </motion.main>
      )}
    </>
  )
}
