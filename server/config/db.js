const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.DRIVER_LINK;
  if (!uri) {
    throw new Error("DRIVER_LINK is missing. Copy .env.example to .env and set your MongoDB connection string.");
  }
  const conn = await mongoose.connect(uri);
  console.log("MongoDB connected: " + conn.connection.host);
  return conn;
}

module.exports = connectDB;
