const express = require("express");

const router = express.Router();

const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const validate = require("../middlewares/validation.middleware");

const {
    getProfile,
    updateProfile,
    changePassword,
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    getAllUsers,
    getUserById,
    updateUserStatus,
    deleteUser
} = require("../controllers/User.controller");

const {
    validateUpdateProfile,
    validateChangePassword,
    validateAddAddress,
    validateUpdateAddress,
    validateDeleteAddress,
    validateGetAllUsers,
    validateGetUserById,
    validateUpdateUserStatus,
    validateDeleteUser
} = require("../validators/user.validator");

// Customer Routes

router.get(
    "/profile",
    authenticate,
    getProfile
);

router.put(
    "/profile",
    authenticate,
    validateUpdateProfile,
    validate,
    updateProfile
);

router.put(
    "/change-password",
    authenticate,
    validateChangePassword,
    validate,
    changePassword
);

router.get(
    "/addresses",
    authenticate,
    getAddresses
);

router.post(
    "/addresses",
    authenticate,
    validateAddAddress,
    validate,
    addAddress
);

router.put(
    "/addresses/:addressId",
    authenticate,
    validateUpdateAddress,
    validate,
    updateAddress
);

router.delete(
    "/addresses/:addressId",
    authenticate,
    validateDeleteAddress,
    validate,
    deleteAddress
);


// Admin Routes

router.get(
    "/",
    authenticate,
    authorize("Admin"),
    validateGetAllUsers,
    validate,
    getAllUsers
);

router.get(
    "/:userId",
    authenticate,
    authorize("Admin"),
    validateGetUserById,
    validate,
    getUserById
);

router.patch(
    "/:userId/status",
    authenticate,
    authorize("Admin"),
    validateUpdateUserStatus,
    validate,
    updateUserStatus
);

router.delete(
    "/:userId",
    authenticate,
    authorize("Admin"),
    validateDeleteUser,
    validate,
    deleteUser
);

module.exports = router;