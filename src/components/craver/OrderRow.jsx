import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import FoodImage from '../ui/FoodImage.jsx'
import Avatar from '../ui/Avatar.jsx'
import Badge, { WeeklyBadge } from '../ui/Badge.jsx'
import StarRating from '../ui/StarRating.jsx'
import ChatButton from '../chat/ChatButton.jsx'
import RatingPrompt from './RatingPrompt.jsx'
import { useBeity } from '../../store/BeityContext.jsx'
import { useLang } from '../../i18n/useLang.js'

export default function OrderRow({ order }) {
  const { dishById, cookById, rateOrder } = useBeity()
  const { t, tr } = useLang()
  const dish = dishById(order.dishId)
  const cook = cookById(order.cookId)
  const canChat = order.status === 'Accepted' || order.status === 'Delivered'
  const needsRating = order.status === 'Delivered' && !order.rating

  return (
    <div className="p-3.5 rounded-xl bg-cream-50 border border-cream-400">
      <div className="flex gap-3.5">
        <FoodImage
          name={tr(dish?.name) || ''}
          photo={dish?.photo}
          category={dish?.category}
          iconSize={22}
          className="w-16 h-16 rounded-lg shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-bold text-brown-700 truncate">
                {tr(dish?.name) || 'Dish'} <span className="text-brown-300">× {order.qty}</span>
              </p>
              <Link
                to={`/cooks/${cook?.id}`}
                className="inline-flex items-center gap-1.5 mt-1 group"
              >
                <Avatar name={tr(cook?.name) || ''} size="xs" ring={false} />
                <span className="text-[12.5px] font-semibold text-brown-400 group-hover:text-terracotta-500 transition-colors">
                  {tr(cook?.name)}
                </span>
              </Link>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <Badge status={order.status} />
              {order.recurring && <WeeklyBadge day={order.recurringDay} />}
              <span className="text-[11.5px] font-semibold text-brown-200">{order.placedAt}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 mt-2.5">
            <span className="text-[13px] font-bold text-terracotta-500 tabular-nums">
              {(dish?.price || 0) * order.qty} {t('egp')}
            </span>
            {canChat && <ChatButton threadId={order.threadId} />}
            {order.rating && (
              <span className="inline-flex items-center gap-2 ml-auto text-[11.5px] font-semibold text-brown-300">
                <Check size={12} strokeWidth={3} className="text-olive-500" />
                {t('rated')}
                <StarRating value={order.rating.taste} size={11} />
              </span>
            )}
          </div>
        </div>
      </div>

      {needsRating && (
        <RatingPrompt onSubmit={(taste, onTime, text) => rateOrder(order.id, taste, onTime, text)} />
      )}
    </div>
  )
}
