const GiftCard = require("../models/GiftCard");
const mongoose = require("mongoose");

// @Ali: Get all gift cards
const getAllGiftCards = async (req, res) => {
    try {

        const giftCards = await GiftCard.find().sort({
            createdAt: -1
        });

        return res.status(200).json({
            success: true,
            count: giftCards.length,
            giftCards
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};



// @Ali: Get gift card by ID
const getGiftCardById = async (req, res) => {
    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid gift card ID."
            });
        }

        const giftCard = await GiftCard.findById(id);

        if (!giftCard) {
            return res.status(404).json({
                success: false,
                message: "Gift card not found."
            });
        }

        return res.status(200).json({
            success: true,
            giftCard
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
    getAllGiftCards,
    getGiftCardById,
};