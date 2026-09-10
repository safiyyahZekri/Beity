import { Check } from 'lucide-react'

const TONES = {
  terracotta: {
    on: 'bg-terracotta-500 text-cream-50 border-terracotta-600 shadow-soft',
    off: 'bg-cream-50 text-brown-500 border-cream-400 hover:border-terracotta-300 hover:text-terracotta-600',
  },
  gold: {
    on: 'bg-gold-400 text-brown-700 border-gold-500 shadow-soft',
    off: 'bg-cream-50 text-brown-500 border-cream-400 hover:border-gold-400 hover:text-gold-600',
  },
  olive: {
    on: 'bg-olive-500 text-cream-50 border-olive-600 shadow-soft',
    off: 'bg-cream-50 text-brown-500 border-cream-400 hover:border-olive-400 hover:text-olive-600',
  },
}

/** Toggleable filter / preference pill. */
export default function Chip({ active = false, tone = 'terracotta', onClick, children, className = '' }) {
  const t = TONES[tone] || TONES.terracotta
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[13px] font-semibold
        transition-all duration-150 active:scale-[0.97] ${active ? t.on : t.off} ${className}`}
    >
      {active && <Check size={13} strokeWidth={3} />}
      {children}
    </button>
  )
}

/** Non-interactive label pill (cuisine tags, dietary flags). */
export function Tag({ children, tone = 'cream', className = '' }) {
  const tones = {
    cream: 'bg-cream-200 text-brown-500 border-cream-400',
    olive: 'bg-olive-50 text-olive-600 border-olive-100',
    gold: 'bg-gold-50 text-gold-600 border-gold-100',
    terracotta: 'bg-terracotta-50 text-terracotta-600 border-terracotta-100',
  }
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11.5px] font-semibold
        uppercase tracking-wide ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
