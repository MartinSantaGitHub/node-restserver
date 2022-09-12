import express from "express";
import cors from "cors";
import { usersRouter } from "../routes/usersRoutes.js";

export default class Server {
    constructor() {
        this.port = process.env.PORT;
        this.app = express();
        this.usersPath = "/api/users";

        // Middlewares
        this.middlewares();

        // My application routes
        this.routes();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static("public"));
    }

    routes() {
        this.app.use(this.usersPath, usersRouter);
    }

    run() {
        this.app.listen(this.port, () =>
            console.log("Server running on port", this.port)
        );
    }
}
