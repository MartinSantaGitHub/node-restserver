import { Category } from "../models/category.js";
import { Product } from "../models/product.js";
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

const isCategory = async (id) => {
    const dbCategory = await Category.findById(id);

    if (!dbCategory) {
        throw new Error(`The category with id = ${id} does not exist`);
    }
};

const isProduct = async (id) => {
    const dbProduct = await Product.findById(id);

    if (!dbProduct) {
        throw new Error(`The product with id = ${id} does not exist`);
    }
};

const allowedCollections = (collection = "", collections = []) => {
    const isIncluded = collections.includes(collection);

    if (!isIncluded) {
        throw new Error(
            `The collection ${collection} is not allowed, ${collections}`
        );
    }

    return true;
};

export { isRole, isEmail, isCategory, isProduct, isUser, allowedCollections };
