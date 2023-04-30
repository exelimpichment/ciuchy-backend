import express from 'express';
import authenticateUser from '../middleware/authentication';

export const router = express.Router();

import {
  register,
  login,
  logout,
  verifyEmail,
} from '../Controllers/authController';

router.post('/register', register);
router.post('/login', login);
router.delete('/logout', authenticateUser, logout);
router.post('/verify-email', verifyEmail);
