import express from "express";
import { 
    getDashboardStats, 
    getAllUsers,
    getSections,
    createSection,
    updateSection,
    deleteSection,
    reorderSections
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, admin, getDashboardStats);
router.get("/users", protect, admin, getAllUsers);
router.get("/sections", protect, admin, getSections);
router.post("/sections", protect, admin, createSection);
router.put("/sections/:id", protect, admin, updateSection);
router.delete("/sections/:id", protect, admin, deleteSection);
router.put("/sections/reorder", protect, admin, reorderSections);

export default router;
