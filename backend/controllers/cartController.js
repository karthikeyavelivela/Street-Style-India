import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
        
        if (!cart) {
            cart = new Cart({ userId: req.user._id, items: [] });
            await cart.save();
        }

        // Enrich items with product details
        const enrichedItems = await Promise.all(
            cart.items.map(async (item) => {
                const product = await Product.findById(item.productId);
                if (!product) return null;
                
                return {
                    _id: item._id,
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    discount: product.discount,
                    image: product.images?.[0] || '',
                    size: item.size,
                    color: item.color,
                    quantity: item.quantity
                };
            })
        );

        res.json({ items: enrichedItems.filter(Boolean) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity, size, color } = req.body;

        if (!productId || !size || !color) {
            return res.status(400).json({ message: "Product ID, size, and color are required" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if variant exists and has stock
        const variant = product.variants?.find(v => v.color === color);
        if (!variant) {
            return res.status(400).json({ message: "Color variant not found" });
        }

        const sizeObj = variant.sizes?.find(s => s.size === size);
        if (!sizeObj) {
            return res.status(400).json({ message: "Size not found for this color" });
        }

        if (sizeObj.stock < quantity) {
            return res.status(400).json({ message: "Insufficient stock" });
        }

        let cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            cart = new Cart({ userId: req.user._id, items: [] });
        }

        // Check if item already exists with same product, size, and color
        const existingItemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId && 
                    item.size === size && 
                    item.color === color
        );

        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({ productId, quantity, size, color });
        }

        await cart.save();
        res.json({ message: "Item added to cart", cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateCartItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1" });
        }

        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.items.id(itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        // Check stock
        const product = await Product.findById(item.productId);
        const variant = product.variants?.find(v => v.color === item.color);
        const sizeObj = variant?.sizes?.find(s => s.size === item.size);
        
        if (!sizeObj || sizeObj.stock < quantity) {
            return res.status(400).json({ message: "Insufficient stock" });
        }

        item.quantity = quantity;
        await cart.save();

        res.json({ message: "Cart updated", cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;

        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(item => item._id.toString() !== itemId);
        await cart.save();

        res.json({ message: "Item removed from cart", cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        res.json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};






