import Stock from "../models/stockModel.js";

export const getStock = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const stock = await Stock.find(filter).populate({
      path: "productId",
      populate: [
        {
          path: "categoryId",
        },
        {
          path: "subCategoryId",
        },
        {
          path: "brandId",
        },
      ],
    });
    return res.status(200).json({ results: stock });
  } catch (error) {
    console.log("Error getting stock", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const createStock = async (req, res) => {
  try {
    const stock = await Stock.create(req.body);
    return res.status(200).json({ results: stock });
  } catch (error) {
    console.log("Error creating stock", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const updateStock = async (req, res) => {
  try {
    const updatedStock = await Stock.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    return res.status(200).json({
      message: "Stock updated successfully",
      results: updatedStock,
    });
  } catch (error) {
    console.log("Error updating stock", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteStock = async (req, res) => {
  try {
    await Stock.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Stock deleted successfully" });
  } catch (error) {
    console.log("Error deleting stock", error.message);
    return res.status(500).json({ message: error.message });
  }
};
