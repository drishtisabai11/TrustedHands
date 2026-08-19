import { Request, Response } from 'express';
import mongoose from 'mongoose';

export const getHealthStatus = async (_req: Request, res: Response) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.status(200).json({
    status: 'healthy',
    service: 'Trusted Hands API Engine',
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
};
