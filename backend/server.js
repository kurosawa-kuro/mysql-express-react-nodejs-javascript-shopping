// backend\server.js

// External Imports
import path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan'; // Add this line

// Internal Imports
import { db } from "./database/prisma/prismaClient.js";
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load Environment Variables
dotenv.config();

// Create Express Application
const app = express();

if (process.env.NODE_ENV === 'development') { // Add this block
  app.use(morgan('dev'));
}

// Middleware Configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Express Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// PayPal Configuration Endpoint
app.get('/api/config/paypal', (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

// File Upload Endpoint
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Serve Static Files in Production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

// Error Handlers
app.use(notFound);
app.use(errorHandler);

// Connect to Database and Start Server
const port = process.env.PORT || 5000;
try {
  await db.$connect()
  console.log('DB connected by Prisma')
  app.listen(port, () =>
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
  );
} catch (error) {
  console.error(`Error: ${error.message}`)
  process.exit(1)
}
