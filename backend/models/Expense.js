import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { 
        type: String, 
        required: true,
        enum: ['Rent', 'Electricity', 'Salary', 'Transport', 'Misc', 'Other']
    },
    description: { type: String },
    date: { type: Date, default: Date.now },
    addedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'StockAdmin' 
    }
}, { timestamps: true });

export default mongoose.model("Expense", expenseSchema);




