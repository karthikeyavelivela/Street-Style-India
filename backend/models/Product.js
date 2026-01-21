import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true }, // T-Shirts, Hoodies, Oversized
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    description: { type: String, required: true },
    images: [{ type: String }], // URLs
    variants: [{
        color: { type: String },
        sizes: [{
            size: { type: String }, // S, M, L, XL
            stock: { type: Number, default: 0 }
        }]
    }],
    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    tag: { type: String, enum: ['hot', 'new', 'others'], default: 'others' },
    tagColor: { type: String, default: '#DC143C' }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
