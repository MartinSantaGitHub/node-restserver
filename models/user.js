import { Schema, model } from "mongoose";

const userSchema = Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: [true, "Role is required"],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isGoogle: {
        type: Boolean,
        default: false,
    },
});

userSchema.methods.toJSON = function () {
    const { __v, password, _id, ...user } = this.toObject();

    user.uid = _id;

    return user;
};

const User = model("User", userSchema);

export { User };
