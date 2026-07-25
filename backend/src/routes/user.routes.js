const express = require("express");
const { getProfile, updateProfile, changePassword, getAddresses } = require("../controllers/user.controller");
const authenticate = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);
router.put("/change-password", authenticate, changePassword);
router.get("/addresses", authenticate, getAddresses);

module.exports = router;