import { json, request, response } from "express";
import { User } from "../models/user.js";
import bcryptjs from "bcryptjs";
import { generateJWT } from "../helpers/generate-jwt.js";
import { googleVerify } from "../helpers/google-verify.js";

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

const googleSignIn = async (req, res = response) => {
    const { id_token } = req.body;

    try {
        const { email, name, picture } = await googleVerify(id_token);
        let user = await User.findOne({ email });

        if (!user) {
            const data = {
                name,
                email,
                password: ":P",
                picture,
                isGoogle: true,
            };

            user = new User(data);

            await user.save();
        }

        if (!user.isActive) {
            return res.status(401).json({
                msg: "The user is not active - Contact the admin",
            });
        }

        const token = await generateJWT(user.id);

        res.json({
            user,
            token,
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: "Cannot verify the Token",
        });
    }
};

const renewToken = async (req, res = response) => {
    const { authenticatedUser } = req;
    const token = await generateJWT(authenticatedUser.id);

    res.json({
        authenticatedUser,
        token,
    });
};

export { login, googleSignIn, renewToken };
