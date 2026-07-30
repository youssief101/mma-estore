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

module.exports = {
  getUserOrders,
};
