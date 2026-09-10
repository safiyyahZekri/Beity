import { MapPin, Quote } from 'lucide-react'
import { Tag } from '../ui/Chip.jsx'
import { useLang } from '../../i18n/useLang.js'
import { CUISINE_TAG_LABELS } from '../../i18n/translations.js'

export default function CookDetailsPanel({ cook, dishCount }) {
  const { t, tr, label } = useLang()
  if (!cook) return null

  return (
    <div className="h-full bg-cream-50 border border-cream-400 rounded-2xl shadow-soft p-5 lg:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-widest text-brown-300 mb-1">
            {t('cookDetailsLabel')}
          </p>
          <h1 className="text-2xl font-bold text-brown-700 tracking-tight leading-tight truncate">
            {tr(cook.name)}
          </h1>
          <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brown-400 mt-1.5">
            <MapPin size={13} strokeWidth={2.4} /> {cook.location}
          </p>
        </div>
        <span className="shrink-0 px-2.5 py-1 rounded-full bg-cream-200 border border-cream-400 text-[11px] font-bold uppercase tracking-wider text-brown-400">
          {cook.joined}
        </span>
      </div>

      <div className="relative mt-4 pl-7">
        <Quote size={16} strokeWidth={2.2} className="absolute left-0 top-0.5 text-gold-300" />
        <p className="text-[14px] text-brown-500 leading-relaxed">{tr(cook.bio)}</p>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-cream-300">
        {cook.cuisineTags.map((tag) => (
          <Tag key={tag} tone="terracotta">
            {label(CUISINE_TAG_LABELS, tag)}
          </Tag>
        ))}
        <Tag tone="cream">
          {dishCount} {t('dishesOnMenu')}
        </Tag>
      </div>
    </div>
  )
}
