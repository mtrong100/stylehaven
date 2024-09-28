import express from "express";
import { protect } from "../middlewares/authMiddlware.js";
import { getInventory } from "../controllers/inventoryController.js";

const router = express.Router();

router.get("/", protect, getInventory);

// router.post("/create", createInventory);

// router.delete("/delete/:id", protect, deleteInventory);

export default router;
