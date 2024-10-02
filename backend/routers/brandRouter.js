import express from "express";
import { protect } from "../middlewares/authMiddlware.js";
import {
  createBrand,
  deleteBrand,
  getActiveBrands,
  getBrands,
  updateBrand,
} from "../controllers/brandController.js";

const router = express.Router();

router.get("/", getBrands);

router.get("/active", getActiveBrands);

router.post("/create", protect, createBrand);

router.put("/update/:id", protect, updateBrand);

router.delete("/delete/:id", protect, deleteBrand);

export default router;
