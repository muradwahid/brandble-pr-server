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
exports.SponsoredService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createSponsored = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.sponsored.create({
        data
    });
    return result;
});
const getAllSponsors = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.sponsored.findMany();
    return result;
});
const updateSponsored = (id, sponsored) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.sponsored.update({
        where: { id },
        data: sponsored,
    });
    return result;
});
const deleteSponsored = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.sponsored.delete({
        where: { id },
    });
    return result;
});
const getSponsoredById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.sponsored.findUnique({
        where: { id },
    });
    return result;
});
exports.SponsoredService = { createSponsored, getAllSponsors, updateSponsored, deleteSponsored, getSponsoredById };
