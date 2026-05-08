# 💰 SettleSmart - Zero-Onboarding Group Expense Splitter

A lightweight, mobile-friendly web app for splitting group expenses with zero sign-up friction. Perfect for trips, roommates, and group projects.

## 🎯 Features

✅ **Zero Onboarding** - No app install, no sign-up required
✅ **Instant Sharing** - Share link, QR code, or invite code
✅ **Smart Settlement** - Optimized debt calculation with minimum transactions
✅ **Mobile-First** - Fully responsive, PWA-enabled
✅ **Real-Time Updates** - See changes instantly across all devices
✅ **Guest Mode** - No accounts needed, just a browser session
✅ **Offline Support** - Works even with poor connectivity
✅ **Debt Optimization** - Proprietary algorithm minimizes number of payments

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Git (optional)

### 1. Clone or Download
```bash
cd settlesmart
```

### 2. Setup Backend

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env if needed (default PORT=5000)
# Optional: set OPENAI_API_KEY to enable AI split planning

# Start server
npm start
# or for development with auto-reload:
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Setup Frontend

```bash
cd ../frontend
npm install

# Create .env.local file
cp .env.example .env.local
# If backend is on different server, update NEXT_PUBLIC_API_URL

# Start development server
npm run dev
```

Frontend runs on `http://localhost:3000`

### 4. Open in Browser

Visit `http://localhost:3000`

## 📱 User Flow

### 1. Create Group
- Enter group name and currency
- Get shareable invite link and QR code
- Share with friends

### 2. Friends Join
- Click link or scan QR
- Enter their name
- No account required!

### 3. Add Expenses
- Who paid?
- How much?
- Ask AI to split equally or create a custom split
- Edit each member's amount before saving

### 4. View Settlements
- Algorithm calculates minimum payments
- See who owes whom and how much
- One person settles at a time

## 🔄 Debt Minimization Algorithm

**How it works:**

1. **Calculate Net Balance** - For each person: (amount_paid - amount_owed)
2. **Separate** - Creditors (positive) and Debtors (negative)
3. **Greedy Settlement** - Match largest amounts first
4. **Result** - Minimum transactions needed

**Example:**
```
Before:
- Alex paid $50, owes $20 (balance: +$30)
- Sarah paid $20, owes $40 (balance: -$20)
- Mike paid $40, owes $30 (balance: +$10)

After optimization (2 payments):
1. Sarah pays Alex $20
2. Mike pays Alex $10
```

## 📊 API Endpoints

### Groups
- `POST /api/groups` - Create group
- `GET /api/groups/:groupId` - Get group details
- `POST /api/groups/join/:inviteCode` - Join with code

### Expenses
- `POST /api/expenses` - Add expense
- `POST /api/expenses/split-plan` - Create an AI-assisted split plan
- `GET /api/groups/:groupId/expenses` - List expenses
- `PUT /api/expenses/:expenseId` - Update expense
- `DELETE /api/expenses/:expenseId` - Delete expense

### Settlements
- `GET /api/groups/:groupId/settlements` - Get minimum settlements
- `GET /api/groups/:groupId/balance/:userId` - Get user balance

## 📱 Mobile Experience

- **Responsive Design** - Works on all screen sizes
- **PWA** - Install as app on home screen
- **Offline Mode** - Basic caching for offline access
- **Touch-Optimized** - Large buttons and inputs
- **No Horizontal Scroll** - Content fits screen

### Install as App

**iPhone/iPad:**
1. Open in Safari
2. Tap Share
3. "Add to Home Screen"

**Android:**
1. Open in Chrome
2. Tap Menu (⋮)
3. "Install app"

## 🛠️ Technology Stack

### Frontend
- **Next.js** - React framework with SSR
- **Tailwind CSS** - Utility-first styling
- **Lucide Icons** - Beautiful icons
- **PWA** - Progressive Web App support
- **Responsive** - Mobile-first design

### Backend
- **Express.js** - Node.js web framework
- **CORS** - Cross-origin support
- **UUID** - Unique IDs
- **In-memory storage** (ready for database upgrade)

## 🗄️ Data Schema

### Groups
```javascript
{
  id: uuid,
  name: string,
  currency: string,
  invite_code: string,
  created_at: timestamp
}
```

### Users (Members)
```javascript
{
  id: uuid,
  name: string,
  group_id: uuid,
  guest_token: uuid,
  avatar: string (url),
  created_at: timestamp
}
```

### Expenses
```javascript
{
  id: uuid,
  group_id: uuid,
  description: string,
  amount: float,
  paid_by: user_id,
  splits: { user_id: amount },
  category: string,
  created_at: timestamp
}
```

## 🔐 Security Notes

- **No Authentication** - Guest sessions via browser storage
- **In-Memory Storage** - Data lost on server restart (development only)
- **CORS Enabled** - Allow frontend to call backend
- **Input Validation** - Basic validation on API

**For Production:**
- Use persistent database (MongoDB, PostgreSQL)
- Add input sanitization
- Implement rate limiting
- Use HTTPS
- Add session management
- Consider user authentication

## 📈 Scaling for Production

### Database Migration
Replace in-memory storage with:
- **MongoDB** - Document-based
- **PostgreSQL** - Relational
- **Firebase** - Managed backend

### Deployment
Frontend:
- **Vercel** - Next.js native
- **Netlify** - React apps
- **AWS S3 + CloudFront** - Static files

Backend:
- **Heroku** - Easy Node.js hosting
- **AWS Lambda** - Serverless
- **DigitalOcean** - Affordable VPS
- **Railway** - Modern Node.js hosting

### Example: Vercel + Heroku

**Frontend:**
```bash
# In frontend folder
npm install -g vercel
vercel
```

**Backend:**
```bash
# Create Heroku app
heroku create your-app-name
git push heroku main
```

## 🎨 Customization

### Change Colors
Edit [tailwind.config.js](frontend/tailwind.config.js):
```javascript
colors: {
  primary: '#YOUR_COLOR',
  secondary: '#YOUR_COLOR',
}
```

### Add Categories
In [pages/group/[groupId].jsx](frontend/pages/group/[groupId].jsx):
```javascript
<option value="YourCategory">Your Category</option>
```

### Modify Algorithm
In [backend/server.js](backend/server.js), update `calculateDebts()` function

## 🐛 Troubleshooting

### API Connection Error
```
Check NEXT_PUBLIC_API_URL in .env.local
Ensure backend is running on PORT 5000
Check CORS settings in backend
```

### Data Not Persisting
- Backend uses in-memory storage
- Restart browser/refresh page to see latest data
- Implement database for persistent storage

### Mobile App Won't Install
- Ensure HTTPS for production (PWA requirement)
- Check manifest.json is served correctly
- Use Chrome/Edge for best PWA support

## 📚 Further Reading

- [Next.js Docs](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PWA Guide](https://web.dev/progressive-web-apps/)

## 💡 Future Enhancements

- 🔐 User accounts & authentication
- 💳 Payment integration (Stripe, PayPal)
- 📸 Receipt scanner with OCR
- 📊 Analytics & spending reports
- 🔔 Push notifications
- 💬 In-app messaging
- 📅 Recurring expenses
- 🌍 Multi-language support
- 🎨 Dark mode

## 📝 License

MIT - Free to use and modify

## 🤝 Contributing

Feel free to fork, modify, and use this project!

## 💬 Support

For issues, questions, or suggestions, open an issue or contact the developer.

---

**Made with ❤️ for friends, roommates, and group travelers**
