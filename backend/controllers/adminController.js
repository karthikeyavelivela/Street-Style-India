import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import HomePageSection from "../models/HomePageSection.js";

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

        // Weekly and Monthly stats
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const weeklyOrders = await Order.countDocuments({ createdAt: { $gte: weekAgo } });
        const monthlyOrders = await Order.countDocuments({ createdAt: { $gte: monthAgo } });

        const weeklyOrdersList = await Order.find({ createdAt: { $gte: weekAgo } });
        const monthlyOrdersList = await Order.find({ createdAt: { $gte: monthAgo } });

        const weeklyRevenue = weeklyOrdersList.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
        const monthlyRevenue = monthlyOrdersList.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

        // Revenue analytics - last 6 months
        const revenueData = [];
        for (let i = 5; i >= 0; i--) {
            const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
            const monthOrders = await Order.find({
                createdAt: { $gte: monthStart, $lte: monthEnd }
            });
            const monthRevenue = monthOrders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
            revenueData.push({
                name: monthStart.toLocaleDateString('en-US', { month: 'short' }),
                revenue: monthRevenue
            });
        }

        // Category distribution
        const categoryData = [];
        const products = await Product.find();
        const categoryCount = {};
        products.forEach(product => {
            const cat = product.category || 'Uncategorized';
            categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        });
        Object.entries(categoryCount).forEach(([name, value]) => {
            categoryData.push({ name, value });
        });

        res.json({
            totalOrders,
            totalProducts,
            totalUsers,
            totalRevenue,
            weeklyOrders,
            monthlyOrders,
            weeklyRevenue,
            monthlyRevenue,
            revenueData,
            categoryData,
            recentOrders: orders.slice(-5).reverse() // Last 5 orders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all home page sections
// @route   GET /api/admin/sections
// @access  Private/Admin
export const getSections = async (req, res) => {
    try {
        const sections = await HomePageSection.find({}).sort({ order: 1 });
        res.json(sections);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get active home page sections (public)
// @route   GET /api/sections
// @access  Public
export const getActiveSections = async (req, res) => {
    try {
        const sections = await HomePageSection.find({ isActive: true }).sort({ order: 1 });
        res.json(sections);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new home page section
// @route   POST /api/admin/sections
// @access  Private/Admin
export const createSection = async (req, res) => {
    try {
        const { type, title, subtitle, order, isActive, config, slides, categories, content, styles } = req.body;
        
        // Get max order if not provided
        let sectionOrder = order;
        if (sectionOrder === undefined || sectionOrder === null) {
            const maxOrder = await HomePageSection.findOne({}).sort({ order: -1 });
            sectionOrder = maxOrder ? maxOrder.order + 1 : 0;
        }

        const section = new HomePageSection({
            type,
            title,
            subtitle,
            order: sectionOrder,
            isActive: isActive !== undefined ? isActive : true,
            config: config || {},
            slides: slides || [],
            categories: categories || [],
            content: content || '',
            styles: styles || {}
        });

        const savedSection = await section.save();
        res.status(201).json(savedSection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a home page section
// @route   PUT /api/admin/sections/:id
// @access  Private/Admin
export const updateSection = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const section = await HomePageSection.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        res.json(section);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a home page section
// @route   DELETE /api/admin/sections/:id
// @access  Private/Admin
export const deleteSection = async (req, res) => {
    try {
        const { id } = req.params;
        const section = await HomePageSection.findByIdAndDelete(id);

        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        res.json({ message: 'Section deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reorder sections
// @route   PUT /api/admin/sections/reorder
// @access  Private/Admin
export const reorderSections = async (req, res) => {
    try {
        const { sectionOrders } = req.body; // Array of { id, order }

        const updatePromises = sectionOrders.map(({ id, order }) =>
            HomePageSection.findByIdAndUpdate(id, { order }, { new: true })
        );

        await Promise.all(updatePromises);
        const sections = await HomePageSection.find({}).sort({ order: 1 });
        res.json(sections);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
