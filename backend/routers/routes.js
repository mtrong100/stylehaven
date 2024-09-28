import express from "express";
import userRouter from "./userRouter.js";
import categoryRouter from "./categoryRouter.js";
import subCategoryRouter from "./subCategoryRouter.js";
import brandRouter from "./brandRouter.js";
import supplierRouter from "./supplierRouter.js";
import productRouter from "./productRouter.js";
import inventoryRouter from "./inventoryRouter.js";
import stockEntryRouter from "./stockEntryRouter.js";

const router = express.Router();

router.use("/users", userRouter);
router.use("/categories", categoryRouter);
router.use("/sub-categories", subCategoryRouter);
router.use("/brands", brandRouter);
router.use("/suppliers", supplierRouter);
router.use("/products", productRouter);
router.use("/inventory", inventoryRouter);
router.use("/stock-entries", stockEntryRouter);

export default router;
