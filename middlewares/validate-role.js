import { request, response } from "express";

const isAdmin = (req = request, res = response, next) => {
    if (!req.authenticatedUser) {
        return res.status(500).json({
            msg: "Verifying role without validating the token first",
        });
    }

    const { role, name } = req.authenticatedUser;

    if (role !== "ADMIN_ROLE") {
        return res.status(401).json({
            msg: `${name} is not admin - Permission denied`,
        });
    }

    next();
};

const hasRole = (...roles) => {
    return (req = request, res = response, next) => {
        if (!req.user) {
            return res.status(500).json({
                msg: "Verifying role without validating the token first",
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(401).json({
                msg: `The service requires one of these roles ${roles.join(
                    ", "
                )}`,
            });
        }

        next();
    };
};

export { isAdmin, hasRole };
