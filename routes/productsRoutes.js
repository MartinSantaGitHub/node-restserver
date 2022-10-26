import { Router } from "express";
import { check } from "express-validator";
import {
    deleteProduct,
    getProductDetails,
    getProducts,
    createProduct,
    updateProduct,
} from "../controllers/productsController.js";
import { isCategory, isProduct } from "../helpers/db-validators.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { isAdmin } from "../middlewares/validate-role.js";

const productsRouter = new Router();

productsRouter.get(
    "/",
    [
        check("limit").optional().isInt(),
        check("from").optional().isInt(),
        validateFields,
    ],
    getProducts
);

productsRouter.get(
    "/:id",
    [
        check("id", "Invalid Mongo Id").isMongoId().custom(isProduct),
        validateFields,
    ],
    getProductDetails
);

productsRouter.post(
    "/",
    [
        validateJWT,
        check("name", "The name is required").not().isEmpty(),
        check("category", "Invalid Mongo Id").isMongoId().custom(isCategory),
        check(
            "description",
            "The description is required and must be alphanumeric"
        )
            .not()
            .isEmpty()
            .isAlphanumeric("en-US", { ignore: "\\s" }),
        check("price").optional().isFloat(),
        check("isAvailable").optional().isBoolean(),
        validateFields,
    ],
    createProduct
);

productsRouter.put(
    "/:id",
    [
        validateJWT,
        check("id", "Invalid Mongo Id").isMongoId().custom(isProduct),
        check("name", "The name is required").not().isEmpty(),
        check(
            "description",
            "The description is required and must be alphanumeric"
        )
            .optional()
            .not()
            .isEmpty()
            .isAlphanumeric("en-US", { ignore: "\\s" }),
        check("category").optional().isMongoId().custom(isCategory),
        check("price").optional().isFloat(),
        check("isAvailable").optional().isBoolean(),
        validateFields,
    ],
    updateProduct
);

productsRouter.delete(
    "/:id",
    [
        validateJWT,
        isAdmin,
        check("id", "Invalid Mongo Id").isMongoId().custom(isProduct),
        validateFields,
    ],
    deleteProduct
);

export { productsRouter };
