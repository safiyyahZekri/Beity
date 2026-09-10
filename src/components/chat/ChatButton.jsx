import { MessageCircle } from 'lucide-react'
import { useBeity } from '../../store/BeityContext.jsx'
import { useLang } from '../../i18n/useLang.js'

/** Appears on any order/request that has an open thread. */
export default function ChatButton({ threadId, size = 'sm', label }) {
  const { openChat, threads } = useBeity()
  const { t } = useLang()
  const shownLabel = label ?? t('chat')
  if (!threadId || !threads[threadId]) return null

  const unread = threads[threadId].messages.length
  const pad = size === 'sm' ? 'px-2.5 py-1.5 text-[12.5px]' : 'px-3.5 py-2 text-[13px]'

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        openChat(threadId)
      }}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-olive-200 bg-olive-50
        font-bold text-olive-600 hover:bg-olive-100 hover:border-olive-300 transition-colors ${pad}`}
    >
      <MessageCircle size={14} strokeWidth={2.4} />
      {shownLabel}
      {unread > 0 && (
        <span className="grid place-items-center min-w-[17px] h-[17px] px-1 rounded-full bg-olive-500 text-cream-50 text-[10px] tabular-nums">
          {unread}
        </span>
      )}
    </button>
  )
}
