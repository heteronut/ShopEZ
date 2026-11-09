const Product = require("../models/Product");

const SORTS = {
  popular: { rating: -1, numReviews: -1 },
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
  discount: { discount: -1 },
};

// GET /api/products?search=&category=&gender=&sort=
async function listProducts(req, res, next) {
  try {
    const { search, category, gender, sort } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (gender) filter.gender = gender;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    const products = await Product.find(filter).sort(SORTS[sort] || SORTS.popular);
    res.json(products);
  } catch (err) {
    next(err);
  }
}

// GET /api/products/:id
async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

// POST /api/products (admin)
async function createProduct(req, res, next) {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

// PUT /api/products/:id (admin)
async function updateProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/products/:id (admin)
async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product removed" });
  } catch (err) {
    next(err);
  }
}

// POST /api/products/:id/reviews (logged in customers)
async function addReview(req, res, next) {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (!rating || !comment) {
      return res.status(400).json({ message: "Rating and comment are both required" });
    }
    const already = product.reviews.find((r) => r.userId.toString() === req.user._id.toString());
    if (already) return res.status(400).json({ message: "You have already reviewed this product" });
    product.reviews.push({ userId: req.user._id, username: req.user.username, rating: Number(rating), comment });
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.numReviews;
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct, addReview };
