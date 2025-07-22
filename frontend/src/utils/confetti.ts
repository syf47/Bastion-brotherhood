import canvasConfetti from 'canvas-confetti'

export function createConfetti() {
  const DEFAULT_COLORS = ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1']
  const DEFAULTS = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

  const randomInRange = (min: number, max: number) =>
    Math.random() * (max - min) + min

  const sideCannons = (
    duration: number = 3000,
    colors: string[] = DEFAULT_COLORS,
  ) => {
    const end = Date.now() + duration

    const frame = () => {
      if (Date.now() > end) return
      canvasConfetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors,
      })
      canvasConfetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors,
      })
      requestAnimationFrame(frame)
    }

    frame()
  }

  const fireworks = (
    duration: number = 5000,
    colors: string[] = DEFAULT_COLORS,
  ) => {
    const animationEnd = Date.now() + duration

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = Math.floor(50 * (timeLeft / duration))
      canvasConfetti({
        ...DEFAULTS,
        particleCount,
        colors,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      canvasConfetti({
        ...DEFAULTS,
        particleCount,
        colors,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)
  }

  return { sideCannons, fireworks }
}

export const { sideCannons, fireworks } = createConfetti()
