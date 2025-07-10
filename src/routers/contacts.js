import express from 'express';

import { ctrlWrapper } from '../utils/cntlWrappers.js';
import {
  showContactsController,
  showContactByIdController,
  createNewContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';

const router = express.Router();

router.get('/', ctrlWrapper(showContactsController));
router.get('/:contactId', ctrlWrapper(showContactByIdController));

router.post('/', ctrlWrapper(createNewContactController));

router.patch('/:contactId', ctrlWrapper(updateContactController));

router.delete('/:contactId', ctrlWrapper(deleteContactController));

export default router;
