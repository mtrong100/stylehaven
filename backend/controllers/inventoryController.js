import Inventory from "../models/inventoryModel.js";

export const getInventory = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const inventories = await Inventory.find(filter).populate({
      path: "productId",
      select: "name thumbnail price",
    });
    return res.status(200).json({ results: inventories });
  } catch (error) {
    console.log("Error getting inventories", error.message);
    return res.status(500).json({ message: error.message });
  }
};

// export const createInventory = async (req, res) => {
//   try {
//     const newInventory = await Inventory.create(req.body);

//     res.status(200).json({
//       message: "Inventory created successfully",
//       results: newInventory,
//     });
//   } catch (error) {
//     console.log("Error creating inventory", error.message);
//     return res.status(500).json({ message: error.message });
//   }
// };

// export const deleteInventory = async (req, res) => {
//   try {
//     await Inventory.findByIdAndDelete(req.params.id);
//     return res.status(200).json({ message: "Inventory deleted successfully" });
//   } catch (error) {
//     console.log("Error deleting inventory", error.message);
//     return res.status(500).json({ message: error.message });
//   }
// };
