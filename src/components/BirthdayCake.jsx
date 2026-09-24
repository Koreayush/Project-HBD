import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Wind, Sparkles, Heart, RotateCcw, Volume2, VolumeX, Wand2 } from 'lucide-react'
import { grandCelebration } from '../lib/celebrate'
import { localAudioUrl, musicBoxSynth, playFairyChime } from '../lib/birthdayAudio'

// State constants for clean state-driven animation
const STATES = {
  CAKE_IDLE: 'CAKE_IDLE',
  WAITING_FOR_BLOW: 'WAITING_FOR_BLOW',
  BLOW_DETECTED: 'BLOW_DETECTED',
  CANDLE_EXTINGUISHING: 'CANDLE_EXTINGUISHING',
  CANDLES_OUT: 'CANDLES_OUT',
  CELEBRATION: 'CELEBRATION',
  BIRTHDAY_MESSAGE: 'BIRTHDAY_MESSAGE',
}

// 7 candles configuration with pastel colors and staggered extinguishing offsets
const CANDLE_CONFIG = [
  { id: 0, x: -92, y: 10, h: 48, color: 'from-pink-300 to-rose-400', stripe: '#FFF', extinguishAt: 5.3 },
  { id: 1, x: -62, y: 5,  h: 54, color: 'from-purple-300 to-indigo-400', stripe: '#FFD700', extinguishAt: 4.2 },
  { id: 2, x: -31, y: 1,  h: 58, color: 'from-amber-200 to-yellow-400', stripe: '#FFF', extinguishAt: 4.8 },
  { id: 3, x: 0,   y: -1, h: 62, color: 'from-rose-300 to-pink-500', stripe: '#FFF8F3', extinguishAt: 5.5 }, // center
  { id: 4, x: 31,  y: 1,  h: 58, color: 'from-teal-200 to-emerald-400', stripe: '#FFD700', extinguishAt: 4.6 },
  { id: 5, x: 62,  y: 5,  h: 54, color: 'from-violet-300 to-purple-400', stripe: '#FFF', extinguishAt: 4.3 },
  { id: 6, x: 92,  y: 10, h: 48, color: 'from-pink-300 to-rose-400', stripe: '#FFD700', extinguishAt: 5.4 },
]

// 18 Richly Styled Celebration Balloons
const CELEBRATION_BALLOONS = [
  { id: 1,  left: '4%',  dur: '10s',  delay: '0s',   color: '#FF9EC3', size: 44, heart: true,  sway: 35, rot: 12 },
  { id: 2,  left: '10%', dur: '13s',  delay: '1.5s', color: '#E4DAFF', size: 48, heart: false, sway: -25, rot: -8 },
  { id: 3,  left: '17%', dur: '9s',   delay: '3.2s', color: '#FFD700', size: 40, heart: false, sway: 30, rot: 10 },
  { id: 4,  left: '24%', dur: '12s',  delay: '0.8s', color: '#FF8FB1', size: 52, heart: true,  sway: -30, rot: -10 },
  { id: 5,  left: '31%', dur: '14s',  delay: '4.5s', color: '#FFF2B2', size: 38, heart: false, sway: 20, rot: 6 },
  { id: 6,  left: '38%', dur: '11s',  delay: '2.1s', color: '#D4B8FF', size: 46, heart: true,  sway: -22, rot: -7 },
  { id: 7,  left: '52%', dur: '10s',  delay: '3.8s', color: '#FFDCC6', size: 42, heart: false, sway: 26, rot: 9 },
  { id: 8,  left: '59%', dur: '13s',  delay: '1.1s', color: '#FF80AB', size: 50, heart: true,  sway: -35, rot: -12 },
  { id: 9,  left: '67%', dur: '9.5s', delay: '4.2s', color: '#E1BEE7', size: 40, heart: false, sway: 28, rot: 8 },
  { id: 10, left: '74%', dur: '12s',  delay: '0.5s', color: '#FFD700', size: 48, heart: false, sway: -24, rot: -9 },
  { id: 11, left: '81%', dur: '11s',  delay: '2.8s', color: '#FFB2D0', size: 54, heart: true,  sway: 32, rot: 11 },
  { id: 12, left: '88%', dur: '14s',  delay: '1.8s', color: '#C5CAE9', size: 44, heart: false, sway: -28, rot: -8 },
  { id: 13, left: '94%', dur: '10.5s',delay: '3.5s', color: '#FF8A80', size: 46, heart: true,  sway: 25, rot: 10 },
  { id: 14, left: '7%',  dur: '11.5s',delay: '5.2s', color: '#FFE082', size: 42, heart: false, sway: -20, rot: -6 },
  { id: 15, left: '21%', dur: '13.5s',delay: '6.1s', color: '#F8BBD0', size: 48, heart: true,  sway: 30, rot: 12 },
  { id: 16, left: '62%', dur: '10s',  delay: '5.8s', color: '#E0F7FA', size: 40, heart: false, sway: -32, rot: -10 },
  { id: 17, left: '79%', dur: '12.5s',delay: '6.5s', color: '#FFD54F', size: 46, heart: true,  sway: 22, rot: 7 },
  { id: 18, left: '92%', dur: '11s',  delay: '7.2s', color: '#EA80FC', size: 44, heart: false, sway: -25, rot: -9 },
]

