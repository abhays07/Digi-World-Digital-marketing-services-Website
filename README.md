# Digi-World Promotions - Enterprise Platform

## 🏗 System Architecture

This application has been refactored to follow "Standard-of-Excellence" architectural principles, ensuring high scalability, maintainability, and performance.

### **Frontend Architecture (React + Vite + TypeScript)**

The frontend implements a **Service-Oriented Architecture** (SOA) on the client side to decouple business logic from UI components.

```
/src
  ├── /api            # (Deprecated) Legacy Aggregator
  ├── /components     # Atomic UI Components
  │     ├── /charts   # Advanced Visualization (HybridGraph)
  │     └── ...
  ├── /pages          # Route Views
  ├── /services       # Business Logic Layer (The "Brain")
  │     ├── auth.service.ts       # Authentication
  │     ├── analytics.service.ts  # Dashboard Data
  │     ├── finance.service.ts    # Financial Operations
  │     └── httpClient.ts         # Centralized Axios Instance (Interceptors)
  ├── /theme          # Design System
  └── App.tsx         # Root Orchestrator
```

### **Backend Architecture (Node.js + Express + MongoDB)**

The backend utilizes modular routing and middleware for security and performance.

- **Security:** `Helmet` (Headers), `RateLimit` (DDOS protection), `JWT` (Stateless Auth).
- **Performance:** `Compression` (Gzip), Indexed MongoDB Queries.
- **Middleware:** Centralized `authMiddleware` for consistent protection.

---

## 🚀 Migration Report & Optimizations

**Executive Summary:**
Refactored the monolithic `api.ts` into granular services and implemented elite-standard data visualization.

**1. Architectural Integrity**
- **Refactor:** Migrated usage of `api.ts` to `auth.service`, `analytics.service`, etc.
- **Design Pattern:** Implemented the **Service Repository Pattern** for API interaction.
- **Standardization:** Enforced strict typing and centralized HTTP error handling (Interceptors).

**2. Advanced Visualization**
- **New Component:** `HybridGraph.tsx` created for high-fidelity financial tracking.
- **Features:** Dual-axis (Revenue vs Expense), Custom Tooltips with "Glassmorphism" UI, Animations.
- **Performance:** optimized re-renders using `Recharts` responsive containers.

**3. Security & Performance**
- **Backend:** Added `helmet`, `compression`, and `express-rate-limit`.
- **Frontend:** Implemented Auto-Redirect on 401 Unauthorized via Interceptors (Stealth Mode).

---

## 🛠 Setup & Run

### Prerequisites
- Node.js v16+
- MongoDB Local or Atlas

### Running Locally

1. **Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Accessing the System
- **Public:** `http://localhost:5173/`
- **Admin Portal (Hidden):** `http://localhost:5173/#/admin-portal-secure-access`
  - *Note:* The admin login is hidden from the public navigation.

---

## 🎨 Theme System

**Brand Palette (Strict Enforcement):**
- **Primary:** `brand-blue` (#0EA5E9)
- **Secondary:** `brand-pink` (#EC4899)
- **Accent:** `brand-orange` (#F59E0B)
- **Background:** `brand-dark` (#0B1121)

All components subscribe to the "0-pixel overflow" policy for mobile responsiveness.
