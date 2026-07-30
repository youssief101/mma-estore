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


// @Ali: Create a new gift card
const createGiftCard = async (req, res) => {
    try {

        const {
            code,
            amount,
            expirationDate
        } = req.body;

        if (!code || amount === undefined || !expirationDate) {
            return res.status(400).json({
                success: false,
                message: "Code, amount and expiration date are required."
            });
        }

        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Gift card amount must be greater than zero."
            });
        }

        const expiration = new Date(expirationDate);

        if (isNaN(expiration.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid expiration date."
            });
        }

        if (expiration <= new Date()) {
            return res.status(400).json({
                success: false,
                message: "Expiration date must be in the future."
            });
        }

        const existingGiftCard = await GiftCard.findOne({
            code: code.toUpperCase().trim()
        });

        if (existingGiftCard) {
            return res.status(409).json({
                success: false,
                message: "Gift card code already exists."
            });
        }

        const giftCard = await GiftCard.create({
            code,
            amount,
            expirationDate: expiration
        });

        return res.status(201).json({
            success: true,
            message: "Gift card created successfully.",
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
    createGiftCard
};