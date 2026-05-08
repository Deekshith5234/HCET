# 🎯 Quick Start Guide - SettleSmart

Get SettleSmart running in 5 minutes!

## Prerequisites

- **Node.js 16+** - [Download here](https://nodejs.org/)
- **npm** - Comes with Node.js

## Step 1: Installation (2 minutes)

### Windows
```bash
cd settlesmart
quickstart.bat
```

### macOS/Linux
```bash
cd settlesmart
chmod +x quickstart.sh
./quickstart.sh
```

### Or Manual
```bash
cd settlesmart
npm run install-all
```

## Step 2: Start Development (1 minute)

```bash
npm run dev
```

You'll see:
```
> Backend running on port 5000
> Frontend running on http://localhost:3000
```

## Step 3: Open in Browser

Visit: **http://localhost:3000**

## Step 4: Test the App (2 minutes)

### Create a Group
1. Click "Create New Group"
2. Enter: "Test Trip"
3. Select currency: USD
4. Click "Create Group"
5. Copy the invite link or code

### Join as a Friend
1. In same or new browser window, visit `http://localhost:3000`
2. Click "Join Existing Group"
3. Enter name: "Friend Name"
4. Paste invite code
5. Click "Join Group"

### Add an Expense
1. Click "Add Expense"
2. Description: "Dinner"
3. Amount: "60"
4. Paid by: Select creator
5. Click "Add Expense"

### See Settlement
1. Go to "Settlements" tab
2. See minimum payment needed
3. Done! 🎉

## Common Commands

```bash
# Start both frontend and backend
npm run dev

# Start frontend only
npm run dev:frontend

# Start backend only
npm run dev:backend

# Build for production
npm run build --prefix frontend

# Run with Docker
npm run docker-up

# Stop Docker
npm run docker-down
```

## Troubleshooting

### Port Already in Use
```bash
# Change port (Linux/Mac)
PORT=3001 npm run dev:frontend

# Windows PowerShell
$env:PORT=3001; npm run dev:frontend
```

### API Connection Error
- Check backend is running: `npm run dev:backend`
- Check frontend .env.local has correct API URL
- Clear browser cache

### Dependencies Won't Install
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules frontend/node_modules backend/node_modules

# Reinstall
npm run install-all
```

## Next Steps

1. **Read Documentation**
   - [README.md](README.md) - Full features
   - [ARCHITECTURE.md](ARCHITECTURE.md) - Technical details
   - [DEPLOYMENT.md](DEPLOYMENT.md) - Deploy to production

2. **Customize**
   - Change colors in `frontend/tailwind.config.js`
   - Modify API in `backend/server.js`
   - Update UI in `frontend/pages/`

3. **Deploy**
   - Free option: Vercel (frontend) + Railway (backend)
   - See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guides

4. **Add Database**
   - Currently uses in-memory storage
   - Add MongoDB/PostgreSQL for production
   - See [DEPLOYMENT.md](DEPLOYMENT.md) for database setup

## Features to Explore

- ✅ Create unlimited groups
- ✅ Zero signup required
- ✅ Share with QR code or link
- ✅ Track all expenses
- ✅ Calculate minimum settlements
- ✅ Works on mobile (install as PWA)
- ✅ Offline support

## Get Help

- Check browser console for errors (F12)
- Check backend logs in terminal
- Review [README.md](README.md) for more details
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment issues

## What's Next?

- 💾 Add database for persistent data
- 🔐 Add user authentication
- 💳 Integrate payment gateway (Stripe)
- 📱 Build native mobile app
- 🌍 Deploy to production
- 📊 Add analytics
- 🎨 Implement dark mode

---

**Made with ❤️ - Have fun splitting expenses!**
