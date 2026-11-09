# ShopEZ: One-Stop Shop for Online Purchases

Capstone project for the MERN Full-Stack LM C3 class (NASSCOM Future Skills),
submitted by Silman Ahsanul Qoul. ShopEZ is a small working e-commerce store:
customers register, browse a product catalog with filters, add products to a
cart, check out with a delivery address and payment method, and see their
orders in their profile. An admin manages the catalog and every order from a
dashboard whose figures are calculated from the database at request time.

## Tech stack

- MongoDB with Mongoose (database, schemas in server/models)
- Express.js on Node.js (REST API, MVC layout in server/)
- React built with Vite, React Router, Axios and Bootstrap (client/)
- JWT authentication with bcrypt password hashing

## Project layout

```
client/   React app (pages: Landing, Products, Product Detail, Login,
          Register, Cart, Profile, Admin Dashboard, All Orders,
          All Products, New Product)
server/   Express API (config, models, controllers, routes, middleware,
          utils, data, test)
docs/     Project documentation (deliverable 2)
phase-templates/  Phase-wise templates, weeks 1 to 5 (deliverable 3)
DESIGN.md Design direction and the reason for each visual decision
```

## Run ShopEZ on Windows

1. Install Node.js 18 or newer. If the `node_modules` folders are missing,
   run `npm install` once in each of `server` and `client`.
2. Double-click `ShopEZ.exe` in the project folder. It starts the local demo
   database, API, and website, then opens the store in your default browser.
3. Keep the ShopEZ launcher open while using the store. Select **Stop and
   close**, or close the launcher window, to stop its services cleanly.

The first launch needs an internet connection to download the temporary
MongoDB demo binary. Demo data is held in memory and resets when ShopEZ closes.
The launcher only binds to this computer and will not stop another application
if ports 3001 or 5173 are already in use. If both services are already serving
ShopEZ locally, the launcher reuses them and leaves them running when it closes.
Runtime logs are saved under `%LOCALAPPDATA%\ShopEZ\logs`.

The executable launches the project files next to it; keep the `client` and
`server` folders with `ShopEZ.exe`. To rebuild it after changing the launcher,
run `powershell -ExecutionPolicy Bypass -File .\build-launcher.ps1`.

## Run it manually

You need Node.js 18 or newer and a MongoDB connection string (a local
MongoDB, MongoDB Compass, or a MongoDB Atlas cluster all work).

1. Server:
   ```
   cd server
   copy .env.example .env      (Windows)   or: cp .env.example .env
   ```
   Edit server/.env and set DRIVER_LINK to your MongoDB connection string
   and JWT_SECRET to any long random string. Then:
   ```
   npm install
   npm run seed     (loads 13 sample products and two demo accounts)
   npm start        (API on http://localhost:3001)
   ```
2. Client, in a second terminal:
   ```
   cd client
   npm install
   npm run dev      (store on http://localhost:5173)
   ```

No MongoDB installed? Use the in-memory demo runner instead of the two
server commands above. It starts a temporary MongoDB, seeds it, and serves
the API until you stop it. Data is lost when it stops:

```
cd server
npm install
npm run dev:memory
```

Demo accounts created by the seed script:

- Admin: admin@shopez.in / admin123
- Customer: customer@shopez.in / customer123

## Test it

The server has an end-to-end API test that needs no MongoDB installation. It
starts an in-memory MongoDB, seeds it, and walks the whole buying flow:
registration, login, filtering, cart rules, placing an order, stock changes,
reviews, admin figures and role checks.

```
cd server
npm test
```

## Honest notes

- The 13 products are sample seed data written for this project, in
  server/data/products.js. They are not copied from a real store.
- Product photos are illustrative third-party photography, not exact product
  images; the storefront labels them accordingly.
- Payment is recorded as a method (Cash on Delivery, UPI or Card). No real
  payment gateway is connected, and the app never asks for card numbers.
- Reviews start empty on purpose. The first review on every product is
  written by a real registered user of the running app.
