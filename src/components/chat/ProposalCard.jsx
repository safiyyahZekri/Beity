import { BadgeCheck, CalendarDays, Check, HandCoins, X } from 'lucide-react'
import { useLang } from '../../i18n/useLang.js'

/** The structured "propose price & date" message. */
export default function ProposalCard({ message, mine, onRespond }) {
  const { t, fmtDate } = useLang()
  const { price, date, note, status } = message

  return (
    <div
      className={`w-[290px] max-w-full rounded-2xl border overflow-hidden shadow-soft
        ${mine ? 'bg-cream-50 border-cream-400' : 'bg-white border-gold-200'}`}
    >
      <div className="flex items-center gap-2 px-3.5 py-2 bg-gold-50 border-b border-gold-100">
        <HandCoins size={14} strokeWidth={2.4} className="text-gold-600" />
        <span className="text-[11px] font-bold uppercase tracking-widest text-gold-600">
          {t('priceDateProposalHeader')}
        </span>
      </div>

      <div className="px-3.5 py-3 space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-[11.5px] font-bold uppercase tracking-wider text-brown-300">{t('priceLabel')}</span>
          <span className="text-lg font-bold text-terracotta-500 tabular-nums">{price} {t('egp')}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11.5px] font-bold uppercase tracking-wider text-brown-300">{t('whenLabel')}</span>
          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brown-600">
            <CalendarDays size={13} strokeWidth={2.3} /> {fmtDate(date)}
          </span>
        </div>
        {note && <p className="text-[12.5px] text-brown-400 leading-snug pt-0.5">{note}</p>}
      </div>

      <div className="px-3.5 pb-3">
        {status === 'pending' ? (
          mine ? (
            <p className="text-[12px] font-semibold text-brown-300 text-center py-1">
              {t('waitingForReply')}
            </p>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => onRespond('accepted')}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg
                  bg-olive-500 text-cream-50 text-[13px] font-bold hover:bg-olive-600 transition-colors"
              >
                <Check size={14} strokeWidth={3} /> {t('accept')}
              </button>
              <button
                onClick={() => onRespond('declined')}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg
                  bg-cream-200 text-brown-500 text-[13px] font-bold hover:bg-cream-300 transition-colors"
              >
                <X size={14} strokeWidth={3} /> {t('decline')}
              </button>
            </div>
          )
        ) : (
          <p
            className={`inline-flex items-center gap-1.5 w-full justify-center py-1.5 rounded-lg text-[12.5px] font-bold
              ${status === 'accepted'
                ? 'bg-olive-50 text-olive-600'
                : 'bg-terracotta-50 text-terracotta-600'}`}
          >
            <BadgeCheck size={14} strokeWidth={2.5} />
            {status === 'accepted' ? t('statusAccepted') : t('statusDeclined')}
          </p>
        )}
      </div>
    </div>
  )
}
