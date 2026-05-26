"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createState = async (data) => {
    const result = await prisma_1.default.state.create({
        data
    });
    return result;
};
const getAllState = async () => {
    const result = await prisma_1.default.state.findMany();
    return result;
};
const updateState = async (id, state) => {
    const result = await prisma_1.default.state.update({
        where: { id },
        data: state,
    });
    return result;
};
const deleteState = async (id) => {
    const result = await prisma_1.default.state.delete({
        where: { id },
    });
    return result;
};
const getStateById = async (id) => {
    const result = await prisma_1.default.state.findUnique({
        where: { id },
    });
    return result;
};
exports.StateService = { createState, getAllState, updateState, deleteState, getStateById };
