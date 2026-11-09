// One-command demo runner for machines without MongoDB installed.
// Starts an in-memory MongoDB, seeds the same data as seed.js, then serves
// the API. Data disappears when the process stops; for a permanent database
// use DRIVER_LINK in .env with a local MongoDB or Atlas instead.
process.env.JWT_SECRET = process.env.JWT_SECRET || "dev_memory_secret";
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongo;
let apiServer;
let stopRequested = false;
let stopPromise;

function stop() {
  if (stopPromise) return stopPromise;
  stopPromise = (async () => {
    if (apiServer) {
      await new Promise((resolve, reject) => {
        apiServer.close((err) => (err ? reject(err) : resolve()));
      });
    }
    await mongoose.disconnect();
    if (mongo) await mongo.stop();
  })();
  return stopPromise;
}

function requestStop() {
  stopRequested = true;
  if (mongo || apiServer) {
    stop()
      .then(() => process.exit(0))
      .catch((err) => {
        console.error("Demo server shutdown failed: " + err.message);
        process.exit(1);
      });
  }
}

if (process.env.SHOPEZ_LAUNCHER === "1") {
  const readline = require("readline");
  const input = readline.createInterface({ input: process.stdin, terminal: false });
  input.on("line", (line) => {
    if (line.trim() === "stop") requestStop();
  });
}

async function main() {
  mongo = await MongoMemoryServer.create();
  if (stopRequested) {
    await stop();
    return;
  }
  process.env.DRIVER_LINK = mongo.getUri();
  const connectDB = require("./config/db");
  await connectDB();

  const User = require("./models/User");
  const Product = require("./models/Product");
  const Admin = require("./models/Admin");
  const products = require("./data/products");
  await User.create([
    { username: "ShopEZ Admin", email: "admin@shopez.in", password: "admin123", usertype: "admin" },
    { username: "Demo Customer", email: "customer@shopez.in", password: "customer123", usertype: "customer" },
  ]);
  await Product.insertMany(products);
  await Admin.create({
    banner: "Festive sale is live on Fashion and Electronics. Discounts shown on each product are applied at checkout.",
    categories: ["Mobiles", "Electronics", "Sports-Equipment", "Fashion", "Groceries"],
  });

  const app = require("./index");
  const port = process.env.PORT || 3001;
  apiServer = app.listen(port, "127.0.0.1", () => {
    console.log("ShopEZ demo server on http://localhost:" + port + " (in-memory MongoDB, seeded)");
    console.log("Admin login: admin@shopez.in / admin123");
    console.log("Customer login: customer@shopez.in / customer123");
  });
  if (stopRequested) requestStop();
}

main().catch((err) => {
  console.error("Demo server failed: " + err.message);
  process.exit(1);
});
