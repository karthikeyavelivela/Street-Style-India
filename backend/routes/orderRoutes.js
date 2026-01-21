import express from "express";
import {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    updatePaymentStatus,
    requestCancellation,
    respondCancellation
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
    .post(protect, createOrder)
    .get(protect, admin, getAllOrders);

router.get("/my", protect, getMyOrders);

router.route("/:id")
    .get(protect, getOrderById);

router.route("/:id/status")
    .put(protect, admin, updateOrderStatus);

router.route("/:id/payment")
    .put(protect, admin, updatePaymentStatus);

router.route("/:id/cancel-request")
    .post(protect, requestCancellation);

router.route("/:id/cancel-response")
    .put(protect, admin, respondCancellation);

export default router;
