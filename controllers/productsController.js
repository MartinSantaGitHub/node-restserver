import { request, response } from "express";
import { Product } from "../models/product.js";

const getProducts = async (req = request, res = response) => {
    const { limit = 10, from = 0 } = req.query;
    const query = { isActive: true };
    const [products, total] = await Promise.all([
        Product.find(query)
            .skip(Number.parseInt(from, 10))
            .limit(Number.parseInt(limit, 10)),
        Product.countDocuments(query),
    ]);

    res.json({
        products,
        meta: {
            total,
        },
    });
};

const getProductDetails = async (req = request, res = response) => {
    const { id } = req.params;
    const product = await Product.findById(id)
        .populate({
            path: "user",
            select: "name",
        })
        .populate({
            path: "category",
            select: "name -user",
        });

    res.json({
        product,
    });
};

const createProduct = async (req = request, res = response) => {
    const name = req.body.name.toUpperCase();
    const { description, isAvailable, price, category } = req.body;
    const productDb = await Product.findOne({ name });

    if (productDb) {
        return res.status(400).json({
            msg: `The Product ${productDb.name} already exists`,
        });
    }

    const data = {
        name,
        user: req.authenticatedUser.id,
        description,
        isAvailable,
        price,
        category,
    };

    const product = new Product(data);

    await product.save();

    res.status(201).json(product);
};

const updateProduct = async (req = request, res = response) => {
    const { id } = req.params;
    const { name } = req.body;
    const optionals = [
        { name: "price", value: req.body.price },
        { name: "isAvailable", value: req.body.isAvailable },
        { name: "description", value: req.body.description },
        { name: "category", value: req.body.category },
    ];
    const updateQuery = {
        name: name.toUpperCase(),
        user: req.authenticatedUser.id,
    };

    optionals.forEach((e) => {
        if (e.value !== undefined) {
            updateQuery[e.name] = e.value;
        }
    });

    const product = await Product.findByIdAndUpdate(id, updateQuery, {
        new: true,
    })
        .populate({
            path: "user",
            select: "name",
        })
        .populate({
            path: "category",
            select: "name -user",
        });

    res.json({
        product,
    });
};

const deleteProduct = async (req = request, res = response) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
    );

    res.json({
        product,
    });
};

export {
    getProducts,
    getProductDetails,
    createProduct,
    deleteProduct,
    updateProduct,
};
