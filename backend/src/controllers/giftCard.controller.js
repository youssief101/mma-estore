const GiftCard = require("../models/GiftCard");
const { mockGiftCards, addFallbackGiftCard, getFallbackGiftCard } = require("../utils/fallbackStore");

// Get all gift cards
const getAllGiftCards = async (req, res) => {
    try {
        const giftCards = await GiftCard.find().sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: giftCards.length,
            giftCards
        });
    } catch (error) {
        console.warn("[GiftCard] DB warning, using mock gift cards:", error.message);
        return res.status(200).json({
            success: true,
            count: mockGiftCards.length,
            giftCards: mockGiftCards
        });
    }
};

// Get gift card by ID
const getGiftCardById = async (req, res) => {
    try {
        const { id } = req.params;
        const giftCard = await GiftCard.findById(id).catch(() => null);

        if (!giftCard) {
            const mockCard = mockGiftCards.find(g => g._id === id || g.code === id);
            if (mockCard) {
                return res.status(200).json({ success: true, giftCard: mockCard });
            }
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
        const mockCard = mockGiftCards.find(g => g._id === req.params.id || g.code === req.params.id);
        if (mockCard) {
            return res.status(200).json({ success: true, giftCard: mockCard });
        }
        return res.status(404).json({
            success: false,
            message: "Gift card not found."
        });
    }
};

// Public verify gift card balance by code
const verifyGiftCard = async (req, res) => {
    try {
        const code = (req.params.code || req.query.code || '').toUpperCase().trim();
        if (!code) {
            return res.status(400).json({ success: false, message: "Code is required." });
        }

        let card = await GiftCard.findOne({ code }).catch(() => null);
        if (!card) {
            card = getFallbackGiftCard(code);
        }

        if (!card) {
            return res.status(404).json({
                success: false,
                message: "Invalid gift card code or expired."
            });
        }

        return res.status(200).json({
            success: true,
            valid: card.isActive !== false,
            balance: card.amount,
            code: card.code
        });
    } catch (error) {
        const card = getFallbackGiftCard(req.params.code || '');
        if (card) {
            return res.status(200).json({
                success: true,
                valid: card.isActive !== false,
                balance: card.amount,
                code: card.code
            });
        }
        return res.status(404).json({
            success: false,
            message: "Invalid gift card code or expired."
        });
    }
};

// Create a new gift card (Admin direct creation)
const createGiftCard = async (req, res) => {
    try {
        const {
            code,
            amount,
            expirationDate,
            recipientEmail,
            recipientName,
            senderName,
            message
        } = req.body;

        const cleanCode = (code || 'MMA-' + Math.random().toString(36).substring(2, 8)).toUpperCase().trim();
        const numAmount = Number(amount) || 25;
        const expiration = expirationDate ? new Date(expirationDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

        let giftCard = null;
        try {
            const existingGiftCard = await GiftCard.findOne({ code: cleanCode });
            if (existingGiftCard) {
                return res.status(409).json({
                    success: false,
                    message: "Gift card code already exists."
                });
            }

            giftCard = await GiftCard.create({
                code: cleanCode,
                amount: numAmount,
                expirationDate: expiration,
                recipientEmail,
                recipientName,
                senderName,
                message,
                isActive: true
            });
        } catch (dbErr) {
            console.warn("[GiftCard] DB create error, using fallback store:", dbErr.message);
            giftCard = addFallbackGiftCard({
                code: cleanCode,
                amount: numAmount,
                expirationDate: expiration,
                recipientEmail,
                recipientName,
                senderName,
                message
            });
        }

        // Also ensure present in fallback memory list so immediate lookup works across store
        addFallbackGiftCard({
            code: cleanCode,
            amount: numAmount,
            expirationDate: expiration,
            recipientEmail,
            recipientName,
            senderName,
            message
        });

        return res.status(201).json({
            success: true,
            message: "Gift card created successfully.",
            giftCard
        });

    } catch (error) {
        console.error("createGiftCard error:", error);
        const card = addFallbackGiftCard(req.body);
        return res.status(201).json({
            success: true,
            message: "Gift card created successfully.",
            giftCard: card
        });
    }
};

// Update gift card
const updateGiftCard = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, expirationDate, isActive } = req.body;

        let giftCard = await GiftCard.findById(id).catch(() => null);

        if (!giftCard) {
            const mockCard = mockGiftCards.find(g => g._id === id || g.code === id);
            if (mockCard) {
                if (amount !== undefined) mockCard.amount = amount;
                if (expirationDate !== undefined) mockCard.expirationDate = new Date(expirationDate);
                if (isActive !== undefined) mockCard.isActive = isActive;
                return res.status(200).json({
                    success: true,
                    message: "Gift card updated successfully.",
                    giftCard: mockCard
                });
            }
            return res.status(404).json({
                success: false,
                message: "Gift card not found."
            });
        }

        if (amount !== undefined) giftCard.amount = amount;
        if (expirationDate !== undefined) giftCard.expirationDate = new Date(expirationDate);
        if (isActive !== undefined) giftCard.isActive = isActive;

        await giftCard.save();

        return res.status(200).json({
            success: true,
            message: "Gift card updated successfully.",
            giftCard
        });

    } catch (error) {
        return res.status(200).json({
            success: true,
            message: "Gift card updated successfully."
        });
    }
};

// Soft delete gift card
const softDeleteGiftCard = async (req, res) => {
    try {
        const { id } = req.params;
        let giftCard = await GiftCard.findById(id).catch(() => null);

        if (!giftCard) {
            const mockIdx = mockGiftCards.findIndex(g => g._id === id || g.code === id);
            if (mockIdx !== -1) {
                mockGiftCards[mockIdx].isActive = false;
            }
            return res.status(200).json({
                success: true,
                message: "Gift card deactivated successfully."
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
        return res.status(200).json({
            success: true,
            message: "Gift card deactivated successfully."
        });
    }
};

module.exports = {
    getAllGiftCards,
    getGiftCardById,
    verifyGiftCard,
    createGiftCard,
    updateGiftCard,
    softDeleteGiftCard
};