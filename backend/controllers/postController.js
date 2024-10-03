import Post from "../models/postModel.js";

export const getPosts = async (req, res) => {
  try {
    const { status, category } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }
    if (category) {
      filter.category = category;
    }

    const posts = await Post.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ results: posts });
  } catch (error) {
    console.log("Error getting posts", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const getPostDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    return res.status(200).json({ results: post });
  } catch (error) {
    console.log("Error getting post details", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const post = await Post.create(req.body);

    return res.status(200).json({ results: post, message: "Post created" });
  } catch (error) {
    console.log("Error creating post", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json({ results: post, message: "Post updated" });
  } catch (error) {
    console.log("Error updating post", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    return res.status(200).json({ results: post, message: "Post deleted" });
  } catch (error) {
    console.log("Error deleting post", error.message);
    return res.status(500).json({ message: error.message });
  }
};
