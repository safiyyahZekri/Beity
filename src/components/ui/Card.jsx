export default function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`bg-cream-50 border border-cream-400 rounded-2xl shadow-soft ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, icon: Icon, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <div className="flex items-start gap-2.5 min-w-0">
        {Icon && (
          <span className="mt-0.5 grid place-items-center w-8 h-8 rounded-lg bg-terracotta-50 text-terracotta-500 border border-terracotta-100 shrink-0">
            <Icon size={16} strokeWidth={2.3} />
          </span>
        )}
        <div className="min-w-0">
          <h2 className="text-[17px] font-bold text-brown-700 tracking-tight truncate">{title}</h2>
          {subtitle && <p className="text-[13px] text-brown-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}
