// import cors from 'cors';
// import http from 'http';
// import express, { Application, NextFunction, Request, Response } from 'express';
// import httpStatus from 'http-status';
// import globalErrorHandler from './app/middlewares/globalErrorHandler';
// import routes from './app/routes';

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

import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import routes from './app/routes';
import cookieParser from 'cookie-parser';
import { initializeSocket } from './socketServer';

const app: Application = express();
app.set('trust proxy', 1);

// CORS configuration
app.use(cors({
  origin: [
    'https://app.brandable-pr.com',
    'https://www.app.brandable-pr.com',
    'https://www.brandable-pr.com',
    'https://brandable-pr.com',
    'http://localhost:5174',
    'http://localhost:5173',
    'http://localhost:5173'
  ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
}));

app.use(cookieParser());

// Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', routes);

// Global error handler
app.use(globalErrorHandler);

// Handle not found
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
