const express = require("express");
const { getProtectedRoute } = require("../controllers/protect");
const { protect } = require("../middleware/protect");

const router = express.Router();

router.route("/").get(protect, getProtectedRoute);

module.exports = router;