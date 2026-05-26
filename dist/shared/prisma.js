"use strict";
// import { PrismaClient } from "@prisma/client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const config_1 = __importDefault(require("../config"));
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("../generated/client/client");
// const prisma = new PrismaClient({ errorFormat: 'minimal' });
// export default prisma;
const pool = new pg_1.Pool({
    connectionString: config_1.default.dbUrl,
    max: 15,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({
    adapter,
    errorFormat: "minimal",
    log: config_1.default.env === "development" ? ["query", "error", "warn"] : ["error"],
});
exports.default = prisma;
