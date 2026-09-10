const VARIANTS = {
  primary:
    'bg-terracotta-500 text-cream-50 border-terracotta-600 hover:bg-terracotta-600 shadow-soft hover:shadow-lift',
  secondary:
    'bg-cream-50 text-brown-600 border-cream-400 hover:bg-cream-100 hover:border-brown-200 shadow-soft',
  gold: 'bg-gold-400 text-brown-700 border-gold-500 hover:bg-gold-300 shadow-soft hover:shadow-lift',
  olive: 'bg-olive-500 text-cream-50 border-olive-600 hover:bg-olive-600 shadow-soft',
  ghost: 'bg-transparent text-brown-500 border-transparent hover:bg-cream-300/70 hover:text-brown-700',
  outline: 'bg-transparent text-terracotta-500 border-terracotta-300 hover:bg-terracotta-50',
  danger: 'bg-transparent text-terracotta-600 border-terracotta-200 hover:bg-terracotta-50',
}

const SIZES = {
  sm: 'text-[13px] px-3 py-1.5 gap-1.5 rounded-lg',
  md: 'text-sm px-4 py-2.5 gap-2 rounded-xl',
  lg: 'text-base px-6 py-3 gap-2.5 rounded-xl',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconRight: IconRight,
  children,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center border font-semibold tracking-tight
        transition-all duration-150 active:translate-y-px disabled:opacity-50 disabled:pointer-events-none
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 16} strokeWidth={2.2} />}
      {children}
      {IconRight && <IconRight size={size === 'sm' ? 14 : 16} strokeWidth={2.2} />}
    </button>
  )
}
