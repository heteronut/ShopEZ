const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const Product = require("./models/Product");
const Cart = require("./models/Cart");
const Order = require("./models/Order");
const Admin = require("./models/Admin");
const products = require("./data/products");

async function seed() {
  await connectDB();
  await Promise.all([
    User.deleteMany({}), Product.deleteMany({}), Cart.deleteMany({}),
    Order.deleteMany({}), Admin.deleteMany({}),
  ]);
  await User.create([
    { username: "ShopEZ Admin", email: "admin@shopez.in", password: "admin123", usertype: "admin" },
    { username: "Demo Customer", email: "customer@shopez.in", password: "customer123", usertype: "customer" },
  ]);
  await Product.insertMany(products);
  await Admin.create({
    banner: "Festive sale is live on Fashion and Electronics. Discounts shown on each product are applied at checkout.",
    categories: ["Mobiles", "Electronics", "Sports-Equipment", "Fashion", "Groceries"],
  });
  console.log("Seed complete: 2 users, " + products.length + " products, 1 admin config.");
  console.log("Admin login: admin@shopez.in / admin123");
  console.log("Customer login: customer@shopez.in / customer123");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed: " + err.message);
  process.exit(1);
});
