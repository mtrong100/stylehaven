import Category from "../models/categoryModel.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "categoryId",
          as: "products",
        },
      },
      {
        $project: {
          name: 1,
          productCount: { $size: "$products" },
          status: 1,
          createdAt: 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return res.status(200).json({
      message: "Categories fetched successfully",
      results: categories,
    });
  } catch (error) {
    console.log("Error fetching categories", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const getActiveCategories = async (req, res) => {
  try {
    const categories = await Category.find({ status: "Active" });
    return res.status(200).json({
      message: "Categories fetched successfully",
      results: categories,
    });
  } catch (error) {
    console.log("Error fetching categories", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const uniqueCat = await Category.findOne({
      name: req.body.name,
    });

    if (uniqueCat) {
      return res
        .status(400)
        .json({ message: "Category already existed", results: uniqueCat });
    }

    const newCat = await Category.create({
      name: req.body.name,
    });

    return res
      .status(200)
      .json({ message: "Category created successfully", results: newCat });
  } catch (error) {
    console.log("Error creating category", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const updatedCat = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, status: req.body.status },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Category updated successfully", results: updatedCat });
  } catch (error) {
    console.log("Error updating category", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.log("Error deleting category", error.message);
    return res.status(500).json({ message: error.message });
  }
};
