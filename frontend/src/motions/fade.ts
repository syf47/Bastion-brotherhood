import type { MotionProps } from 'motion-v'

const fadeMotion: MotionProps = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
  transition: {
    duration: 0.3,
  },
}

export { fadeMotion }
