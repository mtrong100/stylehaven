import SubCategory from "../models/subCategoryModel.js";

export const getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "subCategoryId",
          as: "products",
        },
      },
      {
        $project: {
          name: 1,
          status: 1,
          createdAt: 1,
          categoryId: 1,
          category: "$category.name",
          productCount: { $size: "$products" },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return res.status(200).json({
      message: "SubCategories fetched successfully",
      results: subCategories,
    });
  } catch (error) {
    console.log("Error fetching subCategories", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const createSubCategory = async (req, res) => {
  try {
    const uniqueSubCat = await SubCategory.findOne({
      name: req.body.name,
    });

    if (uniqueSubCat) {
      return res.status(400).json({
        message: "SubCategory already existed",
        results: uniqueSubCat,
      });
    }

    const newSubCategory = await SubCategory.create(req.body);

    return res.status(200).json({
      message: "SubCategory created successfully",
      results: newSubCategory,
    });
  } catch (error) {
    console.log("Error creating SubCategory", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const updateSubCategory = async (req, res) => {
  try {
    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.status(200).json({
      message: "SubCategory updated successfully",
      results: updatedSubCategory,
    });
  } catch (error) {
    console.log("Error updating SubCategory", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteSubCategory = async (req, res) => {
  try {
    await SubCategory.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ message: "SubCategory deleted successfully" });
  } catch (error) {
    console.log("Error deleting SubCategory", error.message);
    return res.status(500).json({ message: error.message });
  }
};
