'use client'

export default function QRCode({ value, size = 74 }: { value: string; size?: number }) {
  const grid = 15
  const moduleSize = size / grid
  const seed = value.split('').reduce((a, c, i) => a + c.charCodeAt(0) * (i + 1), 0)

  function isFinderPattern(row: number, column: number): boolean | null {
    if (row < 7 && column < 7) {
      const border = row === 0 || row === 6 || column === 0 || column === 6
      const inner = row >= 2 && row <= 4 && column >= 2 && column <= 4
      return border || inner
    }

    if (row < 7 && column >= grid - 7) {
      const localColumn = column - (grid - 7)
      const border = row === 0 || row === 6 || localColumn === 0 || localColumn === 6
      const inner = row >= 2 && row <= 4 && localColumn >= 2 && localColumn <= 4
      return border || inner
    }

    if (row >= grid - 7 && column < 7) {
      const localRow = row - (grid - 7)
      const border = localRow === 0 || localRow === 6 || column === 0 || column === 6
      const inner = localRow >= 2 && localRow <= 4 && column >= 2 && column <= 4
      return border || inner
    }

    return null
  }

  function isFilled(row: number, column: number): boolean {
    const finderPattern = isFinderPattern(row, column)
    if (finderPattern !== null) return finderPattern
    if (row === 6 || column === 6) return (row + column) % 2 === 0
    return (row * 17 + column * 13 + seed + row * column * 7) % 5 !== 0
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', shapeRendering: 'crispEdges' }}>
      <rect width={size} height={size} fill="white" />
      {Array.from({ length: grid }, (_, row) =>
        Array.from({ length: grid }, (_, column) =>
          isFilled(row, column) ? (
            <rect key={`${row}-${column}`} x={column * moduleSize} y={row * moduleSize} width={moduleSize} height={moduleSize} fill="#1a1a1a" />
          ) : null
        )
      )}
    </svg>
  )
}
