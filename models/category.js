import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, "The name is required"],
        unique: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

categorySchema.pre("find", function () {
    this.populate("user", "name");
});

categorySchema.methods.toJSON = function () {
    const { __v, isActive, ...data } = this.toObject();

    return data;
};

const Category = model("Category", categorySchema);

export { Category };
