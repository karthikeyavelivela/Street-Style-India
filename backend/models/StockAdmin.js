import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const stockAdminSchema = new mongoose.Schema({
    pin: { 
        type: String, 
        required: true
    },
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date }
}, { timestamps: true });

// Hash PIN before saving
stockAdminSchema.pre('save', async function(next) {
    if (!this.isModified('pin')) {
        return next();
    }
    // Validate PIN length before hashing
    if (this.pin && this.pin.length !== 6 && !this.pin.startsWith('$2')) {
        // If PIN is not 6 digits and not already hashed, it's invalid
        const error = new Error('PIN must be exactly 6 digits');
        return next(error);
    }
    // Only hash if not already hashed (bcrypt hashes start with $2)
    if (this.pin && !this.pin.startsWith('$2')) {
        const salt = await bcrypt.genSalt(10);
        this.pin = await bcrypt.hash(this.pin, salt);
    }
    next();
});

// Method to compare PIN
stockAdminSchema.methods.matchPin = async function(enteredPin) {
    return await bcrypt.compare(enteredPin, this.pin);
};

export default mongoose.model("StockAdmin", stockAdminSchema);

