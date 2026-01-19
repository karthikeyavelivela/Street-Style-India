import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        price: Number,
        quantity: Number,
        size: String,
        color: String,
        image: String
    }],
    shippingAddress: {
        fullName: String,
        phone: String,
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        pincode: String,
    },
    paymentMethod: { type: String, default: 'COD' }, // Razorpay, COD
    paymentId: { type: String },
    paymentStatus: { type: String, default: 'Pending' }, // Pending, Paid, Failed
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
