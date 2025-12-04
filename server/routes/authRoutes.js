import express from 'express';
import { body } from 'express-validator';
import { signup, login } from '../controllers/authController.js';

const router = express.Router();

const passwordRegex = /^(?=.{8,16}$)(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/]).*$/;

router.post('/signup', [
  body('name').isLength({ min: 20, max: 60 }),
  body('email').isEmail(),
  body('address').isLength({ max: 400 }),
  body('password').matches(passwordRegex)
], signup);

router.post('/login', [
  body('email').isEmail(),
  body('password').exists()
], login);

export default router;
