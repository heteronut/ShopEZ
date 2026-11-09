# ShopEZ Project Documentation

Capstone: ShopEZ: One-Stop Shop for Online Purchases
Course: Full Stack Development with MERN, LM C3 (NASSCOM Future Skills)
Student: Silman Ahsanul Qoul (team of one, leader)
Stack: MongoDB, Express.js, React (Vite), Node.js

## 1. Introduction

ShopEZ is a working e-commerce web application. A customer registers, browses
a catalog of products in five categories (Mobiles, Electronics,
Sports-Equipment, Fashion and Groceries), filters and sorts the catalog,
reads and writes product reviews, adds products to a cart, checks out with a
delivery address and a payment method, and receives an order confirmation
with a delivery date. An admin signs in to a dashboard that reports revenue,
orders, items sold, registered users and low stock from the live database,
manages the product catalog, and moves every order through its delivery
statuses.

The project follows the structure in the capstone brief: a client folder
(React with Vite, Axios, React Router and Bootstrap) and a server folder
(Node.js and Express with Mongoose, organised as models, controllers and
routes, the MVC pattern).

## 2. Problem statement and how this build answers it

The brief describes two sides of one problem. Customers meet complicated
interfaces, scattered product information, reviews they cannot trust, prices
whose discounts are unclear, and checkout flows they do not trust, so they
abandon purchases. Sellers meet weak order management, little sales insight
and poor inventory visibility.

This build answers with specific mechanisms, not slogans:

- One product page per item carrying the full description, the MRP, the
  discount percentage, the computed selling price, the stock count and the
  reviews, so the information a buyer needs is never scattered.
- A price details panel in the cart that separates Total MRP, Discount,
  Delivery and Final Price, using the same pricing function the server uses
  when the order is placed, so the number a customer sees is the number the
  server charges.
- Checkout validation on the server for the mobile number (10 digits), the
  pincode (6 digits) and the payment method, with the error returned to the
  form and shown next to it.
- Reviews that can only be written by a registered user, once per product.
  The seed data contains no reviews at all, so nothing in the store pretends
  to be customer opinion before a real customer writes it.
- An admin dashboard whose revenue, items sold, sales by category and low
  stock figures are MongoDB aggregations over real orders at request time.

## 3. Objectives from the brief, and where each one is met

1. User-friendly shopping platform: client/src/pages/HomePage.jsx and
   ProductsPage.jsx, with search, category and gender filters and four sort
   orders (popular, price low to high, price high to low, discount).
2. Detailed product information, reviews and discounts: ProductDetailPage.jsx
   and the reviews array on the Product model, added through
   POST /api/products/:id/reviews.
3. Secure checkout: JWT protected order route, bcrypt hashed passwords, and
   server-side recomputation of every price (server/utils/pricing.js).
   Payment is recorded as a method; no card data is collected anywhere.
4. Instant order confirmation: the cart page replaces its content with the
   confirmed order, its items, its final price and its delivery date, and
   the same order appears in the customer profile.
5. Seller dashboard for orders and inventory: AdminDashboardPage.jsx,
   AllOrdersPage.jsx and AllProductsPage.jsx, with stock counts and a low
   stock list (5 units or fewer).
6. Analytical tools for data-driven decisions: GET /api/admin/summary runs
   three aggregations (revenue, items sold, sales by category) over the
   Orders collection.
7. One solution for both sides: the same Product and Order collections serve
   the storefront and the admin area, separated only by role checks.

## 4. Software and hardware requirements

- Node.js 18 or newer and npm (developed and tested on Node.js 24)
- MongoDB: a local installation, MongoDB Atlas, or the in-memory runner
  described in the README for machines without MongoDB
- A modern browser (Chrome or Firefox, latest)
- Editor: Visual Studio Code
- Tools used while building: Postman style API checks were replaced by the
  automated test in server/test/api.test.js, and Git for version control

## 5. Architecture

The backend follows MVC. Routes (server/routes) receive requests and pass
them to controllers (server/controllers), which talk to Mongoose models
(server/models) and answer with JSON. Cross-cutting behaviour sits in
middleware (JWT protection, admin role check, error handler that always
returns a message and a status code) and utils (token signing and the single
pricing function).

Request flow for placing an order:

1. React sends POST /api/orders with the JWT and the delivery form.
2. The protect middleware verifies the token and loads the user.
3. orderController.placeOrder validates the form, reloads the cart, reloads
   every product from the database, rejects the order if any quantity is
   above stock, recomputes the totals with utils/pricing.js, saves the
   order, decrements stock and clears the cart.
