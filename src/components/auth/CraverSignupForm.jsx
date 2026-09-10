import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Utensils } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import Chip from '../ui/Chip.jsx'
import { Field, Input, Textarea } from '../ui/Field.jsx'
import { PREFERENCE_OPTIONS } from '../../data/filters.js'
import { useBeity } from '../../store/BeityContext.jsx'
import { useLang } from '../../i18n/useLang.js'
import { PREFERENCE_LABELS } from '../../i18n/translations.js'

export default function CraverSignupForm({ open, onClose }) {
  const { signupCraver } = useBeity()
  const { t, label } = useLang()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    location: '',
    preferences: [],
    favoriteFoods: '',
    allergies: '',
  })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const togglePref = (p) =>
    set('preferences', form.preferences.includes(p)
      ? form.preferences.filter((x) => x !== p)
      : [...form.preferences, p])

  const submit = (e) => {
    e.preventDefault()
    signupCraver({
      name: form.name.trim() || 'Craver',
      location: form.location.trim() || 'Cairo',
      preferences: form.preferences,
      favoriteFoods: form.favoriteFoods,
      allergies: form.allergies,
    })
    navigate('/craver')
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      icon={Utensils}
      title={t('signupCraverTitle')}
      subtitle={t('signupCraverSubtitle')}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('back')}
          </Button>
          <Button type="submit" form="craver-signup" iconRight={Utensils}>
            {t('startCraving')}
          </Button>
        </>
      }
    >
      <form id="craver-signup" onSubmit={submit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={t('yourName')}>
            <Input
              autoFocus
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Nour Ezzat"
            />
          </Field>
          <Field label={t('location')}>
            <Input
              value={form.location}
              onChange={(e) => set('location', e.target.value)}
              placeholder="e.g. Maadi, Cairo"
            />
          </Field>
        </div>

        <Field label={t('foodPreferences')} hint={t('pickAsManyHint')}>
          <div className="flex flex-wrap gap-2 pt-0.5">
            {PREFERENCE_OPTIONS.map((p) => (
              <Chip
                key={p}
                tone="olive"
                active={form.preferences.includes(p)}
                onClick={() => togglePref(p)}
              >
                {label(PREFERENCE_LABELS, p)}
              </Chip>
            ))}
          </div>
        </Field>

        <Field label={t('favouriteFoods')}>
          <Textarea
            rows={2}
            value={form.favoriteFoods}
            onChange={(e) => set('favoriteFoods', e.target.value)}
            placeholder="Koshari, molokhia, anything with tahina…"
          />
        </Field>

        <Field label={t('allergies')} hint={t('optionalHint')}>
          <Input
            value={form.allergies}
            onChange={(e) => set('allergies', e.target.value)}
            placeholder="e.g. walnuts, shellfish"
          />
        </Field>
      </form>
    </Modal>
  )
}
