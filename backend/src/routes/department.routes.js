const express = require("express");

const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const validate = require("../middlewares/validation.middleware");

const {
    getAllDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment
} = require("../controllers/department.controller");

const {
    validateGetDepartmentById,
    validateCreateDepartment,
    validateUpdateDepartment,
    validateDeleteDepartment
} = require("../validators/department.validator");

const router = express.Router();

// Public routes
router.get("/", getAllDepartments);

router.get(
    "/:departmentId",
    validateGetDepartmentById,
    validate,
    getDepartmentById
);

// Admin routes
router.post(
    "/",
    authenticate,
    authorize("Admin"),
    validateCreateDepartment,
    validate,
    createDepartment
);

router.put(
    "/:departmentId",
    authenticate,
    authorize("Admin"),
    validateUpdateDepartment,
    validate,
    updateDepartment
);

router.delete(
    "/:departmentId",
    authenticate,
    authorize("Admin"),
    validateDeleteDepartment,
    validate,
    deleteDepartment
);

module.exports = router;