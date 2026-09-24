import { useEffect, useRef, useState } from 'react'
import { Music } from 'lucide-react'
import { musicUrl } from '../lib/assets'
import { birthdayData as d } from '../data/birthdayData'

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false)
  const [broken, setBroken] = useState(false)
  const [compact, setCompact] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!musicUrl || broken) return null // no file → hide gracefully

  const toggle = () => {
    const a = ref.current
    if (!a) return
    if (playing) { a.pause(); setPlaying(false); return }
    const p = a.play()
    if (p && p.then) p.then(() => setPlaying(true)).catch(() => setPlaying(false))
    else setPlaying(true)
  }

  return (
    <>
      <audio ref={ref} src={musicUrl} loop preload="none" onError={() => setBroken(true)} />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? 'Pause birthday song' : d.musicLabel}
        className={`fixed z-[60] right-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] inline-flex items-center gap-2.5 rounded-full glass pl-2 min-h-[48px] text-sm font-bold text-plum active:scale-95 transition-transform ${compact ? 'pr-2 sm:pr-4' : 'pr-4'}`}
      >
        <span className={`grid place-items-center w-8 h-8 rounded-full bg-rosedeep text-white ${playing ? 'animate-spin [animation-duration:4s]' : ''}`}>
          <Music size={16} aria-hidden="true" />
        </span>
        <span className={compact ? 'hidden sm:inline' : ''}>{playing ? 'Playing · tap to pause' : `🎵 ${d.musicLabel}`}</span>
        {playing && (
          <span aria-hidden="true" className="flex items-end gap-0.5 h-4">
            {[0, 0.2, 0.4, 0.1].map((dl, i) => (
              <span key={i} className="wave-bar w-[3px] rounded-full bg-rosedeep" style={{ animationDelay: `${dl}s` }} />
            ))}
          </span>
        )}
      </button>
    </>
  )
}
