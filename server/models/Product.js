const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Product title is required"], trim: true },
    description: { type: String, required: [true, "Product description is required"] },
    price: { type: Number, required: [true, "Price (MRP) is required"], min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 90 },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Mobiles", "Electronics", "Sports-Equipment", "Fashion", "Groceries"],
    },
    gender: { type: String, enum: ["Men", "Women", "Unisex"], default: "Unisex" },
    sizes: { type: [String], default: [] },
    carousel: { type: [String], default: [] },
    stock: { type: Number, required: true, default: 0, min: 0 },
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
