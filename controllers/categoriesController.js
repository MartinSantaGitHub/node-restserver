import { request, response } from "express";
import { Category } from "../models/category.js";

const getCategories = async (req = request, res = response) => {
    const { limit = 10, from = 0 } = req.query;
    const query = { isActive: true };
    const [categories, total] = await Promise.all([
        Category.find(query)
            .skip(Number.parseInt(from, 10))
            .limit(Number.parseInt(limit, 10)),
        Category.countDocuments(query),
    ]);

    res.json({
        categories,
        meta: {
            total,
        },
    });
};

const getCategoryDetails = async (req = request, res = response) => {
    const { id } = req.params;
    const category = await Category.findById(id).populate({
        path: "user",
        select: "name",
    });

    res.json({
        category,
    });
};

const createCategory = async (req = request, res = response) => {
    const name = req.body.name.toUpperCase();
    const categoryDb = await Category.findOne({ name });

    if (categoryDb) {
        return res.status(400).json({
            msg: `The category ${categoryDb.name} already exists`,
        });
    }

    const data = {
        name,
        user: req.authenticatedUser.id,
    };

    const category = new Category(data);

    await category.save();

    res.status(201).json(category);
};

const updateCategory = async (req = request, res = response) => {
    const { id } = req.params;
    const { name } = req.body;
    const updateQuery = {
        name: name.toUpperCase(),
        user: req.authenticatedUser.id,
    };

    const category = await Category.findByIdAndUpdate(id, updateQuery, {
        new: true,
    });

    res.json({
        category,
    });
};

const deleteCategory = async (req = request, res = response) => {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
    );

    res.json({
        category,
    });
};

export {
    getCategories,
    getCategoryDetails,
    createCategory,
    deleteCategory,
    updateCategory,
};
