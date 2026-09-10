import { useEffect } from 'react'
import { X } from 'lucide-react'

const WIDTHS = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  icon: Icon,
  size = 'md',
  children,
  footer,
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-brown-800/45 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${WIDTHS[size]} max-h-[88vh] flex flex-col
          bg-cream-100 border border-cream-400 rounded-2xl shadow-lift animate-pop-in overflow-hidden`}
      >
        {(title || Icon) && (
          <header className="flex items-start gap-3 px-6 pt-5 pb-4 border-b border-cream-300 bg-cream-50">
            {Icon && (
              <span className="grid place-items-center w-9 h-9 rounded-xl bg-terracotta-50 text-terracotta-500 border border-terracotta-100 shrink-0">
                <Icon size={18} strokeWidth={2.3} />
              </span>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-brown-700 tracking-tight">{title}</h2>
              {subtitle && <p className="text-[13px] text-brown-400 mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="shrink-0 p-1.5 -mr-1 -mt-0.5 rounded-lg text-brown-300 hover:text-brown-600 hover:bg-cream-300 transition-colors"
            >
              <X size={18} strokeWidth={2.4} />
            </button>
          </header>
        )}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <footer className="px-6 py-4 border-t border-cream-300 bg-cream-50 flex justify-end gap-2.5">
            {footer}
          </footer>
        )}
      </div>
    </div>
  )
}
