import express from "express";
import { protect } from "../middlewares/authMiddlware.js";
import {
  createProduct,
  deleteProduct,
  getProductDetails,
  getProducts,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", protect, getProducts);

router.get("/:id", protect, getProductDetails);

router.post("/create", protect, createProduct);

router.put("/update/:id", protect, updateProduct);

router.delete("/delete/:id", protect, deleteProduct);

export default router;
