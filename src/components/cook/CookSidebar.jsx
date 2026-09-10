import { ClipboardList, History, LineChart, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useBeity } from '../../store/BeityContext.jsx'
import { useLang } from '../../i18n/useLang.js'

const NAV = [
  { key: 'current', labelKey: 'currentOrders', icon: ClipboardList, hintKey: 'cookingNowHint' },
  { key: 'past', labelKey: 'pastOrders', icon: History, hintKey: 'deliveredHint' },
  { key: 'money', labelKey: 'transactionTracker', icon: LineChart, hintKey: 'earningsHint' },
]

export default function CookSidebar({ onOpen, counts = {} }) {
  const { logout } = useBeity()
  const { t } = useLang()
  const navigate = useNavigate()

  return (
    <div className="bg-cream-50 border border-cream-400 rounded-2xl shadow-soft overflow-hidden">
      <p className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-widest text-brown-300 border-b border-cream-300 bg-cream-100">
        {t('myKitchen')}
      </p>

      <nav className="p-2.5 space-y-1.5">
        {NAV.map((item) => (
          <button
            key={item.key}
            onClick={() => onOpen(item.key)}
            className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
              hover:bg-terracotta-50 border border-transparent hover:border-terracotta-200 transition-colors"
          >
            <span className="grid place-items-center w-9 h-9 rounded-lg bg-cream-200 border border-cream-400 text-brown-400 group-hover:bg-terracotta-500 group-hover:text-cream-50 group-hover:border-terracotta-600 transition-colors shrink-0">
              <item.icon size={16} strokeWidth={2.3} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13.5px] font-bold text-brown-600 leading-tight truncate">
                {t(item.labelKey)}
              </span>
              <span className="block text-[11.5px] text-brown-300">{t(item.hintKey)}</span>
            </span>
            {counts[item.key] != null && (
              <span className="shrink-0 grid place-items-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-cream-200 border border-cream-400 text-[11.5px] font-bold text-brown-500 tabular-nums">
                {counts[item.key]}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-2.5 pt-0">
        <button
          onClick={() => {
            logout()
            navigate('/')
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-bold
            text-brown-300 hover:text-terracotta-500 hover:bg-cream-200 transition-colors"
        >
          <span className="grid place-items-center w-9 h-9">
            <LogOut size={16} strokeWidth={2.3} />
          </span>
          {t('signOut')}
        </button>
      </div>
    </div>
  )
}
