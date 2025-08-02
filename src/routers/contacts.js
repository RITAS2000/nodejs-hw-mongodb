import express from 'express';
import { ctrlWrapper } from '../utils/cntlWrappers.js';
import {
  showContactsController,
  showContactByIdController,
  createNewContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { contactShema, updateContactShema } from '../validation/contact.js';

import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.get('/', ctrlWrapper(showContactsController));
router.get('/:contactId', isValidId, ctrlWrapper(showContactByIdController));

router.post(
  '/',
  upload.single('photo'),
  validateBody(contactShema),
  ctrlWrapper(createNewContactController),
);

router.patch(
  '/:contactId',
  upload.single('photo'),
  isValidId,
  validateBody(updateContactShema),
  ctrlWrapper(updateContactController),
);

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;
