import http, { Server } from 'http';
import app from './app';
import config from './config';
import { errorlogger, logger } from './shared/logger';
import { initializeSocket } from './socketServer';
import { initOrderReminderCron } from './app/corn/corn.orderReminder';

async function bootstrap() {
  // Create ONE HTTP server from Express app
  const server: Server = http.createServer(app);

  // Initialize Socket.io with the SAME HTTP server
  initializeSocket(server);

  // Initialize Corn Jobs
  initOrderReminderCron();

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
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });

  });
}

bootstrap();