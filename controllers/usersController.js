import { request, response } from "express";

const usersGet = (req = request, res = response) => {
    const { q, name = "No Name", page = 1, limit = 5 } = req.query;

    res.json({
        msg: "Get API - controller",
        q,
        name,
        page,
        limit,
    });
};

const usersPost = (req, res = response) => {
    const { name, age } = req.body;

    res.json({
        msg: "Post API - controller",
        name,
        age,
    });
};

const usersPut = (req, res = response) => {
    const { id } = req.params;

    res.json({
        msg: "Put API - controller",
        id,
    });
};

const usersDelete = (req, res = response) => {
    res.json({
        msg: "Delete API - controller",
    });
};

const usersPatch = (req, res = response) => {
    res.json({
        msg: "Patch API - controller",
    });
};

export { usersGet, usersPost, usersDelete, usersPut, usersPatch };
