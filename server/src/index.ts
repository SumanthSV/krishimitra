import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import rateLimit from 'express-rate-limit';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import cropRoutes from './routes/crops';
import weatherRoutes from './routes/weather';
import financeRoutes from './routes/finance';
import queryRoutes from './routes/queries';
import advisoryRoutes from './routes/advisories';
import marketRoutes from './routes/market';
import locationRoutes from './routes/location';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { authMiddleware } from './middleware/auth';

// Import database connection
import { connectDB } from './config/database';

// Import services
import { initializeAIService } from './services/aiService';
import { initializeWeatherService } from './services/weatherService';
import { initializeCacheService } from './services/cacheService';
import { initializeDataIngestionService } from './services/dataIngestionService';
import { initializeFactCheckingService } from './services/factCheckingService';
import { initializeMultimodalService } from './services/multimodalService';

// Import utilities
import logger from './utils/logger';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(compression());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/queries', queryRoutes);
app.use('/api/advisories', advisoryRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/location', locationRoutes);

// Socket.io for real-time features
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);
  
  socket.on('join_location', (location) => {
    socket.join(`location_${location}`);
    logger.info(`User ${socket.id} joined location: ${location}`);
  });
  
  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Initialize services
const initializeServices = async () => {
  try {
    await connectDB();
    await initializeCacheService();
    await initializeAIService();
    await initializeWeatherService();
    await initializeDataIngestionService();
    await initializeFactCheckingService();
    await initializeMultimodalService();
    logger.info('All services initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize services:', error);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    await initializeServices();
    
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();

export { io };