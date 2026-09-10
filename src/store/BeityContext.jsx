import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react'
import * as seed from '../data/seed.js'
import { asBilingual } from '../i18n/translations.js'
import { api } from '../lib/api.js'

const BeityContext = createContext(null)

let idCounter = 1000
const nextId = (prefix) => `${prefix}-${++idCounter}`

function buildInitialState() {
  return {
    session: { role: null, userId: null },
    lang: 'en',
    cooks: structuredClone(seed.cooks),
    dishes: structuredClone(seed.dishes),
    cravers: structuredClone(seed.cravers),
    orders: structuredClone(seed.orders),
    cookOrders: structuredClone(seed.cookOrders),
    requests: structuredClone(seed.requests),
    threads: structuredClone(seed.threads),
    reviews: structuredClone(seed.myReviews),
    earningsByCook: { [seed.DEMO_COOK_ID]: structuredClone(seed.earnings) },
    activeThreadId: null,
    // Remembers the last account created per role so the demo role switcher
    // returns you to *your* signed-up profile rather than the seeded one.
    accounts: { cook: seed.DEMO_COOK_ID, craver: seed.DEMO_CRAVER_ID },
  }
}

// A fresh cook still needs a plausible history so the dashboard reads well on stage.
function makeCookActivity(cookId, cookDishes) {
  const craverNames = ['Tarek Hassanein', 'Dina Mostafa', 'Mariam Adel', 'Youssef Kamal', 'Salma Refaat']
  const statuses = ['Accepted', 'Pending', 'Delivered', 'Delivered', 'Delivered']
  const placedAt = ['Today, 10:02', 'Today, 12:40', 'Yesterday', '3 days ago', '4 days ago']

  const orders = cookDishes.length
    ? craverNames.map((craverName, i) => {
        const dish = cookDishes[i % cookDishes.length]
        const qty = (i % 3) + 1
        return {
          id: nextId('corder'),
          cookId,
          dishId: dish.id,
          craverName,
          qty,
          total: Number(dish.price || 0) * qty,
          status: statuses[i],
          placedAt: placedAt[i],
          threadId: nextId('thread'),
          recurring: i === 1,
          recurringDay: i === 1 ? 'Tuesday' : null,
        }
      })
    : []

  const delivered = orders.filter((o) => o.status === 'Delivered')
  const base = delivered.length ? delivered.reduce((s, o) => s + o.total, 0) : 600
  const weeks = ['W32', 'W33', 'W34', 'W35', 'W36', 'W37'].map((label, i) => ({
    label,
    amount: Math.round(base * (1.1 + i * 0.22)),
  }))

  return {
    orders,
    earnings: {
      weeks,
      pendingPayout: Math.round(base * 0.8),
      paidOut: weeks.reduce((s, w) => s + w.amount, 0),
      ordersCompleted: 12 + delivered.length,
    },
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'RESET':
      return buildInitialState()

    case 'SET_LANG':
      return { ...state, lang: action.lang }

    case 'LOGIN_AS': {
      const { role } = action
      return { ...state, session: { role, userId: state.accounts[role] }, activeThreadId: null }
    }

    case 'LOGOUT':
      return { ...state, session: { role: null, userId: null }, activeThreadId: null }

    case 'SIGNUP_CRAVER': {
      const id = nextId('craver')
      const craver = { id, ...action.payload }
      // Hand the seeded history over to the new account so their profile page
      // has orders, requests and reviews to show immediately.
      const prev = state.accounts.craver
      return {
        ...state,
        cravers: [...state.cravers, craver],
        orders: state.orders.map((o) => (o.craverId === prev ? { ...o, craverId: id } : o)),
        requests: state.requests.map((r) =>
          r.craverId === prev ? { ...r, craverId: id, craverName: craver.name } : r,
        ),
        threads: Object.fromEntries(
          Object.entries(state.threads).map(([k, t]) => [k, t.craverId === prev ? { ...t, craverId: id } : t]),
        ),
        accounts: { ...state.accounts, craver: id },
        session: { role: 'craver', userId: id },
      }
    }

    case 'SIGNUP_COOK': {
      const { starterItems = [], name, bio, ...profile } = action.payload
      const id = nextId('cook')
      const cook = {
        id,
        rating: 0,
        ratingCount: 0,
        joined: 'Joined today',
        ...profile,
        name: asBilingual(name),
        bio: asBilingual(bio),
      }
      const newDishes = starterItems.map((item) => ({
        id: nextId('dish'),
        cookId: id,
        name: asBilingual(item.name),
        price: Number(item.price) || 0,
        description: asBilingual(item.description || ''),
        ingredients: (item.ingredients || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .map(asBilingual),
        calories: null,
        category: item.category || 'Lunch',
        taste: item.taste || [],
        dietary: item.dietary || [],
        rating: 0,
        reviews: [],
      }))
      const activity = makeCookActivity(id, newDishes)
      return {
        ...state,
        cooks: [cook, ...state.cooks],
        dishes: [...newDishes, ...state.dishes],
        cookOrders: [...activity.orders, ...state.cookOrders],
        earningsByCook: { ...state.earningsByCook, [id]: activity.earnings },
        accounts: { ...state.accounts, cook: id },
        session: { role: 'cook', userId: id },
      }
    }

    case 'PLACE_ORDER': {
      const { dishId, cookId, qty, craverId, recurring = false, recurringDay = null } = action
      const threadId = nextId('thread')
      const dish = state.dishes.find((d) => d.id === dishId)
      const craver = state.cravers.find((c) => c.id === craverId)
      const order = {
        id: nextId('order'),
        dishId,
        cookId,
        craverId,
        qty,
        status: 'Pending',
        placedAt: 'Just now',
        rating: null,
        threadId,
        recurring,
        recurringDay,
      }
      return {
        ...state,
        orders: [order, ...state.orders],
        cookOrders: [
          {
            id: nextId('corder'),
            cookId,
            dishId,
            craverName: craver?.name || 'A craver',
            qty,
            total: Number(dish?.price || 0) * qty,
            status: 'Pending',
            placedAt: 'Just now',
            threadId,
            recurring,
            recurringDay,
          },
          ...state.cookOrders,
        ],
        threads: {
          ...state.threads,
          [threadId]: {
            id: threadId,
            cookId,
            craverId,
            subject: `${dish?.name || 'Order'} × ${qty}`,
            messages: [],
          },
        },
      }
    }

    case 'SET_ORDER_STATUS': {
      // The craver's order and the cook's copy share a threadId, so one status
      // change keeps both sides of the demo in sync.
      const match =
        state.orders.find((o) => o.id === action.id) ||
        state.cookOrders.find((o) => o.id === action.id)
      const key = match?.threadId
      const apply = (o) =>
        o.id === action.id || (key && o.threadId === key) ? { ...o, status: action.status } : o
      return {
        ...state,
        orders: state.orders.map(apply),
        cookOrders: state.cookOrders.map(apply),
      }
    }

    case 'RATE_ORDER': {
      const order = state.orders.find((o) => o.id === action.id)
      if (!order) return state
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === action.id ? { ...o, rating: { taste: action.taste, onTime: action.onTime } } : o,
        ),
        reviews: [
          {
            id: nextId('rev'),
            dishId: order.dishId,
            cookId: order.cookId,
            taste: action.taste,
            onTime: action.onTime,
            text: action.text || '',
            at: 'Just now',
          },
          ...state.reviews,
        ],
      }
    }

    case 'ADD_REQUEST': {
      const threadId = nextId('thread')
      const craver = state.cravers.find((c) => c.id === action.craverId)
      return {
        ...state,
        requests: [
          {
            id: nextId('req'),
            craverId: action.craverId,
            craverName: craver?.name || 'A craver',
            description: action.description,
            date: action.date,
            budget: action.budget,
            status: 'pending',
            distanceKm: Number((Math.random() * 6 + 0.6).toFixed(1)),
            postedAt: 'Just now',
            threadId,
            tags: action.tags || [],
          },
          ...state.requests,
        ],
        threads: {
          ...state.threads,
          [threadId]: {
            id: threadId,
            cookId: null,
            craverId: action.craverId,
            subject: 'Special request',
            messages: [],
          },
        },
      }
    }

    case 'SET_REQUEST_STATUS': {
      const request = state.requests.find((r) => r.id === action.id)
      if (!request) return state
      const threads = { ...state.threads }
      if (action.status === 'accepted') {
        const existing = threads[request.threadId]
        threads[request.threadId] = {
          id: request.threadId,
          cookId: action.cookId,
          craverId: request.craverId,
          subject: 'Special request',
          messages: existing?.messages || [],
        }
      }
      return {
        ...state,
        threads,
        requests: state.requests.map((r) =>
          r.id === action.id
            ? { ...r, status: action.status, acceptedBy: action.status === 'accepted' ? action.cookId : null }
            : r,
        ),
      }
    }

    case 'ADD_DISH': {
      const dish = {
        id: nextId('dish'),
        cookId: action.cookId,
        name: asBilingual(action.payload.name),
        price: Number(action.payload.price) || 0,
        description: asBilingual(action.payload.description || ''),
        ingredients: (action.payload.ingredients || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .map(asBilingual),
        calories: action.payload.calories ? Number(action.payload.calories) : null,
        category: action.payload.category || 'Lunch',
        taste: action.payload.taste || [],
        dietary: action.payload.dietary || [],
        rating: 0,
        reviews: [],
      }
      return { ...state, dishes: [dish, ...state.dishes] }
    }

    case 'SEND_MESSAGE': {
      const thread = state.threads[action.threadId]
      if (!thread) return state
      return {
        ...state,
        threads: {
          ...state.threads,
          [action.threadId]: {
            ...thread,
            messages: [...thread.messages, { id: nextId('m'), at: action.at, ...action.message }],
          },
        },
      }
    }

    case 'RESPOND_PROPOSAL': {
      const thread = state.threads[action.threadId]
      if (!thread) return state
      return {
        ...state,
        threads: {
          ...state.threads,
          [action.threadId]: {
            ...thread,
            messages: thread.messages.map((m) =>
              m.id === action.messageId ? { ...m, status: action.status } : m,
            ),
          },
        },
      }
    }

    case 'LOAD_BACKEND_DATA': {
      const { cooks, dishes, orders, requests } = action.payload
      return {
        ...state,
        cooks: cooks && cooks.length ? cooks : state.cooks,
        dishes: dishes && dishes.length ? dishes : state.dishes,
        orders: orders && orders.length ? orders : state.orders,
        cookOrders: orders && orders.length ? orders : state.cookOrders,
        requests: requests && requests.length ? requests : state.requests,
      }
    }

    case 'SYNC_THREAD': {
      const { thread } = action
      if (!thread?.id) return state
      return {
        ...state,
        threads: {
          ...state.threads,
          [thread.id]: {
            ...(state.threads[thread.id] || {}),
            ...thread,
          },
        },
      }
    }

    case 'SYNC_THREAD_MESSAGES': {
      const { threadId, messages } = action
      const current = state.threads[threadId]
      return {
        ...state,
        threads: {
          ...state.threads,
          [threadId]: {
            ...(current || { id: threadId }),
            messages,
          },
        },
      }
    }

    case 'OPEN_CHAT':
      return { ...state, activeThreadId: action.threadId }

    case 'CLOSE_CHAT':
      return { ...state, activeThreadId: null }

    default:
      return state
  }
}

