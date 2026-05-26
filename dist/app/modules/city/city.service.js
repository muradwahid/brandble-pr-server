"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createCity = async (data) => {
    const result = await prisma_1.default.city.create({
        data
    });
    return result;
};
const getAllCity = async () => {
    const result = await prisma_1.default.city.findMany();
    return result;
};
const updateCity = async (id, city) => {
    const result = await prisma_1.default.city.update({
        where: { id },
        data: city,
    });
    return result;
};
const deleteCity = async (id) => {
    const result = await prisma_1.default.city.delete({
        where: { id },
    });
    return result;
};
const getCityById = async (id) => {
    const result = await prisma_1.default.city.findUnique({
        where: { id },
    });
    return result;
};
exports.CityService = { createCity, getAllCity, updateCity, deleteCity, getCityById };
