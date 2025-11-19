// import { Server } from 'http';
// import app from './app';
// import config from './config';
// import { errorlogger, logger } from './shared/logger';

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
import http, { Server } from 'http';
import app from './app';
import config from './config';
import { errorlogger, logger } from './shared/logger';
import { initializeSocket } from './socketServer';

async function bootstrap() {
  // Create ONE HTTP server from Express app
  const server: Server = http.createServer(app);

  // Initialize Socket.io with the SAME HTTP server
  initializeSocket(server);

  // Start the ONE server
  server.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`);
    logger.info(`Express API routes available`);
    logger.info(`Socket.io running on same port`);
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info('Server closed');
      });
    }
    process.exit(1);
  };

  const unexpectedErrorHandler = (error: unknown) => {
    errorlogger.error(error);
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
      server.close();
    }
  });
}

bootstrap();