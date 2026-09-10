import { Check, ClipboardList, History } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import Badge, { WeeklyBadge } from '../ui/Badge.jsx'
import Avatar from '../ui/Avatar.jsx'
import FoodImage from '../ui/FoodImage.jsx'
import EmptyState from '../ui/EmptyState.jsx'
import ChatButton from '../chat/ChatButton.jsx'
import { useBeity } from '../../store/BeityContext.jsx'
import { useLang } from '../../i18n/useLang.js'

export default function OrdersModal({ mode, open, onClose }) {
  const { cookOrders, dishById, session, setOrderStatus } = useBeity()
  const { t, tr } = useLang()

  const CONFIG = {
    current: {
      title: t('currentOrders'),
      subtitle: t('currentOrdersSubtitle'),
      icon: ClipboardList,
      statuses: ['Pending', 'Accepted'],
      empty: { title: t('nothingCookingNow'), message: t('nothingCookingMsg') },
    },
    past: {
      title: t('pastOrders'),
      subtitle: t('pastOrdersSubtitle'),
      icon: History,
      statuses: ['Delivered'],
      empty: { title: t('noPastOrdersYet'), message: t('noPastOrdersMsg') },
    },
  }
  const config = CONFIG[mode] || CONFIG.current
  const rows = cookOrders.filter(
    (o) => o.cookId === session.userId && config.statuses.includes(o.status),
  )

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      icon={config.icon}
      title={config.title}
      subtitle={config.subtitle}
    >
      {rows.length === 0 ? (
        <EmptyState icon={config.icon} title={config.empty.title} message={config.empty.message} />
      ) : (
        <div className="space-y-3">
          {rows.map((o) => {
            const dish = dishById(o.dishId)
            const dishName = tr(dish?.name)
            return (
              <div
                key={o.id}
                className="flex items-center gap-3.5 p-3.5 rounded-xl bg-cream-50 border border-cream-400"
              >
                <FoodImage
                  name={dishName || ''}
                  photo={dish?.photo}
                  category={dish?.category}
                  iconSize={20}
                  className="w-14 h-14 rounded-lg shrink-0"
                />

                <div className="min-w-0 flex-1">
                  <p className="font-bold text-brown-700 truncate">
                    {dishName || 'Dish'} <span className="text-brown-300">× {o.qty}</span>
                  </p>
                  <span className="inline-flex items-center gap-1.5 mt-1">
                    <Avatar name={o.craverName} size="xs" ring={false} />
                    <span className="text-[12.5px] font-semibold text-brown-400">{o.craverName}</span>
                    <span className="text-[11.5px] text-brown-200">· {o.placedAt}</span>
                    {o.recurring && <WeeklyBadge day={o.recurringDay} />}
                  </span>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-[14px] font-bold text-terracotta-500 tabular-nums">
                    {o.total} {t('egp')}
                  </span>
                  <div className="flex items-center gap-2">
                    {o.status === 'Pending' ? (
                      <button
                        onClick={() => setOrderStatus(o.id, 'Accepted')}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-olive-500
                          text-cream-50 text-[12.5px] font-bold hover:bg-olive-600 transition-colors"
                      >
                        <Check size={13} strokeWidth={3} /> {t('accept')}
                      </button>
                    ) : (
                      <Badge status={o.status} />
                    )}
                    {o.status === 'Accepted' && <ChatButton threadId={o.threadId} />}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Modal>
  )
}
