const Product = require("../models/Product");
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

// @Ali: Add product to cart
const addProductToCart = async (req, res) => {
    try {

        const {
            productID,
            size,
            quantity
        } = req.body;

        const product = await Product.findById(productID);

        if (!product || !product.isActive) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        const variant = product.inventory.variants.find(
            item => item.size === size
        );

        if (!variant) {
            return res.status(400).json({
                success: false,
                message: "Selected size is unavailable."
            });
        }

        if (variant.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock."
            });
        }

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

        const existingItem = cart.items.find(item =>
            item.productID.toString() === productID &&
            item.size === size
        );

        if (existingItem) {

            if (variant.stock < existingItem.quantity + quantity) {
                return res.status(400).json({
                    success: false,
                    message: "Insufficient stock."
                });
            }

            existingItem.quantity += quantity;

        } else {

            const primaryImage =
                product.images.find(image => image.isPrimary)?.url ||
                product.images[0]?.url ||
                "";

            cart.items.push({
                productID: product._id,
                productName: product.name,
                imageUrl: primaryImage,
                size,
                quantity,
                unitPrice: product.price
            });

        }

        cart.totalPrice = cart.items.reduce(
            (total, item) => total + (item.unitPrice * item.quantity),
            0
        );

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Product added to cart successfully.",
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

// @Ali: Update cart item quantity
const updateCartItemQuantity = async (req, res) => {
    try {

        const { productID, size, quantity } = req.body;

        const cart = await Cart.findOne({
            userID: req.user._id
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found."
            });
        }

        const item = cart.items.find(
            cartItem =>
                cartItem.productID.toString() === productID &&
                cartItem.size === size
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found."
            });
        }

        const product = await Product.findById(productID);

        if (!product || !product.isActive) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        const variant = product.inventory.variants.find(
            variant => variant.size === size
        );

        if (!variant) {
            return res.status(400).json({
                success: false,
                message: "Selected size is unavailable."
            });
        }

        if (quantity > variant.stock) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock."
            });
        }

        item.quantity = quantity;

        cart.totalPrice = cart.items.reduce(
            (total, currentItem) =>
                total + (currentItem.quantity * currentItem.unitPrice),
            0
        );

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Cart item updated successfully.",
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

// @Ali: Remove item from cart
const removeCartItem = async (req, res) => {
    try {

        const { productID, size } = req.body;

        const cart = await Cart.findOne({
            userID: req.user._id
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found."
            });
        }

        const itemIndex = cart.items.findIndex(
            item =>
                item.productID.toString() === productID &&
                item.size === size
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found."
            });
        }

        cart.items.splice(itemIndex, 1);

        cart.totalPrice = cart.items.reduce(
            (total, item) => total + (item.quantity * item.unitPrice),
            0
        );

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Item removed from cart successfully.",
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

// @Ali: Clear authenticated user's cart
const clearCart = async (req, res) => {
    try {

        const cart = await Cart.findOne({
            userID: req.user._id
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found."
            });
        }

        cart.items = [];
        cart.totalPrice = 0;

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Cart cleared successfully.",
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
    getUserCart,
    addProductToCart,
    updateCartItemQuantity,
    removeCartItem,
    clearCart
};