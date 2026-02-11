import express from "express";
import StockAdmin from "../models/StockAdmin.js";

const router = express.Router();

// Test endpoint to check if StockAdmin exists
router.get("/test-stock-admin", async (req, res) => {
    try {
        const stockAdmin = await StockAdmin.findOne();
        if (stockAdmin) {
            res.json({ 
                exists: true, 
                hasPin: !!stockAdmin.pin,
                isActive: stockAdmin.isActive,
                name: stockAdmin.name
            });
        } else {
            res.json({ exists: false, message: 'Run: npm run seed:stock' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;




