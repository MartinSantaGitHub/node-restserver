import { response } from "express";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import cloudinary from "cloudinary";
import { uploadFileHelper } from "../helpers/upload-file.js";
import { User } from "../models/user.js";
import { Product } from "../models/product.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadFile = async (req, res = response) => {
    try {
        const name = await uploadFileHelper(req.files, undefined, "imgs");

        res.json({
            name,
        });
    } catch (error) {
        res.status(400).json({ error });
    }
};

// const updateImage = async (req, res = response) => {
//     const { id, collection } = req.params;
//     let model;

//     switch (collection) {
//         case "users":
//             model = await User.findById(id);

//             if (!model) {
//                 return res
//                     .status(400)
//                     .json({ msg: `User with Id = ${id} does not exist` });
//             }

//             break;

//         case "products":
//             model = await Product.findById(id);

//             if (!model) {
//                 return res
//                     .status(400)
//                     .json({ msg: `Product with Id = ${id} does not exist` });
//             }

//             break;
//         default:
//             return res.status(500).json({
//                 msg: "Method not implemented",
//             });
//     }

//     if (model.img) {
//         const imagePath = path.join(
//             __dirname,
//             "../uploads",
//             collection,
//             model.img
//         );

//         if (fs.existsSync(imagePath)) {
//             fs.unlinkSync(imagePath);
//         }
//     }

//     model.img = await uploadFileHelper(req.files, undefined, collection);

//     await model.save();

//     res.json({
//         model,
//     });
// };

const updateImageCloudinary = async (req, res = response) => {
    const { id, collection } = req.params;
    let model;

    switch (collection) {
        case "users":
            model = await User.findById(id);

            if (!model) {
                return res
                    .status(400)
                    .json({ msg: `User with Id = ${id} does not exist` });
            }

            break;

        case "products":
            model = await Product.findById(id);

            if (!model) {
                return res
                    .status(400)
                    .json({ msg: `Product with Id = ${id} does not exist` });
            }

            break;
        default:
            return res.status(500).json({
                msg: "Method not implemented",
            });
    }

    cloudinary.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    if (model.img) {
        const nameArr = model.img.split("/");
        const name = nameArr[nameArr.length - 1];
        const [public_id] = name.split(".");

        await cloudinary.v2.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.file;
    const { secure_url } = await cloudinary.v2.uploader.upload(tempFilePath);

    model.img = secure_url;

    await model.save();

    res.json({
        model,
    });
};

const getImage = async (req, res = response) => {
    const { id, collection } = req.params;
    let model;

    switch (collection) {
        case "users":
            model = await User.findById(id);

            if (!model) {
                return res
                    .status(400)
                    .json({ msg: `User with Id = ${id} does not exist` });
            }

            break;

        case "products":
            model = await Product.findById(id);

            if (!model) {
                return res
                    .status(400)
                    .json({ msg: `Product with Id = ${id} does not exist` });
            }

            break;
        default:
            return res.status(500).json({
                msg: "Method not implemented",
            });
    }

    if (model.img) {
        const imagePath = path.join(
            __dirname,
            "../uploads",
            collection,
            model.img
        );

        if (fs.existsSync(imagePath)) {
            return res.sendFile(imagePath);
        }
    }

    const noImagePath = path.join(__dirname, "../assets", "no-image.jpeg");

    res.sendFile(noImagePath);
};

export { uploadFile, updateImageCloudinary, getImage };
