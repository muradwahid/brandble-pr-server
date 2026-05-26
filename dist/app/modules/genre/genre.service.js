"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createGenre = async (data) => {
    const result = await prisma_1.default.genre.create({
        data
    });
    return result;
};
const getAllGenres = async () => {
    const result = await prisma_1.default.genre.findMany();
    return result;
};
const updateGenre = async (id, genre) => {
    const result = await prisma_1.default.genre.update({
        where: { id },
        data: genre,
    });
    return result;
};
const deleteGenre = async (id) => {
    const result = await prisma_1.default.genre.delete({
        where: { id },
    });
    return result;
};
const getGenreById = async (id) => {
    const result = await prisma_1.default.genre.findUnique({
        where: { id },
    });
    return result;
};
exports.default = { createGenre, getAllGenres, updateGenre, deleteGenre, getGenreById };
