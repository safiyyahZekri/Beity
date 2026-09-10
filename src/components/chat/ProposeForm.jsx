import { useState } from 'react'
import { HandCoins, Send } from 'lucide-react'
import Button from '../ui/Button.jsx'
import { Field, DateInput, Input } from '../ui/Field.jsx'
import { useLang } from '../../i18n/useLang.js'

export default function ProposeForm({ onCancel, onSubmit }) {
  const { t } = useLang()
  const [price, setPrice] = useState('')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')

  const submit = (e) => {
    e.preventDefault()
    onSubmit({ price: Number(price) || 0, date: date.trim() || 'To be confirmed', note: note.trim() })
  }

  return (
    <form
      onSubmit={submit}
      className="p-3.5 rounded-xl bg-gold-50 border border-gold-200 animate-pop-in space-y-3"
    >
      <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gold-600">
        <HandCoins size={13} strokeWidth={2.5} /> {t('proposePriceDate')}
      </p>

      <div className="grid grid-cols-2 gap-2.5">
        <Field label={t('priceEgp')}>
          <Input
            autoFocus
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="750"
          />
        </Field>
        <Field label={t('dateTime')}>
          <DateInput value={date} onChange={(e) => setDate(e.target.value)} className="px-2.5" />
        </Field>
      </div>

      <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder={t('optionalNote')} />

      <div className="flex justify-end gap-2">
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button type="submit" size="sm" variant="gold" icon={Send}>
          {t('sendProposal')}
        </Button>
      </div>
    </form>
  )
}
