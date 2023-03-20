import express from 'express';

export const router = express.Router();

import {
  register,
  login,
  logout,
  verifyEmail,
} from '../Controllers/authController';

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.post('/verify-email', verifyEmail);
