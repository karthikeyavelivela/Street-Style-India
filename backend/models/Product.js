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
    // Stock Management Fields
    totalStock: { type: Number, default: 0 },
    onlineSales: { type: Number, default: 0 },
    offlineSales: { type: Number, default: 0 },
    availableStock: { type: Number, default: 0 },
    sku: { type: String, unique: true, sparse: true },
    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    tag: { type: String, enum: ['hot', 'new', 'others'], default: 'others' },
    tagColor: { type: String, default: '#DC143C' }
}, { timestamps: true });

// Virtual for calculating available stock
productSchema.virtual('calculatedAvailableStock').get(function() {
    return this.totalStock - this.onlineSales - this.offlineSales;
});

// Pre-save hook to update availableStock
productSchema.pre('save', function(next) {
    this.availableStock = this.totalStock - this.onlineSales - this.offlineSales;
    next();
});

export default mongoose.model("Product", productSchema);
