import express from "express";
import userRouter from "./userRouter.js";
import categoryRouter from "./categoryRouter.js";
import subCategoryRouter from "./subCategoryRouter.js";
import brandRouter from "./brandRouter.js";
import supplierRouter from "./supplierRouter.js";
import productRouter from "./productRouter.js";
import stockEntryRouter from "./stockEntryRouter.js";
import stockRouter from "./stockRouter.js";
import voucherRouter from "./voucherRouter.js";
import postRouter from "./postRouter.js";
import commentRouter from "./commentRouter.js";

const router = express.Router();

router.use("/users", userRouter);
router.use("/categories", categoryRouter);
router.use("/sub-categories", subCategoryRouter);
router.use("/brands", brandRouter);
router.use("/suppliers", supplierRouter);
router.use("/products", productRouter);
router.use("/stocks", stockRouter);
router.use("/stock-entries", stockEntryRouter);
router.use("/vouchers", voucherRouter);
router.use("/posts", postRouter);
router.use("/comments", commentRouter);

export default router;
