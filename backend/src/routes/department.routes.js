const express = require("express");

const { getAllDepartments, getDepartmentById } = require("../controllers/department.controller");

const router = express.Router();

router.get("/", getAllDepartments);
router.get("/:departmentId", getDepartmentById);

module.exports = router;