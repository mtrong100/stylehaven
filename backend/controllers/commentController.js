import Comment from "../models/commentModel.js";
import Post from "../models/postModel.js";

export const getPostsWithComments = async (req, res) => {
  try {
    const posts = await Post.find().select("title image");

    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const comments = await Comment.find({ postId: post._id }).populate({
          path: "userId",
          select: "name avatar",
        });

        return {
          _id: post._id,
          title: post.title,
          image: post.image,
          totalComments: comments.length,
          comments: comments.map((comment) => ({
            _id: comment._id,
            userId: comment.userId._id,
            userName: comment.userId.name,
            userAvatar: comment.userId.avatar,
            comment: comment.comment,
          })),
        };
      })
    );

    return res.status(200).json({ results: postsWithComments });
  } catch (error) {
    console.error("Error getting posts with comments:", error.message);
    return res.status(500).json({
      message: "An error occurred while fetching posts and comments.",
    });
  }
};

export const createComment = async (req, res) => {
  try {
    const newComment = await Comment.create(req.body);

    return res.status(200).json({
      message: "Comment created successfully.",
      results: newComment,
    });
  } catch (error) {
    console.error("Error creating comment:", error.message);
    return res.status(500).json({
      message: "An error occurred while creating the comment.",
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.log("Error deleting comment", error.message);
    return res.status(500).json({ message: error.message });
  }
};