// 24 Magical Floating Fairydust Sparkles & Stars
const FAIRY_SPARKLES = [
  { id: 1,  left: '8%',  top: '25%', size: 24, dur: '3.8s', delay: '0s',   symbol: '✨', color: '#FFD700' },
  { id: 2,  left: '16%', top: '45%', size: 18, dur: '4.5s', delay: '1.2s', symbol: '⭐', color: '#FFAEC5' },
  { id: 3,  left: '23%', top: '15%', size: 28, dur: '5.2s', delay: '2.4s', symbol: '🌟', color: '#FFF8F3' },
  { id: 4,  left: '30%', top: '35%', size: 16, dur: '4.0s', delay: '0.6s', symbol: '✨', color: '#FFD700' },
  { id: 5,  left: '37%', top: '55%', size: 20, dur: '3.5s', delay: '1.8s', symbol: '💕', color: '#FF8FB1' },
  { id: 6,  left: '45%', top: '20%', size: 26, dur: '4.8s', delay: '3.1s', symbol: '✨', color: '#FFF' },
  { id: 7,  left: '55%', top: '22%', size: 22, dur: '4.2s', delay: '0.9s', symbol: '🌟', color: '#FFD700' },
  { id: 8,  left: '63%', top: '48%', size: 18, dur: '5.0s', delay: '2.1s', symbol: '✨', color: '#C9B6FF' },
  { id: 9,  left: '70%', top: '18%', size: 24, dur: '3.9s', delay: '1.5s', symbol: '⭐', color: '#FFD700' },
  { id: 10, left: '78%', top: '40%', size: 20, dur: '4.6s', delay: '2.8s', symbol: '💖', color: '#FF8FB1' },
  { id: 11, left: '86%', top: '28%', size: 26, dur: '4.1s', delay: '0.3s', symbol: '✨', color: '#FFF' },
  { id: 12, left: '92%', top: '52%', size: 18, dur: '5.4s', delay: '1.9s', symbol: '🌟', color: '#FFD700' },
  { id: 13, left: '12%', top: '65%', size: 22, dur: '4.4s', delay: '3.5s', symbol: '✨', color: '#FFB8CE' },
  { id: 14, left: '28%', top: '70%', size: 20, dur: '3.7s', delay: '0.7s', symbol: '⭐', color: '#FFD700' },
  { id: 15, left: '48%', top: '68%', size: 24, dur: '4.9s', delay: '2.2s', symbol: '✨', color: '#FFF8F3' },
  { id: 16, left: '68%', top: '72%', size: 18, dur: '4.3s', delay: '1.4s', symbol: '💕', color: '#FF8FB1' },
  { id: 17, left: '84%', top: '65%', size: 24, dur: '5.1s', delay: '3.0s', symbol: '🌟', color: '#FFD700' },
  { id: 18, left: '50%', top: '10%', size: 30, dur: '4.0s', delay: '0.5s', symbol: '✨', color: '#FFD700' },
]

