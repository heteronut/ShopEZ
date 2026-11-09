const mongoose = require("mongoose");

// Store-wide configuration that the admin maintains: the home page banner
// text and the product category list. Kept as a single document.
const adminSchema = new mongoose.Schema(
  {
    banner: { type: String, default: "" },
    categories: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
