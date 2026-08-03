const BASE_URL = 'http://localhost:8080/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status} on ${path}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // Wellbeing check-ins
  getCheckIns: () => request('/checkins'),
  createCheckIn: (mood, escalated) =>
    request('/checkins', { method: 'POST', body: JSON.stringify({ mood, escalated }) }),

  // Contacts
  getContacts: () => request('/contacts'),
  createContact: (contact) =>
    request('/contacts', { method: 'POST', body: JSON.stringify(contact) }),
  updateContact: (id, contact) =>
    request(`/contacts/${id}`, { method: 'PUT', body: JSON.stringify(contact) }),
  deleteContact: (id) => request(`/contacts/${id}`, { method: 'DELETE' }),

  // mesaages
  getMessages: () => request('/messages'),
  sendMessage: (contactId, text) =>
    request('/messages', { method: 'POST', body: JSON.stringify({ contactId, text }) }),


  // Community groups
  getGroups: () => request('/groups'),
  joinGroup: (id) => request(`/groups/${id}/join`, { method: 'POST' }),
  leaveGroup: (id) => request(`/groups/${id}/leave`, { method: 'POST' }),

  // profile setup
  getProfile: async () => {
  const res = await fetch(`${BASE_URL}/profile`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API error ${res.status} on /profile`);
  return res.json();
},
  createProfile: (profile) => request('/profile', { method: 'POST', body: JSON.stringify(profile) }),
  verifyPin: (pin) => request('/profile/verify-pin', { method: 'POST', body: JSON.stringify({ pin }) }),

  
};

