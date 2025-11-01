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
exports.DoFollowService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createDoFollow = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.doFollow.create({
        data
    });
    return result;
});
const getAllDoFollow = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.doFollow.findMany();
    return result;
});
const updateDoFollow = (id, doFollow) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.doFollow.update({
        where: { id },
        data: doFollow,
    });
    return result;
});
const deleteDoFollow = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.doFollow.delete({
        where: { id },
    });
    return result;
});
const getDoFollowById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.doFollow.findUnique({
        where: { id },
    });
    return result;
});
exports.DoFollowService = { createDoFollow, getAllDoFollow, updateDoFollow, deleteDoFollow, getDoFollowById };
