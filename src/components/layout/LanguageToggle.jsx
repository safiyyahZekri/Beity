import { Languages } from 'lucide-react'
import { useLang } from '../../i18n/useLang.js'

/** EN / AR switch. Purely a display-language toggle — no RTL mirroring. */
export default function LanguageToggle({ className = '' }) {
  const { lang, setLang } = useLang()

  return (
    <div
      role="group"
      aria-label="Language"
      className={`hidden sm:inline-flex items-center gap-0.5 p-0.5 rounded-full bg-cream-200 border border-cream-400 shrink-0 ${className}`}
    >
      <Languages size={13} strokeWidth={2.4} className="ml-1.5 mr-0.5 text-brown-300" />
      {['en', 'ar'].map((code) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`px-2.5 py-1 rounded-full text-[11.5px] font-bold uppercase tracking-wider transition-colors
            ${
              lang === code
                ? 'bg-terracotta-500 text-cream-50 shadow-soft'
                : 'text-brown-400 hover:text-terracotta-500'
            }`}
        >
          {code}
        </button>
      ))}
    </div>
  )
}
