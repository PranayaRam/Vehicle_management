const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const path = require('path');
const fs = require('fs');

// Connect to MongoDB and auto-seed if fresh database
connectDB().then(async () => {
  try {
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Server] Fresh database detected. Auto-seeding initial users and catalogue...');
      const seedDB = require('./utils/seedData');
      await seedDB();
      console.log('[Server] Auto-seeding complete.');
    }
  } catch (err) {
    console.warn('[Server] Auto-seed check notice:', err.message);
  }
});

const app = express();

// Configurable CORS for production & development
const configuredOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim().replace(/\/$/, ''))
  : [];

const localOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (mobile apps, Postman, curl, Render health checks)
    if (!origin) return callback(null, true);

    // Allow configured origins, all .onrender.com domains, localhost, or if wildcard specified
    if (
      configuredOrigins.includes('*') ||
      configuredOrigins.includes(origin) ||
      localOrigins.includes(origin) ||
      origin.endsWith('.onrender.com') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }

    // Default allow if CLIENT_URL not explicitly configured
    if (configuredOrigins.length === 0) {
      return callback(null, true);
    }

    return callback(new Error(`CORS policy blocked access from origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Vehicle Service Management API is operating smoothly',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/service-types', require('./routes/serviceTypeRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/check-in', require('./routes/checkInRoutes'));
app.use('/api/inspections', require('./routes/inspectionRoutes'));
app.use('/api/service-jobs', require('./routes/serviceJobRoutes'));
app.use('/api/jobs', require('./routes/serviceJobRoutes'));
app.use('/api/parts', require('./routes/partRoutes'));
app.use('/api/labour', require('./routes/labourRoutes'));
app.use('/api/estimates', require('./routes/estimateRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/delivery', require('./routes/deliveryRoutes'));
app.use('/api/deliveries', require('./routes/deliveryRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Serve frontend build if dist directory exists (Single-service fullstack deployment mode)
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found`
  });
});

// Fallback 404 Handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found`
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[UnhandledRejection] ${err.message}`);
});

module.exports = app;
