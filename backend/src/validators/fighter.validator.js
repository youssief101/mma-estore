const { body, param, query } = require("express-validator");
const { FighterGenders } = require("../constants/enums");

// @youssef: Public Validators

const validateGetAllFighters = [

    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer."),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100.")

];

const validateGetFighterById = [

    param("fighterId")
        .isMongoId()
        .withMessage("Invalid fighter ID.")

];

// @youssef: Admin Validators

const validateCreateFighter = [

    body("firstName")
        .trim()
        .notEmpty()
        .withMessage("First name is required.")
        .isLength({ max: 50 })
        .withMessage("First name cannot exceed 50 characters."),

    body("lastName")
        .trim()
        .notEmpty()
        .withMessage("Last name is required.")
        .isLength({ max: 50 })
        .withMessage("Last name cannot exceed 50 characters."),

    body("nickname")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 100 })
        .withMessage("Nickname cannot exceed 100 characters."),

    body("gender")
        .optional({ nullable: true })
        .customSanitizer(val => {
            if (!val) return "Male";
            if (val.toString().toUpperCase() === "MALE") return "Male";
            if (val.toString().toUpperCase() === "FEMALE") return "Female";
            return val;
        })
        .isIn(FighterGenders)
        .withMessage("Invalid gender."),

    body("weightClass")
        .optional({ nullable: true })
        .trim(),

    body("ranking")
        .optional({ nullable: true }),

    body("country")
        .optional({ nullable: true })
        .trim(),

    body("image")
        .optional({ nullable: true })
        .trim(),

    body("champion")
        .optional({ nullable: true })

];

const validateUpdateFighter = [

    param("fighterId")
        .isMongoId()
        .withMessage("Invalid fighter ID."),

    body("firstName")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("First name cannot be empty.")
        .isLength({ max: 50 })
        .withMessage("First name cannot exceed 50 characters."),

    body("lastName")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Last name cannot be empty.")
        .isLength({ max: 50 })
        .withMessage("Last name cannot exceed 50 characters."),

    body("nickname")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Nickname cannot exceed 100 characters."),

    body("gender")
        .optional()
        .isIn(FighterGenders)
        .withMessage("Invalid gender."),

    body("weightClass")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Weight class cannot be empty.")
        .isLength({ max: 50 })
        .withMessage("Weight class cannot exceed 50 characters."),

    body("ranking")
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage("Ranking must be a positive integer."),

    body("country")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Country cannot be empty.")
        .isLength({ max: 100 })
        .withMessage("Country cannot exceed 100 characters."),

    body("image")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Image cannot be empty."),

    body("champion")
        .optional()
        .isBoolean()
        .withMessage("Champion must be a boolean."),

    body("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be a boolean.")

];

const validateDeleteFighter = [

    param("fighterId")
        .isMongoId()
        .withMessage("Invalid fighter ID.")

];

module.exports = {
    validateGetAllFighters,
    validateGetFighterById,
    validateCreateFighter,
    validateUpdateFighter,
    validateDeleteFighter
};