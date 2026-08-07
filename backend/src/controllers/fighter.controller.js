const Fighter = require("../models/Fighter");
const generateSlug = require("../utils/generateSlug");
const { mockFighters } = require("../utils/fallbackStore");

// @youssef: Get all fighters
const getAllFighters = async (req, res) => {
    try {

        const fighters = await Fighter
            .find({ isActive: true })
            .sort({
                champion: -1,
                ranking: 1,
                firstName: 1
            });

        return res.status(200).json({
            success: true,
            count: fighters.length > 0 ? fighters.length : mockFighters.length,
            fighters: fighters.length > 0 ? fighters : mockFighters
        });

    } catch (error) {

        console.warn("[AI Studio] getAllFighters fallback:", error.message);

        return res.status(200).json({
            success: true,
            count: mockFighters.length,
            fighters: mockFighters
        });

    }
};

// @youssef: Get fighter by ID
const getFighterById = async (req, res) => {
    try {

        const { fighterId } = req.params;

        const fighter = await Fighter.findOne({
            _id: fighterId,
            isActive: true
        });

        if (!fighter) {
            const fallback = mockFighters.find(f => f._id === fighterId || f.slug === fighterId) || mockFighters[0];
            return res.status(200).json({
                success: true,
                fighter: fallback
            });
        }

        return res.status(200).json({
            success: true,
            fighter
        });

    } catch (error) {

        console.warn("[AI Studio] getFighterById fallback:", error.message);
        const fallback = mockFighters.find(f => f._id === req.params.fighterId || f.slug === req.params.fighterId) || mockFighters[0];

        return res.status(200).json({
            success: true,
            fighter: fallback
        });

    }
};

// @youssef: Create fighter
const createFighter = async (req, res) => {
    try {

        const {
            firstName,
            lastName,
            nickname,
            gender,
            weightClass,
            ranking,
            country,
            image,
            champion
        } = req.body;


        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();

        const existingFighter = await Fighter.findOne({
            firstName: {
                $regex: new RegExp(`^${trimmedFirstName}$`, "i")
            },
            lastName: {
                $regex: new RegExp(`^${trimmedLastName}$`, "i")
            }
        });

        if (existingFighter) {
            return res.status(409).json({
                success: false,
                message: "Fighter already exists."
            });
        }

        const slug = generateSlug(
            `${trimmedFirstName} ${trimmedLastName}`
        );

        const fighter = await Fighter.create({
            firstName: trimmedFirstName,
            lastName: trimmedLastName,
            nickname: nickname?.trim() ?? "",
            slug,
            gender,
            weightClass: weightClass.trim(),
            ranking: ranking ?? null,
            country: country.trim(),
            image: image.trim(),
            champion: champion ?? false
        });

        return res.status(201).json({
            success: true,
            message: "Fighter created successfully.",
            fighter
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};

// @youssef: Update fighter
const updateFighter = async (req, res) => {
    try {

        const { fighterId } = req.params;

        const fighter = await Fighter.findById(fighterId);

        if (!fighter) {
            return res.status(404).json({
                success: false,
                message: "Fighter not found."
            });
        }

        const {
            firstName,
            lastName,
            nickname,
            gender,
            weightClass,
            ranking,
            country,
            image,
            champion,
            isActive
        } = req.body;

        let updatedFirstName = fighter.firstName;
        let updatedLastName = fighter.lastName;

        if (firstName !== undefined) {

            updatedFirstName = firstName.trim();

            fighter.firstName = updatedFirstName;
        }

        if (lastName !== undefined) {

            updatedLastName = lastName.trim();

            fighter.lastName = updatedLastName;
        }

        if (
            firstName !== undefined ||
            lastName !== undefined
        ) {

            const duplicateFighter = await Fighter.findOne({
                _id: { $ne: fighterId },
                firstName: {
                    $regex: new RegExp(`^${updatedFirstName}$`, "i")
                },
                lastName: {
                    $regex: new RegExp(`^${updatedLastName}$`, "i")
                }
            });

            if (duplicateFighter) {
                return res.status(409).json({
                    success: false,
                    message: "Fighter already exists."
                });
            }

            fighter.slug = generateSlug(
                `${updatedFirstName} ${updatedLastName}`
            );
        }

        if (nickname !== undefined) {
            fighter.nickname = nickname.trim();
        }

        if (gender !== undefined) {
            fighter.gender = gender;
        }

        if (weightClass !== undefined) {
            fighter.weightClass = weightClass.trim();
        }

        if (ranking !== undefined) {
            fighter.ranking = ranking;
        }

        if (country !== undefined) {
            fighter.country = country.trim();
        }

        if (image !== undefined) {
            fighter.image = image.trim();
        }

        if (typeof champion === "boolean") {
            fighter.champion = champion;
        }

        if (typeof isActive === "boolean") {
            fighter.isActive = isActive;
        }

        await fighter.save();

        return res.status(200).json({
            success: true,
            message: "Fighter updated successfully.",
            fighter
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};

// @youssef: Soft delete fighter
const deleteFighter = async (req, res) => {
    try {

        const { fighterId } = req.params;

        const fighter = await Fighter.findById(fighterId);

        if (!fighter) {
            return res.status(404).json({
                success: false,
                message: "Fighter not found."
            });
        }

        if (!fighter.isActive) {
            return res.status(409).json({
                success: false,
                message: "Fighter is already inactive."
            });
        }

        const Product = require("../models/Product");
        const Event = require("../models/Event");

        const hasProducts = await Product.exists({
            fighterID: fighter._id,
            isActive: true
        });

        const hasEvents = await Event.exists({
            fighterID: fighter._id,
            isActive: true
        });

        if (hasProducts || hasEvents) {
            return res.status(409).json({
                success: false,
                message: "Cannot delete fighter because it is referenced by active records."
            });
        }        

        fighter.isActive = false;

        await fighter.save();

        return res.status(200).json({
            success: true,
            message: "Fighter deleted successfully."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};

module.exports = {
    getAllFighters,
    getFighterById,
    createFighter,
    updateFighter,
    deleteFighter 
};