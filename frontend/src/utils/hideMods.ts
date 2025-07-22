let leftCount = 0;
let rightCount = 0;
let onceTimer: NodeJS.Timeout | null = null;
const events = {
  unlockAdd: () => {
    (document.querySelector('#person-creator-banner-btn') as HTMLElement)?.classList.remove('hideMod');
  }
}
const results = [
  {
    left: 2,
    right: 3,
    event: events.unlockAdd,
  }
]

function __clear() {
  leftCount = 0;
  rightCount = 0;
}
function handleResult() {
  if (leftCount === 0 && rightCount === 0) return;
  const result = results.find(r => r.left === leftCount && r.right === rightCount);
  if (result) {
    result.event();
    __clear();
  }
}
export default function useHideMods() {
  function onHideModeClick(direction: 'left' | 'right') {
    if (onceTimer) {
      clearTimeout(onceTimer);
      onceTimer = null;
    }
    onceTimer = setTimeout(__clear, 1500)
    if (direction === 'left') {
      leftCount++
    } else {
      rightCount++
    }
    handleResult();
  }
  return {
    onHideModeClick,
  }
}