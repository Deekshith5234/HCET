const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined') {
    const { hostname } = window.location;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `http://${hostname}:5003`;
    }
  }
  return 'http://localhost:5003';
};

const API_BASE_URL = getApiUrl();

export const api = {
  createGroup: async (name, currency = 'INR', categories = [], creator_contact) => {
    const res = await fetch(`${API_BASE_URL}/api/groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, currency, categories, creator_contact }),
    });
    return res.json();
  },

  getGroup: async (groupId) => {
    const res = await fetch(`${API_BASE_URL}/api/groups/${groupId}`);
    return res.json();
  },

  joinGroup: async (inviteCode, name) => {
    const res = await fetch(`${API_BASE_URL}/api/groups/join/${inviteCode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    return res.json();
  },

  addExpense: async (groupId, description, amount, paidBy, splits, category = 'Other') => {
    const res = await fetch(`${API_BASE_URL}/api/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        group_id: groupId,
        description,
        amount,
        paid_by: paidBy,
        splits,
        category,
      }),
    });
    return res.json();
  },

  getChat: async (groupId) => {
    const res = await fetch(`${API_BASE_URL}/api/groups/${groupId}/chat`);
    return res.json();
  },

  sendChatMessage: async (groupId, data) => {
    const res = await fetch(`${API_BASE_URL}/api/groups/${groupId}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  createSplitPlan: async (groupId, amount, prompt) => {
    const res = await fetch(`${API_BASE_URL}/api/expenses/split-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        group_id: groupId,
        amount,
        prompt,
      }),
    });
    return res.json();
  },

  getBalance: async (groupId, userId) => {
    const res = await fetch(`${API_BASE_URL}/api/groups/${groupId}/balance/${userId}`);
    return res.json();
  },

  deleteExpense: async (expenseId) => {
    const res = await fetch(`${API_BASE_URL}/api/expenses/${expenseId}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  sendOtp: async (identifier) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier }),
    });
    return res.json();
  },

  verifyOtp: async (identifier, otp) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, otp }),
    });
    return res.json();
  },

  createRazorpayOrder: async (amount, currency = 'INR') => {
    const res = await fetch(`${API_BASE_URL}/api/payment/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency }),
    });
    return res.json();
  },

  markSettlementPaid: async (settlementId) => {
    const res = await fetch(`${API_BASE_URL}/api/settlements/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settlementId }),
    });
    return res.json();
  },
};

export const storage = {
  setUser: (userId, guestToken, groupId, userName, isLeader) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('guestToken', guestToken);
    localStorage.setItem('groupId', groupId);
    if (userName) localStorage.setItem('userName', userName);
    if (isLeader !== undefined) localStorage.setItem('isLeader', isLeader ? 'true' : 'false');
  },

  getUser: () => {
    if (typeof window === 'undefined') return { isLeader: false };
    return {
      userId: localStorage.getItem('userId'),
      guestToken: localStorage.getItem('guestToken'),
      groupId: localStorage.getItem('groupId'),
      userName: localStorage.getItem('userName'),
      isLeader: localStorage.getItem('isLeader') === 'true',
    };
  },

  clearUser: () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('guestToken');
    localStorage.removeItem('groupId');
    localStorage.removeItem('userName');
    localStorage.removeItem('isLeader');
  }
};
