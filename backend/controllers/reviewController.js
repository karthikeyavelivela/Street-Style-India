import Review from "../models/Review.js";
import Product from "../models/Product.js";

// @desc    Get reviews (optionally filter by product)
// @route   GET /api/reviews
// @access  Public
export const getReviews = async (req, res) => {
    try {
        const { productId, limit, status } = req.query;
        const filter = productId ? { productId } : {};

        if (status && status !== "all") {
            filter.status = status;
        } else if (!status) {
            filter.status = "published";
        }

        const reviews = await Review.find(filter)
            .sort({ createdAt: -1 })
            .limit(Number(limit) || 0)
            .populate("productId", "name images");

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const review = new Review({
            productId,
            userId: req.user?._id,
            name: req.user?.name || "Guest",
            rating,
            comment
        });

        const saved = await review.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update review (admin only)
// @route   PUT /api/reviews/:id
// @access  Private/Admin
export const updateReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        review.rating = req.body.rating ?? review.rating;
        review.comment = req.body.comment ?? review.comment;
        review.status = req.body.status ?? review.status;

        const updated = await review.save();
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        await review.deleteOne();
        res.json({ message: "Review removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

