import { Router } from "express";
import { check } from "express-validator";
import { search } from "../controllers/searchController.js";
import { validateFields } from "../middlewares/validate-fields.js";

const searchRouter = new Router();

searchRouter.get(
    "/:collection/:term",
    [
        check("limit").optional().isInt(),
        check("from").optional().isInt(),
        validateFields,
    ],
    search
);

export { searchRouter };
