import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, UserPlus } from 'lucide-react'
import BrandMark from '../components/layout/BrandMark.jsx'
import Button from '../components/ui/Button.jsx'
import RolePickerModal from '../components/auth/RolePickerModal.jsx'
import CraverSignupForm from '../components/auth/CraverSignupForm.jsx'
import CookSignupForm from '../components/auth/CookSignupForm.jsx'
import LanguageToggle from '../components/layout/LanguageToggle.jsx'
import { useBeity } from '../store/BeityContext.jsx'
import { useLang } from '../i18n/useLang.js'

export default function LandingPage() {
  const { loginAs } = useBeity()
  const { t } = useLang()
  const navigate = useNavigate()
  const [picker, setPicker] = useState(null) // 'signup' | 'login' | null
  const [signupRole, setSignupRole] = useState(null) // 'cook' | 'craver' | null

  const handlePick = (role) => {
    if (picker === 'login') {
      loginAs(role)
      navigate(role === 'cook' ? '/cook' : '/craver')
      setPicker(null)
      return
    }
    setPicker(null)
    setSignupRole(role)
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <img
        src="/landing-bg.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Gentle vignette so white UI stays legible over a busy photograph. */}
      <div className="absolute inset-0 bg-gradient-to-b from-brown-800/45 via-brown-800/15 to-brown-800/55" />

      <header className="relative z-20 flex items-center justify-between gap-3 px-5 lg:px-10 pt-6">
        <LanguageToggle className="!bg-cream-50/90 backdrop-blur-sm" />
        <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          icon={LogIn}
          onClick={() => setPicker('login')}
          className="!bg-cream-50/90 backdrop-blur-sm hover:!bg-cream-50"
        >
          {t('login')}
        </Button>
        <Button icon={UserPlus} onClick={() => setPicker('signup')}>
          {t('signUp')}
        </Button>
        </div>
      </header>

      {/* The blurred stripe: full-bleed, feathered top and bottom. */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[42vh] min-h-[240px] z-10">
        <div className="absolute inset-0 backdrop-blur-2xl bg-brown-800/35 stripe-feather" />
        <div className="absolute inset-0 bg-gradient-to-r from-terracotta-700/25 via-transparent to-brown-800/25 stripe-feather" />
      </div>

      {/* Absolutely centred so the lockup lands dead-on the stripe. */}
      <main className="absolute inset-0 z-20 flex items-center justify-center px-6 text-center pointer-events-none">
        <BrandMark size="hero" light className="animate-rise" />
      </main>

      <p className="absolute bottom-6 inset-x-0 z-20 text-center text-[12.5px] font-medium text-cream-200/70">
        {t('demoTagline')}
      </p>

      <RolePickerModal
        open={picker !== null}
        mode={picker || 'signup'}
        onClose={() => setPicker(null)}
        onPick={handlePick}
      />
      <CraverSignupForm open={signupRole === 'craver'} onClose={() => setSignupRole(null)} />
      <CookSignupForm open={signupRole === 'cook'} onClose={() => setSignupRole(null)} />
    </div>
  )
}
