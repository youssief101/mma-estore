const express = require("express");
const { getProfile, updateProfile, changePassword, getAddresses, addAddress ,updateAddress } = require("../controllers/user.controller");
const authenticate = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);
router.put("/change-password", authenticate, changePassword);
router.get("/addresses", authenticate, getAddresses);
router.post("/addresses",authenticate,addAddress);
router.put( "/addresses/:addressId", authenticate, updateAddress);

module.exports = router;