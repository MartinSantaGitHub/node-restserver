import { Role } from "../models/role.js";
import { User } from "../models/user.js";

const isRole = async (role = "") => {
    const dbRole = await Role.findOne({ role });

    if (!dbRole) {
        throw new Error(`The Role ${role} is not registered in the DB`);
    }
};

const isEmail = async (email = "") => {
    const dbEmail = await User.findOne({ email });

    if (dbEmail) {
        throw new Error(`The Email ${email} already exists in the DB`);
    }
};

const isUser = async (id) => {
    const dbUser = await User.findById(id);

    if (!dbUser) {
        throw new Error(`The User with id ${id} does not exist`);
    }
};

export { isRole, isEmail, isUser };
