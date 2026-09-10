import { useEffect, useRef, useState } from 'react'
import { HandCoins, MessageCircle, Send, X } from 'lucide-react'
import Avatar from '../ui/Avatar.jsx'
import EmptyState from '../ui/EmptyState.jsx'
import MessageBubble from './MessageBubble.jsx'
import ProposeForm from './ProposeForm.jsx'
import { useBeity } from '../../store/BeityContext.jsx'
import { useLang } from '../../i18n/useLang.js'

/**
 * Slide-in thread for an accepted request or a confirmed order. Both roles use
 * the same component; `side` decides which bubbles are mine.
 */
export default function ChatDrawer() {
  const {
    activeThreadId,
    threads,
    closeChat,
    session,
    sendMessage,
    respondProposal,
    cookById,
    cravers,
    requests,
  } = useBeity()
  const { t, tr } = useLang()
  const [draft, setDraft] = useState('')
  const [proposing, setProposing] = useState(false)
  const scrollRef = useRef(null)

  const thread = activeThreadId ? threads[activeThreadId] : null
  const side = session.role === 'cook' ? 'cook' : 'craver'

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [thread?.messages.length, activeThreadId])

  useEffect(() => {
    setProposing(false)
    setDraft('')
  }, [activeThreadId])

  if (!thread) return null

  const cook = cookById(thread.cookId)
  const craverRecord =
    cravers.find((c) => c.id === thread.craverId) ||
    requests.find((r) => r.craverId === thread.craverId)
  const craverName = thread.craverName || craverRecord?.name || craverRecord?.craverName || 'Craver'
  const cookName = tr(cook?.name) || 'Cook'
  const counterpart = side === 'cook' ? craverName : cookName

  const send = () => {
    if (!draft.trim()) return
    sendMessage(thread.id, { type: 'text', from: side, body: draft.trim() })
    setDraft('')
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div
        className="absolute inset-0 bg-brown-800/35 backdrop-blur-sm animate-fade-in"
        onClick={closeChat}
      />

      <aside className="relative w-full max-w-[420px] h-full flex flex-col bg-cream-100 border-l border-cream-400 shadow-lift animate-slide-in-right">
        <header className="flex items-center gap-3 px-4 py-3.5 bg-cream-50 border-b border-cream-300">
          <Avatar name={counterpart} size="md" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-brown-700 truncate leading-tight">{counterpart}</p>
            <p className="text-[12px] text-brown-300 truncate">{thread.subject}</p>
          </div>
          <button
            onClick={closeChat}
            aria-label="Close chat"
            className="p-2 rounded-lg text-brown-300 hover:text-brown-600 hover:bg-cream-200 transition-colors"
          >
            <X size={18} strokeWidth={2.4} />
          </button>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
          {thread.messages.length === 0 ? (
            <EmptyState
              icon={MessageCircle}
              title={t('noMessagesYet')}
              message={side === 'craver' ? t('noMessagesCraverMsg') : t('noMessagesCookMsg')}
            />
          ) : (
            thread.messages.map((m) => (
              <MessageBubble
                key={m.id}
                message={m}
                mine={m.from === side}
                authorName={m.from === 'cook' ? cookName : craverName}
                onRespond={(status) => respondProposal(thread.id, m.id, status)}
              />
            ))
          )}
        </div>

        <div className="px-4 py-3.5 bg-cream-50 border-t border-cream-300 space-y-3">
          {proposing ? (
            <ProposeForm
              onCancel={() => setProposing(false)}
              onSubmit={(payload) => {
                sendMessage(
                  thread.id,
                  { type: 'proposal', from: side, status: 'pending', ...payload },
                  { autoReply: false },
                )
                setProposing(false)
              }}
            />
          ) : (
            <button
              onClick={() => setProposing(true)}
              className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-xl
                border border-dashed border-gold-300 bg-gold-50/60 text-[13px] font-bold text-gold-600
                hover:bg-gold-50 hover:border-gold-400 transition-colors"
            >
              <HandCoins size={15} strokeWidth={2.4} /> {t('proposePriceDate')}
            </button>
          )}

          <div className="flex items-end gap-2">
            <textarea
              rows={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send()
                }
              }}
              placeholder={side === 'craver' ? t('chatPlaceholderCraver') : t('chatPlaceholderCook')}
              className="flex-1 resize-none max-h-24 bg-cream-50 border border-cream-400 rounded-xl
                px-3.5 py-2.5 text-sm text-brown-700 placeholder:text-brown-200
                focus:border-terracotta-300 focus:bg-white transition-colors"
            />
            <button
              onClick={send}
              disabled={!draft.trim()}
              aria-label="Send message"
              className="grid place-items-center w-[42px] h-[42px] shrink-0 rounded-xl bg-terracotta-500
                text-cream-50 shadow-soft hover:bg-terracotta-600 disabled:opacity-40
                disabled:pointer-events-none transition-colors"
            >
              <Send size={17} strokeWidth={2.3} />
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}
