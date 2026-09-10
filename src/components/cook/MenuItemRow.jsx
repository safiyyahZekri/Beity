import { Flame } from 'lucide-react'
import FoodImage from '../ui/FoodImage.jsx'
import StarRating, { RatingBadge } from '../ui/StarRating.jsx'
import Avatar from '../ui/Avatar.jsx'
import { Tag } from '../ui/Chip.jsx'
import { useLang } from '../../i18n/useLang.js'
import { CATEGORY_LABELS } from '../../i18n/translations.js'

/** One menu row: picture on the left half, details and reviews on the right. */
export default function MenuItemRow({ dish }) {
  const { t, tr, trList, label } = useLang()
  const dishName = tr(dish.name)

  return (
    <article className="grid md:grid-cols-2 bg-cream-50 border border-cream-400 rounded-2xl shadow-soft overflow-hidden">
      <FoodImage
        name={dishName}
        photo={dish.photo}
        category={dish.category}
        iconSize={52}
        className="min-h-[200px] md:min-h-[230px]"
      />

      <div className="p-5 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-brown-700 tracking-tight leading-tight">
              {dishName}
            </h3>
            <div className="flex items-center gap-2 mt-1.5">
              <RatingBadge value={dish.rating} count={dish.reviews.length || undefined} />
              <Tag tone="cream">{label(CATEGORY_LABELS, dish.category)}</Tag>
              {dish.calories && (
                <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-brown-300">
                  <Flame size={11} strokeWidth={2.6} /> {dish.calories} {t('kcal')}
                </span>
              )}
            </div>
          </div>
          <span className="shrink-0 text-lg font-bold text-terracotta-500 tabular-nums">
            {dish.price} <span className="text-[12px] font-bold text-brown-300">{t('egp')}</span>
          </span>
        </div>

        {dish.description && (
          <p className="mt-2.5 text-[13px] text-brown-500 leading-relaxed line-clamp-2">
            {tr(dish.description)}
          </p>
        )}

        <div className="mt-3">
          <p className="text-[10.5px] font-bold uppercase tracking-widest text-brown-300 mb-1.5">
            {t('ingredients')}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {dish.ingredients.length ? (
              trList(dish.ingredients).map((i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-cream-200 border border-cream-400 text-[11.5px] font-medium text-brown-500"
                >
                  {i}
                </span>
              ))
            ) : (
              <span className="text-[12.5px] text-brown-300">{t('toldOnRequest')}</span>
            )}
          </div>
        </div>

        <div className="mt-auto pt-3.5">
          <p className="text-[10.5px] font-bold uppercase tracking-widest text-brown-300 mb-2">
            {t('reviewsFromCravers')}
          </p>
          {dish.reviews.length === 0 ? (
            <p className="text-[12.5px] text-brown-300">
              {t('noReviewsFreshMenu')}
            </p>
          ) : (
            <div className="space-y-2">
              {dish.reviews.slice(0, 2).map((r, i) => (
                <div key={i} className="flex gap-2.5">
                  <Avatar name={r.by} size="xs" ring={false} />
                  <div className="min-w-0">
                    <p className="flex items-center gap-2">
                      <span className="text-[12.5px] font-bold text-brown-600">{r.by}</span>
                      <StarRating value={r.rating} size={11} />
                    </p>
                    <p className="text-[12.5px] text-brown-400 leading-snug italic">
                      &ldquo;{r.text}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
