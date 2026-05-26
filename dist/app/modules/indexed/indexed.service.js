"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexedService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createIndexed = async (data) => {
    const result = await prisma_1.default.indexed.create({
        data
    });
    return result;
};
const getAllIndexes = async () => {
    const result = await prisma_1.default.indexed.findMany();
    return result;
};
const updateIndexed = async (id, indexed) => {
    const result = await prisma_1.default.indexed.update({
        where: { id },
        data: indexed,
    });
    return result;
};
const deleteIndexed = async (id) => {
    const result = await prisma_1.default.indexed.delete({
        where: { id },
    });
    return result;
};
const getIndexedById = async (id) => {
    const result = await prisma_1.default.indexed.findUnique({
        where: { id },
    });
    return result;
};
exports.IndexedService = { createIndexed, getAllIndexes, updateIndexed, deleteIndexed, getIndexedById };
