import Brand from "../models/brandModel.js";

export const getBrands = async (req, res) => {
  try {
    const brands = await Brand.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "brandId",
          as: "products",
        },
      },
      {
        $project: {
          name: 1,
          country: 1,
          image: 1,
          status: 1,
          productCount: { $size: "$products" },
          createdAt: 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return res.status(200).json({
      message: "Brands fetched successfully",
      results: brands,
    });
  } catch (error) {
    console.log("Error getting brands", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const createBrand = async (req, res) => {
  try {
    const uniqueBrand = await Brand.findOne({
      name: req.body.name,
    });

    if (uniqueBrand) {
      return res
        .status(400)
        .json({ message: "Brand already existed", results: uniqueBrand });
    }

    const newBrand = await Brand.create(req.body);

    return res
      .status(200)
      .json({ message: "Brand created successfully", results: newBrand });
  } catch (error) {
    console.log("Error creating brand", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const updateBrand = async (req, res) => {
  try {
    const updatedBrand = await Brand.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Brand updated successfully", results: updatedBrand });
  } catch (error) {
    console.log("Error updating brand", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteBrand = async (req, res) => {
  try {
    await Brand.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.log("Error deleting brand", error.message);
    return res.status(500).json({ message: error.message });
  }
};
