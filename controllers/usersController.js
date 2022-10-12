import { request, response } from "express";
import { User } from "../models/user.js";
import bcryptjs from "bcryptjs";

const usersGet = async (req = request, res = response) => {
    //const { q, name = "No Name", page = 1, limit = 5 } = req.query;
    const { limit = 5, from = 0 } = req.query;
    const query = { isActive: true };
    const [users, total] = await Promise.all([
        User.find(query)
            .skip(Number.parseInt(from, 10))
            .limit(Number.parseInt(limit, 10)),
        User.countDocuments(query),
    ]);

    res.json({
        total,
        users,
    });
};

const usersPost = async (req, res = response) => {
    const { isGoogle, isActive, ...rest } = req.body;
    const user = new User(rest);

    // Encrypt the password
    user.password = encryptPassword(user.password);

    // Save into DB
    await user.save();

    res.json(user);
};

const usersPut = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, isGoogle, email, ...rest } = req.body;

    // Validate against the DB.
    if (password) {
        rest.password = encryptPassword(password);
    }

    const user = await User.findByIdAndUpdate(id, rest);

    res.json(user);
};

const usersDelete = async (req, res = response) => {
    const { id } = req.params;
    const authenticatedUser = req.authenticatedUser;

    // Fisical delete
    //const user = await User.findByIdAndDelete(id);

    // Logical delete
    const user = await User.findByIdAndUpdate(id, { isActive: false });

    res.json(user);
};

const usersPatch = (req, res = response) => {
    res.json({
        msg: "Patch API - controller",
    });
};

const encryptPassword = (password) => {
    const salt = bcryptjs.genSaltSync(10);

    return bcryptjs.hashSync(password, salt);
};

export { usersGet, usersPost, usersDelete, usersPut, usersPatch };
