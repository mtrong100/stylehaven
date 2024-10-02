import express from "express";
import { protect } from "../middlewares/authMiddlware.js";
import {
  createCategory,
  deleteCategory,
  getActiveCategories,
  getCategories,
  updateCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", getCategories);

router.get("/active", getActiveCategories);

router.post("/create", protect, createCategory);

router.put("/update/:id", protect, updateCategory);

router.delete("/delete/:id", protect, deleteCategory);

export default router;
