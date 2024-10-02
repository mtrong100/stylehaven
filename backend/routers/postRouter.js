import express from "express";
import { protect } from "../middlewares/authMiddlware.js";
import {
  createPost,
  deletePost,
  getPostDetails,
  getPosts,
  updatePost,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/", getPosts);

router.get("/:id", getPostDetails);

router.post("/create", protect, createPost);

router.put("/update/:id", protect, updatePost);

router.delete("/delete/:id", protect, deletePost);

export default router;
