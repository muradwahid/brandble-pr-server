"use strict";
// import cors from 'cors';
// import http from 'http';
// import express, { Application, NextFunction, Request, Response } from 'express';
// import httpStatus from 'http-status';
// import globalErrorHandler from './app/middlewares/globalErrorHandler';
// import routes from './app/routes';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import cookieParser from 'cookie-parser';
// import { initializeSocket } from './socketServer';
// const app: Application = express();
// const socketServer = http.createServer(app);
// // app.use(cors());
// app.set('trust proxy', 1)
// app.use(cors({
//   origin: ['https://app.brandable-pr.com', 'https://www.app.brandable-pr.com', 'https://www.brandable-pr.com', 'https://brandable-pr.com', 'http://localhost:5174','http://localhost:5173'],
//   credentials: true,
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
// }));
// app.use(cookieParser());
// //parser
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use('/api/v1', routes);
// //global error handler
// app.use(globalErrorHandler);
// initializeSocket(socketServer)
// //handle not found
// app.use((req: Request, res: Response, next: NextFunction) => {
//   res.status(httpStatus.NOT_FOUND).json({
//     success: false,
//     message: 'Not Found',
//     errorMessages: [
//       {
//         path: req.originalUrl,
//         message: 'API Not Found',
//       },
//     ],
//   });
//   next();
// });
// export default app;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const routes_1 = __importDefault(require("./app/routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// import { initializeSocket } from './socketServer';
const app = (0, express_1.default)();
app.set('trust proxy', 1);
// CORS configuration
// app.use(cors({
//   origin: [
//     'https://app.brandable-pr.com',
//     'https://www.app.brandable-pr.com',
//     'https://www.brandable-pr.com',
//     'https://brandable-pr.com',
//     'http://localhost:5174',
//     'http://localhost:5173',
//     'http://localhost:5173'
//   ],
//   credentials: true,
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
// }));
const allowedOrigins = [
    "https://app.brandable-pr.com",
    "https://www.app.brandable-pr.com",
    "https://brandable-pr.com",
    "https://www.brandable-pr.com",
    "https://api.brandable-pr.com",
    "http://localhost:5173",
    "http://localhost:5174",
];
const corsOptions = {
    origin: (origin, cb) => {
        if (!origin)
            return cb(null, true);
        if (allowedOrigins.includes(origin))
            return cb(null, true);
        return cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
// Parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/v1', routes_1.default);
// Global error handler
app.use(globalErrorHandler_1.default);
// Handle not found
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: 'Not Found',
        errorMessages: [
            {
                path: req.originalUrl,
                message: 'API Not Found',
            },
        ],
    });
    next();
});
exports.default = app;
