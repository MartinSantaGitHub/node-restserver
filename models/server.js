import express from "express";
import cors from "cors";
import { usersRouter } from "../routes/usersRoutes.js";
import { authRouter } from "../routes/authRoutes.js";
import { dbConnection } from "../database/config.js";
import { categoriesRouter } from "../routes/categoriesRoutes.js";
import { productsRouter } from "../routes/productsRoutes.js";
import { searchRouter } from "../routes/searchRoutes.js";

export default class Server {
    constructor() {
        this.port = process.env.PORT;
        this.app = express();
        this.paths = {
            users: "/api/users",
            auth: "/api/auth",
            categories: "/api/categories",
            products: "/api/products",
            search: "/api/search",
        };

        // Connect to the DB
        this.connectToDb();

        // Middlewares
        this.middlewares();

        // My application routes
        this.routes();
    }

    async connectToDb() {
        await dbConnection();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static("public"));
    }

    routes() {
        this.app.use(this.paths.auth, authRouter);
        this.app.use(this.paths.users, usersRouter);
        this.app.use(this.paths.categories, categoriesRouter);
        this.app.use(this.paths.products, productsRouter);
        this.app.use(this.paths.search, searchRouter);
    }

    run() {
        this.app.listen(this.port, () =>
            console.log("Server running on port", this.port)
        );
    }
}
