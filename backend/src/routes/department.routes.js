const express = require("express");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");

const { getAllDepartments, getDepartmentById, createDepartment } = require("../controllers/department.controller");

const router = express.Router();

router.get("/", getAllDepartments);
router.get("/:departmentId", getDepartmentById);
router.post("/", authenticate, authorize("Admin"), createDepartment);

module.exports = router;