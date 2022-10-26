import { Router } from "express";
import { check } from "express-validator";
import {
    getImage,
    updateImageCloudinary,
    uploadFile,
} from "../controllers/uploadsController.js";
import { allowedCollections } from "../helpers/db-validators.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { isFile } from "../middlewares/validate-file.js";

const uploadsRouter = new Router();

uploadsRouter.post("/", [isFile], uploadFile);
uploadsRouter.put(
    "/:collection/:id",
    [
        check("id", "The Id Must be a valid Mongo Id").isMongoId(),
        check("collection").custom((c) =>
            allowedCollections(c, ["users", "products"])
        ),
        validateFields,
        isFile,
    ],
    updateImageCloudinary
);
uploadsRouter.get(
    "/:collection/:id",
    [
        check("id", "The Id Must be a valid Mongo Id").isMongoId(),
        check("collection").custom((c) =>
            allowedCollections(c, ["users", "products"])
        ),
        validateFields,
    ],
    getImage
);

export { uploadsRouter };
