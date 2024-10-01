import Voucher from "../models/voucherModel.js";

export const getVouchers = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    const vouchers = await Voucher.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ results: vouchers });
  } catch (error) {
    console.log("Error getting vouchers", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const createVoucher = async (req, res) => {
  try {
    const { code, discountValue, pointsRequired, expirationDate, status } =
      req.body;

    const voucher = await Voucher.create({
      code,
      discountValue,
      pointsRequired,
      expirationDate,
      status,
    });
    return res
      .status(200)
      .json({ results: voucher, message: "Voucher created" });
  } catch (error) {
    console.log("Error creating voucher", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const updateVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discountValue, pointsRequired, expirationDate, status } =
      req.body;
    const updatedVoucher = await Voucher.findByIdAndUpdate(
      id,
      {
        code,
        discountValue,
        pointsRequired,
        expirationDate,
        status,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ results: updatedVoucher, message: "Voucher updated" });
  } catch (error) {
    console.log("Error updating voucher", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    await Voucher.findByIdAndDelete(id);
    return res.status(200).json({ message: "Voucher deleted successfully" });
  } catch (error) {
    console.log("Error deleting voucher", error.message);
    return res.status(500).json({ message: error.message });
  }
};
