"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncForEach = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const asyncForEach = async (array, calback) => {
    if (!Array.isArray(array)) {
        throw new Error("Expected an array");
    }
    for (let index = 0; index < array.length; index++) {
        calback(array[index], index, array);
    }
};
exports.asyncForEach = asyncForEach;
