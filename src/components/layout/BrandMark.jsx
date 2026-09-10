import { Link } from 'react-router-dom'

const SIZES = {
  sm: { title: 'text-2xl', motto: 'text-base', gap: '-mt-1' },
  md: { title: 'text-4xl', motto: 'text-xl', gap: '-mt-1.5' },
  hero: { title: 'text-[clamp(3.5rem,12vw,9rem)]', motto: 'text-[clamp(1.4rem,3.4vw,2.5rem)]', gap: 'mt-1 md:mt-2' },
}

/** The "Beity" wordmark + cursive motto lockup, reused across landing and nav. */
export default function BrandMark({
  size = 'md',
  to = null,
  showMotto = true,
  light = false,
  className = '',
}) {
  const s = SIZES[size]
  const Wrapper = to ? Link : 'div'

  return (
    <Wrapper
      {...(to ? { to } : {})}
      className={`inline-flex flex-col items-center leading-none select-none ${
        to ? 'transition-transform hover:-rotate-1' : ''
      } ${className}`}
    >
      <span
        className={`font-display ${s.title} ${
          light ? 'text-cream-50 text-shadow-warm' : 'text-terracotta-500'
        }`}
      >
        Beity
      </span>
      {showMotto && (
        <span
          className={`font-script ${s.motto} ${s.gap} ${
            light ? 'text-gold-200 text-shadow-warm' : 'text-brown-400'
          }`}
        >
          Homemade, from someone's kitchen to yours.
        </span>
      )}
    </Wrapper>
  )
}
