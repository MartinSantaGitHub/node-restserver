import mongoose from "mongoose";

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONN);

        console.log("Database online");
    } catch (error) {
        console.error(error);

        throw new Error("Database error when trying to run it");
    }
};

export { dbConnection };
