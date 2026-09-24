// Birthday Audio Handler: Supports local file with Web Audio API chime fallback
const musicModules = import.meta.glob('/src/assets/music/*.{mp3,m4a,ogg,wav,aac}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const musicEntries = Object.entries(musicModules)
const preferred = musicEntries.find(([p]) => p.toLowerCase().includes('happy-birthday') || p.toLowerCase().includes('birthday'))
export const localAudioUrl = (preferred ?? musicEntries[0])?.[1] ?? null

// Sweet Music Box / Celesta Synthesizer for "Happy Birthday" using Web Audio API
class MusicBoxPlayer {
  constructor() {
    this.ctx = null
    this.isPlaying = false
    this.timeoutIds = []
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  // Play a single bell / chime note
  playChime(freq, time, duration = 1.2, volume = 0.28) {
    if (!this.ctx) return
    const now = time

    // Fundamental oscillator (sine)
    const osc1 = this.ctx.createOscillator()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(freq, now)

    // Sweet bell harmonic (2nd or 3rd overtone)
    const osc2 = this.ctx.createOscillator()
    osc2.type = 'triangle'
    osc2.frequency.setValueAtTime(freq * 2.01, now)

    // Gain envelope for chime / celesta
    const gainNode = this.ctx.createGain()
    gainNode.gain.setValueAtTime(0.0001, now)
    gainNode.gain.linearRampToValueAtTime(volume, now + 0.015) // quick soft attack
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration)

    const osc2Gain = this.ctx.createGain()
    osc2Gain.gain.setValueAtTime(volume * 0.35, now)
    osc2Gain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.6)

    // Gentle stereo spread
    const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null
    if (panner) {
      panner.pan.value = (Math.random() - 0.5) * 0.4
      osc1.connect(gainNode)
      osc2.connect(osc2Gain)
      gainNode.connect(panner)
      osc2Gain.connect(panner)
      panner.connect(this.ctx.destination)
    } else {
      osc1.connect(gainNode)
      osc2.connect(osc2Gain)
      gainNode.connect(this.ctx.destination)
      osc2Gain.connect(this.ctx.destination)
    }

    osc1.start(now)
    osc2.start(now)
    osc1.stop(now + duration)
    osc2.stop(now + duration)
  }

  play() {
    this.stop()
    this.init()
    if (!this.ctx) return

    this.isPlaying = true
    const now = this.ctx.currentTime + 0.1

    // "Happy Birthday to You" notes & durations (in seconds)
    // Key of C major / G major:
    // G4 = 392.00, A4 = 440.00, B4 = 493.88, C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99
    const G4 = 392.00
    const A4 = 440.00
    const B4 = 493.88
    const C5 = 523.25
    const D5 = 587.33
    const E5 = 659.25
    const F5 = 698.46
    const G5 = 783.99

    const beat = 0.52 // tempo

    const melody = [
      // Line 1: Hap-py birth-day to you
      { f: G4, d: beat * 0.75, dur: 0.8 },
      { f: G4, d: beat * 0.25, dur: 0.7 },
      { f: A4, d: beat * 1.0,  dur: 1.1 },
      { f: G4, d: beat * 1.0,  dur: 1.1 },
      { f: C5, d: beat * 1.0,  dur: 1.2 },
      { f: B4, d: beat * 2.0,  dur: 1.6 },

      // Line 2: Hap-py birth-day to you
      { f: G4, d: beat * 0.75, dur: 0.8 },
      { f: G4, d: beat * 0.25, dur: 0.7 },
      { f: A4, d: beat * 1.0,  dur: 1.1 },
      { f: G4, d: beat * 1.0,  dur: 1.1 },
      { f: D5, d: beat * 1.0,  dur: 1.2 },
      { f: C5, d: beat * 2.0,  dur: 1.6 },

      // Line 3: Hap-py birth-day dear Shra-va-ni
      { f: G4, d: beat * 0.75, dur: 0.8 },
      { f: G4, d: beat * 0.25, dur: 0.7 },
      { f: G5, d: beat * 1.0,  dur: 1.3 },
      { f: E5, d: beat * 1.0,  dur: 1.2 },
      { f: C5, d: beat * 1.0,  dur: 1.1 },
      { f: B4, d: beat * 1.0,  dur: 1.1 },
      { f: A4, d: beat * 2.0,  dur: 1.6 },

      // Line 4: Hap-py birth-day to you
      { f: F5, d: beat * 0.75, dur: 0.8 },
      { f: F5, d: beat * 0.25, dur: 0.7 },
      { f: E5, d: beat * 1.0,  dur: 1.2 },
      { f: C5, d: beat * 1.0,  dur: 1.2 },
      { f: D5, d: beat * 1.0,  dur: 1.3 },
      { f: C5, d: beat * 2.5,  dur: 2.2 },
    ]

    let timeOffset = 0
    melody.forEach((note) => {
      this.playChime(note.f, now + timeOffset, note.dur, 0.24)
      timeOffset += note.d
    })

    // Loop after finished
    const totalDurationMs = (timeOffset + 1.5) * 1000
    const loopId = setTimeout(() => {
      if (this.isPlaying) {
        this.play()
      }
    }, totalDurationMs)
    this.timeoutIds.push(loopId)
  }

  stop() {
    this.isPlaying = false
    this.timeoutIds.forEach((id) => clearTimeout(id))
    this.timeoutIds = []
  }
}

export const musicBoxSynth = new MusicBoxPlayer()

// Magical fairy dust / wand glissando chime played when candles go out
export function playFairyChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    if (ctx.state === 'suspended') ctx.resume()
    const now = ctx.currentTime

    // Ethereal celestial notes (ascending arpeggio glissando)
    const notes = [
      { f: 523.25, d: 0.00, dur: 0.9 }, // C5
      { f: 659.25, d: 0.06, dur: 0.9 }, // E5
      { f: 783.99, d: 0.12, dur: 1.0 }, // G5
      { f: 987.77, d: 0.18, dur: 1.0 }, // B5
      { f: 1046.50, d: 0.24, dur: 1.1 }, // C6
      { f: 1318.51, d: 0.30, dur: 1.2 }, // E6
      { f: 1567.98, d: 0.36, dur: 1.3 }, // G6
      { f: 2093.00, d: 0.42, dur: 1.6 }, // C7
    ]

    notes.forEach((n) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(n.f, now + n.d)

      gain.gain.setValueAtTime(0.0001, now + n.d)
      gain.gain.linearRampToValueAtTime(0.22, now + n.d + 0.015)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + n.d + n.dur)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + n.d)
      osc.stop(now + n.d + n.dur)
    })
  } catch { /* ignore */ }
}
