import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Minus, Plus, Repeat, ShoppingBag } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import Chip from '../ui/Chip.jsx'
import FoodImage from '../ui/FoodImage.jsx'
import Avatar from '../ui/Avatar.jsx'
import { WeeklyBadge } from '../ui/Badge.jsx'
import { RatingBadge } from '../ui/StarRating.jsx'
import { WEEK_DAYS, todayWeekDay } from '../../data/filters.js'
import { useBeity } from '../../store/BeityContext.jsx'
import { useLang } from '../../i18n/useLang.js'
import { CATEGORY_LABELS, WEEKDAY_SHORT_LABELS } from '../../i18n/translations.js'

export default function OrderModal({ dish, onClose }) {
  const { cookById, placeOrder } = useBeity()
  const { t, tr, label } = useLang()
  const [qty, setQty] = useState(1)
  const [recurring, setRecurring] = useState(false)
  const [day, setDay] = useState(todayWeekDay)
  const [placed, setPlaced] = useState(false)

  useEffect(() => {
    setQty(1)
    setRecurring(false)
    setDay(todayWeekDay())
    setPlaced(false)
  }, [dish?.id])

  if (!dish) return null
  const cook = cookById(dish.cookId)
  const cookName = tr(cook?.name)
  const dishName = tr(dish.name)
  const total = dish.price * qty

  const confirm = () => {
    placeOrder(dish.id, dish.cookId, qty, recurring, recurring ? day : null)
    setPlaced(true)
  }

  return (
    <Modal
      open={!!dish}
      onClose={onClose}
      size="md"
      icon={ShoppingBag}
      title={placed ? t('orderPlaced') : `${t('order')} ${dishName}`}
      subtitle={placed ? undefined : `${t('from')} ${cookName} · ${cook?.location}`}
      footer={
        placed ? (
          <>
            <Button variant="ghost" onClick={onClose}>
              {t('keepBrowsing')}
            </Button>
            <Link to="/craver/profile">
              <Button variant="gold">{t('viewMyOrders')}</Button>
            </Link>
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={onClose}>
              {t('cancel')}
            </Button>
            <Button icon={Check} onClick={confirm}>
              {t('confirmOrder')} · {total} {t('egp')}
            </Button>
          </>
        )
      }
    >
      {placed ? (
        <div className="text-center py-4">
          <span className="grid place-items-center w-16 h-16 mx-auto rounded-full bg-olive-100 border-2 border-olive-200 text-olive-600 mb-4 animate-pop-in">
            <Check size={30} strokeWidth={2.6} />
          </span>
          <p className="text-lg font-bold text-brown-700">
            {qty} × {dishName}
          </p>
          {recurring && (
            <div className="flex justify-center mt-2">
              <WeeklyBadge day={day} />
            </div>
          )}
          <p className="text-[13.5px] text-brown-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
            {t('sittingWithCook')} <span className="font-semibold text-brown-600">{cookName}</span>{' '}
            {t('sittingWithCookTail')}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex gap-4">
            <FoodImage
              name={dishName}
              photo={dish.photo}
              category={dish.category}
              iconSize={30}
              className="w-28 h-28 rounded-xl shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <RatingBadge value={dish.rating} />
                <span className="text-[12.5px] font-semibold text-brown-300">
                  {label(CATEGORY_LABELS, dish.category)}
                </span>
              </div>
              <p className="text-[13.5px] text-brown-500 leading-relaxed line-clamp-3">
                {tr(dish.description)}
              </p>
              <div className="flex items-center gap-2 mt-2.5">
                <Avatar name={cookName || ''} size="xs" />
                <span className="text-[12.5px] font-semibold text-brown-400">{cookName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-cream-200/70 border border-cream-400">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-brown-300">{t('quantity')}</p>
              <p className="text-[12.5px] text-brown-400 mt-0.5">
                {dish.price} {t('egp')} {t('each')}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid place-items-center w-9 h-9 rounded-lg bg-cream-50 border border-cream-400
                  text-brown-500 hover:border-terracotta-300 hover:text-terracotta-500 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={15} strokeWidth={2.6} />
              </button>
              <span className="w-10 text-center text-lg font-bold text-brown-700 tabular-nums">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(20, q + 1))}
                className="grid place-items-center w-9 h-9 rounded-lg bg-cream-50 border border-cream-400
                  text-brown-500 hover:border-terracotta-300 hover:text-terracotta-500 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={15} strokeWidth={2.6} />
              </button>
            </div>
          </div>

          <div
            className={`rounded-xl border transition-colors
              ${
                recurring
                  ? 'bg-gold-50 border-gold-300'
                  : 'bg-cream-200/70 border-cream-400 hover:border-gold-300'
              }`}
          >
            <label className="flex items-center gap-3 p-3.5 cursor-pointer">
              <input
                type="checkbox"
                checked={recurring}
                onChange={(e) => setRecurring(e.target.checked)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={`relative w-10 h-6 rounded-full shrink-0 transition-colors
                  ${recurring ? 'bg-gold-400' : 'bg-cream-500'}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-soft
                    transition-transform duration-200 ${recurring ? 'translate-x-4' : ''}`}
                />
              </span>
              <span className="flex items-center gap-1.5 text-[13.5px] font-bold text-brown-700">
                <Repeat
                  size={13}
                  strokeWidth={2.6}
                  className={recurring ? 'text-gold-600' : 'text-brown-300'}
                />
                {t('makeWeekly')}
              </span>
            </label>

            {recurring && (
              <div className="px-3.5 pb-3.5 pt-0.5 animate-fade-in">
                <p className="text-[11px] font-bold uppercase tracking-widest text-brown-300 mb-2">
                  {t('pickDeliveryDay')}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {WEEK_DAYS.map((d) => (
                    <Chip
                      key={d}
                      tone="gold"
                      active={day === d}
                      onClick={() => setDay(d)}
                      className="!px-2.5 !text-[12.5px]"
                    >
                      {label(WEEKDAY_SHORT_LABELS, d)}
                    </Chip>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-baseline justify-between px-1">
            <span className="text-[13px] font-bold uppercase tracking-wider text-brown-400">{t('total')}</span>
            <span className="text-2xl font-bold text-terracotta-500 tabular-nums">
              {total} {t('egp')}
            </span>
          </div>
        </div>
      )}
    </Modal>
  )
}
