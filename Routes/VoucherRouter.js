import express from 'express';

import { isAdmin, protect } from '../Middleware/Auth.js';
import {
  createVoucher,
  getAllVouchers,
} from '../Controller/VoucherController.js';

/* Public routes */
const router = express.Router();
router.post('/createVoucher', protect, isAdmin, createVoucher);
router.get('/getAllVouchers', getAllVouchers);
export default router;
