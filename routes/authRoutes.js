import { Router } from "express";
import { check } from "express-validator";
import { login } from "../controllers/authController.js";
import { validateFields } from "../middlewares/validate-fields.js";

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

export { authRouter };
