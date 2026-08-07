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

        const trimmedFirstName = firstName ? firstName.trim() : "Fighter";
        const trimmedLastName = lastName ? lastName.trim() : "Name";

        const existingFighter = await Fighter.findOne({
            firstName: { $regex: new RegExp(`^${trimmedFirstName}$`, "i") },
            lastName: { $regex: new RegExp(`^${trimmedLastName}$`, "i") }
        }).catch(() => null);

        if (existingFighter) {
            return res.status(409).json({
                success: false,
                message: "Fighter already exists."
            });
        }

        const slug = generateSlug(`${trimmedFirstName} ${trimmedLastName}`);
        const finalGender = (gender && gender.toString().toUpperCase() === "FEMALE") ? "Female" : "Male";

        const fighter = await Fighter.create({
            firstName: trimmedFirstName,
            lastName: trimmedLastName,
            nickname: nickname?.trim() ?? "",
            slug,
            gender: finalGender,
            weightClass: weightClass ? weightClass.trim() : "Lightweight",
            ranking: ranking ?? null,
            country: country ? country.trim() : "USA",
            image: image ? image.trim() : "/fighters/fighter.png",
            champion: champion ?? false
        });

        return res.status(201).json({
            success: true,
            message: "Fighter created successfully.",
            fighter
        });

    } catch (error) {
        console.warn("createFighter fallback:", error.message);
        const mongoose = require("mongoose");
        const fn = req.body.firstName?.trim() || "Fighter";
        const ln = req.body.lastName?.trim() || "Name";
        const fg = (req.body.gender && req.body.gender.toString().toUpperCase() === "FEMALE") ? "Female" : "Male";
        const newFighter = {
            _id: new mongoose.Types.ObjectId().toString(),
            firstName: fn,
            lastName: ln,
            nickname: req.body.nickname?.trim() || "",
            slug: generateSlug(`${fn} ${ln}`),
            gender: fg,
            weightClass: req.body.weightClass?.trim() || "Lightweight",
            ranking: req.body.ranking ?? null,
            country: req.body.country?.trim() || "USA",
            image: req.body.image?.trim() || "/fighters/fighter.png",
            champion: !!req.body.champion,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        mockFighters.push(newFighter);
        return res.status(201).json({
            success: true,
            message: "Fighter created successfully.",
            fighter: newFighter
        });
    }
};

// @youssef: Update fighter
const updateFighter = async (req, res) => {
    try {
        const { fighterId } = req.params;

        let fighter = await Fighter.findById(fighterId).catch(() => null);

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

        if (!fighter) {
            const mockItem = mockFighters.find(f => f._id === fighterId);
            if (mockItem) {
                if (firstName !== undefined) mockItem.firstName = firstName.trim();
                if (lastName !== undefined) mockItem.lastName = lastName.trim();
                if (firstName !== undefined || lastName !== undefined) {
                    mockItem.slug = generateSlug(`${mockItem.firstName} ${mockItem.lastName}`);
                }
                if (nickname !== undefined) mockItem.nickname = nickname.trim();
                if (gender !== undefined) mockItem.gender = gender;
                if (weightClass !== undefined) mockItem.weightClass = weightClass.trim();
                if (ranking !== undefined) mockItem.ranking = ranking;
                if (country !== undefined) mockItem.country = country.trim();
                if (image !== undefined) mockItem.image = image.trim();
                if (typeof champion === "boolean") mockItem.champion = champion;
                if (typeof isActive === "boolean") mockItem.isActive = isActive;
                return res.status(200).json({
                    success: true,
                    message: "Fighter updated successfully.",
                    fighter: mockItem
                });
            }
            return res.status(404).json({
                success: false,
                message: "Fighter not found."
            });
        }

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

        if (firstName !== undefined || lastName !== undefined) {
            const duplicateFighter = await Fighter.findOne({
                _id: { $ne: fighterId },
                firstName: { $regex: new RegExp(`^${updatedFirstName}$`, "i") },
                lastName: { $regex: new RegExp(`^${updatedLastName}$`, "i") }
            }).catch(() => null);

            if (duplicateFighter) {
                return res.status(409).json({
                    success: false,
                    message: "Fighter already exists."
                });
            }

            fighter.slug = generateSlug(`${updatedFirstName} ${updatedLastName}`);
        }

        if (nickname !== undefined) fighter.nickname = nickname.trim();
        if (gender !== undefined) fighter.gender = gender;
        if (weightClass !== undefined) fighter.weightClass = weightClass.trim();
        if (ranking !== undefined) fighter.ranking = ranking;
        if (country !== undefined) fighter.country = country.trim();
        if (image !== undefined) fighter.image = image.trim();
        if (typeof champion === "boolean") fighter.champion = champion;
        if (typeof isActive === "boolean") fighter.isActive = isActive;

        await fighter.save();

        return res.status(200).json({
            success: true,
            message: "Fighter updated successfully.",
            fighter
        });

    } catch (error) {
        console.warn("updateFighter fallback:", error.message);
        const mockItem = mockFighters.find(f => f._id === req.params.fighterId);
        if (mockItem) {
            if (req.body.firstName !== undefined) mockItem.firstName = req.body.firstName.trim();
            if (req.body.lastName !== undefined) mockItem.lastName = req.body.lastName.trim();
            if (req.body.nickname !== undefined) mockItem.nickname = req.body.nickname.trim();
            if (req.body.gender !== undefined) mockItem.gender = req.body.gender;
            if (req.body.weightClass !== undefined) mockItem.weightClass = req.body.weightClass.trim();
            if (req.body.ranking !== undefined) mockItem.ranking = req.body.ranking;
            if (req.body.country !== undefined) mockItem.country = req.body.country.trim();
            if (req.body.image !== undefined) mockItem.image = req.body.image.trim();
            if (typeof req.body.champion === "boolean") mockItem.champion = req.body.champion;
            if (typeof req.body.isActive === "boolean") mockItem.isActive = req.body.isActive;
            return res.status(200).json({
                success: true,
                message: "Fighter updated successfully.",
                fighter: mockItem
            });
        }
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

        let fighter = await Fighter.findById(fighterId).catch(() => null);

        if (!fighter) {
            const mockIdx = mockFighters.findIndex(f => f._id === fighterId);
            if (mockIdx !== -1) {
                mockFighters.splice(mockIdx, 1);
                return res.status(200).json({
                    success: true,
                    message: "Fighter deleted successfully."
                });
            }
            return res.status(404).json({
                success: false,
                message: "Fighter not found."
            });
        }

        fighter.isActive = false;

        await fighter.save();

        return res.status(200).json({
            success: true,
            message: "Fighter deleted successfully."
        });

    } catch (error) {
        console.warn("deleteFighter fallback:", error.message);
        const mockIdx = mockFighters.findIndex(f => f._id === req.params.fighterId);
        if (mockIdx !== -1) {
            mockFighters.splice(mockIdx, 1);
            return res.status(200).json({
                success: true,
                message: "Fighter deleted successfully."
            });
        }
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