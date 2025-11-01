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
exports.IndexedService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createIndexed = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.indexed.create({
        data
    });
    return result;
});
const getAllIndexes = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.indexed.findMany();
    return result;
});
const updateIndexed = (id, indexed) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.indexed.update({
        where: { id },
        data: indexed,
    });
    return result;
});
const deleteIndexed = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.indexed.delete({
        where: { id },
    });
    return result;
});
const getIndexedById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.indexed.findUnique({
        where: { id },
    });
    return result;
});
exports.IndexedService = { createIndexed, getAllIndexes, updateIndexed, deleteIndexed, getIndexedById };
