
# Anand Finserv Advisory Platform

A premium investment advisory platform for sharing real-time market signals and research.

## 🚀 How to Deploy on Vercel
1. **GitHub:** Create a new repository and upload all files.
2. **Vercel:** Connect your GitHub repo to Vercel for instant hosting.
3. **API Key Setup:** 
   - Go to [Google AI Studio](https://aistudio.google.com/) and get a Gemini API Key.
   - In Vercel Project Settings -> **Environment Variables**, add:
     - **Key:** `API_KEY`
     - **Value:** `YOUR_GEMINI_API_KEY_HERE`
4. **Redeploy:** Trigger a new deployment on Vercel to activate the key.

## 🔐 Admin Access
- **Login Mode:** Toggle the "Admin Login" button on the login screen.
- **Default Password:** `admin` (Change this in `constants.tsx` before going live).
- **Capabilities:** Add new signals, close calls (Hit TP/SL), and delete records.

## ⚠️ Troubleshooting Rate Limits (Error 429)
If you see "Limit Reached" in the dashboard:
- The app is using the Gemini Free Tier which has a low request limit.
- The app will automatically "cool down" for 60 seconds when limits are hit.
- For production use, consider enabling billing at [Google AI Studio](https://aistudio.google.com/) for higher quotas.

## 📱 Features
- **Live Market Tracker:** NSE/BSE Index tracking via Google Search Grounding.
- **Push Notifications:** Instant alerts for new BUY/SELL signals.
- **AI Intelligence:** Automated market sentiment analysis.
- **Cloud Sync:** Firebase-backed real-time database for all clients.
