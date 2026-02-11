import express from "express";
import {
    authenticateStockAdmin,
    getDashboardStats,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getDepartments,
    createDepartment,
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    getOfflineSales,
    globalSearch
} from "../controllers/stockAdminController.js";
import { protectStockAdmin } from "../middleware/stockAdminMiddleware.js";

const router = express.Router();

// Authentication
router.post("/auth", authenticateStockAdmin);

// Dashboard
router.get("/dashboard", protectStockAdmin, getDashboardStats);

// Products
router.route("/products")
    .get(protectStockAdmin, getProducts)
    .post(protectStockAdmin, createProduct);

router.route("/products/:id")
    .put(protectStockAdmin, updateProduct)
    .delete(protectStockAdmin, deleteProduct);

router.put("/products/:id/stock", protectStockAdmin, updateProductStock);

// Employees
router.route("/employees")
    .get(protectStockAdmin, getEmployees)
    .post(protectStockAdmin, createEmployee);

router.route("/employees/:id")
    .put(protectStockAdmin, updateEmployee)
    .delete(protectStockAdmin, deleteEmployee);

// Departments
router.route("/departments")
    .get(protectStockAdmin, getDepartments)
    .post(protectStockAdmin, createDepartment);

// Expenses
router.route("/expenses")
    .get(protectStockAdmin, getExpenses)
    .post(protectStockAdmin, createExpense);

router.route("/expenses/:id")
    .put(protectStockAdmin, updateExpense)
    .delete(protectStockAdmin, deleteExpense);

// Offline Sales
router.get("/sales", protectStockAdmin, getOfflineSales);

// Global Search
router.get("/search", protectStockAdmin, globalSearch);

export default router;

