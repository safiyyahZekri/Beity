import { Star } from 'lucide-react'

/** Read-only star row. */
export default function StarRating({ value = 0, size = 14, showValue = false, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = value >= i - 0.5
        return (
          <Star
            key={i}
            size={size}
            strokeWidth={2}
            className={filled ? 'text-gold-400' : 'text-cream-500'}
            fill={filled ? 'currentColor' : 'none'}
          />
        )
      })}
      {showValue && (
        <span className="ml-1 text-[12.5px] font-bold text-brown-500 tabular-nums">{value.toFixed(1)}</span>
      )}
    </span>
  )
}

/** Compact "4.7★" badge used on meal cards. */
export function RatingBadge({ value = 0, count, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 pl-2 pr-2.5 py-0.5 rounded-full
        bg-gold-50 border border-gold-200 text-[12px] font-bold text-brown-600 ${className}`}
    >
      <Star size={11} strokeWidth={0} fill="currentColor" className="text-gold-400" />
      {value ? value.toFixed(1) : 'New'}
      {count ? <span className="font-medium text-brown-300">({count})</span> : null}
    </span>
  )
}

/** Clickable 1–5 star input. */
export function StarInput({ value = 0, onChange, size = 22, label }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            aria-label={`${label || 'Rate'} ${i} of 5`}
            onClick={() => onChange(i)}
            className="transition-transform hover:scale-110 active:scale-95"
          >
            <Star
              size={size}
              strokeWidth={2}
              className={i <= value ? 'text-gold-400' : 'text-cream-500 hover:text-gold-200'}
              fill={i <= value ? 'currentColor' : 'none'}
            />
          </button>
        ))}
      </div>
      <span className="text-[13px] font-semibold text-brown-400 tabular-nums w-8">
        {value ? `${value}/5` : '—'}
      </span>
    </div>
  )
}
