import jwt from "jsonwebtoken";
import StockAdmin from "../models/StockAdmin.js";

export const protectStockAdmin = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Verify it's a stock admin token
            if (decoded.type !== 'stockAdmin') {
                return res.status(401).json({ message: "Not authorized, invalid token type" });
            }

            req.stockAdmin = await StockAdmin.findById(decoded.id).select("-pin");
            
            if (!req.stockAdmin || !req.stockAdmin.isActive) {
                return res.status(401).json({ message: "Stock admin not found or inactive" });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    } else {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};