export default function BirthdayCake() {
  const [animState, setAnimState] = useState(STATES.CAKE_IDLE)
  const [extinguishTime, setExtinguishTime] = useState(0) // 0 to 6.5s
  const [micActive, setMicActive] = useState(false)
  const [micLevel, setMicLevel] = useState(0)
  const [micError, setMicError] = useState(null)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [audioBlocked, setAudioBlocked] = useState(false)
  const [messageStep, setMessageStep] = useState(0) // 0 to 5 for staggered text
  const [candlesLit, setCandlesLit] = useState(true)

  const audioRef = useRef(null)
  const animFrameRef = useRef(null)
  const startTimeRef = useRef(null)
  const micStreamRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)

  // Clean up mic resources
  const stopMicrophone = useCallback(() => {
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop())
      micStreamRef.current = null
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {})
      audioContextRef.current = null
    }
    setMicActive(false)
    setMicLevel(0)
  }, [])

  // Start Birthday Music (with graceful fallback to music box synthesizer)
  const playBirthdayMusic = useCallback(() => {
    if (localAudioUrl && audioRef.current) {
      audioRef.current.volume = 0.85
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setAudioPlaying(true)
            setAudioBlocked(false)
          })
          .catch(() => {
            try {
              musicBoxSynth.play()
              setAudioPlaying(true)
              setAudioBlocked(false)
            } catch {
              setAudioBlocked(true)
              setAudioPlaying(false)
            }
          })
      }
    } else {
      try {
        musicBoxSynth.play()
        setAudioPlaying(true)
        setAudioBlocked(false)
      } catch {
        setAudioBlocked(true)
        setAudioPlaying(false)
      }
    }
  }, [])

  const stopBirthdayMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    musicBoxSynth.stop()
    setAudioPlaying(false)
  }, [])

  // Trigger Magic Sparks & Chimes anytime
  const castMagicSparkles = useCallback(() => {
    playFairyChime()
    grandCelebration()
  }, [])

  // Start the 5-6 second candle extinguishing sequence
  const startExtinguishSequence = useCallback(() => {
    stopMicrophone()
    setAnimState(STATES.BLOW_DETECTED)

    // Tiny 150ms delay for initial blow reaction
    setTimeout(() => {
      setAnimState(STATES.CANDLE_EXTINGUISHING)
      startTimeRef.current = performance.now()

      const tick = (now) => {
        const elapsed = (now - startTimeRef.current) / 1000 // seconds
        setExtinguishTime(elapsed)

        if (elapsed < 5.6) {
          animFrameRef.current = requestAnimationFrame(tick)
        } else {
          // 5.6s - 6.0s: All candles completely extinguished!
          setCandlesLit(false)
          setAnimState(STATES.CANDLES_OUT)

          // Play magical fairy chime sweep right when candles go out!
          playFairyChime()

          // 0.4s suspense anticipation pause before grand celebration
          setTimeout(() => {
            setAnimState(STATES.CELEBRATION)
            playBirthdayMusic()
            grandCelebration()

            // Trigger progressive staggered text reveal
            setTimeout(() => setAnimState(STATES.BIRTHDAY_MESSAGE), 800)
            setTimeout(() => setMessageStep(1), 1200) // HAPPY
            setTimeout(() => setMessageStep(2), 2000) // 23RD
            setTimeout(() => setMessageStep(3), 2800) // BIRTHDAY
            setTimeout(() => setMessageStep(4), 3800) // SHRAVANI ❤️
            setTimeout(() => setMessageStep(5), 5000) // Final heartfelt message
          }, 500)
        }
      }

      animFrameRef.current = requestAnimationFrame(tick)
    }, 150)
  }, [stopMicrophone, playBirthdayMusic])

  // Listen for blowing via Microphone
  const startMicrophoneBlow = async () => {
    setMicError(null)
    setAnimState(STATES.WAITING_FOR_BLOW)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
        video: false,
      })

      micStreamRef.current = stream
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      const ctx = new AudioCtx()
      audioContextRef.current = ctx

      const analyser = ctx.createAnalyser()
      analyser.fftSize = 512
      analyser.smoothingTimeConstant = 0.2
      analyserRef.current = analyser

      const source = ctx.createMediaStreamSource(stream)
      source.connect(analyser)

      setMicActive(true)

      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      let blowStreak = 0

      const checkBlow = () => {
        if (!analyserRef.current || !micStreamRef.current) return

        analyser.getByteFrequencyData(dataArray)

        let total = 0
        let lowFreqTotal = 0
        for (let i = 0; i < bufferLength; i++) {
          total += dataArray[i]
          if (i < 10) lowFreqTotal += dataArray[i]
        }

        const avgVolume = total / bufferLength
        const lowFreqAvg = lowFreqTotal / 10

        setMicLevel(Math.min(100, Math.round((avgVolume / 90) * 100)))

        // Blow detection threshold: low-frequency wind turbulence + energy
        if (lowFreqAvg > 65 && avgVolume > 35) {
          blowStreak++
          if (blowStreak >= 3) {
            startExtinguishSequence()
            return
          }
        } else {
          blowStreak = Math.max(0, blowStreak - 1)
        }

        requestAnimationFrame(checkBlow)
      }

      requestAnimationFrame(checkBlow)
    } catch (err) {
      console.warn('Microphone access denied or unavailable:', err)
      setMicError('Microphone not available. Tap the button below to blow! 💨')
      setAnimState(STATES.CAKE_IDLE)
    }
  }

  // Reset celebration to blow again
  const handleReset = () => {
    cancelAnimationFrame(animFrameRef.current)
    stopMicrophone()
    stopBirthdayMusic()
    setAnimState(STATES.CAKE_IDLE)
    setExtinguishTime(0)
    setCandlesLit(true)
    setMessageStep(0)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animFrameRef.current)
      stopMicrophone()
      stopBirthdayMusic()
    }
  }, [stopMicrophone, stopBirthdayMusic])

  // Compute live flame dynamics based on extinguish time (0s - 6s)
  const getFlameState = (candle) => {
    if (!candlesLit) return { scale: 0, opacity: 0, bend: 0, smoke: 1 }

    if (animState === STATES.CAKE_IDLE || animState === STATES.WAITING_FOR_BLOW) {
      return { scale: 1, opacity: 1, bend: 0, smoke: 0 }
    }

    if (animState === STATES.BLOW_DETECTED) {
      return { scale: 1.15, opacity: 1, bend: 42, smoke: 0.2 }
    }

    if (animState === STATES.CANDLE_EXTINGUISHING) {
      const t = extinguishTime

      // If this candle has already passed its individual extinction threshold
      if (t >= candle.extinguishAt) {
        return { scale: 0, opacity: 0, bend: 0, smoke: 1 }
      }

      // 0 - 1s: Flames bend strongly, initial smoke starts
      if (t < 1.0) {
        return {
          scale: 0.95 + Math.sin(t * 12) * 0.1,
          opacity: 1,
          bend: 38 - t * 8,
          smoke: t * 0.3,
        }
      }

      // 1 - 2s: Flames shrink to 65%, smoke becomes visible
      if (t < 2.0) {
        const p = t - 1.0 // 0 to 1
        return {
          scale: 0.9 - p * 0.3,
          opacity: 0.95 - p * 0.15,
          bend: 28 - p * 12,
          smoke: 0.3 + p * 0.3,
        }
      }

      // 2 - 3s: Flames flicker irregularly, suspense builds
      if (t < 3.0) {
        const flicker = Math.sin(t * 18 + candle.id * 3) * 0.15
        return {
          scale: Math.max(0.2, 0.58 + flicker - (candle.id % 2 === 0 ? 0.1 : 0)),
          opacity: 0.8 + flicker,
          bend: 12 + Math.sin(t * 10) * 8,
          smoke: 0.65,
        }
      }

      // 3 - 4s: Flames shrink to tiny embers, surrounding environment dims
      if (t < 4.0) {
        const p = t - 3.0
        const flicker = Math.sin(t * 22 + candle.id * 4) * 0.1
        return {
          scale: Math.max(0.12, 0.45 - p * 0.25 + flicker),
          opacity: 0.65 - p * 0.25,
          bend: 6 + Math.sin(t * 12) * 5,
          smoke: 0.8,
        }
      }

      // 4 - 5.5s: Final sputtering flickers before going out
      const remainingTime = candle.extinguishAt - t
      const lastGasps = Math.max(0, Math.sin(t * 25 + candle.id) * 0.12 + 0.15)
      return {
        scale: remainingTime > 0.3 ? lastGasps : 0,
        opacity: remainingTime > 0.3 ? 0.35 : 0,
        bend: 4,
        smoke: 0.95,
      }
    }

    return { scale: 0, opacity: 0, bend: 0, smoke: 1 }
  }

  // Calculate ambient candle glow intensity for the cake top
  const ambientGlow = useMemo(() => {
    if (!candlesLit) return 0
    if (animState === STATES.CAKE_IDLE || animState === STATES.WAITING_FOR_BLOW) return 1
    if (animState === STATES.BLOW_DETECTED) return 1.2
    if (animState === STATES.CANDLE_EXTINGUISHING) {
      if (extinguishTime < 1.0) return 0.95
      if (extinguishTime < 2.0) return 0.75 - (extinguishTime - 1.0) * 0.25
      if (extinguishTime < 3.0) return 0.45
      if (extinguishTime < 4.0) return 0.25
      if (extinguishTime < 5.0) return 0.1
      return 0
    }
    return 0
  }, [animState, extinguishTime, candlesLit])

  const isCelebrationActive = animState === STATES.CELEBRATION || animState === STATES.BIRTHDAY_MESSAGE

  return (
    <section
      id="birthday-cake-celebration"
      className="relative z-20 px-4 py-12 md:py-20 max-w-5xl mx-auto overflow-hidden text-center select-none"
      aria-labelledby="cake-celebration-title"
    >
      {/* Hidden Audio Element for local file */}
      {localAudioUrl && (
        <audio
          ref={audioRef}
          src={localAudioUrl}
          loop
          preload="auto"
          onError={() => setAudioBlocked(true)}
        />
      )}

      {/* Dynamic Celebration Ambient Atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000 -z-10"
        style={{
          background: isCelebrationActive
            ? 'radial-gradient(ellipse at 50% 45%, rgba(255, 215, 0, 0.22), rgba(255, 143, 177, 0.15), rgba(228, 218, 255, 0.1), transparent 75%)'
            : ambientGlow > 0.3
            ? `radial-gradient(ellipse at 50% 50%, rgba(255, 180, 50, ${0.15 * ambientGlow}), transparent 65%)`
            : 'radial-gradient(ellipse at 50% 50%, rgba(61, 35, 64, 0.08), transparent 60%)',
        }}
      />

      {/* ✨ MAGICAL ROTATING SUNBURST AURA BEHIND CAKE */}
      {isCelebrationActive && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] sm:w-[650px] h-[520px] sm:h-[650px] pointer-events-none -z-10 overflow-hidden">
          <div
            className="w-full h-full magical-aura opacity-35"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255, 215, 0, 0.35) 15deg, transparent 35deg, rgba(255, 143, 177, 0.3) 55deg, transparent 75deg, rgba(255, 215, 0, 0.35) 95deg, transparent 115deg, rgba(201, 182, 255, 0.3) 135deg, transparent 155deg, rgba(255, 215, 0, 0.35) 175deg, transparent 195deg, rgba(255, 143, 177, 0.3) 215deg, transparent 235deg, rgba(255, 215, 0, 0.35) 255deg, transparent 275deg, rgba(201, 182, 255, 0.3) 295deg, transparent 315deg, rgba(255, 215, 0, 0.35) 335deg, transparent 360deg)',
              maskImage: 'radial-gradient(circle, black 25%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(circle, black 25%, transparent 70%)',
            }}
          />
        </div>
      )}

      {/* 🎈 ABUNDANT CELEBRATION BALLOONS (18 Dynamic Balloons) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {CELEBRATION_BALLOONS.map((b) => (
          <div
            key={b.id}
            className={`absolute ${isCelebrationActive ? 'balloon-ascend' : 'balloon-sway'}`}
            style={{
              left: b.left,
              bottom: isCelebrationActive ? '-12%' : '12%',
              '--dur': isCelebrationActive ? b.dur : '7s',
              '--delay': isCelebrationActive ? b.delay : `${b.id * 0.4}s`,
              '--sway': `${b.sway}px`,
              '--rot': `${b.rot}deg`,
              opacity: isCelebrationActive ? 0.95 : 0.45,
            }}
          >
            <svg width={b.size} height={b.size * 1.3} viewBox="0 0 40 55" fill="none">
              {b.heart ? (
                <path
                  d="M20 38 C10 28 4 20 4 13 C4 6 10 2 16 4 C18 5 19 7 20 9 C21 7 22 5 24 4 C30 2 36 6 36 13 C36 20 30 28 20 38 Z"
                  fill={b.color}
                  filter="drop-shadow(0 4px 12px rgba(196,61,114,0.18))"
                />
              ) : (
                <ellipse
                  cx="20"
                  cy="20"
                  rx="16"
                  ry="20"
                  fill={b.color}
                  filter="drop-shadow(0 4px 12px rgba(0,0,0,0.1))"
                />
              )}
              {/* Balloon knot */}
              <polygon points="18,40 22,40 20,43" fill={b.color} />
              {/* Glossy highlight */}
              <ellipse cx="14" cy="14" rx="4" ry="7" fill="white" fillOpacity="0.5" transform="rotate(-25 14 14)" />
              {/* String */}
              <path d="M20 42 Q23 48 18 55" stroke="#CBB3F5" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            </svg>
          </div>
        ))}
      </div>

      {/* ✨ FAIRYDUST SPARKLES & STARS CONSTELLATION */}
      {isCelebrationActive && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-5">
          {FAIRY_SPARKLES.map((sp) => (
            <div
              key={sp.id}
              className="absolute fairy-sparkle"
              style={{
                left: sp.left,
                top: sp.top,
                fontSize: `${sp.size}px`,
                color: sp.color,
                '--dur': sp.dur,
                '--delay': sp.delay,
                '--drift-x': `${(sp.id % 2 === 0 ? 1 : -1) * (15 + (sp.id % 5) * 4)}px`,
                '--max-o': 0.95,
                filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.8))',
              }}
            >
              {sp.symbol}
            </div>
          ))}
        </div>
      )}

      {/* Section Header */}
      <div className="mb-4 md:mb-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-blush/60 text-rosedeep border border-white/80 shadow-sm mb-3">
            <Sparkles size={14} className="text-amber-500 animate-pulse" />
            Special Birthday Moment
          </span>
          <h2
            id="cake-celebration-title"
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-plum tracking-tight"
          >
            Make a Wish, Shravani 🎂
          </h2>
          <p className="font-script text-xl sm:text-2xl text-mauve mt-1 max-w-lg mx-auto">
            Take a deep breath, make your sweetest wish, and blow out the candles! ✨
          </p>
        </motion.div>
      </div>

      {/* Main Interactive Stage with Cake */}
      <div className="relative mx-auto flex flex-col items-center justify-center min-h-[340px] sm:min-h-[400px]">
        {/* Ambient Candle Warmth Cast */}
        <div
          className="absolute top-10 w-72 sm:w-96 h-48 rounded-full pointer-events-none transition-all duration-700 blur-3xl -z-5"
          style={{
            background: `radial-gradient(circle, rgba(255, 175, 40, ${0.45 * ambientGlow}) 0%, rgba(255, 100, 50, ${0.2 * ambientGlow}) 50%, transparent 80%)`,
            transform: `scale(${0.8 + 0.3 * ambientGlow})`,
          }}
        />

        {/* 🎂 THE BIRTHDAY CAKE */}
        <div className="relative w-full max-w-[320px] sm:max-w-[400px] md:max-w-[450px] flex justify-center items-end py-2">
          <svg
            viewBox="0 0 460 380"
            className="w-full h-auto overflow-visible select-none drop-shadow-2xl"
          >
            <defs>
              <radialGradient id="plateShadow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#3D2340" stopOpacity="0.32" />
                <stop offset="60%" stopColor="#3D2340" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#3D2340" stopOpacity="0" />
              </radialGradient>

              <linearGradient id="goldStandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D4AF37" />
                <stop offset="25%" stopColor="#FFF3B0" />
                <stop offset="50%" stopColor="#E5C158" />
                <stop offset="75%" stopColor="#FFF7D6" />
                <stop offset="100%" stopColor="#B38B21" />
              </linearGradient>

              <linearGradient id="tier1Grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFAEC5" />
                <stop offset="20%" stopColor="#FFD4E2" />
                <stop offset="50%" stopColor="#FFF2F6" />
                <stop offset="80%" stopColor="#FFC2D4" />
                <stop offset="100%" stopColor="#F593B0" />
              </linearGradient>

              <linearGradient id="tier2Grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D6C4F8" />
                <stop offset="25%" stopColor="#EBDDFF" />
                <stop offset="50%" stopColor="#FAF5FF" />
                <stop offset="75%" stopColor="#DFC8FF" />
                <stop offset="100%" stopColor="#BFA3EE" />
              </linearGradient>

              <linearGradient id="creamDripGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="70%" stopColor="#FFF8F0" />
                <stop offset="100%" stopColor="#FFEEDD" />
              </linearGradient>

              <radialGradient id="flameCoreGrad" cx="50%" cy="60%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="35%" stopColor="#FFF176" />
                <stop offset="75%" stopColor="#FF9800" />
                <stop offset="100%" stopColor="#FF5722" />
              </radialGradient>
            </defs>

            {/* Cake Platter Cast Shadow */}
            <ellipse cx="230" cy="358" rx="190" ry="18" fill="url(#plateShadow)" />

            {/* Cake Stand Pedestal */}
            <g id="cake-stand">
              <path
                d="M 195 348 Q 230 338 265 348 L 275 362 Q 230 368 185 362 Z"
                fill="url(#goldStandGrad)"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
              />
              <ellipse cx="230" cy="346" rx="178" ry="18" fill="#FFFFFF" fillOpacity="0.85" stroke="#E2D4C8" strokeWidth="1.5" />
              <ellipse cx="230" cy="345" rx="172" ry="15" fill="url(#goldStandGrad)" fillOpacity="0.55" />
            </g>

            {/* BOTTOM TIER */}
            <g id="bottom-tier">
              <path
                d="M 68 252 C 68 252 68 332 68 332 C 68 348 230 354 392 332 C 392 332 392 252 392 252 Z"
                fill="url(#tier1Grad)"
                stroke="#F2A5BC"
                strokeWidth="1"
              />
              {/* Pearls border */}
              <g id="bottom-pearls">
                {[...Array(17)].map((_, i) => (
                  <ellipse
                    key={i}
                    cx={82 + i * 18.5}
                    cy={338 + Math.sin((i / 16) * Math.PI) * 5}
                    rx="10"
                    ry="7"
                    fill="#FFFFFF"
                    stroke="#FFD1DC"
                    strokeWidth="0.8"
                    filter="drop-shadow(0 1px 2px rgba(0,0,0,0.08))"
                  />
                ))}
              </g>
              {/* Drippings */}
              <path
                d="M 68 254 
                   C 80 274, 90 274, 102 254
                   C 114 286, 126 286, 138 254
                   C 150 268, 162 268, 174 254
                   C 186 282, 200 282, 212 254
                   C 224 266, 236 266, 248 254
                   C 260 288, 274 288, 286 254
                   C 298 270, 310 270, 322 254
                   C 334 284, 348 284, 360 254
                   C 372 268, 384 268, 392 254
                   L 392 250 C 392 235 68 235 68 250 Z"
                fill="url(#creamDripGrad)"
                filter="drop-shadow(0 3px 3px rgba(196,61,114,0.18))"
              />
              {/* Sprinkles */}
              {[
                { cx: 110, cy: 300, c: '#FF69B4', r: 3 },
                { cx: 145, cy: 312, c: '#FFD700', r: 3.5 },
                { cx: 180, cy: 295, c: '#9370DB', r: 3 },
                { cx: 220, cy: 315, c: '#FF8FB1', r: 4 },
                { cx: 260, cy: 298, c: '#FFD700', r: 3 },
                { cx: 295, cy: 310, c: '#48D1CC', r: 3.5 },
                { cx: 335, cy: 295, c: '#FF69B4', r: 3 },
                { cx: 360, cy: 308, c: '#E4DAFF', r: 3.5 },
              ].map((sp, idx) => (
                <circle key={idx} cx={sp.cx} cy={sp.cy} r={sp.r} fill={sp.c} opacity="0.9" />
              ))}
              <ellipse cx="230" cy="252" rx="162" ry="24" fill="#FFEBF2" stroke="#FFC9D9" strokeWidth="1" />
            </g>

            {/* TOP TIER */}
            <g id="top-tier">
              <path
                d="M 115 168 C 115 168 115 244 115 244 C 115 258 230 264 345 244 C 345 244 345 168 345 168 Z"
                fill="url(#tier2Grad)"
                stroke="#CBB3F5"
                strokeWidth="1"
              />
              <path
                d="M 115 170 
                   C 126 195, 138 195, 148 170
                   C 158 205, 172 205, 182 170
                   C 192 188, 204 188, 214 170
                   C 225 208, 238 208, 248 170
                   C 258 185, 270 185, 280 170
                   C 292 204, 305 204, 316 170
                   C 328 186, 338 186, 345 170
                   L 345 165 C 345 152 115 152 115 165 Z"
                fill="url(#creamDripGrad)"
                filter="drop-shadow(0 3px 4px rgba(122,90,120,0.2))"
              />
              {/* Golden "23" Plaque */}
              <g id="cake-plaque" transform="translate(230, 218)">
                <ellipse cx="0" cy="0" rx="34" ry="22" fill="url(#goldStandGrad)" stroke="#FFFFFF" strokeWidth="2" filter="drop-shadow(0 2px 5px rgba(0,0,0,0.18))" />
                <ellipse cx="0" cy="0" rx="30" ry="18" fill="#FFF8F3" stroke="#D4AF37" strokeWidth="1" />
                <text
                  x="0"
                  y="7"
                  textAnchor="middle"
                  fontFamily="'Cormorant Garamond', Georgia, serif"
                  fontSize="22"
                  fontWeight="bold"
                  fontStyle="italic"
                  fill="#7A5A78"
                  letterSpacing="1"
                >
                  23
                </text>
              </g>
              {/* Top Piping Swirls */}
              <g id="top-piping">
                {[...Array(13)].map((_, i) => (
                  <ellipse
                    key={i}
                    cx={126 + i * 17.5}
                    cy={166 + Math.sin((i / 12) * Math.PI) * 4}
                    rx="9"
                    ry="6.5"
                    fill="#FFFFFF"
                    stroke="#EBDDFF"
                    strokeWidth="0.8"
                    filter="drop-shadow(0 1px 2px rgba(0,0,0,0.06))"
                  />
                ))}
              </g>
              <ellipse
                cx="230"
                cy="166"
                rx="115"
                ry="20"
                fill="#FFF4F9"
                stroke="#E2D4F8"
                strokeWidth="1"
                style={{
                  fill: ambientGlow > 0.4 ? `rgba(255, 240, 220, ${0.85 + ambientGlow * 0.15})` : '#FFF4F9',
                  transition: 'fill 0.8s ease',
                }}
              />
            </g>

            {/* 7 CANDLES WITH FLAMES & SMOKE */}
            <g id="candles-group">
              {CANDLE_CONFIG.map((candle) => {
                const candleBaseX = 230 + candle.x
                const candleBaseY = 166 + candle.y
                const candleTopY = candleBaseY - candle.h
                const fState = getFlameState(candle)

                return (
                  <g key={candle.id} id={`candle-${candle.id}`}>
                    <ellipse
                      cx={candleBaseX}
                      cy={candleBaseY}
                      rx="7"
                      ry="3.5"
                      fill="#FFD700"
                      stroke="#B8860B"
                      strokeWidth="0.8"
                    />

                    <rect
                      x={candleBaseX - 4.5}
                      y={candleTopY}
                      width="9"
                      height={candle.h}
                      rx="2.5"
                      style={{
                        fill: candle.id % 2 === 0 ? '#FFB8CE' : '#E4DAFF',
                        stroke: '#FFFFFF',
                        strokeWidth: 0.6,
                      }}
                    />

                    {[0.25, 0.5, 0.75].map((pos, sIdx) => (
                      <line
                        key={sIdx}
                        x1={candleBaseX - 4.5}
                        y1={candleTopY + candle.h * pos}
                        x2={candleBaseX + 4.5}
                        y2={candleTopY + candle.h * pos - 4}
                        stroke={candle.stripe}
                        strokeWidth="2"
                        strokeLinecap="round"
                        opacity="0.85"
                      />
                    ))}

                    <ellipse cx={candleBaseX} cy={candleTopY} rx="4.5" ry="2" fill="#FFFFFF" />

                    <line
                      x1={candleBaseX}
                      y1={candleTopY}
                      x2={candleBaseX}
                      y2={candleTopY - 7}
                      stroke="#2C1D11"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />

                    {/* Animated Realistic Flame */}
                    {fState.scale > 0.05 && (
                      <g
                        id={`flame-${candle.id}`}
                        transform={`translate(${candleBaseX}, ${candleTopY - 7}) scale(${fState.scale}) rotate(${fState.bend}) translate(${-candleBaseX}, ${-(candleTopY - 7)})`}
                        style={{
                          opacity: fState.opacity,
                          transition: animState === STATES.BLOW_DETECTED ? 'opacity 0.15s ease' : 'opacity 0.4s ease',
                        }}
                      >
                        <ellipse
                          cx={candleBaseX}
                          cy={candleTopY - 19}
                          rx="13"
                          ry="22"
                          fill="url(#flameCoreGrad)"
                          fillOpacity="0.45"
                          filter="blur(3px)"
                        />

                        <path
                          d={`M ${candleBaseX} ${candleTopY - 34}
                             C ${candleBaseX + 10} ${candleTopY - 20}, ${candleBaseX + 8} ${candleTopY - 9}, ${candleBaseX} ${candleTopY - 7}
                             C ${candleBaseX - 8} ${candleTopY - 9}, ${candleBaseX - 10} ${candleTopY - 20}, ${candleBaseX} ${candleTopY - 34} Z`}
                          fill="url(#flameCoreGrad)"
                          className={animState === STATES.CAKE_IDLE ? 'flame-alive' : ''}
                          style={{
                            filter: 'drop-shadow(0 0 6px rgba(255,160,0,0.85)) drop-shadow(0 0 14px rgba(255,90,0,0.5))',
                            '--flicker-dur': `${1.0 + (candle.id % 4) * 0.25}s`,
                          }}
                        />

                        <ellipse
                          cx={candleBaseX}
                          cy={candleTopY - 14}
                          rx="3.5"
                          ry="8"
                          fill="#FFFFFF"
                          filter="drop-shadow(0 0 4px #80D8FF)"
                        />
                      </g>
                    )}

                    {/* Rising Wisps of Smoke */}
                    {fState.smoke > 0.15 && (
                      <g
                        id={`smoke-${candle.id}`}
                        style={{
                          transformOrigin: `${candleBaseX}px ${candleTopY - 8}px`,
                        }}
                      >
                        <circle
                          cx={candleBaseX}
                          cy={candleTopY - 10}
                          r="4"
                          fill="#A0939F"
                          className="smoke-puff"
                          style={{
                            '--drift': `${(candle.id - 3) * 6 + 8}px`,
                            opacity: fState.smoke * 0.7,
                          }}
                        />
                        <circle
                          cx={candleBaseX + 2}
                          cy={candleTopY - 14}
                          r="6"
                          fill="#C4B8C3"
                          className="smoke-puff"
                          style={{
                            '--drift': `${(candle.id - 3) * 8 + 12}px`,
                            animationDelay: '0.25s',
                            opacity: fState.smoke * 0.55,
                          }}
                        />
                        <circle
                          cx={candleBaseX - 2}
                          cy={candleTopY - 20}
                          r="8"
                          fill="#E6DCE5"
                          className="smoke-puff"
                          style={{
                            '--drift': `${(candle.id - 3) * 10 + 16}px`,
                            animationDelay: '0.5s',
                            opacity: fState.smoke * 0.4,
                          }}
                        />
                      </g>
                    )}
                  </g>
                )
              })}
            </g>
          </svg>
        </div>

        {/* ⏱️ SUSPENSE TEXT OVERLAY (2-3s of extinguishing) */}
        <AnimatePresence>
          {animState === STATES.CANDLE_EXTINGUISHING && extinguishTime >= 2.0 && extinguishTime < 5.6 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="absolute top-2 sm:top-4 z-30 px-6 py-2 rounded-full glass border border-amber-200/60 shadow-lg text-plum font-script text-2xl sm:text-3xl"
            >
              Make a wish... ✨
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 💨 INTERACTION CONTROLS / STATUS AREA */}
      <div className="mt-4 md:mt-6 min-h-[80px] flex flex-col items-center justify-center">
        {/* State 1: CAKE_IDLE */}
        {animState === STATES.CAKE_IDLE && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md"
          >
            {/* Preferred: Microphone */}
            <button
              type="button"
              id="blow-mic-button"
              onClick={startMicrophoneBlow}
              className="w-full sm:w-auto flex-1 min-h-[50px] px-6 py-3 rounded-full bg-gradient-to-r from-rosedeep via-purple-600 to-amber-500 text-white font-bold text-base shadow-[0_10px_25px_-8px_rgba(196,61,114,0.5)] hover:shadow-[0_14px_32px_-6px_rgba(196,61,114,0.65)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2.5"
            >
              <Mic size={20} className="animate-bounce" />
              <span>Blow Out the Candles 🎤</span>
            </button>

            {/* Reliable Tap Fallback */}
            <button
              type="button"
              id="blow-tap-button"
              onClick={startExtinguishSequence}
              className="w-full sm:w-auto min-h-[50px] px-6 py-3 rounded-full glass text-plum font-semibold text-base border border-white hover:bg-white/80 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Wind size={18} className="text-rosedeep" />
              <span>Tap to Blow 💨</span>
            </button>
          </motion.div>
        )}

        {/* State 2: WAITING_FOR_BLOW (Microphone active & listening) */}
        {animState === STATES.WAITING_FOR_BLOW && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3 p-4 rounded-3xl glass border border-blush max-w-md w-full shadow-lg"
          >
            <div className="flex items-center gap-3">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rosedeep opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rosedeep" />
              </span>
              <p className="font-semibold text-plum text-sm sm:text-base">
                Listening... Blow into your microphone! 💨
              </p>
            </div>

            {/* Real-time Mic Volume Bar */}
            <div className="w-full h-2.5 bg-blush/60 rounded-full overflow-hidden p-0.5 border border-white">
              <div
                className="h-full bg-gradient-to-r from-rosedeep to-amber-400 rounded-full transition-all duration-75"
                style={{ width: `${Math.max(5, micLevel)}%` }}
              />
            </div>

            <div className="flex items-center justify-between w-full pt-1 text-xs text-mauve">
              <span>Too quiet?</span>
              <button
                type="button"
                onClick={startExtinguishSequence}
                className="font-bold text-rosedeep underline hover:text-plum cursor-pointer"
              >
                Tap here to blow instead 💨
              </button>
            </div>
          </motion.div>
        )}

        {/* State 3 & 4: CANDLE_EXTINGUISHING countdown feedback */}
        {(animState === STATES.BLOW_DETECTED || animState === STATES.CANDLE_EXTINGUISHING) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex items-center gap-2 text-rosedeep font-script text-2xl sm:text-3xl animate-pulse">
              <Wind size={22} className="animate-spin [animation-duration:3s]" />
              <span>
                {extinguishTime < 2.0
                  ? 'Blowing gently... 💨'
                  : extinguishTime < 4.0
                  ? 'Almost there... keep wishing! ✨'
                  : 'Flickering out... 🕯️'}
              </span>
            </div>
            <div className="w-48 h-1.5 bg-blush/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rosedeep to-amber-400 rounded-full transition-all duration-100"
                style={{ width: `${Math.min(100, (extinguishTime / 5.6) * 100)}%` }}
              />
            </div>
          </motion.div>
        )}

        {/* State 5: CANDLES_OUT (Anticipation pause) */}
        {animState === STATES.CANDLES_OUT && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-script text-2xl sm:text-3xl text-mauve animate-pulse"
          >
            All candles are out... ✨
          </motion.p>
        )}

        {/* Microphone Error Message Fallback */}
        {micError && animState === STATES.CAKE_IDLE && (
          <p className="text-xs text-rose-500 mt-2 font-medium">{micError}</p>
        )}
      </div>

      {/* 🎉 PROGRESSIVE STAGGERED CELEBRATION REVEAL */}
      <AnimatePresence>
        {isCelebrationActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-8 sm:mt-10 flex flex-col items-center text-center space-y-4"
          >
            {/* Staggered Title Words */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 font-display font-black tracking-tight leading-none">
              {messageStep >= 1 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.4, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                  className="text-3xl sm:text-5xl md:text-6xl text-plum drop-shadow-sm"
                >
                  HAPPY
                </motion.span>
              )}

              {messageStep >= 2 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.4, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                  className="text-3xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-rosedeep to-purple-600 font-extrabold filter drop-shadow"
                >
                  23RD
                </motion.span>
              )}

              {messageStep >= 3 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.4, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                  className="text-3xl sm:text-5xl md:text-6xl text-plum drop-shadow-sm"
                >
                  BIRTHDAY
                </motion.span>
              )}
            </div>

            {/* Name Reveal with Glowing Heart */}
            {messageStep >= 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 25 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 10, stiffness: 180 }}
                className="pt-1"
              >
                <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl text-rosedeep tracking-normal drop-shadow-md flex items-center justify-center gap-2 sm:gap-4">
                  <span>SHRAVANI</span>
                  <motion.span
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.4 }}
                    className="inline-block text-rose-500 text-3xl sm:text-5xl md:text-6xl"
                  >
                    ❤️
                  </motion.span>
                </h1>
              </motion.div>
            )}

            {/* 🥹 Final Heartfelt Message Card */}
            {messageStep >= 5 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="w-full max-w-2xl mt-4 p-6 sm:p-8 rounded-3xl paper border border-white/80 shadow-[0_20px_50px_-20px_rgba(196,61,114,0.35)] space-y-4"
              >
                <div className="flex justify-center">
                  <span className="p-3 rounded-full bg-gradient-to-br from-blush to-petal/50 text-rosedeep shadow-inner">
                    <Heart size={26} fill="#C43D72" className="animate-pulse" />
                  </span>
                </div>

                <p className="font-script text-2xl sm:text-3xl text-rosedeep font-semibold">
                  Make a wish, Shravani... ✨
                </p>

                <p className="font-display text-lg sm:text-2xl text-plum leading-relaxed italic max-w-xl mx-auto">
                  “May this year bring you endless happiness, beautiful memories, crazy adventures and everything you’ve been wishing for. ❤️”
                </p>

                {/* Celebration Action Toolbar */}
                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                  {/* Cast Magic Sparkles Button */}
                  <button
                    type="button"
                    onClick={castMagicSparkles}
                    className="min-h-[46px] px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 text-white text-sm font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-md"
                  >
                    <Wand2 size={16} className="animate-spin [animation-duration:6s]" />
                    <span>Magic Sparkles 🪄</span>
                  </button>

                  {/* Relight candles button */}
                  <button
                    type="button"
                    onClick={handleReset}
                    className="min-h-[46px] px-5 py-2.5 rounded-full glass border border-white text-plum text-sm font-bold flex items-center gap-2 hover:bg-white/80 active:scale-95 transition-all shadow-sm"
                  >
                    <RotateCcw size={16} className="text-rosedeep" />
                    <span>Relight Candles 🕯️</span>
                  </button>

                  {/* Music Play/Pause Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      if (audioPlaying) stopBirthdayMusic()
                      else playBirthdayMusic()
                    }}
                    className="min-h-[46px] px-5 py-2.5 rounded-full glass border border-white text-plum text-sm font-bold flex items-center gap-2 hover:bg-white/80 active:scale-95 transition-all shadow-sm"
                  >
                    {audioPlaying ? <Volume2 size={16} className="text-rosedeep" /> : <VolumeX size={16} />}
                    <span>{audioPlaying ? 'Music Playing 🎵' : 'Play Music 🎵'}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
