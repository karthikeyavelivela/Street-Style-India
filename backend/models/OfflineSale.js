import mongoose from "mongoose";

const offlineSaleSchema = new mongoose.Schema({
    productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product',
        required: true 
    },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true },
    color: { type: String },
    size: { type: String },
    date: { type: Date, default: Date.now },
    addedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'StockAdmin',
        required: true 
    },
    notes: { type: String }
}, { timestamps: true });

export default mongoose.model("OfflineSale", offlineSaleSchema);




