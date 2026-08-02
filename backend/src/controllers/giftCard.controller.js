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


// @Ali: Get gift card by ID
const getGiftCardById = async (req, res) => {
    try {

        const { id } = req.params;

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

        const expiration = new Date(expirationDate);

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

// @Ali: Update gift card
const updateGiftCard = async (req, res) => {
    try {

        const { id } = req.params;
        const {
            amount,
            expirationDate,
            isActive
        } = req.body;

        const giftCard = await GiftCard.findById(id);

        if (!giftCard) {
            return res.status(404).json({
                success: false,
                message: "Gift card not found."
            });
        }

        if (amount !== undefined) {

            giftCard.amount = amount;
        }

        if (expirationDate !== undefined) {
            const expiration = new Date(expirationDate);
            giftCard.expirationDate = expiration;
        }

        if (isActive !== undefined) {
            giftCard.isActive = isActive;
        }

        await giftCard.save();

        return res.status(200).json({
            success: true,
            message: "Gift card updated successfully.",
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

// @Ali: Soft delete gift card
const softDeleteGiftCard = async (req, res) => {
    try {

        const { id } = req.params;

        const giftCard = await GiftCard.findById(id);

        if (!giftCard) {
            return res.status(404).json({
                success: false,
                message: "Gift card not found."
            });
        }

        if (!giftCard.isActive) {
            return res.status(400).json({
                success: false,
                message: "Gift card is already inactive."
            });
        }

        giftCard.isActive = false;

        await giftCard.save();

        return res.status(200).json({
            success: true,
            message: "Gift card deactivated successfully.",
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
    createGiftCard,
    updateGiftCard,
    softDeleteGiftCard
};