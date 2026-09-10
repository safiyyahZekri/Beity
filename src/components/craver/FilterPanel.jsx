import { SlidersHorizontal, X } from 'lucide-react'
import Chip from '../ui/Chip.jsx'
import { FILTER_GROUPS } from '../../data/filters.js'
import { useLang } from '../../i18n/useLang.js'
import { CATEGORY_LABELS, TASTE_LABELS, DIETARY_LABELS } from '../../i18n/translations.js'

const TONES = { category: 'terracotta', taste: 'gold', dietary: 'olive' }
const GROUP_LABEL_KEYS = { category: 'mealLabel', taste: 'tasteLabel', dietary: 'dietaryLabel' }
const OPTION_MAPS = { category: CATEGORY_LABELS, taste: TASTE_LABELS, dietary: DIETARY_LABELS }

export default function FilterPanel({ selected, onToggle, onClear }) {
  const { t, label } = useLang()
  const activeCount = Object.values(selected).reduce((n, arr) => n + arr.length, 0)

  return (
    <div className="bg-cream-50 border border-cream-400 rounded-2xl shadow-soft overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-4 py-3.5 border-b border-cream-300 bg-cream-100">
        <span className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-brown-500">
          <SlidersHorizontal size={15} strokeWidth={2.4} />
          {t('mealTypes')}
        </span>
        {activeCount > 0 && (
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1 text-[12px] font-bold text-terracotta-500 hover:text-terracotta-600"
          >
            <X size={12} strokeWidth={3} /> {t('clear')} {activeCount}
          </button>
        )}
      </div>

      <div className="p-4 space-y-5">
        {FILTER_GROUPS.map((group) => (
          <div key={group.id}>
            <p className="text-[11px] font-bold uppercase tracking-widest text-brown-300 mb-2.5">
              {t(GROUP_LABEL_KEYS[group.id])}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.options.map((opt) => (
                <Chip
                  key={opt}
                  tone={TONES[group.id]}
                  active={selected[group.id].includes(opt)}
                  onClick={() => onToggle(group.id, opt)}
                >
                  {label(OPTION_MAPS[group.id], opt)}
                </Chip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
