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

module.exports = {
    getAllFighters
};