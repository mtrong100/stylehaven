import StockEntry from "../models/stockEntryModel.js";
import Stock from "../models/stockModel.js";

export const getStockEntries = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = status ? { status } : {};

    const stockEntries = await StockEntry.find(filter)
      .populate([
        {
          path: "supplierId",
        },
      ])
      .sort({ createdAt: -1 });

    return res.status(200).json({ results: stockEntries });
  } catch (error) {
    console.log("Error getting stock entries:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const getStockEntryDetails = async (req, res) => {
  try {
    const stockEntry = await StockEntry.findById(req.params.id).populate([
      {
        path: "supplierId",
      },
      {
        path: "products.productId",
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
      },
    ]);

    return res.status(200).json({ results: stockEntry });
  } catch (error) {
    console.log("Error getting stock entry details:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const createStockEntry = async (req, res) => {
  try {
    const { products } = req.body;

    const newStockEntry = await StockEntry.create({
      ...req.body,
      products,
    });

    await Promise.all(
      products.map(async (product) => {
        let stock = await Stock.findOne({
          productId: product.productId,
        });

        if (stock) {
          stock.quantity += product.quantity;
        }

        await stock.save();
      })
    );

    res.status(200).json({
      message: "Stock entry created successfully",
      results: newStockEntry,
    });
  } catch (error) {
    console.error("Error creating stock entry:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const updateStockEntry = async (req, res) => {
  try {
    const updatedStockEntry = await StockEntry.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.status(200).json({
      message: "Stock entry updated successfully",
      results: updatedStockEntry,
    });
  } catch (error) {
    console.log("Error updating stock entry", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteStockEntry = async (req, res) => {
  try {
    await StockEntry.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ message: "Stock entry deleted successfully" });
  } catch (error) {
    console.log("Error deleting stock entry", error.message);
    return res.status(500).json({ message: error.message });
  }
};
