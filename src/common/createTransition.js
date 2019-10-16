import { easeQuad } from 'd3-ease'

const TRANSITION_DURATION = 600

export default function createTransition ({ 
  startValue, 
  endValue, 
  setter,
  ease = easeQuad,
  onEnd = null,
  duration = TRANSITION_DURATION,
  delay = 0
}) {

  let t = 0
  let tToValue = (t) => {
    if (t < delay) {
      return startValue
    }
    const d = endValue - startValue
    return startValue + d * ease((t - delay) / duration)
  }

  const tick = (delta) => {
    t += delta
    t = Math.min(duration + delay, t)
    setter(tToValue(t))
    if (t >= duration + delay) {
      if (onEnd) {
        onEnd()
      }
    }
  }

  return { tick }
}