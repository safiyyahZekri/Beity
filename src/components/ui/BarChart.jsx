import { useState } from 'react'

/**
 * Single-series weekly earnings bars. One hue (light -> dark for the current
 * week), recessive gridlines, values on hover plus direct labels on the peak
 * and latest bars only.
 */
export default function BarChart({ data = [], unit = 'EGP', height = 150 }) {
  const [hovered, setHovered] = useState(null)
  if (!data.length) return null

  const max = Math.max(...data.map((d) => d.amount))
  const peakIndex = data.findIndex((d) => d.amount === max)
  const lastIndex = data.length - 1
  const ticks = [max, max / 2, 0]

  return (
    <div className="w-full">
      <div className="relative flex gap-3" style={{ height }}>
        {/* Axis ticks — deliberately recessive. */}
        <div className="flex flex-col justify-between py-0 text-[10.5px] font-semibold text-brown-200 tabular-nums text-right w-9 shrink-0">
          {ticks.map((t) => (
            <span key={t} className="-translate-y-1/2 first:translate-y-0 last:-translate-y-full">
              {t === 0 ? '0' : `${Math.round((t / 1000) * 10) / 10}k`}
            </span>
          ))}
        </div>

        <div className="relative flex-1">
          {ticks.map((t, i) => (
            <div
              key={i}
              className="absolute inset-x-0 border-t border-dashed border-cream-400"
              style={{ top: `${(i / (ticks.length - 1)) * 100}%` }}
            />
          ))}

          {/* 2px surface gap between adjacent bars comes from the px-[1px] pairing. */}
          <div className="absolute inset-0 flex items-end">
            {data.map((d, i) => {
              const pct = max ? (d.amount / max) * 100 : 0
              const isCurrent = i === lastIndex
              const showLabel = i === peakIndex || isCurrent
              return (
                <div
                  key={d.label}
                  className="flex-1 h-full flex items-end px-[1px] group cursor-default"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="relative w-full flex justify-center">
                    {(hovered === i || showLabel) && (
                      <span
                        className={`absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px]
                          font-bold tabular-nums transition-colors
                          ${hovered === i ? 'text-brown-700' : 'text-brown-300'}`}
                      >
                        {d.amount.toLocaleString()}
                      </span>
                    )}
                    <div
                      className={`w-full max-w-[34px] rounded-t animate-grow-bar origin-bottom transition-colors
                        ${isCurrent ? 'bg-terracotta-500' : 'bg-terracotta-200 group-hover:bg-terracotta-300'}`}
                      style={{ height: `${Math.max(pct, 2)}%`, animationDelay: `${i * 55}ms` }}
                      title={`${d.label}: ${d.amount.toLocaleString()} ${unit}`}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-2">
        <div className="w-9 shrink-0" />
        <div className="flex-1 flex">
          {data.map((d, i) => (
            <span
              key={d.label}
              className={`flex-1 text-center text-[11px] font-semibold tabular-nums
                ${i === lastIndex ? 'text-brown-600' : 'text-brown-300'}`}
            >
              {d.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
