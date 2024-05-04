const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validatingToken = asyncHandler(async (req, res, next) => {
    let token;
    let authorization = req.headers.authorization || req.headers.Authorization;
    if (authorization && authorization.startsWith("Bearer")) {
        try {
            token = authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded.user;
            next();
        } catch (error) {
            res.status(401);
            throw new Error("User not authorized, token failed");
        }
    } else {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

module.exports = validatingToken;