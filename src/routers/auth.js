import express from 'express';
import {
  loginController,
  logoutController,
  refreshController,
  registerController,
  SendResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/cntlWrappers.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  resetSendEmailSchema,
} from '../validation/auth.js';

const router = express.Router();

router.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(registerController),
);

router.post('/login', validateBody(loginSchema), ctrlWrapper(loginController));

router.post('/refresh', ctrlWrapper(refreshController));

router.post('/logout', ctrlWrapper(logoutController));

router.post(
  '/send-reset-email',
  validateBody(resetSendEmailSchema),
  ctrlWrapper(SendResetEmailController),
);
router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default router;
