import Avatar from '../ui/Avatar.jsx'
import ProposalCard from './ProposalCard.jsx'

export default function MessageBubble({ message, mine, authorName, onRespond }) {
  return (
    <div className={`flex items-end gap-2 ${mine ? 'flex-row-reverse' : ''}`}>
      <Avatar name={authorName} size="xs" ring={false} className="mb-4" />

      <div className={`flex flex-col max-w-[78%] ${mine ? 'items-end' : 'items-start'}`}>
        {message.type === 'proposal' ? (
          <ProposalCard message={message} mine={mine} onRespond={onRespond} />
        ) : (
          <div
            className={`px-3.5 py-2.5 text-[13.5px] leading-snug shadow-soft
              ${mine
                ? 'bg-terracotta-500 text-cream-50 rounded-2xl rounded-br-md'
                : 'bg-cream-50 text-brown-600 border border-cream-400 rounded-2xl rounded-bl-md'}`}
          >
            {message.body}
          </div>
        )}
        <span className="text-[10.5px] font-semibold text-brown-200 mt-1 px-1 tabular-nums">
          {message.at}
        </span>
      </div>
    </div>
  )
}
