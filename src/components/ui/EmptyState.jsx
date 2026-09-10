import { CookingPot } from 'lucide-react'

export default function EmptyState({ icon: Icon = CookingPot, title, message, action, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center px-6 py-10 ${className}`}>
      <span className="grid place-items-center w-14 h-14 rounded-2xl bg-cream-200 border border-cream-400 text-brown-300 mb-3.5">
        <Icon size={24} strokeWidth={1.8} />
      </span>
      <p className="font-bold text-brown-600">{title}</p>
      {message && <p className="text-[13.5px] text-brown-400 mt-1 max-w-xs leading-relaxed">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
