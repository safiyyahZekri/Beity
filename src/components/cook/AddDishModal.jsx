import { useState } from 'react'
import { Plus, UtensilsCrossed } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import Chip from '../ui/Chip.jsx'
import { Field, Input, Select, Textarea } from '../ui/Field.jsx'
import { DIETARY_OPTIONS, MEAL_CATEGORIES } from '../../data/filters.js'
import { useBeity } from '../../store/BeityContext.jsx'
import { useLang } from '../../i18n/useLang.js'
import { CATEGORY_LABELS, TASTE_LABELS, DIETARY_LABELS } from '../../i18n/translations.js'

const TASTES = ['Sweet', 'Sour', 'Spicy']

export default function AddDishModal({ open, onClose }) {
  const { addDish } = useBeity()
  const { t, label } = useLang()
  const [form, setForm] = useState({
    name: '',
    price: '',
    calories: '',
    category: 'Lunch',
    description: '',
    ingredients: '',
    taste: [],
    dietary: [],
  })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const toggle = (k, v) =>
    set(k, form[k].includes(v) ? form[k].filter((x) => x !== v) : [...form[k], v])

  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    addDish(form)
    onClose()
    setForm({
      name: '',
      price: '',
      calories: '',
      category: 'Lunch',
      description: '',
      ingredients: '',
      taste: [],
      dietary: [],
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      icon={UtensilsCrossed}
      title={t('addDishTitle')}
      subtitle={t('addDishSubtitle')}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button type="submit" form="add-dish" icon={Plus}>
            {t('addToMyMenu')}
          </Button>
        </>
      }
    >
      <form id="add-dish" onSubmit={submit} className="space-y-4">
        <Field label={t('dishNameLabel')}>
          <Input
            autoFocus
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. Bamya bel Lahma"
          />
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <Field label={t('priceEgp')}>
            <Input
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              placeholder="120"
            />
          </Field>
          <Field label={t('caloriesLabel')} hint={t('optionalHint')}>
            <Input
              type="number"
              min="0"
              value={form.calories}
              onChange={(e) => set('calories', e.target.value)}
              placeholder="480"
            />
          </Field>
          <Field label={t('mealLabel')}>
            <Select value={form.category} onChange={(e) => set('category', e.target.value)}>
              {MEAL_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {label(CATEGORY_LABELS, c)}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label={t('descriptionLabel')}>
          <Textarea
            rows={2}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="How do you make it, and what comes with it?"
          />
        </Field>

        <Field label={t('ingredients')} hint={t('commaSeparatedHint')}>
          <Textarea
            rows={2}
            value={form.ingredients}
            onChange={(e) => set('ingredients', e.target.value)}
            placeholder="Okra, beef shank, tomato, garlic, coriander"
          />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={t('tasteLabel')}>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {TASTES.map((taste) => (
                <Chip
                  key={taste}
                  tone="gold"
                  active={form.taste.includes(taste)}
                  onClick={() => toggle('taste', taste)}
                >
                  {label(TASTE_LABELS, taste)}
                </Chip>
              ))}
            </div>
          </Field>
          <Field label={t('dietaryLabel')}>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {DIETARY_OPTIONS.map((d) => (
                <Chip
                  key={d}
                  tone="olive"
                  active={form.dietary.includes(d)}
                  onClick={() => toggle('dietary', d)}
                >
                  {label(DIETARY_LABELS, d)}
                </Chip>
              ))}
            </div>
          </Field>
        </div>
      </form>
    </Modal>
  )
}
