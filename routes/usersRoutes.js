import { Router } from "express";
import { check } from "express-validator";

import {
    usersGet,
    usersPut,
    usersPost,
    usersDelete,
    usersPatch,
} from "../controllers/usersController.js";

import { isEmail, isRole, isUser } from "../helpers/db-validators.js";
import {
    validateFields,
    validateJWT,
    isAdmin,
    hasRole,
} from "../middlewares/index.js";

const usersRouter = new Router();

usersRouter.get(
    "/",
    [
        check("limit").optional().isNumeric(),
        check("from").optional().isNumeric(),
        validateFields,
    ],
    usersGet
);

usersRouter.put(
    "/:id",
    [
        check("id", "Not a valid ID").isMongoId(),
        check("id").custom(isUser),
        check("role").optional().custom(isRole),
        validateFields,
    ],
    usersPut
);

usersRouter.post(
    "/",
    [
        check("name", "The name is required").not().isEmpty(),
        check(
            "password",
            "The password is must have more than 6 characters"
        ).isLength({ min: 6 }),
        check("email", "The email is not a valid format").isEmail(),
        check("email").custom(isEmail),
        //check("role", "Not a valid role").isIn(["ADMIN_ROLE", "USER_ROLE"]),
        check("role", "The Role is required").not().isEmpty(),
        check("role").custom(isRole),
        validateFields,
    ],
    usersPost
);

usersRouter.delete(
    "/:id",
    [
        validateJWT,
        check("id", "Not a valid ID").isMongoId(),
        check("id").custom(isUser),
        isAdmin,
        //hasRole("A_ROLE", "SALES_ROLE"),
        validateFields,
    ],
    usersDelete
);

usersRouter.patch("/:id", usersPatch);

export { usersRouter };
