const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const Razorpay = require('razorpay');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Razorpay with Mock/Test Keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_settlesmart',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_secret'
});

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
let groups = {};
let expenses = {};
let users = {};
let otps = {};
let chatMessages = {}; // groupId -> array of messages

// ============ UTILS ============
function roundMoney(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

const paidSettlements = {}; // { settlementId: true }

function calculateDebts(groupId) {
  const groupExpenses = Object.values(expenses).filter(e => e.group_id === groupId);
  const groupUsers = Object.values(users).filter(u => u.group_id === groupId);
  const balances = {};
  groupUsers.forEach(user => balances[user.id] = 0);
  
  groupExpenses.forEach(expense => {
    if (balances[expense.paid_by] !== undefined) {
      balances[expense.paid_by] += (expense.amount || 0);
    }
    const splits = expense.splits || {};
    Object.keys(splits).forEach(userId => {
      if (balances[userId] !== undefined) {
        balances[userId] -= (splits[userId] || 0);
      }
    });
  });

  const creditors = [];
  const debtors = [];
  Object.entries(balances).forEach(([userId, balance]) => {
    const user = users[userId];
    if (!user) return;
    if (balance > 0.01) creditors.push({ id: userId, name: user.name, amount: balance });
    else if (balance < -0.01) debtors.push({ id: userId, name: user.name, amount: Math.abs(balance) });
  });

  // Potential transactions (worst case if everyone paid one person)
  const potentialCount = Math.max(0, groupUsers.length - 1);
  
  const settlements = [];
  const c = [...creditors].sort((a, b) => b.amount - a.amount);
  const d = [...debtors].sort((a, b) => a.amount - b.amount);

  let i = 0, j = 0;
  while (i < c.length && j < d.length) {
    const amount = Math.min(c[i].amount, d[j].amount);
    const settlementId = `${d[j].id}-${c[i].id}-${amount.toFixed(0)}`;
    settlements.push({
      id: settlementId,
      from: d[j].id,
      from_name: d[j].name,
      to: c[i].id,
      to_name: c[i].name,
      amount: roundMoney(amount),
      is_paid: !!paidSettlements[settlementId]
    });
    c[i].amount -= amount;
    d[j].amount -= amount;
    if (c[i].amount < 0.01) i++;
    if (d[j].amount < 0.01) j++;
  }

  return {
    list: settlements,
    optimization: {
      original: potentialCount,
      optimized: settlements.length,
      saved: Math.max(0, potentialCount - settlements.length)
    },
    balances: Object.entries(balances).map(([id, b]) => ({
      id,
      name: users[id]?.name || 'Unknown',
      amount: roundMoney(b)
    }))
  };
}

// ============ AI SPLIT LOGIC ============
app.post('/api/expenses/split-plan', async (req, res) => {
  const { group_id, amount, prompt } = req.body;
  const groupUsers = Object.values(users).filter(u => u.group_id === group_id);
  if (groupUsers.length === 0) return res.status(400).json({ error: 'No members in group' });

  const amountNum = parseFloat(amount);

  if (openai) {
    try {
      const userList = groupUsers.map(u => ({ id: u.id, name: u.name })).map(u => `${u.name} (ID: ${u.id})`).join(', ');
      const aiResponse = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an expense splitting assistant. Given a total amount, a list of users, and a prompt, calculate how much each user should pay. Return only a JSON object where keys are user IDs and values are amounts (numbers), and an 'explanation' field." },
          { role: "user", content: `Total: ${amountNum}. Users: ${userList}. Prompt: "${prompt}"` }
        ],
        response_format: { type: "json_object" }
      });

      const data = JSON.parse(aiResponse.choices[0].message.content);
      const splits = {};
      groupUsers.forEach(u => {
        splits[u.id] = roundMoney(data[u.id] || 0);
      });
      
      // Validation: Ensure total matches
      const total = Object.values(splits).reduce((a, b) => a + b, 0);
      if (Math.abs(total - amountNum) > 0.01) {
         // If AI failed to match total, fallback to equal split but keep explanation
         const equalSplit = roundMoney(amountNum / groupUsers.length);
         groupUsers.forEach(u => splits[u.id] = equalSplit);
         const diff = roundMoney(amountNum - (equalSplit * groupUsers.length));
         if (diff !== 0) splits[groupUsers[0].id] = roundMoney(splits[groupUsers[0].id] + diff);
      }

      return res.json({ splits, explanation: data.explanation || `AI interpreted your prompt: "${prompt}"` });
    } catch (err) {
      console.error('AI Split Error:', err);
    }
  }

  // Fallback to simple "AI" heuristic for the demo
  const equalSplit = roundMoney(amountNum / groupUsers.length);
  const splits = {};
  groupUsers.forEach(u => splits[u.id] = equalSplit);

  // Fix rounding diff
  const total = Object.values(splits).reduce((a, b) => a + b, 0);
  const diff = roundMoney(amountNum - total);
  if (diff !== 0) splits[groupUsers[0].id] = roundMoney(splits[groupUsers[0].id] + diff);

  res.json({
    splits,
    explanation: `Mock AI: Split ${amountNum} equally among ${groupUsers.length} members. (Add OpenAI key for real AI splitting)`
  });
});

// ============ CHAT ROUTES ============
app.get('/api/groups/:groupId/chat', (req, res) => {
  res.json(chatMessages[req.params.groupId] || []);
});

