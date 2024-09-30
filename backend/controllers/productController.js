import Product from "../models/productModel.js";
import Stock from "../models/stockModel.js";
import { uploadImagesCloudinary } from "../utils/uploadImagesCloudinary.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate([
      {
        path: "categoryId",
        select: "name",
      },
      {
        path: "subCategoryId",
        select: "name",
      },
      {
        path: "brandId",
        select: "name country image",
      },
    ]);

    return res
      .status(200)
      .json({ message: "Products fetched successfully", results: products });
  } catch (error) {
    console.log("Error getting products", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const getProductDetails = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate([
      {
        path: "categoryId",
        select: "name",
      },
      {
        path: "subCategoryId",
        select: "name",
      },
      {
        path: "brandId",
        select: "name country image",
      },
    ]);

    return res.status(200).json({
      message: "Product details fetched successfully",
      results: product,
    });
  } catch (error) {
    console.log("Error getting product details", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { images, thumbnail } = req.body;

    // Validate required fields
    if (!thumbnail || !images || images.length === 0) {
      return res
        .status(400)
        .json({ message: "Thumbnail and images are required." });
    }

    // Upload thumbnail and images in parallel
    const [thumbnailResult, imageResults] = await Promise.all([
      uploadImagesCloudinary(thumbnail),
      Promise.all(
        images.map((imageBase64) => uploadImagesCloudinary(imageBase64))
      ),
    ]);

    // Extract secure URLs from the image results
    const imageUrls = imageResults.map((result) => result.secure_url);

    const [newProduct, stock] = await Promise.all([
      Product.create({
        ...req.body,
        thumbnail: thumbnailResult.secure_url,
        images: imageUrls,
      }),
      Stock.create({ productId: newProduct?._id }),
    ]);

    return res
      .status(200)
      .json({ message: "Product created successfully", results: newProduct });
  } catch (error) {
    console.error("Error creating product", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { images, thumbnail, ...productData } = req.body;

    // Find the product to update
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Handle thumbnail upload if provided
    let thumbnailUrl = product.thumbnail;
    if (thumbnail) {
      const thumbnailResult = await uploadImagesCloudinary(thumbnail);
      thumbnailUrl = thumbnailResult.secure_url;
    }

    // Handle images upload if provided
    let imageUrls = product.images;
    if (images && images.length > 0) {
      const imageResults = await Promise.all(
        images.map((imageBase64) => uploadImagesCloudinary(imageBase64))
      );
      imageUrls = imageResults.map((result) => result.secure_url);
    }

    // Update the product fields
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        ...productData, // Update other product fields
        thumbnail: thumbnailUrl, // Update thumbnail if changed
        images: imageUrls, // Update images if provided
      },
      { new: true, runValidators: true } // Return updated product and run validations
    );

    return res.status(200).json({
      message: "Product updated successfully",
      results: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error deleting product", error.message);
    return res.status(500).json({ message: error.message });
  }
};
