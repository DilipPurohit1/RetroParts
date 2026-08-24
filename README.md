# RetroParts — Specialized Vintage & Rare Vehicle Parts Marketplace

> **"Rare Parts. Timeless Rides."**

RetroParts is a production-grade full-stack MERN application engineered specifically for discovering, buying, selling, and requesting rare, vintage, discontinued, and hard-to-find car and motorcycle spare parts across India.

Unlike generic classifieds platforms, RetroParts is structured entirely around **Vehicle Make → Model → Year → Variant → Compatibility → Part**, solving the fundamental problem of vehicle fitment uncertainty.

---

## 🚀 Key Architectural Features

1. **4-Tier Automotive Fitment Engine**:
   - Every spare part is indexed against explicit vehicle compatibility matrices (`compatibleVehicles`).
   - Live fitment badges: `✓ Direct OEM Match` (Green), `⚠ Cross-Compatible Fitment` (Amber), `✕ Incompatible` (Red), `? Unknown` (Slate).
   - Persistent **"My Vehicle"** garage context in browser `localStorage`.
2. **Synchronous Match-on-Create Bounties**:
   - Enthusiasts post requests for unavailable parts on the community wanted board.
   - When a seller publishes a matching component, the system immediately dispatches an alert notification to the buyer with a 1-click buy link.
3. **Seller Quoting & Bidding Console**:
   - Sellers can review community bounties and submit direct custom quotes (*"I Have This Part"* with price, condition, delivery timeframe, and provenance notes).
4. **Dual Authentication & Role-Based Access Control**:
   - Email/password with bcrypt hashing + Google OAuth 2.0 via Passport.js.
   - Account linking: matching emails automatically link local and Google credentials.
   - Dual-token JWT pattern (15-minute access token + 7-day `httpOnly`, secure refresh cookie) with automatic client retry interceptor.
5. **Real Physical Component Photography**:
   - 100% genuine component photography in `aspect-[4/3]` clean containers with SVG fallback badges.
6. **Order Escrow Protection & Tracking**:
   - Milestone tracking step visualizer (`placed` → `confirmed` → `dispatched` → `in_transit` → `delivered` → `completed`).
7. **Post-Order Reviews**:
   - Reviews are strictly gated on delivered/completed orders to prevent fake feedback.
8. **Admin Console & Verification Queue**:
   - Platform metrics, user directory, moderation queue, and seller verification review.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18 (Vite), React Router v6, Tailwind CSS, TanStack React Query v5, Axios, Socket.io-client, Lucide Icons |
| **Backend** | Node.js, Express.js (ESM), Mongoose ODM, Passport.js (`passport-google-oauth20`), Socket.io server, Multer, Cloudinary |
| **Database** | MongoDB (Atlas connection string or embedded `MongoMemoryServer` zero-config local launch) |
| **Security** | Helmet, CORS allow-list, express-rate-limit, cookie-parser, centralized error handler |

---

## 💻 Local Development Setup

### 1. Prerequisites
- Node.js (v18.x or v20.x+)
- npm (v9.x+)

### 2. Clone and Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-username/retroparts.git
cd retroparts

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `server/.env`:
```bash
cp server/.env.example server/.env
```

Review the variables in `server/.env`:
```env
PORT=5000
NODE_ENV=development

# MongoDB Connection String (Leave blank for zero-config embedded MongoMemoryServer)
MONGODB_URI=mongodb://localhost:27017/retroparts

# JWT Authentication Secrets
JWT_ACCESS_SECRET=your_jwt_access_secret_key_minimum_32_characters
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_minimum_32_characters

# Google OAuth 2.0 Credentials (From Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id_from_gcp_console.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_from_gcp_console
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Cloudinary Media Storage (Optional: Falls back to local uploads/ directory)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# URLs & CORS Allow-List
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
```

### 4. Start Backend Server
```bash
cd server
npm run dev
```
*Backend runs on `http://localhost:5000` (Health check: `http://localhost:5000/api/health`)*

### 5. Start Frontend Client
```bash
cd client
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 🔑 Google Cloud Console OAuth 2.0 Setup Guide

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing project (e.g. `RetroParts-Marketplace`).
3. Navigate to **APIs & Services** → **OAuth consent screen**:
   - Select **External** user type.
   - Enter App name (`RetroParts`), user support email, and developer contact email.
   - Under **Scopes**, add `.../auth/userinfo.email` and `.../auth/userinfo.profile`.
4. Navigate to **Credentials** → **Create Credentials** → **OAuth client ID**:
   - Application type: **Web application**.
   - Name: `RetroParts Web Client`.
   - **Authorized JavaScript origins**:
     - `http://localhost:5173`
     - `http://localhost:5000`
   - **Authorized redirect URIs**:
     - `http://localhost:5000/api/v1/auth/google/callback`
     - `http://localhost:5000/api/auth/google/callback`
5. Copy the generated **Client ID** and **Client Secret** into your `server/.env` file.

---

## 💳 Mock Payment & Escrow Protection Notice

> [!NOTE]
> In accordance with project requirements, payment processing is currently implemented as an **Escrow Vault Mock** that validates orders and simulates payment capture with buyer inspection protection.
> 
> In code, payment integration points are cleanly isolated and labeled with:
> `// TODO: Production payment gateway integration (Razorpay / Stripe)`

---

## 👥 Instant 1-Click Demo Accounts

| Role | Email | Password | Description |
|---|---|---|---|
| **Enthusiast (Buyer)** | `user@retroparts.com` | `password123` | Classic bike & car restorer with active wanted requests and garage vehicles. |
| **Specialist Seller** | `seller@retroparts.com` | `password123` | Verified seller with authentic stock of Yamaha, Honda, Maruti, and Bullet spares. |
| **Platform Admin** | `admin@retroparts.com` | `password123` | Administrator with verification queue approval, user moderation, and platform metrics. |

---

## 🌐 Deployment Instructions

### 1. MongoDB Database (MongoDB Atlas)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and allow network access from `0.0.0.0/0` (or your backend provider's IP range).
3. Copy the SRV connection string into `MONGODB_URI`.

### 2. Backend Deployment (Render / Railway / Fly.io)
1. Connect your GitHub repository.
2. Set Root Directory to `server`.
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Add Environment Variables from your `server/.env`.

### 3. Frontend Deployment (Vercel / Netlify)
1. Connect your GitHub repository.
2. Set Root Directory to `client`.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Configure Rewrite Rule in `vercel.json` or `_redirects` for client-side routing:
   ```json
   {
     "rewrites": [
       { "source": "/api/(.*)", "destination": "https://your-backend.onrender.com/api/$1" },
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

---

## 🧪 Automated Test Suites

```bash
# Run Phase 0 & 1 Auth & Scaffolding Tests
node server/test_auth.js

# Run Phase 2 Vehicles & Listings Core Tests
node server/test_phase2.js

# Run Phase 3 Search & Discovery Tests
node server/test_phase3.js

# Run Phase 4 Wanted Parts & Match-on-Create Tests
node server/test_phase4.js

# Run Phase 5 Real-Time Chat & Reviews Tests
node server/test_phase5.js

# Run Phase 6 Orders & Checkout Tests
node server/test_phase6.js

# Run Phase 7 Dashboards & Admin Tests
node server/test_phase7.js

# Run Master Full-Stack End-to-End Test
node server/test_e2e.js
```