app.post('/api/groups/:groupId/chat', (req, res) => {
  const { groupId } = req.params;
  const { sender_id, sender_name, text, type = 'text', image_url } = req.body;
  if (!chatMessages[groupId]) chatMessages[groupId] = [];
  const message = { id: uuidv4(), sender_id, sender_name, text, type, image_url, timestamp: new Date().toISOString() };
  chatMessages[groupId].push(message);
  res.json(message);
});

// ============ RAZORPAY ROUTES ============
app.post('/api/payment/order', async (req, res) => {
  const { amount, currency = 'INR' } = req.body;
  try {
    const options = { amount: Math.round(amount * 100), currency, receipt: `receipt_${uuidv4().substring(0, 8)}` };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.json({ id: `order_mock_${uuidv4().substring(0, 12)}`, amount: amount * 100, currency: 'INR', status: 'created' });
  }
});

// ============ AUTH ROUTES ============
app.post('/api/auth/send-otp', (req, res) => {
  const { identifier } = req.body;
  const otp = '123456';
  otps[identifier] = otp;
  console.log(`[AUTH] OTP for ${identifier}: ${otp}`);
  res.json({ success: true });
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { identifier, otp } = req.body;
  if (otps[identifier] === otp) {
    delete otps[identifier];
    res.json({ success: true, token: uuidv4() });
  } else {
    res.status(401).json({ error: 'Invalid OTP' });
  }
});

// ============ GROUP ROUTES ============
app.post('/api/groups', (req, res) => {
  const { name, currency = 'INR', categories = [], creator_contact } = req.body;
  if (!name || !creator_contact) return res.status(400).json({ error: 'Missing fields' });
  const groupId = uuidv4();
  const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  groups[groupId] = { id: groupId, name, currency, categories, invite_code: inviteCode, creator_contact, leader_name: 'Leader', created_at: new Date().toISOString() };
  res.json({ id: groupId, name, invite_code: inviteCode });
});

app.get('/api/groups/:groupId', (req, res) => {
  const { groupId } = req.params;
  const group = groups[groupId];
  if (!group) return res.status(404).json({ error: 'Not found' });
  const groupMembers = Object.values(users).filter(u => u.group_id === groupId);
  const groupExpenses = Object.values(expenses).filter(e => e.group_id === groupId);
  const debtData = calculateDebts(groupId);
  res.json({ 
    ...group, 
    members: groupMembers, 
    expenses: groupExpenses, 
    settlements: debtData.list,
    optimization: debtData.optimization,
    balances: debtData.balances
  });
});

app.post('/api/settlements/pay', (req, res) => {
  const { settlementId } = req.body;
  paidSettlements[settlementId] = true;
  res.json({ success: true });
});

app.post('/api/groups/join/:inviteCode', (req, res) => {
  const { inviteCode } = req.params;
  const { name } = req.body;
  const group = Object.values(groups).find(g => g.invite_code === inviteCode);
  if (!group) return res.status(404).json({ error: 'Invalid code' });
  
  // If this is the first member, they are the leader (generator)
  const isLeader = Object.values(users).filter(u => u.group_id === group.id).length === 0;
  if (isLeader) {
    groups[group.id].leader_name = name;
    groups[group.id].leader_id = ''; // Set later
  }

  const userId = uuidv4();
  const guestToken = uuidv4();
  if (isLeader) groups[group.id].leader_id = userId;

  users[userId] = { id: userId, name, group_id: group.id, guest_token: guestToken, is_leader: isLeader, avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f8f9fa&color=1a1c1e&bold=true`, created_at: new Date().toISOString() };
  res.json({ user_id: userId, guest_token: guestToken, group_id: group.id, name, is_leader: isLeader });
});

app.post('/api/expenses', (req, res) => {
  const { group_id, description, amount, paid_by, category } = req.body;
  let { splits } = req.body;
  const amountNum = parseFloat(amount);

  // Auto-calculate equal split if missing or empty
  if (!splits || Object.keys(splits).length === 0) {
    const groupUsers = Object.values(users).filter(u => u.group_id === group_id);
    if (groupUsers.length > 0) {
      splits = {};
      const share = roundMoney(amountNum / groupUsers.length);
      groupUsers.forEach(u => splits[u.id] = share);
      // Fix rounding diff
      const total = Object.values(splits).reduce((a, b) => a + b, 0);
      const diff = roundMoney(amountNum - total);
      if (diff !== 0) splits[groupUsers[0].id] = roundMoney(splits[groupUsers[0].id] + diff);
    }
  }

  const expenseId = uuidv4();
  expenses[expenseId] = { id: expenseId, group_id, description, amount: amountNum, paid_by, splits, category: category || 'Other', created_at: new Date().toISOString() };
  res.json(expenses[expenseId]);
});

app.delete('/api/expenses/:expenseId', (req, res) => {
  const { expenseId } = req.params;
  delete expenses[expenseId];
  res.json({ success: true });
});

app.get('/api/groups/:groupId/balance/:userId', (req, res) => {
  const { groupId, userId } = req.params;
  const groupExpenses = Object.values(expenses).filter(e => e.group_id === groupId);
  let totalPaid = 0, totalOwed = 0;
  groupExpenses.forEach(expense => {
    if (expense.paid_by === userId) totalPaid += expense.amount;
    if (expense.splits?.[userId]) totalOwed += expense.splits[userId];
  });
  const balance = totalPaid - totalOwed;
  res.json({ user_id: userId, total_paid: totalPaid, total_owed: totalOwed, balance });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SettleSmart API | Leader Identity & AI Assist | Running on port ${PORT}`);
});
