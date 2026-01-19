import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();

        const orders = await Order.find();
        const totalRevenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

        // Basic aggregation for sales graph (group by date) - Simplified for example
        // In production, use MongoDB aggregation framework

        res.json({
            totalOrders,
            totalProducts,
            totalUsers,
            totalRevenue,
            recentOrders: orders.slice(-5).reverse() // Last 5 orders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
