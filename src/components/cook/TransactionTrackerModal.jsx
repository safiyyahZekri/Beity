import { ArrowUpRight, Clock, LineChart, Receipt, Wallet } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import BarChart from '../ui/BarChart.jsx'
import { useBeity } from '../../store/BeityContext.jsx'
import { useLang } from '../../i18n/useLang.js'

export default function TransactionTrackerModal({ open, onClose }) {
  const { earningsFor, session, cookOrders } = useBeity()
  const { t } = useLang()
  const data = earningsFor(session.userId)
  const weeks = data.weeks
  const thisWeek = weeks[weeks.length - 1]?.amount || 0
  const lastWeek = weeks[weeks.length - 2]?.amount || 0
  const delta = lastWeek ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : 0
  const delivered = cookOrders.filter((o) => o.cookId === session.userId && o.status === 'Delivered')
  const avg = delivered.length
    ? Math.round(delivered.reduce((s, o) => s + o.total, 0) / delivered.length)
    : Math.round(thisWeek / 8)

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      icon={LineChart}
      title={t('transactionTracker')}
      subtitle={t('transactionSubtitle')}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile
          icon={Wallet}
          label={t('thisWeek')}
          value={`${thisWeek.toLocaleString()} ${t('egp')}`}
          note={`${delta >= 0 ? '+' : ''}${delta}% ${t('onLastWeek')}`}
          positive={delta >= 0}
        />
        <StatTile
          icon={Clock}
          label={t('pendingPayout')}
          value={`${data.pendingPayout.toLocaleString()} ${t('egp')}`}
          note={t('clearsSunday')}
        />
        <StatTile
          icon={Receipt}
          label={t('paidOut')}
          value={`${data.paidOut.toLocaleString()} ${t('egp')}`}
          note={t('last6Weeks')}
        />
        <StatTile
          icon={ArrowUpRight}
          label={t('avgOrder')}
          value={`${avg.toLocaleString()} ${t('egp')}`}
          note={`${data.ordersCompleted} ${t('ordersDone')}`}
        />
      </div>

      <div className="mt-5 p-5 rounded-2xl bg-cream-50 border border-cream-400">
        <div className="flex items-baseline justify-between mb-5">
          <div>
            <h3 className="text-[15px] font-bold text-brown-700 tracking-tight">{t('earningsByWeek')}</h3>
            <p className="text-[12.5px] text-brown-300">{t('egyptianPoundsCommission')}</p>
          </div>
          <span className="text-[11.5px] font-bold uppercase tracking-wider text-brown-300">
            {t('hoverABar')}
          </span>
        </div>
        <BarChart data={weeks} unit={t('egp')} />
      </div>

      <p className="mt-4 text-[12px] text-brown-300 text-center">{t('demoFiguresNote')}</p>
    </Modal>
  )
}

function StatTile({ icon: Icon, label, value, note, positive }) {
  return (
    <div className="p-3.5 rounded-xl bg-cream-50 border border-cream-400">
      <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-widest text-brown-300">
        <Icon size={12} strokeWidth={2.6} /> {label}
      </span>
      <p className="mt-1.5 text-[19px] font-bold text-brown-700 tabular-nums leading-none">{value}</p>
      <p
        className={`mt-1.5 text-[11.5px] font-semibold ${
          positive === undefined ? 'text-brown-300' : positive ? 'text-olive-600' : 'text-terracotta-500'
        }`}
      >
        {note}
      </p>
    </div>
  )
}
