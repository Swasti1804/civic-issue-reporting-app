const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const findLocation = require('./api/findLocation');
const { validateQuery } = require('./middleware/validation'); // New validation middleware

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security middleware
app.use(helmet());
app.use(cors({
  origin: NODE_ENV === 'development' 
    ? '*' 
    : ['https://your-production-domain.com'], // Replace with your actual domain
  methods: ['GET']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint with more detailed response
app.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    message: '🌍 Hamara Shehar Location API',
    version: '1.0.0',
    environment: NODE_ENV,
    endpoints: {
      locationSearch: '/api/find-location?q=:query',
      docs: 'https://github.com/your-repo/docs' // Add link to your API docs
    }
  });
});

// Location search endpoint with improved validation and error handling
app.get('/api/find-location', validateQuery, async (req, res) => {
  try {
    const { q } = req.query;
    const result = await findLocation(q);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        error: result.error,
        query: q,
        suggestions: result.suggestions || []
      });
    }

    // Successful response with additional metadata
    res.json({
      success: true,
      query: q,
      data: {
        coordinates: {
          lat: result.lat,
          lon: result.lon
        },
        address: result.display_name,
        components: result.components,
        boundingbox: result.boundingbox // If available from OpenCage
      },
      attribution: "Powered by OpenCage Data",
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error(`[ERROR] ${new Date().toISOString()}`, {
      error: err.message,
      stack: err.stack,
      query: req.query.q
    });

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    availableEndpoints: ['GET /', 'GET /api/find-location']
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[SERVER ERROR] ${new Date().toISOString()}`, err);

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    ...(NODE_ENV === 'development' && { details: err.message })
  });
});

// Server startup
app.listen(PORT, () => {
  console.log(`
  🚀 Server is running in ${NODE_ENV} mode
  📡 Listening on http://localhost:${PORT}
  ⏱️ Started at ${new Date().toISOString()}
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[UNHANDLED REJECTION] ${new Date().toISOString()}`, err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`[UNCAUGHT EXCEPTION] ${new Date().toISOString()}`, err);
  process.exit(1);
});