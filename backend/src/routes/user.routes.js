const express = require("express");
const { getProfile, updateProfile, changePassword, getAddresses, addAddress , updateAddress, deleteAddress, getAllUsers, getUserById, updateUserStatus, deleteUser } = require("../controllers/User.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");

const router = express.Router();

// @youssef: Customers routes
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);
router.put("/change-password", authenticate, changePassword);
router.get("/addresses", authenticate, getAddresses);
router.post("/addresses",authenticate,addAddress);
router.put( "/addresses/:addressId", authenticate, updateAddress);
router.delete("/addresses/:addressId", authenticate, deleteAddress);

// @youssef: Admin routes
router.get("/", authenticate, authorize("Admin"), getAllUsers);
router.get("/:userId", authenticate, authorize("Admin"), getUserById);
router.patch("/:userId/status", authenticate, authorize("Admin"), updateUserStatus);
router.delete("/:userId", authenticate, authorize("Admin"), deleteUser);
module.exports = router;
