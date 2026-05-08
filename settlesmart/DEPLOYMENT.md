# 🚀 SettleSmart Deployment Guide

## Local Development

### Quick Start (5 minutes)

```bash
# Navigate to project
cd settlesmart

# Install dependencies for all
npm run install-all

# Start both frontend and backend
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Individual Development

**Backend only:**
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:5000
```

**Frontend only:**
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

## Docker Deployment

### Prerequisites
- Docker installed
- Docker Compose installed

### Run with Docker

```bash
# Build and start containers
npm run docker-up

# Or manually:
docker-compose up --build

# Stop containers
npm run docker-down
```

Both services will be available:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended)

**Frontend on Vercel:**

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Deploy
vercel

# Follow prompts to connect GitHub account
```

Environment variables in Vercel dashboard:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

**Backend on Railway:**

1. Go to [Railway.app](https://railway.app)
2. Create new project
3. Add GitHub repo (connect `backend` folder)
4. Set environment variables:
   ```
   PORT=5000
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```
5. Deploy

Update Vercel `NEXT_PUBLIC_API_URL` to Railway backend URL.

### Option 2: Heroku (Free tier deprecated)

Use [Railway](https://railway.app) or [Render](https://render.com) instead.

### Option 3: AWS

**Frontend (S3 + CloudFront):**
```bash
cd frontend
npm run build
aws s3 sync out/ s3://your-bucket-name/
```

**Backend (Lambda or EC2):**
```bash
cd backend
# Package for AWS
zip -r function.zip .
# Upload to Lambda or EC2
```

### Option 4: DigitalOcean App Platform

1. Create App on DigitalOcean App Platform
2. Connect GitHub repo
3. Configure:
   - `frontend` as web service (Next.js)
   - `backend` as service (Node.js)
4. Set environment variables
5. Deploy

### Option 5: Self-Hosted (VPS)

**Prerequisites:**
- Ubuntu/Debian VPS
- Node.js 18+
- Nginx or Apache

**Setup:**

```bash
# SSH into server
ssh root@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone <your-repo-url> /var/www/settlesmart
cd /var/www/settlesmart

# Install dependencies
npm run install-all

# Build frontend
cd frontend && npm run build && cd ..

# Install PM2 for process management
sudo npm install -g pm2

# Start services
pm2 start backend/server.js --name "settlesmart-backend"
pm2 start "npm run start --prefix frontend" --name "settlesmart-frontend"
pm2 save
pm2 startup

# Setup Nginx reverse proxy
```

**Nginx Configuration:**
```nginx
upstream backend {
  server localhost:5000;
}

upstream frontend {
  server localhost:3000;
}

server {
  listen 80;
  server_name your-domain.com;

  location /api/ {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  location / {
    proxy_pass http://frontend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/settlesmart /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**SSL Certificate (Let's Encrypt):**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Production Checklist

- [ ] Use environment variables for configuration
- [ ] Enable HTTPS/SSL certificate
- [ ] Set up database (MongoDB, PostgreSQL)
- [ ] Configure rate limiting
- [ ] Add input validation & sanitization
- [ ] Enable CORS for specific origins
- [ ] Set up monitoring & logging
- [ ] Configure backups
- [ ] Enable CDN for static assets
- [ ] Test on mobile devices
- [ ] Setup CI/CD pipeline
- [ ] Monitor performance

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

### Backend (.env)
```
PORT=5000
FRONTEND_URL=https://your-domain.com
NODE_ENV=production
```

## Database Migration (Production)

Replace in-memory storage with MongoDB:

```bash
# Install MongoDB driver
npm install --prefix backend mongodb
```

Update backend to use MongoDB instead of in-memory storage.

## Monitoring & Logging

### PM2 Monitoring
```bash
pm2 monit
pm2 logs
```

### Uptime Monitoring
- Use UptimeRobot or similar service
- Monitor API endpoints
- Get alerts on downtime

## Performance Optimization

### Frontend
```bash
# Build production bundle
npm run build --prefix frontend

# Analyze bundle
npm install --save-dev webpack-bundle-analyzer
```

### Backend
- Add caching headers
- Compress responses
- Optimize database queries
- Use CDN for static files

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :5000
# Kill process
kill -9 <PID>
```

### CORS Issues
Check backend CORS configuration matches frontend URL.

### PWA Not Installing
- Ensure HTTPS in production
- Check manifest.json is served
- Clear browser cache

## Support

For deployment issues, check:
- Backend logs: `pm2 logs`
- Frontend console: Browser DevTools
- Environment variables are correct
- Firewall rules allow connections
- DNS is properly configured
