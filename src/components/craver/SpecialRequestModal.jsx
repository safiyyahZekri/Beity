import { useState } from 'react'
import { Check, Megaphone } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import Chip from '../ui/Chip.jsx'
import { Field, DateInput, Textarea } from '../ui/Field.jsx'
import { CUISINE_TAG_OPTIONS } from '../../data/filters.js'
import { useBeity } from '../../store/BeityContext.jsx'
import { useLang } from '../../i18n/useLang.js'
import { CUISINE_TAG_LABELS, budgetLabel } from '../../i18n/translations.js'

const BUDGETS = ['Under 300 EGP', '300 – 600 EGP', '600 – 1,000 EGP', '1,000 EGP +']

export default function SpecialRequestModal({ open, onClose }) {
  const { addRequest } = useBeity()
  const { t, lang, label } = useLang()
  const [form, setForm] = useState({ description: '', date: '', budget: BUDGETS[1], tags: [] })
  const [done, setDone] = useState(false)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const toggleTag = (t) =>
    set('tags', form.tags.includes(t) ? form.tags.filter((x) => x !== t) : [...form.tags, t])

  const submit = (e) => {
    e.preventDefault()
    addRequest({
      description: form.description.trim() || 'Looking for something homemade.',
      date: form.date.trim() || 'Flexible',
      budget: form.budget,
      tags: form.tags,
    })
    setDone(true)
  }

  const close = () => {
    onClose()
    setTimeout(() => {
      setDone(false)
      setForm({ description: '', date: '', budget: BUDGETS[1], tags: [] })
    }, 200)
  }

  return (
    <Modal
      open={open}
      onClose={close}
      size="md"
      icon={Megaphone}
      title={done ? t('requestPosted') : t('postSpecialRequestTitle')}
      subtitle={done ? undefined : t('describeWhatYoureAfter')}
      footer={
        done ? (
          <Button onClick={close}>{t('done')}</Button>
        ) : (
          <>
            <Button variant="ghost" onClick={close}>
              {t('cancel')}
            </Button>
            <Button type="submit" form="special-request" icon={Megaphone}>
              {t('postToNearbyCooks')}
            </Button>
          </>
        )
      }
    >
      {done ? (
        <div className="text-center py-4">
          <span className="grid place-items-center w-16 h-16 mx-auto rounded-full bg-olive-100 border-2 border-olive-200 text-olive-600 mb-4 animate-pop-in">
            <Check size={30} strokeWidth={2.6} />
          </span>
          <p className="text-lg font-bold text-brown-700">{t('infrontOfCooks')}</p>
          <p className="text-[13.5px] text-brown-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
            {t('requestPostedDetail')}
          </p>
        </div>
      ) : (
        <form id="special-request" onSubmit={submit} className="space-y-5">
          <Field label={t('whatDoYouWantCooked')}>
            <Textarea
              autoFocus
              rows={4}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder={t('requestPlaceholder')}
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={t('desiredDate')} hint={t('optionalHint')}>
              <DateInput value={form.date} onChange={(e) => set('date', e.target.value)} />
            </Field>
            <Field label={t('budgetRange')}>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {BUDGETS.map((b) => (
                  <Chip key={b} tone="gold" active={form.budget === b} onClick={() => set('budget', b)}>
                    {budgetLabel(b, lang)}
                  </Chip>
                ))}
              </div>
            </Field>
          </div>

          <Field label={t('kindOfCooking')} hint={t('helpsMatchCook')}>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {CUISINE_TAG_OPTIONS.slice(0, 6).map((tag) => (
                <Chip key={tag} tone="olive" active={form.tags.includes(tag)} onClick={() => toggleTag(tag)}>
                  {label(CUISINE_TAG_LABELS, tag)}
                </Chip>
              ))}
            </div>
          </Field>
        </form>
      )}
    </Modal>
  )
}
