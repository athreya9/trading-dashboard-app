# Backend Deployment Guide

## 🎯 **Complete Setup Instructions**

### **1. Deploy Flask Backend to Railway/Heroku**

#### **Option A: Railway (Recommended)**
1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub account
3. Create new project from this repository
4. Select the `backend` folder as root directory
5. Railway will auto-detect Flask and deploy

#### **Option B: Heroku**
1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-trading-bot-api`
4. Deploy: 
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial backend"
   heroku git:remote -a your-trading-bot-api
   git push heroku main
   ```

### **2. Set Environment Variables**

#### **On Railway:**
1. Go to your project dashboard
2. Click "Variables" tab
3. Add: `GOOGLE_SHEETS_CREDENTIALS` = `{your_service_account_json}`

#### **On Heroku:**
```bash
heroku config:set GOOGLE_SHEETS_CREDENTIALS='{"type":"service_account",...}'
```

### **3. Get Your Backend URL**

After deployment, you'll get a public URL like:
- Railway: `https://your-app-name.railway.app`
- Heroku: `https://your-trading-bot-api.herokuapp.com`

### **4. Update Frontend API Calls**

Update your Next.js API routes to use the backend URL:

```typescript
// In your API routes, replace localhost with your backend URL
const BACKEND_URL = 'https://your-app-name.railway.app';

// Example in app/api/bot-status/route.ts
const response = await fetch(`${BACKEND_URL}/api/bot-status`);
```

### **5. Set GitHub Secrets**

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add secret: `GOOGLE_SHEETS_CREDENTIALS`
4. Paste your service account JSON

### **6. Test the Setup**

#### **Test Backend:**
```bash
curl https://your-backend-url.com/
curl https://your-backend-url.com/api/bot-status
```

#### **Test GitHub Actions:**
1. Go to Actions tab in GitHub
2. Run "Trading Bot Data Processing" manually
3. Check logs for success

### **7. Verify Data Flow**

1. **Bot Control**: Start bot from your frontend
2. **Data Processing**: GitHub Actions runs every 5 minutes
3. **Real Data**: Check Google Sheets for updates
4. **Frontend**: Verify dashboard shows real data

## 🚀 **Your Complete Architecture**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js App   │───▶│   Flask Backend  │───▶│  Google Sheets  │
│   (Vercel)      │    │ (Railway/Heroku) │    │   (Data Store)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       ▲
         │                       │                       │
         ▼                       ▼                       │
┌─────────────────┐    ┌──────────────────┐              │
│   User Browser  │    │ GitHub Actions   │──────────────┘
│   (Dashboard)   │    │ (Data Processor) │
└─────────────────┘    └──────────────────┘
```

## ✅ **Verification Checklist**

- [ ] Flask backend deployed and accessible
- [ ] Environment variables set correctly
- [ ] GitHub Actions workflow running
- [ ] Google Sheets credentials working
- [ ] Frontend connecting to backend
- [ ] Real data flowing to sheets
- [ ] Bot control working from dashboard

## 🔧 **Next Steps After Deployment**

1. Update your frontend API calls with the backend URL
2. Test the complete flow end-to-end
3. Monitor GitHub Actions logs
4. Check Google Sheets for real data updates
5. Verify bot start/stop functionality

Your trading bot system will be fully operational! 🚀