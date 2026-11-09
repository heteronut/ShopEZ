const express = require("express");
const { getConfig, updateConfig, summary } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();
router.get("/config", getConfig);
router.put("/config", protect, adminOnly, updateConfig);
router.get("/summary", protect, adminOnly, summary);
module.exports = router;
