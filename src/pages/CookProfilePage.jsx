import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Inbox, Megaphone, Plus, UtensilsCrossed } from 'lucide-react'
import TopBar from '../components/layout/TopBar.jsx'
import CookSidebar from '../components/cook/CookSidebar.jsx'
import CookDetailsPanel from '../components/cook/CookDetailsPanel.jsx'
import MenuItemRow from '../components/cook/MenuItemRow.jsx'
import AddDishModal from '../components/cook/AddDishModal.jsx'
import OrdersModal from '../components/cook/OrdersModal.jsx'
import TransactionTrackerModal from '../components/cook/TransactionTrackerModal.jsx'
import RequestCard from '../components/cook/RequestCard.jsx'
import Avatar from '../components/ui/Avatar.jsx'
import Button from '../components/ui/Button.jsx'
import StarRating from '../components/ui/StarRating.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { useBeity } from '../store/BeityContext.jsx'
import { requestsForCook } from '../lib/match.js'
import { useLang } from '../i18n/useLang.js'
import { CUISINE_TAG_LABELS } from '../i18n/translations.js'

/**
 * Doubles as the cook's own dashboard (`/cook`) and the read-only kitchen page
 * a craver sees (`/cooks/:cookId`) — the public view drops both side columns.
 */
export default function CookProfilePage({ mode = 'owner' }) {
  const { cookId } = useParams()
  const {
    currentCook,
    cookById,
    dishesByCook,
    cookOrders,
    requests,
    setRequestStatus,
    currentCraver,
  } = useBeity()

  const { t, tr, label } = useLang()
  const [modal, setModal] = useState(null) // 'current' | 'past' | 'money' | 'add-dish'

  const isOwner = mode === 'owner'
  const cook = isOwner ? currentCook : cookById(cookId)
  const cookName = tr(cook?.name)
  const menu = cook ? dishesByCook(cook.id) : []

  const counts = useMemo(() => {
    if (!isOwner || !cook) return {}
    const mine = cookOrders.filter((o) => o.cookId === cook.id)
    return {
      current: mine.filter((o) => o.status === 'Pending' || o.status === 'Accepted').length,
      past: mine.filter((o) => o.status === 'Delivered').length,
    }
  }, [cookOrders, cook, isOwner])

  const inbox = useMemo(
    () => (isOwner ? requestsForCook(requests, cook) : []),
    [requests, cook, isOwner],
  )

  if (!cook) {
    return (
      <div className="min-h-screen grid place-items-center">
        <EmptyState
          title={t('kitchenNotFound')}
          message={t('kitchenNotFoundMsg')}
          action={
            <Link to="/craver">
              <Button variant="secondary">{t('backToMeals')}</Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-16">
      <TopBar
        user={isOwner ? cook : currentCraver}
        role={isOwner ? 'cook' : 'craver'}
        profileTo={isOwner ? undefined : '/craver/profile'}
        right={
          isOwner ? undefined : (
            <Link to="/craver">
              <Button variant="secondary" size="sm" icon={ArrowLeft}>
                {t('backToMeals')}
              </Button>
            </Link>
          )
        }
      />

      <div
        className={`mx-auto px-5 lg:px-8 py-7 ${
          isOwner ? 'max-w-[1560px]' : 'max-w-[1100px]'
        }`}
      >
        <div
          className={
            isOwner
              ? 'grid xl:grid-cols-[248px_minmax(0,1fr)_320px] lg:grid-cols-[248px_minmax(0,1fr)] gap-6 items-start'
              : ''
          }
        >
          {/* ---- LEFT: kitchen navigation (owner only) ---------------- */}
          {isOwner && (
            <aside className="lg:sticky lg:top-[86px]">
              <CookSidebar onOpen={setModal} counts={counts} />
            </aside>
          )}

          {/* ---- MIDDLE: identity, details and menu ------------------- */}
          <main className="min-w-0 space-y-6">
            <div className="grid md:grid-cols-[220px_minmax(0,1fr)] gap-5 items-stretch">
              <div className="flex flex-col items-center justify-center text-center p-5 bg-cream-50 border border-cream-400 rounded-2xl shadow-soft">
                <Avatar name={cookName} size="xl" />
                <StarRating value={cook.rating} size={17} className="mt-3.5" />
                <p className="mt-1.5 text-[12.5px] font-semibold text-brown-300">
                  {cook.rating
                    ? `${cook.rating.toFixed(1)} ${t('ratingFromN')} ${cook.ratingCount} ${t('ratings')}`
                    : t('noRatingsYet')}
                </p>
              </div>

              <CookDetailsPanel cook={cook} dishCount={menu.length} />
            </div>

            <section>
              <div className="flex items-end justify-between gap-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="grid place-items-center w-8 h-8 rounded-lg bg-cream-50 border border-cream-400 text-terracotta-500">
                    <UtensilsCrossed size={16} strokeWidth={2.3} />
                  </span>
                  <div>
                    <h2 className="text-[19px] font-bold text-brown-700 tracking-tight leading-tight">
                      {t('myMenu')}
                    </h2>
                    <p className="text-[12.5px] text-brown-300">
                      {menu.length} {menu.length === 1 ? t('dishSingular') : t('dishesPlural')}{' '}
                      {isOwner ? t('onOffer') : `${t('from2')} ${cookName.split(' ')[0]}`}
                    </p>
                  </div>
                </div>

                {isOwner && (
                  <Button icon={Plus} onClick={() => setModal('add-dish')}>
                    {t('addDish')}
                  </Button>
                )}
              </div>

              {menu.length === 0 ? (
                <div className="bg-cream-50 border border-cream-400 rounded-2xl">
                  <EmptyState
                    icon={UtensilsCrossed}
                    title={isOwner ? t('menuEmptyTitle') : t('menuEmptyPublicTitle')}
                    message={isOwner ? t('menuEmptyOwnerMsg') : t('menuEmptyPublicMsg')}
                    action={
                      isOwner ? (
                        <Button variant="secondary" icon={Plus} onClick={() => setModal('add-dish')}>
                          {t('addDish')}
                        </Button>
                      ) : undefined
                    }
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {menu.map((dish) => (
                    <MenuItemRow key={dish.id} dish={dish} />
                  ))}
                </div>
              )}
            </section>
          </main>

          {/* ---- RIGHT: special requests (owner only) ----------------- */}
          {isOwner && (
            <aside className="xl:sticky xl:top-[86px]">
              <div className="bg-cream-50 border border-cream-400 rounded-2xl shadow-soft overflow-hidden">
                <div className="px-4 py-3.5 border-b border-cream-300 bg-cream-100">
                  <p className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-brown-500">
                    <Megaphone size={15} strokeWidth={2.4} /> {t('specialRequestsHeader')}
                  </p>
                  <p className="text-[11.5px] text-brown-300 mt-0.5">
                    {t('matchedTo')}{' '}
                    {cook.cuisineTags.slice(0, 2).map((tag) => label(CUISINE_TAG_LABELS, tag)).join(' & ')}
                  </p>
                </div>

                <div className="p-3 space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto">
                  {inbox.length === 0 ? (
                    <EmptyState
                      icon={Inbox}
                      title={t('noRequestsRightNow')}
                      message={t('noRequestsRightNowMsg')}
                    />
                  ) : (
                    inbox.map((r) => (
                      <RequestCard
                        key={r.id}
                        request={r}
                        onAccept={() => setRequestStatus(r.id, 'accepted')}
                        onDecline={() => setRequestStatus(r.id, 'declined')}
                      />
                    ))
                  )}
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>

      {isOwner && (
        <>
          <OrdersModal mode="current" open={modal === 'current'} onClose={() => setModal(null)} />
          <OrdersModal mode="past" open={modal === 'past'} onClose={() => setModal(null)} />
          <TransactionTrackerModal open={modal === 'money'} onClose={() => setModal(null)} />
          <AddDishModal open={modal === 'add-dish'} onClose={() => setModal(null)} />
        </>
      )}
    </div>
  )
}
