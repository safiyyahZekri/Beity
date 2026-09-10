import { ChefHat, Utensils } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import { useLang } from '../../i18n/useLang.js'

const OPTIONS = [
  {
    role: 'cook',
    icon: ChefHat,
    titleKey: 'roleCook',
    blurbKey: 'cookBlurb',
    tone: 'group-hover:border-terracotta-400 group-hover:bg-terracotta-50',
    iconTone: 'bg-terracotta-500 text-cream-50',
  },
  {
    role: 'craver',
    icon: Utensils,
    titleKey: 'roleCraver',
    blurbKey: 'craverBlurb',
    tone: 'group-hover:border-olive-400 group-hover:bg-olive-50',
    iconTone: 'bg-olive-500 text-cream-50',
  },
]

export default function RolePickerModal({ open, mode = 'signup', onClose, onPick }) {
  const { t } = useLang()
  const isLogin = mode === 'login'
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title={isLogin ? t('welcomeBack') : t('joinBeity')}
      subtitle={isLogin ? t('continueDemoAccount') : t('whichAreYou')}
    >
      <div className="grid sm:grid-cols-2 gap-3.5">
        {OPTIONS.map((o) => (
          <button
            key={o.role}
            onClick={() => onPick(o.role)}
            className="group text-left"
          >
            <div
              className={`h-full p-5 rounded-2xl bg-cream-50 border-2 border-cream-400 transition-all
                duration-200 group-hover:shadow-lift group-hover:-translate-y-0.5 ${o.tone}`}
            >
              <span
                className={`grid place-items-center w-11 h-11 rounded-xl mb-3.5 shadow-soft ${o.iconTone}`}
              >
                <o.icon size={22} strokeWidth={2.2} />
              </span>
              <p className="text-lg font-bold text-brown-700 tracking-tight">{t(o.titleKey)}</p>
              <p className="text-[13px] text-brown-400 mt-1 leading-relaxed">{t(o.blurbKey)}</p>
              <p className="mt-3 text-[12px] font-bold uppercase tracking-wider text-brown-300 group-hover:text-terracotta-500 transition-colors">
                {isLogin ? t('continueArrow') : t('signUpArrow')}
              </p>
            </div>
          </button>
        ))}
      </div>
      {isLogin && (
        <p className="mt-4 text-center text-[12.5px] text-brown-300">{t('demoNoPassword')}</p>
      )}
    </Modal>
  )
}
