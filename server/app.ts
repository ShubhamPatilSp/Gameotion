import express from 'express';
import cors from 'cors';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Routes will be mounted here in the future
  return app;
}


