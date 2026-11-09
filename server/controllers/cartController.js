const Cart = require("../models/Cart");
const Product = require("../models/Product");

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [] });
  return cart;
}

// GET /api/cart
async function getCart(req, res, next) {
  try {
    const cart = await getOrCreateCart(req.user._id);
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

// POST /api/cart  { productId, size, quantity }
async function addToCart(req, res, next) {
  try {
    const { productId, size = "", quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.sizes.length > 0 && !product.sizes.includes(size)) {
      return res.status(400).json({ message: "Please choose a size: " + product.sizes.join(", ") });
    }
    if (quantity < 1) return res.status(400).json({ message: "Quantity must be at least 1" });
    if (quantity > product.stock) {
      return res.status(400).json({ message: "Only " + product.stock + " left in stock" });
    }
    const cart = await getOrCreateCart(req.user._id);
    const existing = cart.items.find(
      (i) => i.productId.toString() === product._id.toString() && i.size === size
    );
    if (existing) {
      if (existing.quantity + quantity > product.stock) {
        return res.status(400).json({ message: "Only " + product.stock + " left in stock" });
      }
      existing.quantity += quantity;
    } else {
      cart.items.push({
        productId: product._id,
        title: product.title,
        description: product.description,
        size,
        quantity,
        price: product.price,
        discount: product.discount,
      });
    }
    await cart.save();
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

// PUT /api/cart  { productId, size, quantity }
async function updateCartItem(req, res, next) {
  try {
    const { productId, size = "", quantity } = req.body;
    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.find((i) => i.productId.toString() === productId && i.size === size);
    if (!item) return res.status(404).json({ message: "Item not in cart" });
    const product = await Product.findById(productId);
    if (product && quantity > product.stock) {
      return res.status(400).json({ message: "Only " + product.stock + " left in stock" });
    }
    if (quantity < 1) {
      cart.items = cart.items.filter((i) => !(i.productId.toString() === productId && i.size === size));
    } else {
      item.quantity = quantity;
    }
    await cart.save();
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/cart/:productId?size=
async function removeFromCart(req, res, next) {
  try {
    const size = req.query.size || "";
    const cart = await getOrCreateCart(req.user._id);
    cart.items = cart.items.filter(
      (i) => !(i.productId.toString() === req.params.productId && i.size === size)
    );
    await cart.save();
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
