import confetti from 'canvas-confetti'

const COLORS = ['#ff8fb1', '#c9b6ff', '#ffc9a8', '#ffffff', '#ffd86b', '#ff5c93']
const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

let heartShape, starShape
function shapes() {
  try {
    heartShape ??= confetti.shapeFromText({ text: '💖', scalar: 2 })
    starShape ??= confetti.shapeFromText({ text: '✨', scalar: 2 })
  } catch { /* fall back to default shapes */ }
  return [heartShape, starShape].filter(Boolean)
}

export function burst(origin = { x: 0.5, y: 0.6 }, count = 90) {
  if (reduced()) return
  try {
    confetti({ particleCount: count, spread: 85, origin, colors: COLORS, ticks: 220, zIndex: 200, scalar: 1 })
  } catch { /* ignore */ }
}

export function heartBurst(origin = { x: 0.5, y: 0.6 }, count = 14) {
  if (reduced()) return
  const s = shapes()
  try {
    confetti({
      particleCount: count, spread: 70, startVelocity: 28, origin, ticks: 120,
      gravity: 0.6, scalar: 2, zIndex: 200, colors: COLORS,
      ...(s.length ? { shapes: s } : {}),
    })
  } catch { /* ignore */ }
}

// A grand celebration explosion: Left, Right, Top, and Cake Center bursts
export function grandCelebration() {
  if (reduced()) return () => {}
  const s = shapes()
  const confettiColors = ['#ff8fb1', '#c9b6ff', '#ffd86b', '#ffffff', '#ff5c93', '#ffdcc6', '#a78bfa']

  // 1. Center cake burst
  try {
    confetti({
      particleCount: 85,
      spread: 360,
      startVelocity: 35,
      origin: { x: 0.5, y: 0.52 },
      colors: confettiColors,
      ticks: 280,
      zIndex: 250,
      ...(s.length ? { shapes: s } : {}),
    })
  } catch { /* ignore */ }

  // 2. Left and right cannons with a tiny delay for cinematic feel
  setTimeout(() => {
    try {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 75,
        startVelocity: 52,
        origin: { x: 0.05, y: 0.72 },
        colors: confettiColors,
        ticks: 280,
        zIndex: 250,
      })
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 75,
        startVelocity: 52,
        origin: { x: 0.95, y: 0.72 },
        colors: confettiColors,
        ticks: 280,
        zIndex: 250,
      })
    } catch { /* ignore */ }
  }, 120)

  // 3. Sky shower with hearts & stars
  setTimeout(() => {
    try {
      confetti({
        particleCount: 65,
        spread: 120,
        startVelocity: 28,
        origin: { x: 0.5, y: 0.1 },
        gravity: 0.65,
        colors: confettiColors,
        ticks: 320,
        zIndex: 250,
        ...(s.length ? { shapes: s } : {}),
      })
    } catch { /* ignore */ }
  }, 350)

  // 4. Secondary upward fountain of gold & hearts
  setTimeout(() => {
    try {
      confetti({
        particleCount: 50,
        angle: 90,
        spread: 100,
        startVelocity: 42,
        origin: { x: 0.5, y: 0.8 },
        colors: ['#ffd700', '#ff8fb1', '#ffffff', '#c9b6ff'],
        gravity: 0.8,
        ticks: 260,
        zIndex: 250,
        ...(s.length ? { shapes: s } : {}),
      })
    } catch { /* ignore */ }
  }, 850)

  // 5. Sustained ambient magical confetti & stars floating gently (7 seconds)
  const end = Date.now() + 7500
  const interval = setInterval(() => {
    if (Date.now() > end) {
      clearInterval(interval)
      return
    }
    try {
      confetti({
        particleCount: 4,
        spread: 100,
        origin: { x: Math.random() * 0.85 + 0.08, y: 0.15 },
        colors: confettiColors,
        gravity: 0.45,
        scalar: 1.3,
        ticks: 220,
        zIndex: 240,
        ...(s.length && Math.random() < 0.6 ? { shapes: s } : {}),
      })
    } catch { /* ignore */ }
  }, 240)

  return () => clearInterval(interval)
}


// A celebration that starts lively and gradually calms down.
export function celebrate(ms = 4500) {
  if (reduced()) return () => {}
  const s = shapes()
  const end = Date.now() + ms
  const id = setInterval(() => {
    const left = end - Date.now()
    if (left <= 0) return clearInterval(id)
    const t = left / ms // 1 → 0
    const n = Math.max(1, Math.round(5 * t))
    const base = { particleCount: n, spread: 65, startVelocity: 45 * (0.5 + t / 2), colors: COLORS, ticks: 200, zIndex: 200, origin: { y: 0.75 } }
    try {
      confetti({ ...base, angle: 60, origin: { x: 0, y: 0.75 } })
      confetti({ ...base, angle: 120, origin: { x: 1, y: 0.75 } })
      if (s.length && Math.random() < 0.5 * t + 0.1) {
        confetti({ particleCount: 3, spread: 100, origin: { x: Math.random(), y: 0.2 }, gravity: 0.5, scalar: 2, shapes: s, zIndex: 200 })
      }
    } catch { /* ignore */ }
  }, 170)
  return () => clearInterval(id)
}


