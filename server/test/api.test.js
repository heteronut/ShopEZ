// End-to-end API test. Starts an in-memory MongoDB, seeds it, boots the
// Express app on an ephemeral port and walks the full buying flow with
// fetch. Run with: npm test
process.env.JWT_SECRET = "test_secret_for_api_test";
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let base = "";
let passed = 0;
let failed = 0;

function check(name, condition, extra) {
  if (condition) {
    passed += 1;
    console.log("PASS  " + name);
  } else {
    failed += 1;
    console.log("FAIL  " + name + (extra ? " :: " + extra : ""));
  }
}

async function call(method, path, body, token) {
  const res = await fetch(base + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer " + token } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

async function main() {
  const mongo = await MongoMemoryServer.create();
  process.env.DRIVER_LINK = mongo.getUri();
  const connectDB = require("../config/db");
  await connectDB();

  const User = require("../models/User");
  const Product = require("../models/Product");
  const Admin = require("../models/Admin");
  const products = require("../data/products");
  await User.create([
    { username: "ShopEZ Admin", email: "admin@shopez.in", password: "admin123", usertype: "admin" },
  ]);
  await Product.insertMany(products);
  await Admin.create({ banner: "Test banner", categories: ["Mobiles", "Electronics", "Sports-Equipment", "Fashion", "Groceries"] });

  const app = require("../index");
  const server = app.listen(0);
  await new Promise((r) => server.once("listening", r));
  base = "http://127.0.0.1:" + server.address().port;

  // Auth
  let r = await call("POST", "/api/auth/register", { username: "Test Buyer", email: "buyer@test.in", password: "buyer123" });
  check("register returns 201 with token", r.status === 201 && !!r.data.token, JSON.stringify(r.data));
  const token = r.data.token;
  r = await call("POST", "/api/auth/register", { username: "Dup", email: "buyer@test.in", password: "buyer123" });
  check("duplicate email rejected with 400", r.status === 400);
  r = await call("POST", "/api/auth/login", { email: "buyer@test.in", password: "wrongpass" });
  check("wrong password rejected with 401", r.status === 401);
  r = await call("POST", "/api/auth/login", { email: "buyer@test.in", password: "buyer123" });
  check("login returns 200 with token", r.status === 200 && !!r.data.token);
  r = await call("GET", "/api/users/profile", null, null);
  check("profile without token is 401", r.status === 401);
  r = await call("GET", "/api/users/profile", null, token);
  check("profile with token returns the buyer", r.status === 200 && r.data.email === "buyer@test.in");

  // Products
  r = await call("GET", "/api/products");
  check("product list returns all seeded products", r.status === 200 && r.data.length === products.length, "got " + (r.data.length || "?"));
  r = await call("GET", "/api/products?category=Fashion&sort=price-asc");
  const fashion = r.data;
  check("category filter returns only Fashion", fashion.length > 0 && fashion.every((p) => p.category === "Fashion"));
  check("price-asc sort is ascending", fashion.every((p, i) => i === 0 || fashion[i - 1].price <= p.price));
  r = await call("GET", "/api/products?search=headphones");
  check("search finds the headphones", r.data.length === 1 && /Headphones/.test(r.data[0].title));
  const shirt = fashion.find((p) => p.sizes.length > 0);

  // Cart rules
  r = await call("POST", "/api/cart", { productId: shirt._id, quantity: 1 }, token);
  check("adding a sized product without size is 400", r.status === 400, JSON.stringify(r.data));
  r = await call("POST", "/api/cart", { productId: shirt._id, size: "M", quantity: 2 }, token);
  check("add to cart returns the item", r.status === 200 && r.data.items.length === 1 && r.data.items[0].quantity === 2);
  r = await call("POST", "/api/cart", { productId: shirt._id, size: "M", quantity: 999 }, token);
  check("quantity above stock is 400", r.status === 400);

  // Order: shirt price 1299, discount 54 percent, qty 2.
  // Unit payable = round(1299 * 0.46) = 598, items total 1196, above the
  // free delivery threshold of 999, so final price must be 1196.
  r = await call("POST", "/api/orders", { name: "Test Buyer", email: "buyer@test.in", mobile: "9810098100", address: "221 MG Road", pincode: "110001", paymentMethod: "UPI" }, token);
  check("place order returns 201", r.status === 201, JSON.stringify(r.data));
  check("order total is recomputed by the server (1196)", r.data.finalPrice === 1196, "got " + r.data.finalPrice);
  check("order has a delivery date after the order date", new Date(r.data.deliveryDate) > new Date(r.data.orderDate));
  const orderId = r.data._id;
  const after = await Product.findById(shirt._id);
  check("stock went down by the ordered quantity", after.stock === shirt.stock - 2, "stock " + after.stock);
  r = await call("GET", "/api/cart", null, token);
  check("cart is empty after ordering", r.data.items.length === 0);
  r = await call("POST", "/api/orders", { name: "Test Buyer", email: "buyer@test.in", mobile: "123", address: "221 MG Road", pincode: "110001", paymentMethod: "UPI" }, token);
  check("invalid mobile is rejected with 400", r.status === 400);

  // Reviews
  r = await call("POST", "/api/products/" + shirt._id + "/reviews", { rating: 5, comment: "Fit matches the size chart." }, token);
  check("logged in user can review", r.status === 201 && r.data.numReviews === 1);
  r = await call("POST", "/api/products/" + shirt._id + "/reviews", { rating: 4, comment: "Second review" }, token);
  check("second review by same user is 400", r.status === 400);

  // Admin
  r = await call("POST", "/api/auth/login", { email: "admin@shopez.in", password: "admin123" });
  const adminToken = r.data.token;
  r = await call("GET", "/api/admin/summary", null, token);
  check("customer cannot read admin summary (403)", r.status === 403);
  r = await call("GET", "/api/admin/summary", null, adminToken);
  check("admin summary revenue equals the placed order (1196)", r.status === 200 && r.data.revenue === 1196, JSON.stringify(r.data));
  check("admin summary counts are real", r.data.totalOrders === 1 && r.data.totalProducts === products.length);
  r = await call("GET", "/api/orders", null, adminToken);
  check("admin sees all orders", r.status === 200 && r.data.length === 1);
  r = await call("PATCH", "/api/orders/" + orderId + "/status", { status: "Cancelled" }, adminToken);
  check("admin can cancel the order", r.status === 200 && r.data.status === "Cancelled");
  const restocked = await Product.findById(shirt._id);
  check("cancelling restocks the items", restocked.stock === shirt.stock, "stock " + restocked.stock);
  r = await call("POST", "/api/products", { title: "Test Widget", description: "Created by the API test.", price: 100, discount: 0, category: "Electronics", stock: 3 }, token);
  check("customer cannot create a product (403)", r.status === 403);
  r = await call("POST", "/api/products", { title: "Test Widget", description: "Created by the API test.", price: 100, discount: 0, category: "Electronics", stock: 3 }, adminToken);
  check("admin can create a product", r.status === 201);
  const widgetId = r.data._id;
  r = await call("DELETE", "/api/products/" + widgetId, null, adminToken);
  check("admin can delete the product", r.status === 200);

  server.close();
  await mongoose.disconnect();
  await mongo.stop();
  console.log("\nResult: " + passed + " passed, " + failed + " failed");
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("Test crashed: " + err.message);
  process.exit(1);
});
