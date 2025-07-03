import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getEnvVar } from './utils/getEnvVar.js';
import { showContacts } from './controllers/contactsController.js';
import { showContactById } from './controllers/showContactById.js';

const PORT = Number(getEnvVar('PORT', '3000')) || 3000;

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
  app.get('/contacts', showContacts);
  app.get('/contacts/:contactId', showContactById);

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
