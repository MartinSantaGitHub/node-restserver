import { request, response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

const validateJWT = async (req = request, res = response, next) => {
    const token = req.header("x-api-key");

    if (!token) {
        return res.status(401).json({
            msg: "No token in the request",
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const authenticatedUser = await User.findById(uid);

        if (!authenticatedUser || !authenticatedUser.isActive) {
            return res.status(401).json({
                msg: "Invalid Token - User is not active or not exists",
            });
        }

        req.user = authenticatedUser;

        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({
            msg: "Not a valid token",
        });
    }
};

export { validateJWT };
