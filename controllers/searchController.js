import { response } from "express";
import mongoose from "mongoose";
import { Category } from "../models/category.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";

const allowedCollections = ["user", "category", "product", "roles"];

const searchUsers = async (term = "", res = response) => {
    const isMongoId = mongoose.Types.ObjectId.isValid(term);

    if (isMongoId) {
        const user = await User.findById(term);

        return res.json({ results: user ? [user] : [] });
    }

    const regex = new RegExp(term, "i");
    const [users, total] = await Promise.all([
        User.find({
            $or: [{ name: regex }, { email: regex }],
            $and: [{ isActive: true }],
        }),
        User.count({
            $or: [{ name: regex }, { email: regex }],
            $and: [{ isActive: true }],
        }),
    ]);

    res.json({
        results: users,
        meta: {
            total,
        },
    });
};

const searchCategories = async (term = "", res = response) => {
    const isMongoId = mongoose.Types.ObjectId.isValid(term);

    if (isMongoId) {
        const category = await Category.findById(term);

        return res.json({ results: category ? [category] : [] });
    }

    const regex = new RegExp(term, "i");
    const query = { name: regex, isActive: true };
    const [categories, total] = await Promise.all([
        Category.find(query),
        Category.countDocuments(query),
    ]);

    res.json({
        results: categories,
        meta: {
            total,
        },
    });
};

const searchProducts = async (term = "", res = response) => {
    const isMongoId = mongoose.Types.ObjectId.isValid(term);

    if (isMongoId) {
        const product = await Product.findById(term)
            .populate({
                path: "user",
                select: "name",
            })
            .populate({
                path: "category",
                select: "name -user",
            });

        return res.json({ results: product ? [product] : [] });
    }

    const regex = new RegExp(term, "i");
    const [products, total] = await Promise.all([
        Product.find({
            $or: [{ name: regex }, { description: regex }],
            $and: [{ isActive: true }],
        }),
        Product.count({
            $or: [{ name: regex }, { description: regex }],
            $and: [{ isActive: true }],
        }),
    ]);

    res.json({
        results: products,
        meta: {
            total,
        },
    });
};

const search = (req, res = response) => {
    const { collection, term } = req.params;

    if (!allowedCollections.includes(collection)) {
        return res.status(400).json({
            msg: `The allowed collections are ${allowedCollections}`,
        });
    }

    switch (collection) {
        case "user":
            searchUsers(term, res);
            break;

        case "category":
            searchCategories(term, res);
            break;

        case "product":
            searchProducts(term, res);
            break;

        default:
            res.status(500).json({
                msg: "Search not implemented",
            });
    }
};

export { search };
