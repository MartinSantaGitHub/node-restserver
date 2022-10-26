import { Schema, model } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, "The name is required"],
        unique: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    price: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
});

productSchema.pre("find", function () {
    this.populate({
        path: "user",
        select: "name",
    }).populate({
        path: "category",
        select: "name -user",
    });
});

productSchema.methods.toJSON = function () {
    const { __v, isActive, ...data } = this.toObject();

    return data;
};

const Product = model("Product", productSchema);

export { Product };
