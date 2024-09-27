import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["In Stock", "Out of Stock", "Low Stock"],
      default: "In Stock",
    },
  },
  {
    timestamps: true,
  }
);

inventorySchema.pre("save", function (next) {
  if (this.quantity === 0) {
    this.status = "Out of Stock";
  } else if (this.quantity < 10) {
    this.status = "Low Stock";
  } else {
    this.status = "In Stock";
  }
  next();
});

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;
