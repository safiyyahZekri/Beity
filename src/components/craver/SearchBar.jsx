import { Search, X } from 'lucide-react'
import { useLang } from '../../i18n/useLang.js'

export default function SearchBar({ value, onChange, resultCount }) {
  const { t } = useLang()
  return (
    <div className="relative">
      <Search
        size={19}
        strokeWidth={2.3}
        className="absolute left-5 top-1/2 -translate-y-1/2 text-brown-300 pointer-events-none"
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('searchPlaceholder')}
        className="w-full h-[58px] pl-14 pr-32 rounded-2xl bg-cream-50 border border-cream-400
          shadow-soft text-[15px] text-brown-700 placeholder:text-brown-200
          focus:border-terracotta-300 focus:bg-white transition-colors"
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {value && (
          <>
            <span className="text-[12.5px] font-semibold text-brown-300 tabular-nums hidden sm:inline">
              {resultCount} {resultCount === 1 ? t('result') : t('results')}
            </span>
            <button
              onClick={() => onChange('')}
              aria-label="Clear search"
              className="p-1.5 rounded-lg text-brown-300 hover:text-terracotta-500 hover:bg-cream-200 transition-colors"
            >
              <X size={16} strokeWidth={2.6} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
