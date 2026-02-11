import Product from "../models/Product.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        const {
            keyword,
            category,
            colors,
            sizes,
            minPrice,
            maxPrice,
            featured,
            trending,
            sort,
            limit,
            includeInactive
        } = req.query;

        const filter = {};
        if (includeInactive !== "true") {
            filter.isActive = true;
        }

        if (keyword) {
            filter.name = { $regex: keyword, $options: "i" };
        }

        if (category) {
            filter.category = { $in: category.split(",") };
        }

        if (colors) {
            filter["variants.color"] = { $in: colors.split(",") };
        }

        if (sizes) {
            filter["variants.sizes.size"] = { $in: sizes.split(",") };
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if (featured === "true") filter.featured = true;
        if (trending === "true") filter.trending = true;

        const sortOption = sort === "latest" ? { createdAt: -1 } : { createdAt: -1 };

        const products = await Product.find(filter)
            .sort(sortOption)
            .limit(Number(limit) || 0);

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get dynamic product metadata for filters
// @route   GET /api/products/meta
// @access  Public
export const getProductMeta = async (_req, res) => {
    try {
        const products = await Product.find({ isActive: true }).select("category price variants");

        const meta = products.reduce((acc, product) => {
            if (product.category) acc.categories.add(product.category);
            if (typeof product.price === "number") {
                acc.minPrice = Math.min(acc.minPrice, product.price);
                acc.maxPrice = Math.max(acc.maxPrice, product.price);
            }
            product.variants?.forEach(variant => {
                if (variant.color) acc.colors.add(variant.color);
                variant.sizes?.forEach(sizeObj => {
                    if (sizeObj.size) acc.sizes.add(sizeObj.size);
                });
            });
            return acc;
        }, { categories: new Set(), colors: new Set(), sizes: new Set(), minPrice: Infinity, maxPrice: 0 });

        res.json({
            categories: Array.from(meta.categories),
            colors: Array.from(meta.colors),
            sizes: Array.from(meta.sizes),
            minPrice: meta.minPrice === Infinity ? 0 : meta.minPrice,
            maxPrice: meta.maxPrice
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
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

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
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
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne(); // or findByIdAndDelete
            res.json({ message: "Product removed" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
