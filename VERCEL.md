# Deploying FORGE X to Vercel 🚀

FORGE X is pre-configured for zero-friction deployment to Vercel.

---

## ⚡ Quick 1-Click Deployment (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new).
2. Select your GitHub repository: `forge-x`.
3. Vercel will automatically detect the configuration from `vercel.json` and `package.json`:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build --prefix apps/web`
   - **Output Directory**: `apps/web/dist`
   - **Install Command**: `npm install --prefix apps/web`
4. Click **Deploy**.

That's it! In less than 60 seconds, your application will be live at `https://your-project.vercel.app`.

---

## ⚙️ Alternative: If Setting Root Directory to `apps/web`

If you prefer to set the **Root Directory** in Vercel to `apps/web`:
- `apps/web/vercel.json` is already included to handle SPA single-page routing rewrites (`/(.*) -> /index.html`).
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

---

## 🌐 Optional: Connecting a Hosted Backend

If you host the Python FastAPI backend on Railway, Render, Fly.io, or AWS:
1. Go to your Vercel Project Settings -> **Environment Variables**.
2. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-service.up.railway.app` (your backend URL without trailing slash)
3. Redeploy.

> **Note**: Even without `VITE_API_URL`, the application operates with 100% full-fidelity simulation mode. Every single feature (Process Archaeology, Decision Genomes, Command Center, Fork Reality, Red Team 100-bot benchmark, AI Apprenticeship, Incident Management, Audit Ledger, and Temporal Time Machine) is interactive and functional out of the box with zero blank screens or errors!
