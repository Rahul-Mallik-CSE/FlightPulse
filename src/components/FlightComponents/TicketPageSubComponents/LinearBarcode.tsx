'use client'

export default function LinearBarcode({ value, w = 22, h = 130 }: { value: string; w?: number; h?: number }) {
  const seed = value.split('').reduce((a, c, i) => a + c.charCodeAt(0) * (i + 1), 0)

  type Bar = { x: number; bw: number }
  const bars: Bar[] = []
  let totalWidth = 0

  for (let i = 0; i < 52; i++) {
    const dark = (i * 7 + seed + i * i * 3) % 4 !== 0
    const barWidth = i % 5 === 0 ? 2.8 : i % 3 === 0 ? 1.6 : 1.0
    const spaceWidth = i % 4 === 0 ? 2.2 : 1.2
    if (dark) bars.push({ x: totalWidth, bw: barWidth })
    totalWidth += barWidth + spaceWidth
  }

  const scale = h / totalWidth
  const number = (seed * 1234567).toString().slice(0, 18).padStart(18, '2')

  return (
    <svg width={w} height={h + 14} viewBox={`0 0 ${w} ${h + 14}`} style={{ display: 'block', shapeRendering: 'crispEdges' }}>
      <g transform={`translate(0, ${h}) rotate(-90) scale(${scale})`}>
        {bars.map((bar, index) => (
          <rect key={index} x={bar.x} y={0} width={bar.bw} height={w / scale} fill="#1a1a1a" />
        ))}
      </g>
      <text
        x={w / 2}
        y={h + 11}
        textAnchor="middle"
        fontSize="4.5"
        fontFamily="monospace"
        fill="#333"
        style={{ letterSpacing: '0.5px' }}
      >
        {number.slice(0, 13)}
      </text>
    </svg>
  )
}
