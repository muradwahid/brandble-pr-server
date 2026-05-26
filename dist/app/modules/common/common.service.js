"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const getAllCommon = async () => {
    const countries = await prisma_1.default.country.findMany();
    const cities = await prisma_1.default.city.findMany();
    const states = await prisma_1.default.state.findMany();
    const genre = await prisma_1.default.genre.findMany();
    const dofollow = await prisma_1.default.doFollow.findMany();
    const indexed = await prisma_1.default.indexed.findMany();
    const niche = await prisma_1.default.niche.findMany({ orderBy: { title: 'asc' } });
    return {
        countries,
        cities,
        states,
        genre,
        dofollow,
        indexed,
        niche
    };
};
exports.CommonService = { getAllCommon };
