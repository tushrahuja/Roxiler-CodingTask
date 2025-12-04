import express from 'express';
import auth from '../middleware/auth.js';
import { permit } from '../middleware/roles.js';
import { addStoreByAdmin, listStores, ownerDashboard } from '../controllers/storeController.js';

const router = express.Router();

router.post('/', auth, permit('SYSTEM_ADMIN'), addStoreByAdmin);
router.get('/', listStores);
router.get('/owner/:ownerId/dashboard', auth, permit('STORE_OWNER'), ownerDashboard);

export default router;
