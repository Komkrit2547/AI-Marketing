import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { routes } from './routes';
import { errorHandler } from './middleware/errorHandler';
import { config } from './config';
import prisma from './lib/prisma';

// Catch uncaught exceptions to prevent silent crashes
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

const app = express();

// Compress responses
app.use(compression());

// Security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Rate limiting to prevent DoS attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));

app.use('/api', routes);

app.use(errorHandler);

const server = app.listen(config.port, () => {
  console.log(`Backend running on http://localhost:${config.port}`);
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown on SIGTERM (Docker/PM2 stop)
process.on('SIGTERM', () => {
  console.info('SIGTERM received. Shutting down gracefully.');
  server.close(async () => {
    console.info('HTTP server closed.');
    await prisma.$disconnect();
    console.info('Prisma disconnected.');
    process.exit(0);
  });
});

export default app;
