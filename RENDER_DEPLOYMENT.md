# Render Backend Deployment Guide

This full-stack application includes an **Express + TypeScript** backend server configured specifically for **Render Web Services** (https://render.com).

---

## 🚀 Quick Deploy with Render Blueprint (`render.yaml`)

This repository includes a native `render.yaml` configuration file for Render's Infrastructure-as-Code (Blueprint) deployment.

### Option 1: Render Blueprints (Recommended)
1. Push this repository to GitHub or GitLab.
2. In the [Render Dashboard](https://dashboard.render.com), click **New +** and select **Blueprint**.
3. Connect your repository.
4. Render will automatically detect `render.yaml` and provision:
   - **Service Type**: Web Service (Node.js)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Health Check Path**: `/api/health`
5. Click **Apply** to deploy!

---

### Option 2: Manual Web Service Setup on Render
If setting up manually in the Render dashboard:
1. Click **New +** > **Web Service**.
2. Connect your Git repository.
3. Configure the following fields:
   - **Name**: `capitalgrow-backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Health Check Path**: `/api/health`
4. Under **Environment Variables**, add:
   - `NODE_ENV` = `production`
   - `GEMINI_API_KEY` = *(Optional: your Google Gemini API key)*
   - `APP_URL` = *(Your Render URL or custom domain)*
5. Click **Create Web Service**.

---

## 📡 API Endpoints Provided by the Backend

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | GET | Zero-downtime health check probe (checked by Render) |
| `/api/system-status` | GET | Server uptime, Render environment status, platform metrics |
| `/api/market-rates` | GET | Real-time liquidity oracle rates (BTC, ETH, SOL, USDT, S&P 500, Gold) |
| `/api/support/ticket` | POST | Customer care ticket ingestion service |
| `/api/ai/insights` | POST | Server-side Gemini AI portfolio analyzer |
| `/*` | GET | Serves the optimized Vite single-page application |

---

## 🛠️ Local Testing
To test the Render-ready server locally:
```bash
# Development mode with Vite middleware
npm run dev

# Production build and test
npm run build
npm run start
```
The server binds to `0.0.0.0:${PORT || 3000}`.
