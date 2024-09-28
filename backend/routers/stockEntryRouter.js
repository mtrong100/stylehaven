import express from "express";
import { protect } from "../middlewares/authMiddlware.js";
import {
  createStockEntry,
  deleteStockEntry,
  getStockEntries,
  updateStockEntry,
} from "../controllers/stockEntryController.js";

const router = express.Router();

router.get("/", protect, getStockEntries);

router.post("/create", protect, createStockEntry);

router.put("/update/:id", protect, updateStockEntry);

router.delete("/delete/:id", protect, deleteStockEntry);

export default router;
