const express = require("express");
const { getProfile, updateProfile, changePassword, getAddresses, addAddress } = require("../controllers/user.controller");
const authenticate = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);
router.put("/change-password", authenticate, changePassword);
router.get("/addresses", authenticate, getAddresses);
router.post("/addresses",authenticate,addAddress);

module.exports = router;