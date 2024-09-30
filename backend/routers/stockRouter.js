import express from "express";
import { protect } from "../middlewares/authMiddlware.js";
import { createStock, getStock } from "../controllers/stockController.js";

const router = express.Router();

router.get("/", protect, getStock);

router.post("/create", createStock);

// router.delete("/delete/:id", protect, deleteInventory);

export default router;
