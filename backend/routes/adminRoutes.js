import express from "express";
import { getDashboardStats, getAllUsers } from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, admin, getDashboardStats);
router.get("/users", protect, admin, getAllUsers);

export default router;
