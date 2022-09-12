import { Schema, model } from "mongoose";

const Role = model(
    "Role",
    Schema({
        role: {
            type: String,
            required: [true, "The Role is required"],
        },
    })
);

export { Role };
