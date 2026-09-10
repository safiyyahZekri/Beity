import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Input } from './Field.jsx'

/**
 * Free-text tag entry (Enter or + to add) with an optional suggestion row.
 * Suggestions may be plain strings, or `{ value, label }` pairs when the
 * stored value (canonical, English) needs to differ from what's shown
 * (translated) — e.g. cuisine tags, which stay English under the hood so
 * filtering/matching never has to care about the current language.
 */
export default function TagInput({ value = [], onChange, placeholder = 'Add a tag…', suggestions = [] }) {
  const [draft, setDraft] = useState('')

  const options = suggestions.map((s) => (typeof s === 'string' ? { value: s, label: s } : s))

  const add = (tag) => {
    const clean = tag.trim()
    if (!clean || value.includes(clean)) return setDraft('')
    onChange([...value, clean])
    setDraft('')
  }

  const remaining = options.filter((o) => !value.includes(o.value))
  const labelFor = (v) => options.find((o) => o.value === v)?.label ?? v

  return (
    <div>
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add(draft)
            }
          }}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => add(draft)}
          className="shrink-0 px-3 rounded-xl border border-cream-400 bg-cream-50 text-brown-400
            hover:text-terracotta-500 hover:border-terracotta-300 transition-colors"
          aria-label="Add tag"
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full
                bg-olive-50 border border-olive-200 text-[12.5px] font-semibold text-olive-600"
            >
              {labelFor(tag)}
              <button
                type="button"
                onClick={() => onChange(value.filter((t) => t !== tag))}
                className="p-0.5 rounded-full hover:bg-olive-200/60 transition-colors"
                aria-label={`Remove ${tag}`}
              >
                <X size={12} strokeWidth={3} />
              </button>
            </span>
          ))}
        </div>
      )}

      {remaining.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {remaining.slice(0, 6).map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => add(o.value)}
              className="text-[12px] font-medium text-brown-300 hover:text-terracotta-500 transition-colors"
            >
              + {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
