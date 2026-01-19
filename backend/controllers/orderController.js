import Order from "../models/Order.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
    const {
        items,
        shippingAddress,
        paymentMethod,
        totalAmount
    } = req.body;

    if (items && items.length === 0) {
        return res.status(400).json({ message: "No order items" });
    } else {
        const order = new Order({
            userId: req.user._id,
            items,
            shippingAddress,
            paymentMethod,
            totalAmount
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
// Corrected from /my to /myorders to be more explicit if needed, but sticking to user prompt /my in routes
export const getMyOrders = async (req, res) => {
    const orders = await Order.find({ userId: req.user._id });
    res.json(orders);
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id).populate('userId', 'name email');

    if (order) {
        // Ensure user can only see their own order unless admin
        if (order.userId._id.toString() === req.user._id.toString() || req.user.role === 'admin') {
            res.json(order);
        } else {
            res.status(401).json({ message: "Not authorized to view this order" });
        }

    } else {
        res.status(404).json({ message: "Order not found" });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
    const orders = await Order.find({}).populate('userId', 'id name');
    res.json(orders);
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = req.body.status || order.status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: "Order not found" });
    }
};
