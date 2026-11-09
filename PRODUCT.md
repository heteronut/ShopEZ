# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Customers in India use ShopEZ to discover products, compare prices and reviews,
manage a cart, and place orders. A store administrator manages products,
inventory, orders, and store performance.

## Product Purpose

ShopEZ is a working e-commerce capstone application for browsing a product
catalog and completing a customer order, with an admin area for managing the
same catalog and orders.

## Positioning

The customer and admin experiences share product and order data. Product
discounts are calculated consistently by the client and server, customer
reviews come from registered users, and dashboard figures are calculated from
orders in the database.

## Operating Context

Customers browse five product categories, filter and sort the catalog, inspect
product details and reviews, add items to a cart, provide delivery details,
choose a recorded payment method, and review their orders. Administrators sign
in to review sales and low-stock figures, edit products, and update order
delivery statuses.

## Capabilities and Constraints

- The application uses MongoDB, Express, React with Vite, and Node.js; the
  client uses React Router, Axios, and Bootstrap.
- Prices are displayed in Indian rupees. Delivery is free for orders of at
  least 999 rupees after discount.
- Checkout records Cash on Delivery, UPI, or Card as a payment method. No
  payment gateway or card-number collection is implemented.
- The catalog contains 13 sample products. Reviews start empty and are written
  by registered users.
- Product imagery is illustrative third-party photography, not exact product
  photography; the storefront labels it accordingly.
- Authentication distinguishes customers from administrators.

## Evidence on Hand

- Project behavior and constraints: [docs/ShopEZ-Project-Documentation.md](docs/ShopEZ-Project-Documentation.md)
- Sample product data: [server/data/products.js](server/data/products.js)
- Product content and accounts are demonstration data, not evidence of a
  production store. No official product photography, testimonials, or payment
  provider are supplied.

## Product Principles

- Make product information, discounts, delivery costs, and final prices easy to
  verify.
- Preserve the same price and stock rules from cart through order placement.
- Never present invented customer reviews or store performance as real.
- Keep customer shopping and administrator operations distinct while using the
  same underlying catalog and order data.
