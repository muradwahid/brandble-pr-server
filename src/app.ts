import cors from 'cors';
import http from 'http';
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import routes from './app/routes';

import cookieParser from 'cookie-parser';
import { initializeSocket } from './socketServer';

const app: Application = express();
const socketServer = http.createServer(app);
// app.use(cors());
app.use(cors({
  origin: ['https://app.brandable-pr.com', 'https://www.brandable-pr.com'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);


//global error handler
app.use(globalErrorHandler);

initializeSocket(socketServer)

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
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

export default app;
