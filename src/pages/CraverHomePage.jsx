import { useMemo, useState } from 'react'
import { Megaphone, Search, Sparkles, UtensilsCrossed } from 'lucide-react'
import TopBar from '../components/layout/TopBar.jsx'
import SearchBar from '../components/craver/SearchBar.jsx'
import FilterPanel from '../components/craver/FilterPanel.jsx'
import MealCard from '../components/craver/MealCard.jsx'
import OrderModal from '../components/craver/OrderModal.jsx'
import SpecialRequestModal from '../components/craver/SpecialRequestModal.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Button from '../components/ui/Button.jsx'
import { useBeity } from '../store/BeityContext.jsx'
import { matchesFilters, matchesSearch, preferenceScore } from '../lib/match.js'
import { useLang } from '../i18n/useLang.js'
import { PREFERENCE_LABELS } from '../i18n/translations.js'

const EMPTY_FILTERS = { category: [], taste: [], dietary: [] }

export default function CraverHomePage() {
  const { dishes, currentCraver, cookById } = useBeity()
  const { t, label } = useLang()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(EMPTY_FILTERS)
  const [orderDish, setOrderDish] = useState(null)
  const [requestOpen, setRequestOpen] = useState(false)

  const toggle = (group, value) =>
    setSelected((s) => ({
      ...s,
      [group]: s[group].includes(value) ? s[group].filter((v) => v !== value) : [...s[group], value],
    }))

  const isBrowsing = !query.trim() && Object.values(selected).every((a) => a.length === 0)

  const { results, recommended } = useMemo(() => {
    const prefs = currentCraver?.preferences || []
    const scored = dishes.map((d) => {
      const cook = cookById(d.cookId)
      return { dish: d, cook, score: preferenceScore(d, cook, prefs) }
    })

    const filtered = scored.filter(
      ({ dish, cook }) => matchesSearch(dish, cook, query) && matchesFilters(dish, selected),
    )

    const recommended = isBrowsing
      ? [...scored]
          .filter((s) => s.score > 0)
          .sort((a, b) => b.score - a.score || b.dish.rating - a.dish.rating)
          .slice(0, 4)
      : []

    const recIds = new Set(recommended.map((r) => r.dish.id))
    return {
      recommended,
      results: isBrowsing ? filtered.filter((f) => !recIds.has(f.dish.id)) : filtered,
    }
  }, [dishes, currentCraver, query, selected, isBrowsing, cookById])

  return (
    <div className="min-h-screen">
      <TopBar user={currentCraver} role="craver" profileTo="/craver/profile" />

      <div className="max-w-[1500px] mx-auto px-5 lg:px-8 py-6">
        <SearchBar value={query} onChange={setQuery} resultCount={results.length} />

        <div className="grid lg:grid-cols-[264px_1fr] gap-6 mt-6 items-start">
          <aside className="lg:sticky lg:top-[86px] space-y-3">
            <FilterPanel selected={selected} onToggle={toggle} onClear={() => setSelected(EMPTY_FILTERS)} />

            <button
              onClick={() => setRequestOpen(true)}
              className="group w-full text-left p-4 rounded-2xl bg-gradient-to-br from-terracotta-500
                to-terracotta-600 text-cream-50 shadow-soft hover:shadow-lift transition-all
                hover:-translate-y-0.5 border border-terracotta-700"
            >
              <span className="grid place-items-center w-9 h-9 rounded-xl bg-cream-50/15 border border-cream-50/20 mb-2.5">
                <Megaphone size={17} strokeWidth={2.3} />
              </span>
              <p className="font-bold tracking-tight">{t('specialRequest')}</p>
              <p className="text-[12.5px] text-cream-200/85 mt-0.5 leading-snug">
                {t('specialRequestHint')}
              </p>
            </button>
          </aside>

          <main className="space-y-8">
            {recommended.length > 0 && (
              <section>
                <SectionHeader
                  icon={Sparkles}
                  title={t('recommendedForYou')}
                  subtitle={
                    currentCraver?.preferences?.length
                      ? `${t('becauseYouLike')} ${currentCraver.preferences
                          .map((p) => label(PREFERENCE_LABELS, p).toLowerCase())
                          .join(', ')}`
                      : t('highestRatedArea')
                  }
                />
                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {recommended.map(({ dish, cook }) => (
                    <MealCard key={dish.id} dish={dish} cook={cook} recommended onOrder={setOrderDish} />
                  ))}
                </div>
              </section>
            )}

            <section>
              <SectionHeader
                icon={isBrowsing ? UtensilsCrossed : Search}
                title={isBrowsing ? t('allMealsNearby') : t('searchResults')}
                subtitle={`${results.length} ${
                  results.length === 1 ? t('dishSingular') : t('dishesPlural')
                } ${t('fromHomeKitchens')}`}
              />

              {results.length === 0 ? (
                <div className="bg-cream-50 border border-cream-400 rounded-2xl">
                  <EmptyState
                    icon={Search}
                    title={t('nothingMatches')}
                    message={t('tryClearingFilter')}
                    action={
                      <Button variant="secondary" icon={Megaphone} onClick={() => setRequestOpen(true)}>
                        {t('postSpecialRequest')}
                      </Button>
                    }
                  />
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                  {results.map(({ dish, cook }) => (
                    <MealCard key={dish.id} dish={dish} cook={cook} onOrder={setOrderDish} />
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>
      </div>

      <OrderModal dish={orderDish} onClose={() => setOrderDish(null)} />
      <SpecialRequestModal open={requestOpen} onClose={() => setRequestOpen(false)} />
    </div>
  )
}

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-2.5 mb-3.5">
      <span className="grid place-items-center w-8 h-8 rounded-lg bg-cream-50 border border-cream-400 text-terracotta-500">
        <Icon size={16} strokeWidth={2.3} />
      </span>
      <div>
        <h2 className="text-[17px] font-bold text-brown-700 tracking-tight leading-tight">{title}</h2>
        <p className="text-[12.5px] text-brown-300">{subtitle}</p>
      </div>
    </div>
  )
}
