const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { computePriceDetails } = require("../utils/pricing");

const MOBILE_RE = /^[0-9]{10}$/;
const PINCODE_RE = /^[0-9]{6}$/;

// POST /api/orders  { name, email, mobile, address, pincode, paymentMethod }
// Places an order for everything in the user's cart. Prices, discounts and
// stock are rechecked against the database at this moment, so a stale cart
// or a changed price can never produce a wrong total.
async function placeOrder(req, res, next) {
  try {
    const { name, email, mobile, address, pincode, paymentMethod } = req.body;
    if (!name || !email || !mobile || !address || !pincode || !paymentMethod) {
      return res.status(400).json({ message: "Name, email, mobile, address, pincode and payment method are all required" });
    }
    if (!MOBILE_RE.test(mobile)) return res.status(400).json({ message: "Mobile number must be 10 digits" });
    if (!PINCODE_RE.test(pincode)) return res.status(400).json({ message: "Pincode must be 6 digits" });
    if (!["Cash on Delivery", "UPI", "Card"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Payment method must be Cash on Delivery, UPI or Card" });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const items = [];
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: "Product no longer available: " + item.title });
      if (item.quantity > product.stock) {
        return res.status(400).json({ message: "Only " + product.stock + " left in stock for " + product.title });
      }
      items.push({
        productId: product._id,
        title: product.title,
        description: product.description,
        size: item.size,
        quantity: item.quantity,
        price: product.price,
        discount: product.discount,
      });
    }

    const totals = computePriceDetails(items);
    const deliveryDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    const order = await Order.create({
      userId: req.user._id,
      name, email, mobile, address, pincode, paymentMethod,
      items,
      ...totals,
      deliveryDate,
    });

    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

// GET /api/orders/mine
async function myOrders(req, res, next) {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

// GET /api/orders (admin)
async function allOrders(req, res, next) {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/orders/:id/status (admin)  { status }
async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!["Placed", "Shipped", "Delivered", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Status must be Placed, Shipped, Delivered or Cancelled" });
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    // Cancelling an order returns its items to stock, exactly once.
    if (status === "Cancelled" && order.status !== "Cancelled") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } });
      }
    }
    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    next(err);
  }
}

module.exports = { placeOrder, myOrders, allOrders, updateOrderStatus };
