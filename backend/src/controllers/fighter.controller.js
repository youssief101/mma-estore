const Fighter = require("../models/Fighter");

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
            count: fighters.length,
            fighters
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
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
            return res.status(404).json({
                success: false,
                message: "Fighter not found."
            });
        }

        return res.status(200).json({
            success: true,
            fighter
        });

    } catch (error) {

        console.error(error);

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid fighter ID."
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
    getFighterById
};