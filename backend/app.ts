import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { config } from './core/config';
import { errorHandler, notFoundHandler } from './core/middleware/error';
import v1Routes from './routes/v1';

const isProduction = config.nodeEnv === 'production';

const app = express();

if (!fs.existsSync(config.uploadDir)) {
  fs.mkdirSync(config.uploadDir, { recursive: true });
}

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false });
app.use('/api/', limiter);

app.use('/uploads', express.static(path.resolve(config.uploadDir)));

// API v1
app.use('/api/v1', v1Routes);
// Backward compatibility
app.use('/api', v1Routes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Temporary: setup endpoint for first-time setup
app.post('/api/setup/seed', async (_req, res) => {
  try {
    const { execSync } = require('child_process');
    const backendDir = path.resolve(__dirname, '..');
    const push = execSync('npx prisma db push', { cwd: backendDir, encoding: 'utf8', timeout: 60000 });
    const seed = execSync('npx prisma db seed', { cwd: backendDir, encoding: 'utf8', timeout: 120000 });
    res.json({ success: true, push: push, seed: seed });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.stderr?.toString() || err.message,
      stdout: err.stdout?.toString(),
      stderr: err.stderr?.toString(),
    });
  }
});

// Serve frontend static build in production
if (isProduction) {
  const frontendDist = path.resolve(__dirname, '../../frontend/dist');
  app.use(express.static(frontendDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
