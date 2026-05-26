"use strict";
// import { Server } from 'http';
// import app from './app';
// import config from './config';
// import { errorlogger, logger } from './shared/logger';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// async function bootstrap() {
//   const server: Server = app.listen(config.port, () => {
//     logger.info(`Server running on port ${config.port}`);
//   });
//   const exitHandler = () => {
//     if (server) {
//       server.close(() => {
//         logger.info('Server closed');
//       });
//     }
//     process.exit(1);
//   };
//   const unexpectedErrorHandler = (error: unknown) => {
//     errorlogger.error(error);
//     exitHandler();
//   };
//   process.on('uncaughtException', unexpectedErrorHandler);
//   process.on('unhandledRejection', unexpectedErrorHandler);
//   process.on('SIGTERM', () => {
//     logger.info('SIGTERM received');
//     if (server) {
//       server.close();
//     }
//   });
// }
// bootstrap();
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const logger_1 = require("./shared/logger");
const socketServer_1 = require("./socketServer");
async function bootstrap() {
    // Create ONE HTTP server from Express app
    const server = http_1.default.createServer(app_1.default);
    // Initialize Socket.io with the SAME HTTP server
    (0, socketServer_1.initializeSocket)(server);
    // Start the ONE server
    server.listen(config_1.default.port, () => {
        logger_1.logger.info(`Server running on port ${config_1.default.port}`);
        logger_1.logger.info(`Express API routes available`);
        logger_1.logger.info(`Socket.io running on same port`);
    });
    const exitHandler = () => {
        if (server) {
            server.close(() => {
                logger_1.logger.info('Server closed');
            });
        }
        process.exit(1);
    };
    const unexpectedErrorHandler = (error) => {
        logger_1.errorlogger.error(error);
        exitHandler();
    };
    process.on('uncaughtException', unexpectedErrorHandler);
    process.on('unhandledRejection', unexpectedErrorHandler);
    process.on('SIGTERM', () => {
        logger_1.logger.info('SIGTERM received');
        server.close(() => {
            logger_1.logger.info('HTTP server closed');
            process.exit(0);
        });
    });
}
bootstrap();
