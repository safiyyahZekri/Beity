// API Client for the Beity Node.js + Express backend

const BASE_URL = ''; // Relative paths, proxied by Vite to http://localhost:5000

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const config = {
    ...options,
    headers,
  };
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const res = await fetch(url, config);
  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    let errorJson;
    try {
      errorJson = JSON.parse(errorText);
    } catch {}
    throw new Error(errorJson?.error || errorText || `HTTP error ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Demo Users
  getDemoUsers: () => request('/api/demo-users'),

  // Cooks
  getCooks: () => request('/api/cooks'),
  getCook: (id) => request(`/api/cooks/${id}`),
  signupCook: (data) => request('/api/cooks', { method: 'POST', body: data }),

  // Cravers
  getCraver: (id) => request(`/api/cravers/${id}`),
  signupCraver: (data) => request('/api/cravers', { method: 'POST', body: data }),
  updateCraver: (id, data) => request(`/api/cravers/${id}`, { method: 'PATCH', body: data }),

  // Dishes
  getDishes: (params = {}) => {
    const query = new URLSearchParams();
    if (params.q) query.set('q', params.q);
    if (params.category) query.set('category', params.category);
    if (params.taste && params.taste.length) {
      query.set('taste', Array.isArray(params.taste) ? params.taste.join(',') : params.taste);
    }
    if (params.dietary && params.dietary.length) {
      query.set('dietary', Array.isArray(params.dietary) ? params.dietary.join(',') : params.dietary);
    }
    if (params.cookId) query.set('cookId', params.cookId);
    const qs = query.toString();
    return request(`/api/dishes${qs ? `?${qs}` : ''}`);
  },
  addDish: (data) => request('/api/dishes', { method: 'POST', body: data }),

  // Orders
  getOrders: (params = {}) => {
    const query = new URLSearchParams();
    if (params.craverId) query.set('craverId', params.craverId);
    if (params.cookId) query.set('cookId', params.cookId);
    const qs = query.toString();
    return request(`/api/orders${qs ? `?${qs}` : ''}`);
  },
  placeOrder: (data) => request('/api/orders', { method: 'POST', body: data }),
  setOrderStatus: (id, status) => request(`/api/orders/${id}/status`, { method: 'PATCH', body: { status } }),

  // Requests
  getRequests: (params = {}) => {
    const query = new URLSearchParams();
    if (params.craverId) query.set('craverId', params.craverId);
    if (params.cookId) query.set('cookId', params.cookId);
    const qs = query.toString();
    return request(`/api/requests${qs ? `?${qs}` : ''}`);
  },
  addRequest: (data) => request('/api/requests', { method: 'POST', body: data }),
  setRequestStatus: (id, status, cookId) =>
    request(`/api/requests/${id}/status`, { method: 'PATCH', body: { status, cookId } }),

  // Threads & Messages
  getThread: (id) => request(`/api/threads/${id}`),
  getThreadMessages: (id) => request(`/api/threads/${id}/messages`),
  sendMessage: (threadId, data) => request(`/api/threads/${threadId}/messages`, { method: 'POST', body: data }),
  respondProposal: (threadId, messageId, status) =>
    request(`/api/threads/${threadId}/messages/${messageId}`, { method: 'PATCH', body: { status } }),

  // Reviews
  createReview: (data) => request('/api/reviews', { method: 'POST', body: data }),
};

export default api;

