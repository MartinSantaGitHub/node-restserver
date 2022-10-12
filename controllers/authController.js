import { request, response } from "express";
import { User } from "../models/user.js";
import bcryptjs from "bcryptjs";
import { generateJWT } from "../helpers/generate-jwt.js";

const login = async (req = request, res = response) => {
    const { email, password } = req.body;

    try {
        // Verify is the email exists
        const user = await User.findOne({ email });
        const userPassMsg = "User / Password not valid";

        if (!user) {
            return res.status(400).json({
                msg: userPassMsg,
            });
        }

        // Verify the password
        const isValidPassword = bcryptjs.compareSync(password, user.password);

        if (!isValidPassword) {
            return res.status(400).json({
                msg: userPassMsg,
            });
        }

        // If the user is active
        if (!user.isActive) {
            return res.status(400).json({
                msg: "User is not active - Please contact the administrator",
            });
        }

        // Generate the JWT
        const token = await generateJWT(user.id);

        res.json({
            user,
            token,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            msg: "Something went wrong",
        });
    }
};

export { login };
