import jwt from "jsonwebtoken";
import StockAdmin from "../models/StockAdmin.js";
import Product from "../models/Product.js";
import Employee from "../models/Employee.js";
import Department from "../models/Department.js";
import Expense from "../models/Expense.js";
import OfflineSale from "../models/OfflineSale.js";

// Generate JWT Token for Stock Admin
const generateToken = (id) => {
    return jwt.sign({ id, type: 'stockAdmin' }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Authenticate stock admin with PIN
// @route   POST /api/admin-main/auth
// @access  Public
export const authenticateStockAdmin = async (req, res) => {
    try {
        const { pin } = req.body;

        // Validate PIN format
        if (!pin) {
            return res.status(400).json({ message: 'PIN is required' });
        }
        
        // Check if PIN is exactly 6 digits
        if (typeof pin !== 'string' || pin.length !== 6 || !/^\d{6}$/.test(pin)) {
            return res.status(400).json({ message: 'Please provide a valid 6-digit numeric PIN' });
        }

        // Find stock admin
        const stockAdmin = await StockAdmin.findOne({ isActive: true });

        if (!stockAdmin) {
            return res.status(404).json({ message: 'Stock admin not found. Please run: npm run seed:stock' });
        }

        // Check if PIN is set
        if (!stockAdmin.pin) {
            return res.status(500).json({ message: 'Stock admin PIN not configured properly' });
        }

        // Verify PIN
        let isMatch;
        try {
            isMatch = await stockAdmin.matchPin(pin);
        } catch (pinError) {
            console.error('PIN verification error:', pinError);
            return res.status(500).json({ message: 'Error verifying PIN', error: pinError.message });
        }

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid PIN' });
        }

        // Update last login
        stockAdmin.lastLogin = new Date();
        await stockAdmin.save();

        let token;
        try {
            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET is not defined in environment variables');
            }
            token = generateToken(stockAdmin._id);
        } catch (tokenError) {
            console.error('Token generation error:', tokenError);
            return res.status(500).json({ message: 'Error generating token', error: tokenError.message });
        }

        res.json({
            _id: stockAdmin._id,
            name: stockAdmin.name,
            token: token,
        });
    } catch (error) {
        console.error('Stock Admin Auth Error:', error);
        res.status(500).json({ 
            message: error.message || 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// @desc    Get admin-main dashboard stats
// @route   GET /api/admin-main/dashboard
// @access  Private/StockAdmin
export const getDashboardStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalEmployees = await Employee.countDocuments({ status: 'active' });
        
        // Calculate total offline sales
        const offlineSalesData = await OfflineSale.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: '$total' },
                    totalQuantity: { $sum: '$quantity' }
                }
            }
        ]);
        const totalOfflineSales = offlineSalesData[0]?.totalSales || 0;
        const totalOfflineQuantity = offlineSalesData[0]?.totalQuantity || 0;

        // Calculate total expenses
        const expensesData = await Expense.aggregate([
            {
                $group: {
                    _id: null,
                    totalExpenses: { $sum: '$amount' }
                }
            }
        ]);
        const totalExpenses = expensesData[0]?.totalExpenses || 0;

        // Calculate current stock
        const products = await Product.find();
        const totalStock = products.reduce((sum, p) => sum + (p.totalStock || 0), 0);
        const availableStock = products.reduce((sum, p) => sum + (p.availableStock || 0), 0);

        // Low stock alerts (products with availableStock < 10)
        const lowStockProducts = products.filter(p => (p.availableStock || 0) < 10).length;

        // Monthly expenses
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyExpenses = await Expense.aggregate([
            {
                $match: {
                    date: { $gte: monthStart }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);
        const monthlyExpensesTotal = monthlyExpenses[0]?.total || 0;

        res.json({
            totalProducts,
            totalEmployees,
            totalOfflineSales,
            totalOfflineQuantity,
            totalExpenses,
            monthlyExpenses: monthlyExpensesTotal,
            totalStock,
            availableStock,
            lowStockAlerts: lowStockProducts,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all products with stock info and offline sales
// @route   GET /api/admin-main/products
// @access  Private/StockAdmin
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        
        // Get offline sales totals for each product
        const offlineSalesData = await OfflineSale.aggregate([
            {
                $group: {
                    _id: '$productId',
                    totalOfflineSales: { $sum: '$quantity' },
                    totalOfflineRevenue: { $sum: '$total' }
                }
            }
        ]);

        // Create a map for quick lookup
        const salesMap = {};
        offlineSalesData.forEach(sale => {
            salesMap[sale._id.toString()] = {
                quantity: sale.totalOfflineSales,
                revenue: sale.totalOfflineRevenue
            };
        });

        // Add offline sales data to products
        const productsWithSales = products.map(product => {
            const sales = salesMap[product._id.toString()] || { quantity: 0, revenue: 0 };
            return {
                ...product.toObject(),
                offlineSalesTotal: sales.quantity,
                offlineRevenueTotal: sales.revenue
            };
        });

        res.json(productsWithSales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product (from admin-main)
// @route   POST /api/admin-main/products
// @access  Private/StockAdmin
export const createProduct = async (req, res) => {
    try {
        const productData = req.body;
        
        // Ensure stock fields are initialized
        if (!productData.totalStock) productData.totalStock = 0;
        if (!productData.onlineSales) productData.onlineSales = 0;
        if (!productData.offlineSales) productData.offlineSales = 0;
        
        // Sync variant stock with totalStock if variants exist
        if (productData.variants && productData.variants.length > 0) {
            const totalVariantStock = productData.variants.reduce((sum, variant) => {
                return sum + (variant.sizes || []).reduce((sizeSum, size) => {
                    return sizeSum + (size.stock || 0);
                }, 0);
            }, 0);
            
            // If totalStock is set but variants don't have stock, distribute it
            if (productData.totalStock > 0 && totalVariantStock === 0) {
                // Distribute totalStock across variants (simple distribution)
                const stockPerVariant = Math.floor(productData.totalStock / productData.variants.length);
                productData.variants.forEach(variant => {
                    variant.sizes.forEach(size => {
                        size.stock = stockPerVariant;
                    });
                });
            }
        }
        
        productData.availableStock = productData.totalStock - productData.onlineSales - productData.offlineSales;
        
        const product = new Product(productData);
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a product (from admin-main)
// @route   PUT /api/admin-main/products/:id
// @access  Private/StockAdmin
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update product fields
        Object.assign(product, req.body);
        
        // Sync variant stock with totalStock if totalStock changed
        if (req.body.totalStock !== undefined && product.variants && product.variants.length > 0) {
            const totalVariantStock = product.variants.reduce((sum, variant) => {
                return sum + (variant.sizes || []).reduce((sizeSum, size) => {
                    return sizeSum + (size.stock || 0);
                }, 0);
            }, 0);
            
            // If totalStock is set but variants don't have stock, distribute it
            if (product.totalStock > 0 && totalVariantStock === 0) {
                const stockPerVariant = Math.floor(product.totalStock / product.variants.length);
                product.variants.forEach(variant => {
                    variant.sizes.forEach(size => {
                        if (!size.stock || size.stock === 0) {
                            size.stock = stockPerVariant;
                        }
                    });
                });
            }
        }
        
        // Recalculate available stock
        product.availableStock = (product.totalStock || 0) - (product.onlineSales || 0) - (product.offlineSales || 0);
        
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a product (from admin-main)
// @route   DELETE /api/admin-main/products/:id
// @access  Private/StockAdmin
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update product stock (offline sales or manual adjustment)
// @route   PUT /api/admin-main/products/:id/stock
// @access  Private/StockAdmin
export const updateProductStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { action, quantity, reason } = req.body; // action: 'add', 'remove', 'adjust', 'damage'

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        switch (action) {
            case 'add':
                product.totalStock = (product.totalStock || 0) + quantity;
                // Also update variant stock if variants exist
                if (product.variants && product.variants.length > 0) {
                    const stockPerVariant = Math.floor(quantity / product.variants.length);
                    product.variants.forEach(variant => {
                        variant.sizes.forEach(size => {
                            size.stock = (size.stock || 0) + stockPerVariant;
                        });
                    });
                }
                break;
            case 'remove':
            case 'damage':
                product.totalStock = Math.max(0, (product.totalStock || 0) - quantity);
                // Update variant stock proportionally
                if (product.variants && product.variants.length > 0) {
                    const currentTotal = product.totalStock;
                    const newTotal = Math.max(0, currentTotal - quantity);
                    const ratio = currentTotal > 0 ? newTotal / currentTotal : 0;
                    product.variants.forEach(variant => {
                        variant.sizes.forEach(size => {
                            size.stock = Math.floor((size.stock || 0) * ratio);
                        });
                    });
                }
                break;
            case 'adjust':
                product.totalStock = quantity;
                // Distribute new total stock across variants
                if (product.variants && product.variants.length > 0) {
                    const stockPerVariant = Math.floor(quantity / product.variants.length);
                    product.variants.forEach(variant => {
                        variant.sizes.forEach(size => {
                            size.stock = stockPerVariant;
                        });
                    });
                }
                break;
            case 'offline_sale':
                product.offlineSales = (product.offlineSales || 0) + quantity;
                break;
            default:
                return res.status(400).json({ message: 'Invalid action' });
        }

        // Recalculate available stock
        product.availableStock = (product.totalStock || 0) - (product.onlineSales || 0) - (product.offlineSales || 0);
        
        // Sync variant stock to match available stock if needed
        if (product.variants && product.variants.length > 0) {
            const totalVariantStock = product.variants.reduce((sum, variant) => {
                return sum + (variant.sizes || []).reduce((sizeSum, size) => {
                    return sizeSum + (size.stock || 0);
                }, 0);
            }, 0);
            
            // If variant stock doesn't match totalStock, update it
            if (totalVariantStock !== product.totalStock && product.totalStock > 0) {
                const stockPerVariant = Math.floor(product.totalStock / product.variants.length);
                product.variants.forEach(variant => {
                    variant.sizes.forEach(size => {
                        size.stock = stockPerVariant;
                    });
                });
            }
        }

        await product.save();

        // If offline sale, create OfflineSale record
        if (action === 'offline_sale') {
            const salePrice = req.body.price || product.price;
            await OfflineSale.create({
                productId: id,
                productName: product.name,
                quantity,
                price: salePrice,
                total: salePrice * quantity,
                color: req.body.color || '',
                size: req.body.size || '',
                addedBy: req.stockAdmin._id,
                notes: reason || 'Offline sale'
            });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all employees
// @route   GET /api/admin-main/employees
// @access  Private/StockAdmin
export const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().populate('department').sort({ createdAt: -1 });
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create employee
// @route   POST /api/admin-main/employees
// @access  Private/StockAdmin
export const createEmployee = async (req, res) => {
    try {
        const employee = await Employee.create(req.body);
        await employee.populate('department');
        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update employee
// @route   PUT /api/admin-main/employees/:id
// @access  Private/StockAdmin
export const updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('department');
        
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete employee
// @route   DELETE /api/admin-main/employees/:id
// @access  Private/StockAdmin
export const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all departments
// @route   GET /api/admin-main/departments
// @access  Private/StockAdmin
export const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find({ isActive: true }).sort({ name: 1 });
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create department
// @route   POST /api/admin-main/departments
// @access  Private/StockAdmin
export const createDepartment = async (req, res) => {
    try {
        const department = await Department.create(req.body);
        res.status(201).json(department);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all expenses
// @route   GET /api/admin-main/expenses
// @access  Private/StockAdmin
export const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find().populate('addedBy', 'name').sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create expense
// @route   POST /api/admin-main/expenses
// @access  Private/StockAdmin
export const createExpense = async (req, res) => {
    try {
        const expense = await Expense.create({
            ...req.body,
            addedBy: req.stockAdmin._id
        });
        await expense.populate('addedBy', 'name');
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update expense
// @route   PUT /api/admin-main/expenses/:id
// @access  Private/StockAdmin
export const updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('addedBy', 'name');
        
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        
        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete expense
// @route   DELETE /api/admin-main/expenses/:id
// @access  Private/StockAdmin
export const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.json({ message: 'Expense deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get offline sales
// @route   GET /api/admin-main/sales
// @access  Private/StockAdmin
export const getOfflineSales = async (req, res) => {
    try {
        const sales = await OfflineSale.find()
            .populate('productId', 'name images')
            .populate('addedBy', 'name')
            .sort({ date: -1 });
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Global search
// @route   GET /api/admin-main/search
// @access  Private/StockAdmin
export const globalSearch = async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q || q.length < 2) {
            return res.json({ products: [], employees: [] });
        }

        const searchRegex = new RegExp(q, 'i');

        // Search products
        const products = await Product.find({
            $or: [
                { name: searchRegex },
                { category: searchRegex },
                { sku: searchRegex },
                { 'variants.color': searchRegex },
                { 'variants.sizes.size': searchRegex }
            ]
        }).limit(20);

        // Search employees
        const employees = await Employee.find({
            $or: [
                { name: searchRegex },
                { email: searchRegex },
                { role: searchRegex }
            ]
        }).populate('department').limit(10);

        res.json({ products, employees });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

