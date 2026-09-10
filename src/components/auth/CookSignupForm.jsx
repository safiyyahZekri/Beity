import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChefHat, Plus, Trash2, UtensilsCrossed } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import TagInput from '../ui/TagInput.jsx'
import { Field, Input, Label, Select, Textarea } from '../ui/Field.jsx'
import { CUISINE_TAG_OPTIONS, MEAL_CATEGORIES } from '../../data/filters.js'
import { useBeity } from '../../store/BeityContext.jsx'
import { useLang } from '../../i18n/useLang.js'
import { CATEGORY_LABELS, CUISINE_TAG_LABELS } from '../../i18n/translations.js'

const blankItem = () => ({
  key: Math.random().toString(36).slice(2),
  name: '',
  price: '',
  category: 'Lunch',
  description: '',
  ingredients: '',
})

export default function CookSignupForm({ open, onClose }) {
  const { signupCook } = useBeity()
  const { t, label } = useLang()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', location: '', bio: '', cuisineTags: [] })
  const [items, setItems] = useState([blankItem()])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const setItem = (key, k, v) =>
    setItems((list) => list.map((it) => (it.key === key ? { ...it, [k]: v } : it)))

  const submit = (e) => {
    e.preventDefault()
    signupCook({
      name: form.name.trim() || 'Home Cook',
      location: form.location.trim() || 'Cairo',
      bio: form.bio.trim() || 'New to Beity — cooking from my own kitchen.',
      cuisineTags: form.cuisineTags.length ? form.cuisineTags : ['Egyptian Home Cooking'],
      starterItems: items
        .filter((it) => it.name.trim())
        .map(({ key, ...rest }) => rest),
    })
    navigate('/cook')
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      icon={ChefHat}
      title={t('signupCookTitle')}
      subtitle={t('signupCookSubtitle')}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('back')}
          </Button>
          <Button type="submit" form="cook-signup" iconRight={ChefHat}>
            {t('openMyKitchen')}
          </Button>
        </>
      }
    >
      <form id="cook-signup" onSubmit={submit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={t('yourName')}>
            <Input
              autoFocus
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Umm Nadia Hassan"
            />
          </Field>
          <Field label={t('location')}>
            <Input
              value={form.location}
              onChange={(e) => set('location', e.target.value)}
              placeholder="e.g. Sayeda Zeinab, Cairo"
            />
          </Field>
        </div>

        <Field label={t('shortBio')}>
          <Textarea
            value={form.bio}
            onChange={(e) => set('bio', e.target.value)}
            placeholder="What do you cook, and who taught you?"
          />
        </Field>

        <Field label={t('cuisineTagsLabel')}>
          <TagInput
            value={form.cuisineTags}
            onChange={(v) => set('cuisineTags', v)}
            placeholder="Type a specialty and press Enter"
            suggestions={CUISINE_TAG_OPTIONS.map((tag) => label(CUISINE_TAG_LABELS, tag))}
          />
        </Field>

        <div className="pt-1">
          <div className="flex items-end justify-between mb-2.5">
            <div>
              <Label className="!mb-0.5">{t('starterMenuItems')}</Label>
              <p className="text-[12.5px] text-brown-300">{t('starterMenuHint')}</p>
            </div>
            <Button size="sm" variant="secondary" icon={Plus} onClick={() => setItems((l) => [...l, blankItem()])}>
              {t('addAnother')}
            </Button>
          </div>

          <div className="space-y-3">
            {items.map((it, i) => (
              <div key={it.key} className="p-4 rounded-xl bg-cream-200/70 border border-cream-400">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-wider text-brown-400">
                    <UtensilsCrossed size={13} strokeWidth={2.4} /> {t('dishNumber')} {i + 1}
                  </span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setItems((l) => l.filter((x) => x.key !== it.key))}
                      className="p-1 rounded-lg text-brown-300 hover:text-terracotta-500 hover:bg-cream-300 transition-colors"
                      aria-label="Remove dish"
                    >
                      <Trash2 size={15} strokeWidth={2.2} />
                    </button>
                  )}
                </div>

                <div className="grid sm:grid-cols-[1fr_110px_130px] gap-3">
                  <Input
                    value={it.name}
                    onChange={(e) => setItem(it.key, 'name', e.target.value)}
                    placeholder="Dish name, e.g. Koshari"
                  />
                  <Input
                    type="number"
                    min="0"
                    value={it.price}
                    onChange={(e) => setItem(it.key, 'price', e.target.value)}
                    placeholder="Price"
                  />
                  <Select value={it.category} onChange={(e) => setItem(it.key, 'category', e.target.value)}>
                    {MEAL_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mt-3">
                  <Textarea
                    rows={2}
                    value={it.description}
                    onChange={(e) => setItem(it.key, 'description', e.target.value)}
                    placeholder="Short description"
                  />
                  <Textarea
                    rows={2}
                    value={it.ingredients}
                    onChange={(e) => setItem(it.key, 'ingredients', e.target.value)}
                    placeholder="Main ingredients, comma separated"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  )
}