const clockLabel = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })

export function BeityProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitialState)

  // 1. Initial load from backend (replaces local seed data)
  useEffect(() => {
    let cancelled = false
    async function loadBackend() {
      try {
        const [cooks, dishes, orders, requests] = await Promise.all([
          api.getCooks().catch(() => null),
          api.getDishes().catch(() => null),
          api.getOrders().catch(() => null),
          api.getRequests().catch(() => null),
        ])
        if (!cancelled) {
          dispatch({
            type: 'LOAD_BACKEND_DATA',
            payload: { cooks, dishes, orders, requests },
          })
        }
      } catch (err) {
        console.warn('Initial backend load error:', err)
      }
    }
    loadBackend()
    return () => {
      cancelled = true
    }
  }, [])

  // 2. Poll thread messages when chat drawer is open
  useEffect(() => {
    if (!state.activeThreadId) return

    api
      .getThread(state.activeThreadId)
      .then((t) => {
        if (t) dispatch({ type: 'SYNC_THREAD', thread: t })
      })
      .catch(() => {})

    const interval = setInterval(async () => {
      try {
        const msgs = await api.getThreadMessages(state.activeThreadId)
        if (msgs && msgs.length) {
          dispatch({ type: 'SYNC_THREAD_MESSAGES', threadId: state.activeThreadId, messages: msgs })
        }
      } catch {}
    }, 2500)

    return () => clearInterval(interval)
  }, [state.activeThreadId])

  const currentCook = useMemo(
    () => state.cooks.find((c) => c.id === state.session.userId) || null,
    [state.cooks, state.session.userId],
  )
  const currentCraver = useMemo(
    () => state.cravers.find((c) => c.id === state.session.userId) || null,
    [state.cravers, state.session.userId],
  )

  const sendMessage = useCallback(
    (threadId, message) => {
      dispatch({ type: 'SEND_MESSAGE', threadId, message, at: clockLabel() })
      const senderName =
        message.from === 'cook'
          ? (typeof currentCook?.name === 'object' ? currentCook.name.en : currentCook?.name) || 'Cook'
          : currentCraver?.name || 'Craver'

      api
        .sendMessage(threadId, {
          from: message.from,
          senderName,
          type: message.type || 'text',
          body: message.body || '',
          price: message.price,
          date: message.date,
          note: message.note,
        })
        .catch((err) => console.error('Failed to sync message to backend:', err))
    },
    [dispatch, currentCook, currentCraver],
  )

  const respondProposal = useCallback(
    (threadId, messageId, status) => {
      dispatch({ type: 'RESPOND_PROPOSAL', threadId, messageId, status })
      api
        .respondProposal(threadId, messageId, status)
        .catch((err) => console.error('Failed to update proposal on backend:', err))
    },
    [dispatch],
  )

  const placeOrder = useCallback(
    (dishId, cookId, qty, recurring = false, recurringDay = null) => {
      const craver = state.cravers.find((c) => c.id === state.session.userId) || state.cravers[0]
      dispatch({
        type: 'PLACE_ORDER',
        dishId,
        cookId,
        qty,
        recurring,
        recurringDay,
        craverId: state.session.userId,
      })
      api
        .placeOrder({
          dishId,
          cookId,
          craverId: state.session.userId || seed.DEMO_CRAVER_ID,
          craverName: craver?.name || 'Craver',
          qty,
          recurring,
          recurringDay,
        })
        .catch((err) => console.error('Failed to sync order with backend:', err))
    },
    [state.session.userId, state.cravers],
  )

  const setOrderStatus = useCallback((id, status) => {
    dispatch({ type: 'SET_ORDER_STATUS', id, status })
    api.setOrderStatus(id, status).catch((err) => console.error('Failed to update order status on backend:', err))
  }, [])

  const rateOrder = useCallback(
    (id, taste, onTime, text) => {
      const order = state.orders.find((o) => o.id === id)
      const craver = state.cravers.find((c) => c.id === state.session.userId) || state.cravers[0]
      dispatch({ type: 'RATE_ORDER', id, taste, onTime, text })
      api
        .createReview({
          orderId: id,
          dishId: order?.dishId,
          cookId: order?.cookId,
          craverId: state.session.userId,
          craverName: craver?.name || 'Craver',
          taste,
          onTime,
          text,
        })
        .catch((err) => console.error('Failed to submit review to backend:', err))
    },
    [state.orders, state.session.userId, state.cravers],
  )

  const addRequest = useCallback(
    (payload) => {
      const craver = state.cravers.find((c) => c.id === state.session.userId) || state.cravers[0]
      dispatch({ type: 'ADD_REQUEST', craverId: state.session.userId, ...payload })
      api
        .addRequest({
          craverId: state.session.userId || seed.DEMO_CRAVER_ID,
          craverName: craver?.name || 'Craver',
          ...payload,
        })
        .catch((err) => console.error('Failed to sync special request to backend:', err))
    },
    [state.session.userId, state.cravers],
  )

  const setRequestStatus = useCallback(
    (id, status) => {
      dispatch({ type: 'SET_REQUEST_STATUS', id, status, cookId: state.session.userId })
      api
        .setRequestStatus(id, status, state.session.userId)
        .catch((err) => console.error('Failed to update request status on backend:', err))
    },
    [state.session.userId],
  )

  const addDish = useCallback(
    (payload) => {
      dispatch({ type: 'ADD_DISH', cookId: state.session.userId, payload })
      api
        .addDish({
          cookId: state.session.userId || seed.DEMO_COOK_ID,
          ...payload,
        })
        .catch((err) => console.error('Failed to add dish to backend:', err))
    },
    [state.session.userId],
  )

  const signupCook = useCallback((payload) => {
    dispatch({ type: 'SIGNUP_COOK', payload })
    api.signupCook(payload).catch((err) => console.error('Failed to sync cook signup to backend:', err))
  }, [])

  const signupCraver = useCallback((payload) => {
    dispatch({ type: 'SIGNUP_CRAVER', payload })
    api.signupCraver(payload).catch((err) => console.error('Failed to sync craver signup to backend:', err))
  }, [])

  const value = useMemo(() => {
    const { session } = state

    return {
      ...state,
      currentCook,
      currentCraver,
      currentUser: session.role === 'cook' ? currentCook : currentCraver,

      // ---- lookups -------------------------------------------------------
      cookById: (id) => state.cooks.find((c) => c.id === id),
      dishById: (id) => state.dishes.find((d) => d.id === id),
      dishesByCook: (id) => state.dishes.filter((d) => d.cookId === id),
      earningsFor: (id) => state.earningsByCook[id] || state.earningsByCook[seed.DEMO_COOK_ID],

      // ---- actions -------------------------------------------------------
      loginAs: (role) => dispatch({ type: 'LOGIN_AS', role }),
      logout: () => dispatch({ type: 'LOGOUT' }),
      setLang: (lang) => dispatch({ type: 'SET_LANG', lang }),
      resetDemo: () => dispatch({ type: 'RESET' }),
      signupCraver,
      signupCook,
      placeOrder,
      setOrderStatus,
      rateOrder,
      addRequest,
      setRequestStatus,
      addDish,
      sendMessage,
      respondProposal,
      openChat: (threadId) => dispatch({ type: 'OPEN_CHAT', threadId }),
      closeChat: () => dispatch({ type: 'CLOSE_CHAT' }),
    }
  }, [
    state,
    currentCook,
    currentCraver,
    signupCraver,
    signupCook,
    placeOrder,
    setOrderStatus,
    rateOrder,
    addRequest,
    setRequestStatus,
    addDish,
    sendMessage,
    respondProposal,
  ])

  return <BeityContext.Provider value={value}>{children}</BeityContext.Provider>
}

export function useBeity() {
  const ctx = useContext(BeityContext)
  if (!ctx) throw new Error('useBeity must be used inside <BeityProvider>')
  return ctx
}
