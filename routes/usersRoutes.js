import { Router } from "express";
import {
    usersGet,
    usersPut,
    usersPost,
    usersDelete,
    usersPatch,
} from "../controllers/usersController.js";

const usersRouter = new Router();

usersRouter.get("/", usersGet);

usersRouter.put("/:id", usersPut);

usersRouter.post("/", usersPost);

usersRouter.delete("/:id", usersDelete);

usersRouter.patch("/:id", usersPatch);

export { usersRouter };
