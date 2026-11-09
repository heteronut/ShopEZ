# Phase-Wise Template: Phase 4, Frontend Development

Project: ShopEZ: One-Stop Shop for Online Purchases
Student: Silman Ahsanul Qoul
Phase dates (from the LMS calendar): ____________________

## Objective

Build the React client in the client folder: the pages the brief requires
(Landing, Products, Authentication, User Profile, Cart, Admin Dashboard,
All Orders, All Products), routing between them, Bootstrap styling, and
binding of every page to the API through Axios.

## Work completed

- React Router routes for /, /products, /products/:id, /login, /register,
  /cart, /profile, /admin, /admin/orders, /admin/products,
  /admin/products/new and /admin/products/:id/edit. Cart and profile are
  behind a login guard, admin pages behind an admin guard.
- AuthContext stores the JWT and user; CartContext keeps the cart count in
  the navbar truthful on every page.
- The Axios instance attaches the token to every request and a helper
  turns server error messages into the text shown in forms.
- Products page filters write to the URL query string, so a filtered view
  can be linked and the home page category buttons land on real filtered
  lists.
- The cart page carries the price details panel (Total MRP, Discount,
  Delivery, Final Price) computed by the same rules as the server, plus
  the delivery and payment form.
- Every data page implements loading, empty and error states. There are no
  buttons or links without a working action, and the navigation only lists
  pages that exist.
- Styling follows DESIGN.md: Bootstrap with a market green primary, amber
  reserved for discounts and focus, small consistent radii, labelled
  placeholder panels where a product photo would go.

## Output produced

- Complete client application in client/src (pages, components, context,
  api, utils)

## Verification evidence

- npm run build completes a production build with no errors.
- Each page was opened against the running server and its controls
  exercised; the results are recorded in the delivery gate report that
  accompanies the submission.

## Design decision worth recording

- The cart lives on the server, one per registered user, so there is no
  guest cart. The product page therefore sends a logged out visitor to the
  login page when they press Add to Cart or Buy Now, instead of keeping a
  second, local cart that would later have to be merged.

## Next phase

Phase 5 runs the whole flow end to end as one implementation: auth,
catalog, cart, ordering and admin, exactly as a user would meet them.
