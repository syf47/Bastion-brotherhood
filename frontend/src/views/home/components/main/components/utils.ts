export function calculateDelta(index: number, total: number, columns: number) {
  if (columns <= 0) {
    throw new Error('[calculateDelta]: columns must be greater than 0')
  }

  if (index < 0 || index >= total) {
    throw new Error('[calculateDelta]: index out of range')
  }

  const rows = Math.ceil(total / columns)

  const row = Math.floor(index / columns)
  const col = index % columns

  const centerRow = (rows - 1) / 2
  const centerCol = (columns - 1) / 2

  return {
    x: col - centerCol,
    y: row - centerRow,
  }
}
