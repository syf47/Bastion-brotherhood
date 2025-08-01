import { calcTodayPsw } from '@/utils/calc-today-psw'

let leftCount = 0
let rightCount = 0
let onceTimer: NodeJS.Timeout | null = null
let handleDelay: NodeJS.Timeout | null = null

const events = {
  unlockAdd: () => {
    ;(
      document.querySelector('#person-creator-banner-btn') as HTMLElement
    )?.classList.remove('hideMod')
  },
  getPsw: async () => {
    console.log('今日口令：', await calcTodayPsw())
  },
}
const results = [
  {
    left: 2,
    right: 3,
    event: events.unlockAdd,
  },
  {
    left: 3,
    right: 2,
    event: events.getPsw,
  },
]

function _clear() {
  leftCount = 0
  rightCount = 0
}
function _handleResult() {
  if (leftCount === 0 && rightCount === 0) return
  const result = results.find(
    (r) => r.left === leftCount && r.right === rightCount,
  )
  if (result) {
    result.event()
    _clear()
  }
}
export function hideMods() {
  function onHideModeClick(direction: 'left' | 'right') {
    if (onceTimer) {
      clearTimeout(onceTimer)
      onceTimer = null
    }
    if (handleDelay) {
      clearTimeout(handleDelay)
      handleDelay = null
    }
    onceTimer = setTimeout(_clear, 1500)
    if (direction === 'left') {
      leftCount++
    } else {
      rightCount++
    }
    handleDelay = setTimeout(_handleResult, 1000)
  }
  return {
    onHideModeClick,
  }
}
