import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarDays,
  Heart,
  Megaphone,
  MessageSquareQuote,
  Save,
  ShoppingBag,
  Wallet,
} from 'lucide-react'
import TopBar from '../components/layout/TopBar.jsx'
import Card, { CardHeader } from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Chip, { Tag } from '../components/ui/Chip.jsx'
import Badge from '../components/ui/Badge.jsx'
import Avatar from '../components/ui/Avatar.jsx'
import StarRating, { RatingBadge } from '../components/ui/StarRating.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { Field, Input } from '../components/ui/Field.jsx'
import OrderRow from '../components/craver/OrderRow.jsx'
import ChatButton from '../components/chat/ChatButton.jsx'
import { PREFERENCE_OPTIONS } from '../data/filters.js'
import { useBeity } from '../store/BeityContext.jsx'
import { useLang } from '../i18n/useLang.js'
import { PREFERENCE_LABELS, CUISINE_TAG_LABELS } from '../i18n/translations.js'

export default function CraverProfilePage() {
  const { currentCraver, orders, requests, reviews, cookById, dishById, session } = useBeity()
  const { t, tr, label, fmtDate } = useLang()
  const [draft, setDraft] = useState(() => ({
    name: currentCraver?.name || '',
    location: currentCraver?.location || '',
    favoriteFoods: currentCraver?.favoriteFoods || '',
    allergies: currentCraver?.allergies || '',
    preferences: currentCraver?.preferences || [],
  }))
  const [saved, setSaved] = useState(false)

  const myOrders = orders.filter((o) => o.craverId === session.userId)
  const myRequests = requests.filter((r) => r.craverId === session.userId)

  // Cooks whose delivered orders you rated 4+ on taste.
  const likedCooks = useMemo(() => {
    const ids = new Set(myOrders.filter((o) => o.rating && o.rating.taste >= 4).map((o) => o.cookId))
    reviews.filter((r) => r.taste >= 4).forEach((r) => ids.add(r.cookId))
    return [...ids].map((id) => cookById(id)).filter(Boolean)
  }, [myOrders, reviews, cookById])

  const set = (k, v) => {
    setDraft((d) => ({ ...d, [k]: v }))
    setSaved(false)
  }
  const togglePref = (p) =>
    set(
      'preferences',
      draft.preferences.includes(p)
        ? draft.preferences.filter((x) => x !== p)
        : [...draft.preferences, p],
    )

  return (
    <div className="min-h-screen pb-16">
      <TopBar
        user={currentCraver}
        role="craver"
        right={
          <Link to="/craver">
            <Button variant="secondary" size="sm" icon={ArrowLeft}>
              {t('backToMeals')}
            </Button>
          </Link>
        }
      />

      <div className="max-w-[1500px] mx-auto px-5 lg:px-8 py-7 space-y-6">
        {/* --- Profile details ---------------------------------------- */}
        <Card className="p-6 lg:p-7">
          <div className="flex flex-col lg:flex-row gap-7">
            <div className="flex flex-col items-center text-center shrink-0 lg:w-52">
              <Avatar name={draft.name || 'Craver'} size="xl" />
              <p className="mt-3.5 text-xl font-bold text-brown-700 tracking-tight">
                {draft.name || 'Craver'}
              </p>
              <p className="text-[13px] text-brown-300">{draft.location || 'Cairo'}</p>
              <div className="flex gap-4 mt-4 pt-4 border-t border-cream-300 w-full justify-center">
                <Stat label={t('statOrders')} value={myOrders.length} />
                <Stat label={t('statReviews')} value={reviews.length} />
                <Stat label={t('statLiked')} value={likedCooks.length} />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <CardHeader
                title={t('myDetails')}
                subtitle={t('myDetailsHint')}
                className="mb-4"
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label={t('nameLabel')}>
                  <Input value={draft.name} onChange={(e) => set('name', e.target.value)} />
                </Field>
                <Field label={t('location')}>
                  <Input value={draft.location} onChange={(e) => set('location', e.target.value)} />
                </Field>
                <Field label={t('favouriteFoods')}>
                  <Input
                    value={draft.favoriteFoods}
                    onChange={(e) => set('favoriteFoods', e.target.value)}
                    placeholder="Koshari, molokhia, anything with tahina"
                  />
                </Field>
                <Field label={t('allergies')}>
                  <Input
                    value={draft.allergies}
                    onChange={(e) => set('allergies', e.target.value)}
                    placeholder="None"
                  />
                </Field>
              </div>

              <Field label={t('foodPreferences')} className="mt-4">
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {PREFERENCE_OPTIONS.map((p) => (
                    <Chip
                      key={p}
                      tone="olive"
                      active={draft.preferences.includes(p)}
                      onClick={() => togglePref(p)}
                    >
                      {label(PREFERENCE_LABELS, p)}
                    </Chip>
                  ))}
                </div>
              </Field>

              <div className="flex items-center gap-3 mt-5">
                <Button icon={Save} onClick={() => setSaved(true)}>
                  {t('saveChanges')}
                </Button>
                {saved && (
                  <span className="text-[13px] font-semibold text-olive-600 animate-fade-in">
                    {t('savedToSession')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-[1.35fr_1fr] gap-6 items-start">
          <div className="space-y-6">
            {/* --- My Orders ------------------------------------------- */}
            <Card className="p-5">
              <CardHeader
                icon={ShoppingBag}
                title={t('myOrders')}
                subtitle={`${myOrders.length} ${t('inTotal')}`}
                className="mb-4"
              />
              {myOrders.length === 0 ? (
                <EmptyState
                  icon={ShoppingBag}
                  title={t('noOrdersYet')}
                  message={t('noOrdersMsg')}
                  action={
                    <Link to="/craver">
                      <Button variant="secondary">{t('browseMeals')}</Button>
                    </Link>
                  }
                />
              ) : (
                <div className="space-y-3">
                  {myOrders.map((o) => (
                    <OrderRow key={o.id} order={o} />
                  ))}
                </div>
              )}
            </Card>

            {/* --- My Requests ----------------------------------------- */}
            <Card className="p-5">
              <CardHeader
                icon={Megaphone}
                title={t('myRequests')}
                subtitle={t('myRequestsSubtitle')}
                className="mb-4"
              />
              {myRequests.length === 0 ? (
                <EmptyState
                  icon={Megaphone}
                  title={t('noRequestsYet')}
                  message={t('noRequestsMsg')}
                />
              ) : (
                <div className="space-y-3">
                  {myRequests.map((r) => (
                    <div key={r.id} className="p-3.5 rounded-xl bg-cream-50 border border-cream-400">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-[13.5px] text-brown-600 leading-relaxed flex-1">
                          {r.description}
                        </p>
                        <Badge status={r.status} />
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brown-400">
                          <CalendarDays size={13} strokeWidth={2.3} /> {fmtDate(r.date)}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brown-400">
                          <Wallet size={13} strokeWidth={2.3} /> {r.budget}
                        </span>
                        {r.status === 'accepted' && (
                          <>
                            <span className="text-[12.5px] font-semibold text-olive-600">
                              {tr(cookById(r.acceptedBy)?.name)} {t('tookItOn')}
                            </span>
                            <ChatButton threadId={r.threadId} />
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            {/* --- Cooks I have liked ---------------------------------- */}
            <Card className="p-5">
              <CardHeader
                icon={Heart}
                title={t('cooksLiked')}
                subtitle={t('cooksLikedSubtitle')}
                className="mb-4"
              />
              {likedCooks.length === 0 ? (
                <EmptyState
                  icon={Heart}
                  title={t('nobodyYet')}
                  message={t('nobodyYetMsg')}
                />
              ) : (
                <div className="space-y-2.5">
                  {likedCooks.map((c) => (
                    <Link
                      key={c.id}
                      to={`/cooks/${c.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-cream-50 border border-cream-400
                        hover:border-terracotta-300 hover:bg-terracotta-50/40 transition-colors group"
                    >
                      <Avatar name={tr(c.name)} size="md" />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-brown-700 truncate group-hover:text-terracotta-600 transition-colors">
                          {tr(c.name)}
                        </p>
                        <p className="text-[12px] text-brown-300 truncate">{c.location}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {c.cuisineTags.slice(0, 2).map((tag) => (
                            <Tag key={tag} tone="olive">
                              {label(CUISINE_TAG_LABELS, tag)}
                            </Tag>
                          ))}
                        </div>
                      </div>
                      <RatingBadge value={c.rating} />
                    </Link>
                  ))}
                </div>
              )}
            </Card>

            {/* --- My Reviews ------------------------------------------ */}
            <Card className="p-5">
              <CardHeader
                icon={MessageSquareQuote}
                title={t('myReviewsTitle')}
                subtitle={`${reviews.length} ${t('leftSoFar')}`}
                className="mb-4"
              />
              {reviews.length === 0 ? (
                <EmptyState
                  icon={MessageSquareQuote}
                  title={t('noReviewsYetTitle')}
                  message={t('noReviewsMsg')}
                />
              ) : (
                <div className="space-y-3">
                  {reviews.map((r) => (
                    <div key={r.id} className="p-3.5 rounded-xl bg-cream-50 border border-cream-400">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-bold text-brown-700 text-[14px] truncate">
                            {tr(dishById(r.dishId)?.name) || 'Dish'}
                          </p>
                          <p className="text-[12px] text-brown-300">{tr(cookById(r.cookId)?.name)}</p>
                        </div>
                        <span className="text-[11.5px] font-semibold text-brown-200 shrink-0">
                          {r.at}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2.5">
                        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-brown-400">
                          {t('tasteLabel')} <StarRating value={r.taste} size={12} />
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-brown-400">
                          {t('onTimeLabel')} <StarRating value={r.onTime} size={12} />
                        </span>
                      </div>
                      {r.text && (
                        <p className="mt-2 text-[13px] text-brown-500 leading-relaxed italic">
                          &ldquo;{r.text}&rdquo;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="text-center">
      <p className="text-lg font-bold text-brown-700 tabular-nums leading-none">{value}</p>
      <p className="text-[10.5px] font-bold uppercase tracking-widest text-brown-300 mt-1">{label}</p>
    </div>
  )
}
