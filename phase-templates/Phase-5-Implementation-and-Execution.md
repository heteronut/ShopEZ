# Phase-Wise Template: Phase 5, Project Implementation and Execution

Project: ShopEZ: One-Stop Shop for Online Purchases
Student: Silman Ahsanul Qoul
Phase dates (from the LMS calendar): ____________________

## Objective

Execute the four flows the brief names for this phase, end to end, and
prove each one works: user authentication, all products, add to cart and
buy product, and order products.

## Flows executed and their results

1. User authentication. Register creates a customer and signs them in.
   Login rejects a wrong password with 401 and the form shows the server
   message. Logout clears the stored token and user, and protected pages
   redirect to login afterwards.
2. All products. The products page lists every seeded product, the home
   page shows the four highest discounts, and search, category, gender and
   sort controls each change the list in the way their labels promise.
3. Add to cart and buy product. A sized product cannot be added without a
   size, quantities above stock are refused with the remaining stock in
   the message, and Buy Now carries the item straight to the cart.
4. Order products. Placing an order with the cart from the tests produces
   a confirmation with a server computed final price, the bought items
   leave the stock count, the cart empties, and the order is visible in
   the customer profile and in the admin order list. Cancelling it in the
   admin area returns the stock and removes it from dashboard revenue.

## Verification evidence

- Automated: npm test on the server, 30 checks passed, 0 failed.
- Manual: the click-through behind the delivery gate report exercised
  these four flows in the browser. The demonstration video is recorded
  from docs/Demo-Video-Script.md, which performs the same flows on camera
  in the same order as this template.
- Build: npm run build on the client completes with no errors.

## Final deliverables prepared

1. Project code files: the ShopEZ folder (client, server, README,
   DESIGN.md).
2. Project documentation: docs/ShopEZ-Project-Documentation.md.
3. Phase-wise templates: this folder, phases 1 to 5.
4. Demonstration video: recorded from docs/Demo-Video-Script.md.

## Known limitations carried into the submission

- Payments are recorded as a method choice only; no gateway is connected
  and no card data is collected.
- Product photos are labelled placeholders because none were supplied.
- The catalog is seed data written for this project.
