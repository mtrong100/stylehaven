import express from "express";
import { protect } from "../middlewares/authMiddlware.js";
import {
  createBrand,
  deleteBrand,
  getBrands,
  updateBrand,
} from "../controllers/brandController.js";

const router = express.Router();

router.get("/", protect, getBrands);

router.post("/create", protect, createBrand);

router.put("/update/:id", protect, updateBrand);

router.delete("/delete/:id", protect, deleteBrand);

export default router;
