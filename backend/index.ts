import app from './app';
import { config } from './core/config';

app.listen(config.port, () => {
  console.log(`TradeHub API running on port ${config.port} [${config.nodeEnv}]`);
  console.log(`API v1: http://localhost:${config.port}/api/v1`);
});
