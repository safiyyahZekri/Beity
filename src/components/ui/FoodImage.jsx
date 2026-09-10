import { useEffect, useState } from 'react'
import { CakeSlice, Croissant, Drumstick, UtensilsCrossed } from 'lucide-react'

/**
 * Dish visual. Draws a warm, deterministic gradient plate as the base and
 * upgrades itself to a real photo from `/dishes/`. The filename comes from the
 * dish's `photo` field when it has one, otherwise from its name, and each
 * extension below is tried in turn — so dropping in a `.jpeg` or a `.png`
 * needs no code change. Dishes with no photo keep the gradient.
 */
const EXTENSIONS = ['jpeg', 'jpg', 'png', 'webp']

const GRADIENTS = [
  'from-terracotta-200 via-terracotta-300 to-terracotta-500',
  'from-gold-100 via-gold-300 to-gold-500',
  'from-olive-100 via-olive-300 to-olive-500',
  'from-cream-300 via-gold-200 to-terracotta-300',
  'from-brown-200 via-brown-300 to-brown-500',
]

const ICONS = {
  Breakfast: Croissant,
  Lunch: UtensilsCrossed,
  Dinner: Drumstick,
  Dessert: CakeSlice,
}

function hash(str = '') {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function dishSlug(name = '') {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function FoodImage({
  name = '',
  photo,
  category = 'Lunch',
  className = '',
  iconSize = 44,
}) {
  const slug = photo || dishSlug(name)
  const [attempt, setAttempt] = useState(0)
  const [loaded, setLoaded] = useState(false)

  // Reset the extension walk when the dish changes (shared card components).
  useEffect(() => {
    setAttempt(0)
    setLoaded(false)
  }, [slug])

  const gradient = GRADIENTS[hash(name) % GRADIENTS.length]
  const Icon = ICONS[category] || UtensilsCrossed
  const exhausted = attempt >= EXTENSIONS.length

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} ${className}`}>
      {/* Soft plate motif so the placeholder reads as food, not a broken image. */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="w-[62%] aspect-square rounded-full bg-cream-50/25 border border-cream-50/30 grid place-items-center">
          <Icon size={iconSize} strokeWidth={1.6} className="text-cream-50/80" />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-brown-800/35 to-transparent" />

      {slug && !exhausted && (
        <img
          key={attempt}
          src={`/dishes/${slug}.${EXTENSIONS[attempt]}`}
          alt={name}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setAttempt((a) => a + 1)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500
            ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  )
}
