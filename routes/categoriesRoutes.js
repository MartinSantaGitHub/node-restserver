import { Router } from "express";
import { check } from "express-validator";
import {
    deleteCategory,
    getCategoryDetails,
    getCategories,
    createCategory,
    updateCategory,
} from "../controllers/categoriesController.js";
import { isCategory } from "../helpers/db-validators.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { isAdmin } from "../middlewares/validate-role.js";

const categoriesRouter = new Router();

categoriesRouter.get(
    "/",
    [
        check("limit").optional().isInt(),
        check("from").optional().isInt(),
        validateFields,
    ],
    getCategories
);

categoriesRouter.get(
    "/:id",
    [check("id").isMongoId().custom(isCategory), validateFields],
    getCategoryDetails
);

categoriesRouter.post(
    "/",
    [
        validateJWT,
        check("name", "The name is required").not().isEmpty(),
        validateFields,
    ],
    createCategory
);

categoriesRouter.put(
    "/:id",
    [
        validateJWT,
        check("id").isMongoId().custom(isCategory),
        check("name", "The name is required").not().isEmpty(),
        validateFields,
    ],
    updateCategory
);

categoriesRouter.delete(
    "/:id",
    [
        validateJWT,
        isAdmin,
        check("id").isMongoId().custom(isCategory),
        validateFields,
    ],
    deleteCategory
);

export { categoriesRouter };
