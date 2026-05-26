"use strict";
// import { PrismaClient } from "@prisma/client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatPrisma = void 0;
const prisma_1 = __importDefault(require("./prisma"));
// Handle graceful shutdown
process.on('beforeExit', async () => {
    await prisma_1.default.$disconnect();
});
process.on('SIGINT', async () => {
    await prisma_1.default.$disconnect();
    process.exit(0);
});
exports.chatPrisma = prisma_1.default;
