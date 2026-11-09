const express = require("express");
const { placeOrder, myOrders, allOrders, updateOrderStatus } = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();
router.use(protect);
router.post("/", placeOrder);
router.get("/mine", myOrders);
router.get("/", adminOnly, allOrders);
router.patch("/:id/status", adminOnly, updateOrderStatus);
module.exports = router;
