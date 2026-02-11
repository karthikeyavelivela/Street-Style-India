import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        unique: true,
        enum: ['Sales', 'Warehouse', 'Billing', 'Logistics', 'Management', 'Other']
    },
    description: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Department", departmentSchema);




