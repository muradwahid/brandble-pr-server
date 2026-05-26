"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SponsoredService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createSponsored = async (data) => {
    const result = await prisma_1.default.sponsored.create({
        data
    });
    return result;
};
const getAllSponsors = async () => {
    const result = await prisma_1.default.sponsored.findMany();
    return result;
};
const updateSponsored = async (id, sponsored) => {
    const result = await prisma_1.default.sponsored.update({
        where: { id },
        data: sponsored,
    });
    return result;
};
const deleteSponsored = async (id) => {
    const result = await prisma_1.default.sponsored.delete({
        where: { id },
    });
    return result;
};
const getSponsoredById = async (id) => {
    const result = await prisma_1.default.sponsored.findUnique({
        where: { id },
    });
    return result;
};
exports.SponsoredService = { createSponsored, getAllSponsors, updateSponsored, deleteSponsored, getSponsoredById };
