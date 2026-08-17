import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { connectDB } from './config/db';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// API V1 Routes
app.use('/api/v1', routes);

// Global Error Handler
app.use(errorHandler);

// Start HTTP Server
const PORT = parseInt(env.PORT, 10) || 5000;
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Trusted Hands API Server Running on Port ${PORT}`);
  console.log(` Environment: ${env.NODE_ENV}`);
  console.log(` Health Check: http://localhost:${PORT}/api/v1/health`);
  console.log(`====================================================`);
});

export default app;
