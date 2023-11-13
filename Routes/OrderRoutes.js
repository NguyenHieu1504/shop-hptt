import express from 'express';

import { isAdmin, protect } from '../Middleware/Auth.js';
import { createVoucher } from '../Controller/VoucherController.js';
import { createOrder, getMyOrder } from '../Controller/OrderController.js';

/* Public routes */
const router = express.Router();
router.post('/createOrder', protect, createOrder);
router.get('/getMyOrder', protect, getMyOrder);
export default router;
