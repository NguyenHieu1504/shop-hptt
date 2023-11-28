import express from 'express';
import {
  addLikedProduct,
  changePassword,
  deleteLikedProduct,
  getLikedProducts,
  getProfile,
  loginUser,
  registerUser,
  updateProfileUser,
  viewAllLikedProduct,
} from '../Controller/UserController.js';
import { isBoss, protect } from '../Middleware/Auth.js';

/* Public routes */
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/updateProfile', protect, updateProfileUser);
router.put('/changepassword', protect, changePassword);
router.get('/getProfile', protect, getProfile);
router.post('/addLikedProduct', protect, addLikedProduct);
router.get('/viewAllLikedProduct', protect, viewAllLikedProduct);
router.delete('/deleteLikedProduct', protect, deleteLikedProduct);
router.get('/getLikedProduct', protect, getLikedProducts);

// statisticalSellProduct
/* router.get('/statisticSellProduct', protect, isBoss, statisticalSellProduct); */
export default router;
