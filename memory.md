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
- 2026-11-13: Deployed on Vercel: web https://jaiswal-grocery-store.vercel.app (proxies /api/v1 to API), api https://jaiswal-grocery-api.vercel.app (backend/api/index.js serverless). No socket.io on Vercel. Atlas must allow 0.0.0.0/0. Backend env vars set in Vercel (MONGODB_URI, JWT_SECRET etc.).
- 2026-11-13: Replaced broken Unsplash images for categories snacks-drinks and cold-drinks (DB + seed.js).
- 2026-11-13: UI/UX pass: font floor 11px (was 7px), --muted contrast darkened, :focus-visible, 16px mobile inputs, mobile announcement fix; fixed 10 dead product image URLs in DB. Redeployed web to Vercel.
- 2026-11-16: Typography bump in frontend/src/app/index.css: font px 11→13, 12→14, 13→15, 14→16, 15→16.5, 16→17, 17–19 +1, ≥20 ×1.06 (font-size and font shorthand). Build passes.
- 2026-11-16: Landing page refresh: hero search bar (→/shop?q=) + popular category chips + star rating, taller hero, card-style benefits, larger section heads/category cards, responsive overrides appended to index.css ("Landing page refresh"); Home.jsx hero edited. Build passes; not visually verified in browser.
- 2026-11-16: Landing below-fold: added How-it-works section, image headers on promise cards, dark gradient newsletter (Home.jsx + index.css 'Below-the-fold visuals'). Build passes.
- 2026-11-16: Added GitHub Actions CI/CD (.github/workflows/ci-cd.yml): CI on PR/push, Vercel prod deploy of backend+frontend on main. Needs repo secret VERCEL_TOKEN. Not yet pushed/tested.
- 2026-11-16: Admin order notifications: bell+dropdown in admin topbar (frontend/src/features/admin/components/AdminNotifications.jsx), polls /notifications every 15s (works on Vercel w/o sockets), beep+toast on new order, mark read / mark all (PATCH /notifications/read-all added), click opens Orders tab. Backend already created audience:'admin' notification in createOrder.
