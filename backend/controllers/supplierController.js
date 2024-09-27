import Supplier from "../models/supplierModel.js";

export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    return res.status(200).json({ results: suppliers });
  } catch (error) {
    console.log("Error getting suppliers", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const createSupplier = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    const newSupplier = await Supplier.create({
      name,
      email,
      phone,
      address,
    });

    return res
      .status(201)
      .json({ message: "Supplier created", results: newSupplier });
  } catch (error) {
    console.log("Error creating supplier", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const updateSupplier = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, address },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Supplier updated", results: updatedSupplier });
  } catch (error) {
    console.log("Error updating supplier", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteSupplier = async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Supplier deleted" });
  } catch (error) {
    console.log("Error deleting supplier", error.message);
    return res.status(500).json({ message: error.message });
  }
};
