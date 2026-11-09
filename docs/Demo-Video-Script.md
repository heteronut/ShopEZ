# ShopEZ Demonstration Video Script

Target length: about 5 minutes. Record the laptop screen at 1080p with the
browser at full width, then repeat the visit at a phone-width window for the
last scene. Before recording, start both parts of the app:

- Terminal 1, in server/: `npm run dev:memory` (or `npm start` if .env
  points at a real MongoDB that has been seeded)
- Terminal 2, in client/: `npm run dev`
- Browser tab 1: http://localhost:5173

## Scene 1, the storefront (about 40 seconds)

Show the home page. Point at the admin banner, the five category buttons and
the highest discount row. Say: the discounts and order on this page come
from the database sorted by the discount stored on each product, and the
banner text is written by the admin, not hard coded.

## Scene 2, finding a product (about 50 seconds)

Open Products. Search for "headphones", clear it, filter Category to
Fashion, sort by Price low to high, and open the men's cotton shirt. Point
at the MRP, the struck-through price, the discount percent, the selling
price and the stock count. Choose size M, quantity 2.

## Scene 3, account and cart (about 60 seconds)

Click Buy Now. You are redirected to Login, which is the route protection
working. Log in as customer@shopez.in / customer123. Add the shirt again if
the cart is empty, open Cart, and read the price details panel out loud:
Total MRP, Discount, Delivery (free, because the discounted total passes
999 rupees), Final Price. Show that quantity can be changed and the panel
updates.

## Scene 4, placing the order (about 60 seconds)

Fill the delivery form with a 10 digit mobile and a 6 digit pincode. First
submit once with a short mobile number to show the server error appearing
in the form, then correct it, choose UPI, and place the order. Show the
confirmation with the order id and the delivery date, then open Profile and
show the same order listed there.

## Scene 5, writing a review (about 30 seconds)

Open the shirt again and save a review with a rating. Refresh and show the
rating summary change from "No reviews yet" to the real average. Try to
review it a second time and show the server refusing with a clear message.

## Scene 6, the admin side (about 70 seconds)

Log out, log in as admin@shopez.in / admin123. On the dashboard, point at
revenue and show that it equals the order placed in Scene 4. Open All
Orders, move that order to Shipped. Open All Products, edit the shirt stock
down to 4, return to the dashboard and show it in the low stock list.
Create one new product with the New Product form and show it appear in the
storefront list.

## Scene 7, phone width (about 30 seconds)

Shrink the browser to a phone width. Show the navigation collapsing into
its menu button, the product grid stacking into one column and the cart
keeping its price panel readable. End the recording on the home page.

## Closing line for the narration

ShopEZ covers the full path in the brief: authentication, catalog,
cart, checkout with server-checked prices, order history, and an admin
dashboard whose figures come from the same database the customers used.
