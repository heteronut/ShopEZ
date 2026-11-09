# Phase-Wise Template: Phase 3, Backend Development

Project: ShopEZ: One-Stop Shop for Online Purchases
Student: Silman Ahsanul Qoul
Phase dates (from the LMS calendar): ____________________

## Objective

Build the Express API: an index.js server with body-parser and cors, a
MongoDB connection, separate route files for authentication, users,
products, cart, orders and admin, JWT based route protection, admin
authorisation, and error handling middleware that returns a message and an
HTTP status code for every failure.

## Work completed

- index.js wires cors, body-parser and the six route groups under /api,
  then the notFound and errorHandler middleware.
- Auth: register, login and logout with bcrypt password checks and JWT
  tokens (utils/generateToken.js). Registration never accepts a usertype
  from the request, so admin accounts can only come from the seed.
- Products: listing with search, category and gender filters and four sort
  orders, single product, admin create, update and delete, and a review
  endpoint that rejects a second review from the same user.
- Cart: add with size and stock validation, quantity update, removal.
- Orders: placement that reloads prices from the database and recomputes
  totals through utils/pricing.js, own order history, admin order list,
  and status updates where cancelling returns items to stock once.
- Admin: store configuration (banner, categories) and a summary endpoint
  running MongoDB aggregations for revenue, items sold and sales by
  category.
- utils/pricing.js holds the only copy of the money rules: discounted unit
  price rounded to whole rupees, free delivery from 999 rupees of
  discounted items, otherwise 49 rupees.

## Output produced

- Complete REST API (routes listed in docs/ShopEZ-Project-Documentation.md)
- server/test/api.test.js, an end-to-end test of the whole flow

## Verification evidence

- npm test reports 30 checks passed and 0 failed, including a basket whose
  expected final price of 1196 rupees is computed by hand in the test
  comments and matched against the server's answer.
- Protected routes return 401 without a token and admin routes return 403
  for customers, both asserted by the test.

## Issues faced and how they were resolved

- Client supplied prices cannot be trusted, so the order controller
  ignores cart prices for totals and reloads each product. This makes the
  checkout slightly slower and the totals always reconcilable.

## Next phase

Phase 4 builds the React frontend against these endpoints.
