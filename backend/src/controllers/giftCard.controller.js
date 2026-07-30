const GiftCard = require("../models/GiftCard");

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

module.exports = {
    getAllGiftCards
};