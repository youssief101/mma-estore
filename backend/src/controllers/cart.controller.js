const Cart = require("../models/Cart");

// @Nassar: Get authenticated user's cart
const getUserCart = async (req, res) => {
    try {

        let cart = await Cart.findOne({
            userID: req.user._id
        });

        if (!cart) {

            cart = await Cart.create({
                userID: req.user._id,
                items: [],
                totalPrice: 0
            });

        }

        return res.status(200).json({
            success: true,
            cart
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
    getUserCart
};