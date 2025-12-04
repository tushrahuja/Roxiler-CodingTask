import express from 'express';
import auth from '../middleware/auth.js';
import { submitOrUpdateRating, getUserRatingForStore } from '../controllers/ratingController.js';

const router = express.Router();

router.post('/:storeId', auth, submitOrUpdateRating);
router.get('/:storeId/user', auth, getUserRatingForStore);

export default router;
