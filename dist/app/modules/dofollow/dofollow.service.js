"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoFollowService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createDoFollow = async (data) => {
    const result = await prisma_1.default.doFollow.create({
        data
    });
    return result;
};
const getAllDoFollow = async () => {
    const result = await prisma_1.default.doFollow.findMany();
    return result;
};
const updateDoFollow = async (id, doFollow) => {
    const result = await prisma_1.default.doFollow.update({
        where: { id },
        data: doFollow,
    });
    return result;
};
const deleteDoFollow = async (id) => {
    const result = await prisma_1.default.doFollow.delete({
        where: { id },
    });
    return result;
};
const getDoFollowById = async (id) => {
    const result = await prisma_1.default.doFollow.findUnique({
        where: { id },
    });
    return result;
};
exports.DoFollowService = { createDoFollow, getAllDoFollow, updateDoFollow, deleteDoFollow, getDoFollowById };
