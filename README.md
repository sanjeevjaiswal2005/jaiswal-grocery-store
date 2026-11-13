# Jaiswal Grocery Store

A full-stack grocery commerce starter with a React/Vite storefront, an Express API, MongoDB persistence, secure cookie-based authentication, server-priced orders, inventory checks, and an admin workspace.

## Run locally

1. Install Node.js 20+ and MongoDB 7+ (local MongoDB or Atlas).
2. Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI` and a long `JWT_SECRET`.
3. From this directory run `npm install`, `npm --prefix backend install`, and `npm --prefix frontend install`, then `npm run dev`.
4. Open `http://localhost:5173`. API health: `http://localhost:5000/api/v1/health`.
5. Populate the starter editable catalog once with `npm --prefix backend run seed`.
6. Register a user. Promote the first account to `super-admin` directly in MongoDB (`db.users.updateOne({email:"..."},{$set:{role:"super-admin"}})`) before using `/admin`.

No catalog records or sales metrics are fabricated. Add the store's real products in the admin catalog; dashboard values are computed from persisted orders and inventory. MongoDB transactions are not required for stock reservation: each item uses an atomic conditional update before the order is persisted and the reservation is restored if order creation fails.

## Project map

- `frontend/`: responsive customer storefront, cart, checkout, order history, and role-gated admin pages.
- `backend/src/`: Express API, Mongoose models, auth/security middleware, controllers, and REST routes.
- `API.md`: endpoint and integration reference.

The starter seed adds 95 editable grocery products across 13 categories, including kirana staples, bakery and biscuit brands, chocolates, Coca-Cola portfolio drinks, Amul and Gokul milk, instant foods, spices, cleaning supplies, and personal care. Cadbury Dairy Milk has sample ₹10, ₹20, ₹30, and ₹35 price-point listings plus a Cadbury Celebrations gift pack. Starter prices and stock levels are editable in the admin catalog and should be checked against the store's local supplier rates. The seed is idempotent and only inserts missing records, so rerunning it preserves later catalog edits. The working flows include catalog browsing, search and sorting, registration and sign-in, guest and customer carts, wishlist, coupon discounts on COD checkout, saved-address APIs, order history and status timeline, persisted notifications with authenticated Socket.IO delivery, admin product editing and category/order management, inventory adjustments and history, coupon creation, review moderation, store settings, dashboard analytics, and CSV sales export. Address management and customer review submission are API-first. Online payment is modeled but intentionally disabled until a real provider can be configured and verified.

## Configuration

See `backend/.env.example`. Razorpay, Cloudinary, and SMTP credentials are optional. Online payment is deliberately unavailable until server-side order creation and signature verification credentials are configured. Never set an online order to paid from a browser callback alone.

## Production notes

Use HTTPS, a strong unique JWT secret, a production MongoDB deployment, restrictive `CLIENT_ORIGIN`, secure cookies, and an external image store before launch. Configure the first super-admin out of band. Configure and verify a payment provider before accepting online payments; the included checkout deliberately offers COD only. Review applicable tax, consumer, privacy, and payment requirements for the store's operating region.

## Project structure

```
backend/src
  config/        db connection, role groups
  controllers/   request handlers, one file per domain
  middlewares/   auth, validation, rate limit, error handling
  models/        one Mongoose model per file (index.js re-exports all)
  routes/        one router per domain, mounted in routes/index.js at /api/v1
  services/      reusable business logic (e.g. coupon rules)
  sockets/       socket.io server
  utils/         asyncHandler, response helpers
  validators/    zod schemas
  scripts/seed.js
  app.js, server.js

frontend/src
  app/           App.jsx, app.routes.jsx, app.store.js, index.css
  features/      home, shop, product, auth, cart, checkout, account, wishlist, admin (pages/ + components/)
  shared/        components, hooks, services (api client), utils
  main.jsx
```

Contributing: add new code to the matching feature/domain folder; keep one component, controller or route file per concern.
