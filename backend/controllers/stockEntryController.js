import Inventory from "../models/inventoryModel.js";
import StockEntry from "../models/stockEntryModel.js";

export const getStockEntries = async (req, res) => {
  try {
    const { status } = req.query; // Get status from query params

    // Create a filter based on the status if provided
    const filter = status ? { status } : {};

    // Find stock entries, populate the supplier and productId fields
    const stockEntries = await StockEntry.find(filter)
      .populate({
        path: "supplier",
        select: "name email phone address", // Select specific supplier fields to populate
      })
      .populate({
        path: "products.productId",
        select: "name thumbnail price category", // Select specific product fields to populate
      });

    return res.status(200).json({ results: stockEntries });
  } catch (error) {
    console.log("Error getting stock entries:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const createStockEntry = async (req, res) => {
  try {
    const { products } = req.body;

    // Create the new stock entry
    const newStockEntry = await StockEntry.create({
      ...req.body,
      products,
    });

    // Update inventory quantities using Promise.all for concurrency
    await Promise.all(
      products.map(async (product) => {
        const inventory = await Inventory.findOne({
          productId: product.productId,
        });

        // If the inventory exists, update its quantity
        if (inventory) {
          inventory.quantity -= product.quantity;
          await inventory.save();
        }
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
