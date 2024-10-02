import express from "express";
import { protect } from "../middlewares/authMiddlware.js";
import {
  createComment,
  deleteComment,
  getPostsWithComments,
} from "../controllers/commentController.js";

const router = express.Router();

router.get("/", getPostsWithComments);

// router.get("/:postId", getCommentInPost);

router.post("/create", protect, createComment);

router.delete("/delete/:id", protect, deleteComment);

export default router;
