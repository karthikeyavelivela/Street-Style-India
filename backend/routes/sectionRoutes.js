import express from "express";
import { getActiveSections } from "../controllers/adminController.js";

const router = express.Router();

// Public route to get active sections
router.get("/", getActiveSections);

export default router;

