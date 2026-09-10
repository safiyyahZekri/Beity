import { Link } from 'react-router-dom'
import { ChefHat, Utensils } from 'lucide-react'
import BrandMark from './BrandMark.jsx'
import Avatar from '../ui/Avatar.jsx'
import LanguageToggle from './LanguageToggle.jsx'
import { useLang } from '../../i18n/useLang.js'

/**
 * Slim app header. `right` lets each page supply its own actions while the
 * greeting + profile chip stay consistent.
 */
export default function TopBar({ user, role = 'craver', profileTo, right, children }) {
  const { t, tr } = useLang()
  const RoleIcon = role === 'cook' ? ChefHat : Utensils
  const userName = tr(user?.name)
  const firstName = userName?.split(' ')[0]

  return (
    <header className="sticky top-0 z-30 bg-cream-100/85 backdrop-blur-md border-b border-cream-400">
      <div className="max-w-[1500px] mx-auto px-5 lg:px-8 h-[68px] flex items-center gap-5">
        <BrandMark size="sm" to="/" showMotto={false} />

        <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cream-200 border border-cream-400 text-[11.5px] font-bold uppercase tracking-wider text-brown-400">
          <RoleIcon size={13} strokeWidth={2.4} />
          {role === 'cook' ? t('roleCook') : t('roleCraver')}
        </span>

        <div className="flex-1 min-w-0">{children}</div>

        <LanguageToggle />

        {right}

        {profileTo && (
          <Link
            to={profileTo}
            className="group flex items-center gap-3 pl-3.5 pr-2 py-1.5 rounded-full border border-cream-400
              bg-cream-50 hover:border-terracotta-300 hover:bg-terracotta-50 transition-colors shrink-0"
          >
            <span className="text-right leading-tight hidden sm:block">
              <span className="block text-[10.5px] font-bold uppercase tracking-wider text-brown-300">
                {t('hello')}, {role === 'cook' ? t('roleCook') : t('roleCraver')}
              </span>
              <span className="block text-[13.5px] font-bold text-brown-600 group-hover:text-terracotta-600">
                {firstName || t('profile')}
              </span>
            </span>
            <Avatar name={userName || 'Beity Guest'} size="sm" />
          </Link>
        )}
      </div>
    </header>
  )
}
