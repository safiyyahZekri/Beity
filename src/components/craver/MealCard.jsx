import { Link } from 'react-router-dom'
import { Flame, Info, Sparkles } from 'lucide-react'
import FoodImage from '../ui/FoodImage.jsx'
import Avatar from '../ui/Avatar.jsx'
import { RatingBadge } from '../ui/StarRating.jsx'
import { Tag } from '../ui/Chip.jsx'
import { useLang } from '../../i18n/useLang.js'
import { CATEGORY_LABELS } from '../../i18n/translations.js'

/**
 * Meal recommendation card. The hover overlay carries the detail (ingredients,
 * price, calories, reviews); clicking anywhere else starts the order flow.
 */
export default function MealCard({ dish, cook, recommended = false, onOrder }) {
  const { t, tr, trList, label } = useLang()
  const cookName = tr(cook?.name)
  const dishName = tr(dish.name)

  return (
    <article
      onClick={() => onOrder(dish)}
      className="group relative flex flex-col bg-cream-50 border border-cream-400 rounded-2xl
        shadow-soft overflow-hidden cursor-pointer transition-all duration-200
        hover:shadow-lift hover:-translate-y-1 hover:border-terracotta-200"
    >
      <div className="relative">
        <FoodImage
          name={dishName}
          photo={dish.photo}
          category={dish.category}
          className="aspect-[4/3] w-full"
        />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[75%]">
          <Tag tone="cream" className="!bg-cream-50/90 backdrop-blur-sm !border-cream-50/60">
            {label(CATEGORY_LABELS, dish.category)}
          </Tag>
          {recommended && (
            <Tag tone="gold" className="!bg-gold-400/95 !text-brown-700 !border-gold-500/60">
              <Sparkles size={11} strokeWidth={2.6} /> {t('yourTasteBadge')}
            </Tag>
          )}
        </div>

        <span
          className="absolute top-3 right-3 grid place-items-center w-7 h-7 rounded-full
            bg-cream-50/85 backdrop-blur-sm text-brown-400 opacity-0 group-hover:opacity-0
            md:opacity-100 transition-opacity"
          title={t('hoverForDetails')}
        >
          <Info size={14} strokeWidth={2.4} />
        </span>

        {/* Hover detail layer */}
        <div
          className="absolute inset-0 bg-brown-800/92 backdrop-blur-[2px] p-4 flex flex-col
            opacity-0 group-hover:opacity-100 transition-opacity duration-200 overflow-hidden"
        >
          <div className="flex items-baseline justify-between gap-2 pb-2 border-b border-cream-100/15">
            <span className="text-[15px] font-bold text-cream-50">{dish.price} {t('egp')}</span>
            {dish.calories && (
              <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-gold-200">
                <Flame size={12} strokeWidth={2.4} /> {dish.calories} {t('kcal')}
              </span>
            )}
          </div>

          <p className="mt-2 text-[10.5px] font-bold uppercase tracking-widest text-cream-400">
            {t('ingredients')}
          </p>
          <p className="text-[12.5px] leading-snug text-cream-200 line-clamp-2">
            {trList(dish.ingredients).join(' · ') || t('toldOnRequest')}
          </p>

          <p className="mt-2.5 text-[10.5px] font-bold uppercase tracking-widest text-cream-400">
            {t('whatCraversSaid')}
          </p>
          <div className="mt-1 space-y-1.5 overflow-hidden">
            {dish.reviews.slice(0, 2).map((r, i) => (
              <p key={i} className="text-[12px] leading-snug text-cream-200/90 line-clamp-2">
                <span className="font-bold text-gold-200">{r.by}</span> “{r.text}”
              </p>
            ))}
            {dish.reviews.length === 0 && (
              <p className="text-[12px] text-cream-300/70">{t('noReviewsBeFirst')}</p>
            )}
          </div>

          <p className="mt-auto pt-2 text-[11.5px] font-bold uppercase tracking-wider text-gold-300">
            {t('clickToOrder')}
          </p>
        </div>
      </div>

      <div className="relative flex items-start gap-3 px-4 py-3.5">
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-brown-700 leading-tight truncate pr-1">{dishName}</h3>
          <div className="mt-1.5 flex items-center gap-2">
            <RatingBadge value={dish.rating} />
            <span className="text-[12.5px] font-semibold text-brown-300 truncate">
              {dish.price} {t('egp')}
            </span>
          </div>
        </div>

        <Link
          to={`/cooks/${cook?.id}`}
          onClick={(e) => e.stopPropagation()}
          title={`${cookName} — view kitchen`}
          className="shrink-0 -mt-0.5 rounded-full transition-transform hover:scale-110"
        >
          <Avatar name={cookName || 'Cook'} size="sm" />
        </Link>
      </div>
    </article>
  )
}
