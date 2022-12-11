import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import { createServer } from "http";
import { Server as Socket } from "socket.io";
import { usersRouter } from "../routes/usersRoutes.js";
import { authRouter } from "../routes/authRoutes.js";
import { dbConnection } from "../database/config.js";
import { categoriesRouter } from "../routes/categoriesRoutes.js";
import { productsRouter } from "../routes/productsRoutes.js";
import { searchRouter } from "../routes/searchRoutes.js";
import { uploadsRouter } from "../routes/uploadsRoutes.js";
import { socketController } from "../sockets/socketController.js";

export default class Server {
    constructor() {
        this.port = process.env.PORT || 3000;
        this.app = express();
        this.server = createServer(this.app);
        this.io = new Socket(this.server);
        this.paths = {
            users: "/api/users",
            auth: "/api/auth",
            categories: "/api/categories",
            products: "/api/products",
            search: "/api/search",
            uploads: "/api/uploads",
        };

        // Connect to the DB
        this.connectToDb();

        // Middlewares
        this.middlewares();

        // My application routes
        this.routes();

        // Sockets
        this.sockets();
    }

    async connectToDb() {
        await dbConnection();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static("public"));
        this.app.use(
            fileUpload({
                useTempFiles: true,
                tempFileDir: "/tmp/",
                createParentPath: true,
            })
        );
    }

    routes() {
        this.app.use(this.paths.auth, authRouter);
        this.app.use(this.paths.users, usersRouter);
        this.app.use(this.paths.categories, categoriesRouter);
        this.app.use(this.paths.products, productsRouter);
        this.app.use(this.paths.search, searchRouter);
        this.app.use(this.paths.uploads, uploadsRouter);
    }

    sockets() {
        this.io.on("connection", (socket) => socketController(socket, this.io));
    }

    run() {
        this.server.listen(this.port, () =>
            console.log("Server running on port", this.port)
        );
    }
}
