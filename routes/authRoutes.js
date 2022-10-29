import { Router } from "express";
import { check } from "express-validator";
import {
    googleSignIn,
    login,
    renewToken,
} from "../controllers/authController.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { validateJWT } from "../middlewares/validate-jwt.js";

const authRouter = new Router();

authRouter.post(
    "/login",
    [
        check("email", "The email is required").isEmail(),
        check("password", "The password is required").not().isEmpty(),
        validateFields,
    ],
    login
);

authRouter.post(
    "/google",
    [
        check("id_token", "The id_token is required").not().isEmpty(),
        validateFields,
    ],
    googleSignIn
);

authRouter.get("/", validateJWT, renewToken);

export { authRouter };
