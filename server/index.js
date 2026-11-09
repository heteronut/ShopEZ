const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

if (require.main === module) {
  connectDB()
    .then(() => app.listen(PORT, () => console.log("ShopEZ server running on port " + PORT)))
    .catch((err) => {
      console.error("Database connection failed: " + err.message);
      process.exit(1);
    });
}

module.exports = app;
