// Deterministic warm-toned initials avatar — no image assets required.
const PALETTES = [
  'from-terracotta-400 to-terracotta-600 text-cream-50',
  'from-olive-400 to-olive-600 text-cream-50',
  'from-gold-300 to-gold-500 text-brown-700',
  'from-brown-400 to-brown-600 text-cream-50',
]

function hash(str = '') {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

const SIZES = {
  xs: 'w-7 h-7 text-[10px] border-2',
  sm: 'w-9 h-9 text-[11px] border-2',
  md: 'w-12 h-12 text-sm border-[3px]',
  lg: 'w-20 h-20 text-xl border-4',
  xl: 'w-32 h-32 text-4xl border-[5px]',
}

export default function Avatar({ name = '', size = 'md', className = '', ring = true }) {
  const palette = PALETTES[hash(name) % PALETTES.length]
  return (
    <span
      title={name}
      className={`inline-grid place-items-center shrink-0 rounded-full bg-gradient-to-br font-bold
        tracking-wide select-none ${palette} ${SIZES[size]}
        ${ring ? 'border-cream-50 shadow-soft' : 'border-transparent'} ${className}`}
    >
      {initials(name) || '?'}
    </span>
  )
}
