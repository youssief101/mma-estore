const express = require("express");

const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const validate = require("../middlewares/validation.middleware");

const {
    getAllFighters,
    getFighterById,
    createFighter,
    updateFighter,
    deleteFighter
} = require("../controllers/fighter.controller");

const {
    validateGetAllFighters,
    validateGetFighterById,
    validateCreateFighter,
    validateUpdateFighter,
    validateDeleteFighter
} = require("../validators/fighter.validator");

const router = express.Router();

// Public

router.get(
    "/",
    validateGetAllFighters,
    validate,
    getAllFighters
);

router.get(
    "/:fighterId",
    validateGetFighterById,
    validate,
    getFighterById
);

// Admin

router.post(
    "/",
    authenticate,
    authorize("Admin"),
    validateCreateFighter,
    validate,
    createFighter
);

router.put(
    "/:fighterId",
    authenticate,
    authorize("Admin"),
    validateUpdateFighter,
    validate,
    updateFighter
);

router.delete(
    "/:fighterId",
    authenticate,
    authorize("Admin"),
    validateDeleteFighter,
    validate,
    deleteFighter
);

module.exports = router;