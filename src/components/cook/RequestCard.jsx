import { CalendarDays, Check, MapPin, Wallet, X } from 'lucide-react'
import Avatar from '../ui/Avatar.jsx'
import Badge from '../ui/Badge.jsx'
import ChatButton from '../chat/ChatButton.jsx'
import { useLang } from '../../i18n/useLang.js'

export default function RequestCard({ request, onAccept, onDecline }) {
  const { t, fmtDate } = useLang()
  const accepted = request.status === 'accepted'
  const declined = request.status === 'declined'

  return (
    <div
      className={`p-3.5 rounded-xl border transition-colors ${
        accepted
          ? 'bg-olive-50/60 border-olive-200'
          : declined
            ? 'bg-cream-200/50 border-cream-400 opacity-70'
            : 'bg-cream-50 border-cream-400 hover:border-terracotta-200'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <Avatar name={request.craverName} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-bold text-brown-700 truncate leading-tight">
            {request.craverName}
          </p>
          <p className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-brown-300">
            <MapPin size={11} strokeWidth={2.6} /> {request.distanceKm} {t('kmAway')}
          </p>
        </div>
        {(accepted || declined) && <Badge status={request.status} />}
      </div>

      <p className="mt-2.5 text-[13px] text-brown-600 leading-relaxed">{request.description}</p>

      <div className="flex flex-wrap gap-x-3.5 gap-y-1 mt-2.5">
        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-brown-400">
          <CalendarDays size={12} strokeWidth={2.4} /> {fmtDate(request.date)}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-brown-400">
          <Wallet size={12} strokeWidth={2.4} /> {request.budget}
        </span>
      </div>

      <div className="mt-3">
        {accepted ? (
          <ChatButton threadId={request.threadId} size="md" label={t('chatWithCraver')} />
        ) : declined ? (
          <p className="text-[12px] font-semibold text-brown-300">{t('passedOnThisOne')}</p>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={onAccept}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg
                bg-olive-500 text-cream-50 text-[13px] font-bold hover:bg-olive-600 transition-colors"
            >
              <Check size={14} strokeWidth={3} /> {t('accept')}
            </button>
            <button
              onClick={onDecline}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg
                bg-cream-200 text-brown-500 text-[13px] font-bold hover:bg-cream-300 transition-colors"
            >
              <X size={14} strokeWidth={3} /> {t('decline')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
