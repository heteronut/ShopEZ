const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    size: { type: String, default: "" },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: [true, "Receiver name is required"] },
    email: { type: String, required: [true, "Email is required"] },
    mobile: { type: String, required: [true, "Mobile number is required"] },
    address: { type: String, required: [true, "Delivery address is required"] },
    pincode: { type: String, required: [true, "Pincode is required"] },
    items: { type: [orderItemSchema], required: true },
    totalMrp: { type: Number, required: true },
    discountAmount: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    finalPrice: { type: Number, required: true },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["Cash on Delivery", "UPI", "Card"],
    },
    status: {
      type: String,
      enum: ["Placed", "Shipped", "Delivered", "Cancelled"],
      default: "Placed",
    },
    orderDate: { type: Date, default: Date.now },
    deliveryDate: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
