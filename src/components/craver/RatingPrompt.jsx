import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import Button from '../ui/Button.jsx'
import { StarInput } from '../ui/StarRating.jsx'
import { Input } from '../ui/Field.jsx'
import { useLang } from '../../i18n/useLang.js'

/** Shown under a delivered-but-unrated order: taste + on-time delivery. */
export default function RatingPrompt({ onSubmit }) {
  const { t } = useLang()
  const [taste, setTaste] = useState(0)
  const [onTime, setOnTime] = useState(0)
  const [text, setText] = useState('')

  return (
    <div className="mt-3 p-3.5 rounded-xl bg-gold-50/70 border border-gold-200">
      <p className="inline-flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-widest text-gold-600 mb-3">
        <Sparkles size={13} strokeWidth={2.5} /> {t('howWasIt')}
      </p>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <p className="text-[12px] font-bold text-brown-400 mb-1.5">{t('tasteLabel')}</p>
          <StarInput value={taste} onChange={setTaste} label={t('tasteLabel')} />
        </div>
        <div>
          <p className="text-[12px] font-bold text-brown-400 mb-1.5">{t('onTimeDelivery')}</p>
          <StarInput value={onTime} onChange={setOnTime} label={t('onTimeDelivery')} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5 mt-3">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('leaveShortReview')}
        />
        <Button
          size="md"
          variant="gold"
          disabled={!taste || !onTime}
          onClick={() => onSubmit(taste, onTime, text)}
          className="shrink-0"
        >
          {t('submitRating')}
        </Button>
      </div>
    </div>
  )
}
