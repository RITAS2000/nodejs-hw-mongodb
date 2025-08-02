import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getEnvVar } from './utils/getEnvVar.js';
import contactsRouters from './routers/contacts.js';
import authRouters from './routers/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import { auth } from './middlewares/auth.js';
import path from 'node:path';

const PORT = process.env.PORT || getEnvVar('PORT', '3000');
const photosDir = path.resolve('src', 'uploads', 'photos');

export function setupServer() {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(cookieParser());
  app.use('/photos', express.static(photosDir));
  app.use('/auth', authRouters);
  app.use('/contacts', auth, contactsRouters);
  app.use(notFoundHandler);
  app.use(errorHandler);
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
