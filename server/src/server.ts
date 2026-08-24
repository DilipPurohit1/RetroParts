import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import { setupPassport } from './config/passport.js';
import { initSocket } from './services/socketService.js';
import { seedDatabase } from './utils/seeder.js';
import { upload } from './middleware/uploadMiddleware.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import wantedRoutes from './routes/wantedRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const httpServer = http.createServer(app);

// 1. Security & Header Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in local dev, allow list in prod
      }
    },
    credentials: true,
  })
);

// 2. Body & Cookie Parsing
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 3. Initialize Passport for Google OAuth 2.0
setupPassport();
app.use(passport.initialize());

// 4. Rate Limiting on Auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: { message: 'Too many authentication attempts, please try again later.', code: 'RATE_LIMITED' },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth', authLimiter);

// 5. Initialize Socket.io
initSocket(httpServer);

// 6. Static Uploads Folder
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// 7. Base Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'RetroParts Marketplace API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// 8. Image Upload Endpoint
app.post('/api/upload', upload.array('images', 6), (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ success: false, message: 'No image files uploaded.' });
      return;
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const urls = files.map((file) => `${protocol}://${host}/uploads/${file.filename}`);

    res.json({
      success: true,
      urls,
      files: files.map((f) => f.filename),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

import userRoutes from './routes/userRoutes.js';
import passportRoutes from './routes/passportRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import garageRoutes from './routes/garageRoutes.js';

// 9. API Resource Routes - Mounted on /api/v1 (REST Standard) and /api (Compatibility)
const registerRoutes = (prefix: string) => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/users`, userRoutes);
  app.use(`${prefix}/listings`, listingRoutes);
  app.use(`${prefix}/vehicles`, vehicleRoutes);
  app.use(`${prefix}/categories`, categoryRoutes);
  app.use(`${prefix}/wanted`, wantedRoutes);
  app.use(`${prefix}/wanted-parts`, wantedRoutes);
  app.use(`${prefix}/passports`, passportRoutes);
  app.use(`${prefix}/garage`, garageRoutes);
  app.use(`${prefix}/orders`, orderRoutes);
  app.use(`${prefix}/chat`, chatRoutes);
  app.use(`${prefix}/messages`, chatRoutes);
  app.use(`${prefix}/reviews`, reviewRoutes);
  app.use(`${prefix}/notifications`, notificationRoutes);
  app.use(`${prefix}/wishlist`, wishlistRoutes);
  app.use(`${prefix}/reports`, reportRoutes);
  app.use(`${prefix}/admin`, adminRoutes);
};


registerRoutes('/api/v1');
registerRoutes('/api');


// 10. Centralized Error Handlers
app.use(notFound);
app.use(errorHandler);


// 11. Start Server Function
export const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    const PORT = process.env.PORT || ENV.PORT || 5000;
    httpServer.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`🚀 RetroParts API Server running on port ${PORT}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
      console.log(`=========================================`);
    });
  } catch (error) {
    console.error('Failed to start RetroParts server:', error);
    process.exit(1);
  }
};

startServer();

export { app, httpServer };