4. The client shows the confirmation returned by the server.

## 6. Data model (ER summary)

- User: username, email (unique), password (hashed), usertype
  (customer or admin)
- Product: title, description, price (MRP), discount (percent), category,
  gender, sizes, carousel, stock, reviews (userId, username, rating,
  comment), rating, numReviews
- Cart: userId (unique), items (productId, title, description, size,
  quantity, price, discount)
- Order: userId, name, email, mobile, address, pincode, items (same shape
  as cart items), totalMrp, discountAmount, deliveryFee, finalPrice,
  paymentMethod, status, orderDate, deliveryDate
- Admin: banner, categories (one configuration document for the store)

Relationships: one User owns one Cart and many Orders. An Order holds many
items, and each item references one Product.

One deliberate deviation from the brief's flat ER sketch: the brief lists an
order as a single product row. This build stores the items as an array
inside the order, with the same field names, because one checkout in ShopEZ
covers the whole cart. A one-row-per-item model would split one payment
into several orders and make the price details panel impossible to
reconcile.

Pricing rules (server/utils/pricing.js, the only place they exist):
discounted unit price = MRP minus discount percent, rounded to whole
rupees. Delivery is free when the discounted items total reaches 999
rupees, otherwise a flat 49 rupees is added.

## 7. API reference

| Method | Route | Access | Purpose |
| --- | --- | --- | --- |
| POST | /api/auth/register | Public | Create a customer account |
| POST | /api/auth/login | Public | Sign in, returns a JWT |
| POST | /api/auth/logout | Logged in | Ends the client session |
| GET | /api/users/profile | Logged in | Read own profile |
| PUT | /api/users/profile | Logged in | Update own username |
| GET | /api/products | Public | List products with search, filters, sort |
| GET | /api/products/:id | Public | One product with its reviews |
| POST | /api/products | Admin | Add a product |
| PUT | /api/products/:id | Admin | Edit a product |
| DELETE | /api/products/:id | Admin | Delete a product |
| POST | /api/products/:id/reviews | Logged in | Add one review per user |
| GET | /api/cart | Logged in | Read own cart |
| POST | /api/cart | Logged in | Add an item (size and stock checked) |
| PUT | /api/cart | Logged in | Change a quantity (0 removes it) |
| DELETE | /api/cart/:productId | Logged in | Remove one item |
| POST | /api/orders | Logged in | Place an order for the whole cart |
| GET | /api/orders/mine | Logged in | Own order history |
| GET | /api/orders | Admin | Every order |
| PATCH | /api/orders/:id/status | Admin | Move or cancel an order |
| GET | /api/admin/config | Public | Banner and categories |
| PUT | /api/admin/config | Admin | Update the banner |
| GET | /api/admin/summary | Admin | Revenue, counts, sales by category, low stock |

## 8. User flow

Register, then log in, then browse products, then open a product, choose a
size where the product has sizes, then add to cart or buy now, then review
the cart and its price details, then submit the delivery and payment form,
then read the confirmation, then track the order in the profile. The admin
flow is: log in as admin, read the dashboard, manage products under All
Products, and update order statuses under All Orders.

## 9. Testing

server/test/api.test.js is an end-to-end test of the API. It boots an
in-memory MongoDB, seeds the catalog, and makes real HTTP calls. It was run on the student's laptop (Windows 11, Node.js 24) and in the
development environment, and both runs report 30 checks passed and 0
failed, covering:
registration and duplicate email rejection, wrong password rejection,
profile protection, product listing with every seeded product, category
filter and price sorting correctness, search, the size requirement, stock
limits on the cart, server-side recomputation of an order total (a known
basket whose expected total of 1196 rupees is worked out in the test
comments), stock decrement after ordering, cart clearing, mobile number
validation, one review per user, customer rejection from admin routes with
403, admin revenue matching the placed order to the rupee, cancellation
restocking the product, and admin product creation and deletion.

The client is verified with a production build (npm run build) and by
clicking through every page against the running server. The delivery gate
report for the interface is kept with the project delivery notes.

## 10. Limitations, stated plainly

- No payment gateway is integrated. The payment method is stored with the
  order and no card details are requested, stored or transmitted.
- Product images are labelled placeholder panels, because no product
  photography was supplied with the brief.
- The catalog ships as seed data written for this project
  (server/data/products.js), not as live merchant inventory.
- Password reset and email notifications are out of scope for this
  capstone's page list and are not implemented.
