const Admin = require("../models/Admin");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

// GET /api/admin/config (public: the client needs banner and categories)
async function getConfig(req, res, next) {
  try {
    let config = await Admin.findOne({});
    if (!config) config = await Admin.create({ banner: "", categories: [] });
    res.json(config);
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/config (admin)
async function updateConfig(req, res, next) {
  try {
    const { banner, categories } = req.body;
    let config = await Admin.findOne({});
    if (!config) config = await Admin.create({});
    if (typeof banner === "string") config.banner = banner;
    if (Array.isArray(categories)) config.categories = categories;
    await config.save();
    res.json(config);
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/summary (admin)
// Every number here is computed from real orders, users and products in the
// database at request time. Nothing is estimated.
async function summary(req, res, next) {
  try {
    const [orderAgg, itemsAgg, categoryAgg, totalOrders, totalUsers, totalProducts, lowStock] = await Promise.all([
      Order.aggregate([
        { $match: { status: { $ne: "Cancelled" } } },
        { $group: { _id: null, revenue: { $sum: "$finalPrice" } } },
      ]),
      Order.aggregate([
        { $match: { status: { $ne: "Cancelled" } } },
        { $unwind: "$items" },
        { $group: { _id: null, itemsSold: { $sum: "$items.quantity" } } },
      ]),
      Order.aggregate([
        { $match: { status: { $ne: "Cancelled" } } },
        { $unwind: "$items" },
        {
          $lookup: {
            from: "products",
            localField: "items.productId",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: "$product" },
        {
          $group: {
            _id: "$product.category",
            orders: { $sum: 1 },
            revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          },
        },
        { $sort: { revenue: -1 } },
      ]),
      Order.countDocuments({}),
      User.countDocuments({}),
      Product.countDocuments({}),
      Product.find({ stock: { $lte: 5 } }).select("title stock category").sort({ stock: 1 }),
    ]);
    res.json({
      revenue: orderAgg[0] ? orderAgg[0].revenue : 0,
      itemsSold: itemsAgg[0] ? itemsAgg[0].itemsSold : 0,
      totalOrders,
      totalUsers,
      totalProducts,
      salesByCategory: categoryAgg,
      lowStock,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getConfig, updateConfig, summary };
