# API reference (v1)

Base URL: `/api/v1`; JSON responses use `{ success, data, message }` and errors use `{ success:false, message, details? }`.

## Public
- `GET /health` service readiness
- `GET /products` supports `q`, `category`, `sort`, `page`, `limit`, `minPrice`, `maxPrice`, `featured`
- `GET /products/:id`, `GET /categories`, `GET /settings/public`
- `POST /newsletter` stores a normalized email subscription
- `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`

## Customer (authenticated)
- `GET /cart`, `PUT /cart` replace cart items by `{items:[{productId,quantity}]}`
- `GET/POST /addresses`, `PATCH/DELETE /addresses/:id`
- `GET /wishlist`, `PUT /wishlist` replace saved IDs by `{productIds:[...]}`
- `POST /coupons/validate` validates `{code,subtotal}`; `POST /orders` creates a COD order using server-side prices and current stock, with optional `couponCode`
- `GET /orders`, `GET /orders/:id`
- `GET /products/:id/reviews`, `POST /products/:id/reviews` (requires a delivered order containing that product)
- `GET /notifications`, `PATCH /notifications/:id/read`; Socket.IO event `notification:new` is delivered to the authenticated user's room

## Admin (role-gated)
- `GET/POST /admin/products`, `PATCH/DELETE /admin/products/:id`
- `GET /admin/orders`, `PATCH /admin/orders/:id/status`
- `GET /admin/overview?from=ISO&to=ISO`
- `GET/PATCH /admin/settings` (patch body: `{settings:{...}}`)
- `GET/POST /admin/categories`, `PATCH/DELETE /admin/categories/:id`
- `POST /admin/inventory/:productId/adjust`, `GET /admin/inventory/history`
- `GET/POST /admin/coupons`, `PATCH /admin/coupons/:id`
- `GET /admin/reviews`, `PATCH /admin/reviews/:id` with `{action:"approve"|"reject"}`
- `GET /admin/reports/sales.csv?from=ISO&to=ISO`

The first super-admin is provisioned directly by an operator in MongoDB. This prevents public self-registration from granting administrative privileges. COD is the only enabled payment method until a verified payment provider is configured. Coupon preview accepts a subtotal for customer feedback; the order endpoint recalculates the subtotal from catalog prices before applying the coupon.
