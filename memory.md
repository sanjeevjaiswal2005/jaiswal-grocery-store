# Project memory
- Stack: Express+Mongoose backend (backend/src: config,controllers,middlewares,models,routes,services,sockets,utils,validators,scripts), React+Vite frontend (frontend/src: app, features/*, shared). Run: `npm run dev` at root (API :5000, web :5173).
- DB: Atlas via backend/.env MONGODB_URI (Atlas IP allowlist required). Do not run `npm run seed` without confirming (may wipe data).
- Pagination: client-side `usePage(list,size,resetKey)` + `Pager` in ui.jsx; `/products` API also supports page/limit.

# Build log
- 2026-11-04: Added pagination to Shop (12/pg), Account orders (5), Admin products/orders (10), Product/Category/Inventory/Coupon/Review managers. Build passes.
- 2026-11-13: Fixed dead mobile hamburger (Header in ui.jsx now toggles .mobile-nav dropdown; styles appended to style.css). Roles: admin and super-admin share same /admin panel/permissions (backend/src/app.js); role is set in MongoDB users.role.
- 2026-11-13: Mobile menu now a right-side slide-in drawer (framer-motion) with overlay.
- 2026-11-13: Shop category sidebar stays vertical/left on phone (72px, sticky) instead of horizontal chips; override at end of style.css.
- 2026-11-13: Restructured for GitHub/Vercel + multi-dev work. Backend split into domain controllers/routes/models/middlewares (46 routes preserved, seed moved to src/scripts/seed.js). Frontend ui.jsx split into app/, features/*, shared/. Added frontend/vercel.json (SPA rewrite). Verified: vite build ok, ESLint no-undef 0 errors over 92 files, API endpoints respond. Pre-refactor backup: Desktop/jaiswal-backup. Note: backend is a long-running Express+socket.io server, so deploy it on Render/Railway (Vercel is fine for frontend only).
- 2026-11-13: Pushed to https://github.com/sanjeevjaiswal2005/jaiswal-grocery-store (public, branch main). gh CLI has accounts sanjeevjaiswal2005 (active) and techinfinitydevelopers.
