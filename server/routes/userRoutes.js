import express from 'express';
import { body } from 'express-validator';
import auth from '../middleware/auth.js';
import { permit } from '../middleware/roles.js';
import { createUserByAdmin, listUsers, updatePassword } from '../controllers/userController.js';

const router = express.Router();

router.post('/', auth, permit('SYSTEM_ADMIN'), [
  body('name').isLength({ min: 20, max: 60 }),
  body('email').isEmail(),
  body('password').matches(/^(?=.{8,16}$)(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/]).*$/),
  body('role').isIn(['SYSTEM_ADMIN','NORMAL_USER','STORE_OWNER'])
], createUserByAdmin);

router.get('/', auth, permit('SYSTEM_ADMIN'), listUsers);

router.put('/password', auth, [
  body('oldPassword').exists(),
  body('newPassword').matches(/^(?=.{8,16}$)(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/]).*$/)
], updatePassword);

export default router;
