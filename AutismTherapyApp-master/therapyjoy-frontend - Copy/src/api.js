const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4001/api';

export async function apiCall(endpoint, options = {}) {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
}

async function getAuthToken() {
  const { getAuth } = await import('firebase/auth');
  const { default: app } = await import('./firebase');
  const auth = getAuth(app);
  const user = auth.currentUser;
  return user ? await user.getIdToken() : null;
}

export const api = {
  health: () => apiCall('/health'),
  profile: () => apiCall('/profile'),
  saveProgress: (data) => apiCall('/progress', { method: 'POST', body: JSON.stringify(data) }),
  getProgress: (params) => apiCall(`/progress?${new URLSearchParams(params)}`),
  createOrder: (data) => apiCall('/subscriptions/create-order', { method: 'POST', body: JSON.stringify(data) }),
  verifyPayment: (data) => apiCall('/subscriptions/verify', { method: 'POST', body: JSON.stringify(data) }),
  getSubscription: () => apiCall('/subscriptions/status'),
};