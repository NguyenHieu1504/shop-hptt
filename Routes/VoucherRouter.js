import express from 'express';

import { isAdmin, protect } from '../Middleware/Auth.js';
import { createVoucher, showVoucher } from '../Controller/VoucherController.js';

/* Public routes */
const router = express.Router();
router.post('/createVoucher', protect, isAdmin, createVoucher);
router.get('/list/all', showVoucher);

export default router;
