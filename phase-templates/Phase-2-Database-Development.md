# Phase-Wise Template: Phase 2, Database Development

Project: ShopEZ: One-Stop Shop for Online Purchases
Student: Silman Ahsanul Qoul
Phase dates (from the LMS calendar): ____________________

## Objective

Connect the server to MongoDB through Mongoose and define the five schemas
the brief names: User, Product, Orders, Cart and Admin.

## Work completed

- Installed Mongoose and wrote config/db.js, which reads the connection
  string from the DRIVER_LINK environment variable and fails with a clear
  message when it is missing.
- models/User.js: username, email (unique, validated), password (hashed
  with bcrypt before saving), usertype (customer or admin).
- models/Product.js: title, description, price, discount, category (the
  five categories from the brief), gender, sizes, carousel, stock, and an
  embedded reviews array from which rating and numReviews are maintained.
- models/Cart.js: one cart per user, items carrying productId, title,
  description, size, quantity, price and discount.
- models/Order.js: buyer and delivery fields from the brief's ER sketch
  (name, email, mobile, address, pincode), the items array, the four price
  totals, paymentMethod, status, orderDate and deliveryDate.
- models/Admin.js: one configuration document holding banner and
  categories.
- Wrote the seed script (server/seed.js) and the sample catalog
  (server/data/products.js): 13 products across the five categories, one
  admin account and one demo customer account.

## Output produced

- Five Mongoose models with validation rules in server/models
- A repeatable seed that rebuilds a clean demonstration database

## Verification evidence

- The API test connects through the same config/db.js used in production
  mode, creates documents in every collection, and reads them back.
- Unique email is enforced by the database: the test registers a duplicate
  email and receives a 400 response.

## Issues faced and how they were resolved

- The brief's ER sketch stores one product per order row, which conflicts
  with checking out a whole cart under one payment. Resolved by storing
  the items as an array inside the order with the same field names, and
  documenting the deviation and its reason in the project documentation.

## Next phase

Phase 3 builds the backend: routes, controllers, authentication and error
handling on top of these models.
