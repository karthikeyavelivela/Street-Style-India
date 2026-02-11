import Order from "../models/Order.js";
import Product from "../models/Product.js";

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
        // Set payment status based on payment method
        const paymentStatus = paymentMethod === 'COD' ? 'Pending' : 'Pending';
        
        // Generate sequential order number
        const lastOrder = await Order.findOne().sort({ orderNumber: -1 });
        const orderNumber = lastOrder && lastOrder.orderNumber ? lastOrder.orderNumber + 1 : 1;
        
        const order = new Order({
            orderNumber,
            userId: req.user._id,
            items,
            shippingAddress,
            paymentMethod,
            paymentStatus,
            totalAmount
        });

        const createdOrder = await order.save();

        // Update product onlineSales for stock tracking
        for (const item of items) {
            try {
                const product = await Product.findById(item.productId);
                if (product) {
                    product.onlineSales = (product.onlineSales || 0) + item.quantity;
                    product.availableStock = (product.totalStock || 0) - product.onlineSales - (product.offlineSales || 0);
                    await product.save();
                }
            } catch (error) {
                console.error(`Error updating stock for product ${item.productId}:`, error);
            }
        }

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
    const orders = await Order.find({})
        .populate('userId', 'id name email phone customerId');
    res.json(orders);
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = req.body.status || order.status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update payment status
// @route   PUT /api/orders/:id/payment
// @access  Private/Admin
export const updatePaymentStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.paymentStatus = req.body.paymentStatus || order.paymentStatus;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Request order cancellation (customer)
// @route   POST /api/orders/:id/cancel-request
// @access  Private
export const requestCancellation = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        // Only allow the owner to request cancellation
        if (order.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }

        // Prevent cancellation if already delivered or cancelled
        if (order.status === 'Delivered' || order.status === 'Cancelled') {
            return res.status(400).json({ message: "Cannot cancel this order" });
        }

        order.cancellationRequested = true;
        order.cancellationStatus = 'Requested';
        order.cancellationReason = req.body.reason || '';
        await order.save();
        res.json({ message: "Cancellation requested", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Respond to cancellation (admin)
// @route   PUT /api/orders/:id/cancel-response
// @access  Private/Admin
export const respondCancellation = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        const decision = req.body.decision; // 'Accepted' or 'Rejected'
        if (!['Accepted', 'Rejected'].includes(decision)) {
            return res.status(400).json({ message: "Invalid decision" });
        }

        order.cancellationRequested = false;
        order.cancellationStatus = decision;
        if (decision === 'Accepted') {
            order.status = 'Cancelled';
            order.paymentStatus = order.paymentMethod === 'COD' ? 'Pending' : order.paymentStatus;
        }

        await order.save();
        res.json({ message: "Cancellation updated", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
