import express from "express";
import { protect } from "../middlewares/authMiddlware.js";
import {
  createSubCategory,
  deleteSubCategory,
  getActiveSubCategories,
  getSubCategories,
  updateSubCategory,
} from "../controllers/subCategoryController.js";

const router = express.Router();

router.get("/", protect, getSubCategories);

router.get("/active", protect, getActiveSubCategories);

router.post("/create", protect, createSubCategory);

router.put("/update/:id", protect, updateSubCategory);

router.delete("/delete/:id", protect, deleteSubCategory);

export default router;
