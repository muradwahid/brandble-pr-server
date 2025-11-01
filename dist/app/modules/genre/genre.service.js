"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createGenre = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.genre.create({
        data
    });
    return result;
});
const getAllGenres = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.genre.findMany();
    return result;
});
const updateGenre = (id, genre) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.genre.update({
        where: { id },
        data: genre,
    });
    return result;
});
const deleteGenre = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.genre.delete({
        where: { id },
    });
    return result;
});
const getGenreById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.genre.findUnique({
        where: { id },
    });
    return result;
});
exports.default = { createGenre, getAllGenres, updateGenre, deleteGenre, getGenreById };
