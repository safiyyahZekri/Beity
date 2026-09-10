import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChefHat, RotateCcw, Utensils, Repeat2, X } from 'lucide-react'
import { useBeity } from '../../store/BeityContext.jsx'

/**
 * Presentation aid: hop between the Craver and Cook views without a backend,
 * so both sides of a chat thread can be shown live. Not part of the product.
 */
export default function DemoRoleSwitcher() {
  const { session, loginAs, resetDemo, closeChat } = useBeity()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  if (!session.role) return null

  const go = (role) => {
    closeChat()
    loginAs(role)
    navigate(role === 'cook' ? '/cook' : '/craver')
    setOpen(false)
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      {open && (
        <div className="w-60 p-3 rounded-2xl bg-brown-700 text-cream-100 shadow-lift animate-pop-in">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-cream-400">Demo controls</p>
            <button onClick={() => setOpen(false)} className="text-cream-400 hover:text-cream-100">
              <X size={14} strokeWidth={2.6} />
            </button>
          </div>
          <div className="space-y-1.5">
            <button
              onClick={() => go('craver')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-semibold transition-colors
                ${session.role === 'craver' ? 'bg-terracotta-500 text-cream-50' : 'hover:bg-brown-600'}`}
            >
              <Utensils size={15} strokeWidth={2.3} /> View as Craver
            </button>
            <button
              onClick={() => go('cook')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-semibold transition-colors
                ${session.role === 'cook' ? 'bg-terracotta-500 text-cream-50' : 'hover:bg-brown-600'}`}
            >
              <ChefHat size={15} strokeWidth={2.3} /> View as Cook
            </button>
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-brown-600 space-y-1.5">
            <button
              onClick={() => {
                resetDemo()
                navigate('/')
                setOpen(false)
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-semibold text-cream-300 hover:bg-brown-600 transition-colors"
            >
              <RotateCcw size={15} strokeWidth={2.3} /> Reset demo data
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        title="Demo controls"
        className="grid place-items-center w-12 h-12 rounded-full bg-brown-700 text-cream-100
          border-2 border-cream-200 shadow-lift hover:bg-brown-600 hover:scale-105 transition-all"
      >
        <Repeat2 size={20} strokeWidth={2.3} />
      </button>
    </div>
  )
}
