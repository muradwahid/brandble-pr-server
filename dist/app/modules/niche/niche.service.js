"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NicheService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createNiche = async (data) => {
    const result = await prisma_1.default.niche.create({
        data,
    });
    return result;
};
const getAllNiches = async () => {
    const result = await prisma_1.default.niche.findMany();
    return result;
};
const updateNiche = async (id, data) => {
    const result = await prisma_1.default.niche.update({
        where: { id },
        data,
    });
    return result;
};
const deleteNiche = async (id) => {
    const result = await prisma_1.default.niche.delete({
        where: { id },
    });
    return result;
};
const getNicheById = async (id) => {
    const result = await prisma_1.default.niche.findUnique({
        where: { id },
    });
    return result;
};
exports.NicheService = { createNiche, getAllNiches, updateNiche, deleteNiche, getNicheById };
