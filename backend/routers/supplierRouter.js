import express from "express";
import { protect } from "../middlewares/authMiddlware.js";
import {
  createSupplier,
  deleteSupplier,
  getSuppliers,
  updateSupplier,
} from "../controllers/supplierController.js";

const router = express.Router();

router.get("/", protect, getSuppliers);

router.post("/create", protect, createSupplier);

router.put("/update/:id", protect, updateSupplier);

router.delete("/delete/:id", protect, deleteSupplier);

export default router;
