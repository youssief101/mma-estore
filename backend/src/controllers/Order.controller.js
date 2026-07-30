const Order = require("../models/Order");

// @Nassar: Get authenticated user's orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userID: req.user._id,
    })
      .populate("items.productID", "name images slug")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
// @Nassar: Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("userID", "firstName lastName email")
      .populate("items.productID", "name images slug");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    const isOwner = order.userID._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "Admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this order.",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
// @Nassar: Find order by order number
const findOrder = async (req, res) => {
    try {

        const { orderNumber } = req.params;

        const order = await Order.findOne({
            orderNumber: Number(orderNumber)
        })
            .populate("userID", "firstName lastName email")
            .populate("items.productID", "name images slug");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            });
        }

        const isOwner = order.userID._id.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "Admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this order."
            });
        }

        return res.status(200).json({
            success: true,
            order
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
  getUserOrders,
  getOrderById,
  findOrder,
};
