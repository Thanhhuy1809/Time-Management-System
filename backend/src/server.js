import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import timeLogRoutes from './routes/timeLogRoutes.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'TaskFlow API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      tasks: '/api/tasks',
      timeLogs: '/api/timelogs'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/timelogs', timeLogRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\n🚀 =======================================');
  console.log(`   TaskFlow Backend Server Started`);
  console.log('   =======================================');
  console.log(`    Server running on port: ${PORT}`);
  console.log(`    Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`    URL: http://localhost:${PORT}`);
  console.log(`    API Docs: http://localhost:${PORT}/api`);
  console.log('   =======================================\n');
  console.log('   Available Endpoints:');
  console.log('   - POST /api/auth/register');
  console.log('   - POST /api/auth/login');
  console.log('   - GET  /api/auth/me');
  console.log('   - GET  /api/tasks');
  console.log('   - POST /api/tasks');
  console.log('   - GET  /api/tasks/:id');
  console.log('   - PUT  /api/tasks/:id');
  console.log('   - DELETE /api/tasks/:id');
  console.log('   - GET  /api/tasks/stats');
  console.log('   - GET  /api/timelogs');
  console.log('   - POST /api/timelogs');
  console.log('   - GET  /api/timelogs/:id');
  console.log('   - PUT  /api/timelogs/:id');
  console.log('   - DELETE /api/timelogs/:id');
  console.log('   - GET  /api/timelogs/stats');
  console.log('   =======================================\n');
});

export default app;