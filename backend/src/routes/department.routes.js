const express = require("express");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");

const { getAllDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment } = require("../controllers/department.controller");

const router = express.Router();

router.get("/", getAllDepartments);
router.get("/:departmentId", getDepartmentById);
router.post("/", authenticate, authorize("Admin"), createDepartment);
router.put("/:departmentId", authenticate, authorize("Admin"), updateDepartment);
router.delete("/:departmentId", authenticate, authorize("Admin"), deleteDepartment);

module.exports = router;