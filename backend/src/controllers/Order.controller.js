const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const GiftCard = require("../models/GiftCard");
const { addFallbackGiftCard } = require("../utils/fallbackStore");

// @Nassar: Get authenticated user's orders
const getUserOrders = async (req, res) => {
  try {
    let orders = [];
    try {
      orders = await Order.find({
        userID: req.user._id,
      })
        .populate("items.productID", "name images slug")
        .sort({ createdAt: -1 });
    } catch (dbErr) {
      console.warn("[AI Studio] getUserOrders DB query warning:", dbErr.message);
    }

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(error);

    return res.status(200).json({
      success: true,
      count: 0,
      orders: [],
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
      orderNumber: Number(orderNumber),
    })
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
// @Nassar: Create order
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({
      userID: req.user._id,
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty.",
      });
    }

    // Validate stock
    for (const item of cart.items) {
      const product = await Product.findById(item.productID);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `${item.productName} no longer exists.`,
        });
      }

      const variant = product.inventory.variants.find(
        (v) => v.size === item.size,
      );

      if (!variant || variant.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.productName}.`,
        });
      }
    }

    const subtotal = cart.totalPrice;
    const shipping = 0;
    const total = subtotal + shipping;

    const lastOrder = await Order.findOne().sort({ orderNumber: -1 });
    const orderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1001;

    // Check if any cart items are Gift Cards and issue active gift cards immediately
    let containsGiftCard = false;
    for (const item of cart.items) {
      if (item.productName && (item.productName.toLowerCase().includes('gift card') || item.productName.toLowerCase().includes('e-gift'))) {
        containsGiftCard = true;
        const gcCode = 'MMA-GC' + Math.random().toString(36).substring(2, 8).toUpperCase();
        const gcPayload = {
          code: gcCode,
          amount: item.unitPrice || subtotal || 25,
          recipientEmail: shippingAddress?.email || req.user?.email || 'customer@mma.com',
          senderName: `${shippingAddress?.firstName || 'Customer'} ${shippingAddress?.lastName || ''}`.trim(),
          recipientName: `${shippingAddress?.firstName || 'Valued'} ${shippingAddress?.lastName || 'Customer'}`.trim(),
          message: 'Purchased via MMA E-Store',
          isActive: true,
          expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        };

        try {
          await GiftCard.create(gcPayload);
        } catch (gcErr) {
          addFallbackGiftCard(gcPayload);
        }
        addFallbackGiftCard(gcPayload);
      }
    }

    const initialOrderStatus = containsGiftCard ? "Delivered" : "Pending";

    const order = await Order.create({
      orderNumber,
      userID: req.user._id,
      shippingAddress,
      items: cart.items,
      subtotal,
      shipping,
      total,
      orderStatus: initialOrderStatus,
      payment: {
        method: paymentMethod || "Credit Card",
        status: "Paid",
        paidAt: new Date()
      },
    });

    // Update inventory using bulkWrite()
    const bulkOperations = cart.items.map((item) => ({
      updateOne: {
        filter: {
          _id: item.productID,
          "inventory.variants.size": item.size,
        },
        update: {
          $inc: {
            "inventory.variants.$.stock": -item.quantity,
            "inventory.totalStock": -item.quantity,
          },
        },
      },
    }));

    await Product.bulkWrite(bulkOperations);

    // Clear cart
    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    return res.status(201).json({
      success: true,
      message: "Order created successfully.",
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

// @Nassar: Update order status (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    order.orderStatus = orderStatus;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
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
// @Nassar: Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // User can cancel only their own order
    if (order.userID.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this order.",
      });
    }

    // Only pending orders can be cancelled
    if (order.orderStatus !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending orders can be cancelled.",
      });
    }

    // Restore inventory
    const bulkOperations = order.items.map((item) => ({
      updateOne: {
        filter: {
          _id: item.productID,
          "inventory.variants.size": item.size,
        },
        update: {
          $inc: {
            "inventory.variants.$.stock": item.quantity,
            "inventory.totalStock": item.quantity,
          },
        },
      },
    }));

    await Product.bulkWrite(bulkOperations);

    order.orderStatus = "Cancelled";

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully.",
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
const getAllOrders = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    let orders = [];
    let totalOrders = 0;

    try {
      orders = await Order.find()
        .populate("userID", "firstName lastName email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      totalOrders = await Order.countDocuments();
    } catch (dbErr) {
      console.warn("[AI Studio] getAllOrders DB query warning:", dbErr.message);
    }

    return res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit) || 1,
      totalOrders,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(error);

    return res.status(200).json({
      success: true,
      currentPage: 1,
      totalPages: 1,
      totalOrders: 0,
      count: 0,
      orders: [],
    });
  }
};
module.exports = {
  getUserOrders,
  getOrderById,
  findOrder,
  createOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
};
