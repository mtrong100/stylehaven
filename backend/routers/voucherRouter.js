import express from "express";
import { protect } from "../middlewares/authMiddlware.js";
import {
  createVoucher,
  deleteVoucher,
  getVouchers,
  updateVoucher,
} from "../controllers/voucherController.js";

const router = express.Router();

router.get("/", getVouchers);

router.post("/create", protect, createVoucher);

router.put("/update/:id", protect, updateVoucher);

router.delete("/delete/:id", protect, deleteVoucher);

export default router;
