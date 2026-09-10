import { Repeat } from 'lucide-react'
import { useLang } from '../../i18n/useLang.js'
import {
  STATUS_LABELS,
  WEEKDAY_LABELS,
  WEEKDAY_SHORT_LABELS,
} from '../../i18n/translations.js'

const STATUS_TONES = {
  Pending: 'bg-gold-50 text-gold-600 border-gold-200',
  Accepted: 'bg-olive-50 text-olive-600 border-olive-200',
  Delivered: 'bg-cream-200 text-brown-500 border-cream-400',
  Declined: 'bg-terracotta-50 text-terracotta-600 border-terracotta-200',
  pending: 'bg-gold-50 text-gold-600 border-gold-200',
  accepted: 'bg-olive-50 text-olive-600 border-olive-200',
  declined: 'bg-terracotta-50 text-terracotta-600 border-terracotta-200',
}

const DOTS = {
  Pending: 'bg-gold-400',
  Accepted: 'bg-olive-500',
  Delivered: 'bg-brown-300',
  Declined: 'bg-terracotta-400',
  pending: 'bg-gold-400',
  accepted: 'bg-olive-500',
  declined: 'bg-terracotta-400',
}

export default function Badge({ status, children, className = '' }) {
  const { label: translate } = useLang()
  const label = children ?? translate(STATUS_LABELS, status)
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11.5px]
        font-bold uppercase tracking-wide ${STATUS_TONES[status] || STATUS_TONES.Delivered} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${DOTS[status] || DOTS.Delivered}`} />
      {label}
    </span>
  )
}

/**
 * Marker for orders the craver flagged as repeating, showing the day they
 * picked ("Weekly · Sun"). Purely a label — nothing in the demo re-creates
 * the order on a schedule.
 */
export function WeeklyBadge({ day, className = '' }) {
  const { t, label: translate } = useLang()
  const title = day ? `${t('repeatsWeeklyOn')} ${translate(WEEKDAY_LABELS, day)}` : t('repeatsWeekly')
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-gold-200
        bg-gold-50 text-gold-600 text-[11px] font-bold uppercase tracking-wide ${className}`}
    >
      <Repeat size={11} strokeWidth={2.8} />
      {t('weeklyBadge')}
      {day && (
        <>
          <span aria-hidden="true" className="text-gold-300">·</span>
          {translate(WEEKDAY_SHORT_LABELS, day)}
        </>
      )}
    </span>
  )
}
