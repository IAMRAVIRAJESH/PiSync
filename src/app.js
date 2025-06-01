const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./Configs/dbConfig');
const { syncModels } = require('./Models');
const routes = require('./Routes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(helmet());
app.use('/api', routes);

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 1000,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

app.use((err, req, res) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong',
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested endpoint does not exist',
  });
});

const initializeApp = async () => {
  try {
    await connectDB();

    await syncModels();

    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Error initializing application:', error);
    process.exit(1);
  }
};

initializeApp();

module.exports = { app };
