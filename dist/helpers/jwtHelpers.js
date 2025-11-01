"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHelpers = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const createToken = (payload, secret, expireTime) => {
    return (0, jsonwebtoken_1.sign)(payload, secret, {
        expiresIn: expireTime,
    });
};
const verifyToken = (token, secret) => {
    return (0, jsonwebtoken_1.verify)(token, secret);
};
exports.jwtHelpers = {
    createToken,
    verifyToken,
};
