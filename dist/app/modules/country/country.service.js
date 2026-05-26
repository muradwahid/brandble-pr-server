"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createCountry = async (data) => {
    const result = await prisma_1.default.country.create({
        data
    });
    return result;
};
const getAllCountry = async () => {
    const result = await prisma_1.default.country.findMany();
    return result;
};
const updateCountry = async (id, country) => {
    const result = await prisma_1.default.country.update({
        where: { id },
        data: country,
    });
    return result;
};
const deleteCountry = async (id) => {
    const result = await prisma_1.default.country.delete({
        where: { id },
    });
    return result;
};
const getCountryById = async (id) => {
    const result = await prisma_1.default.country.findUnique({
        where: { id },
    });
    return result;
};
exports.CountryService = { createCountry, getAllCountry, updateCountry, deleteCountry, getCountryById };
