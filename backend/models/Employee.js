import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String },
    department: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Department',
        required: true 
    },
    role: { type: String, required: true },
    salary: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['active', 'inactive', 'terminated'], 
        default: 'active' 
    },
    joinDate: { type: Date, default: Date.now },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String
    }
}, { timestamps: true });

export default mongoose.model("Employee", employeeSchema);




