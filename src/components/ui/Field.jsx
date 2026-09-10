const base =
  'w-full bg-cream-50 border border-cream-400 rounded-xl px-3.5 py-2.5 text-sm text-brown-700 ' +
  'placeholder:text-brown-200 transition-colors focus:border-terracotta-300 focus:bg-white'

export function Label({ children, hint, className = '' }) {
  return (
    <label className={`block text-[12.5px] font-bold uppercase tracking-wider text-brown-400 mb-1.5 ${className}`}>
      {children}
      {hint && <span className="ml-1.5 normal-case tracking-normal font-medium text-brown-200">{hint}</span>}
    </label>
  )
}

export function Field({ label, hint, children, className = '' }) {
  return (
    <div className={className}>
      {label && <Label hint={hint}>{label}</Label>}
      {children}
    </div>
  )
}

export function Input({ className = '', ...props }) {
  return <input className={`${base} ${className}`} {...props} />
}

/** Today as YYYY-MM-DD in *local* time (toISOString would shift across midnight). */
export function todayISO() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/**
 * Native calendar picker, styled to match the text inputs. Defaults to
 * disallowing past dates — you can't order a meal for last Tuesday.
 */
export function DateInput({ className = '', min = todayISO(), ...props }) {
  return (
    <input
      type="date"
      min={min}
      className={`${base} pr-2.5 [color-scheme:light] ${className}`}
      {...props}
    />
  )
}

export function Textarea({ className = '', rows = 3, ...props }) {
  return <textarea rows={rows} className={`${base} resize-none leading-relaxed ${className}`} {...props} />
}

export function Select({ className = '', children, ...props }) {
  return (
    <select className={`${base} cursor-pointer ${className}`} {...props}>
      {children}
    </select>
  )
}
