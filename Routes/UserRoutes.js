import express from 'express';
import {
  addLikedProduct,
  changePassword,
  deleteLikedProduct,
  getLikedProducts,
  loginUser,
  registerUser,
  updateProfileUser,
  viewAllLikedProduct,
} from '../Controller/UserController.js';
import { protect } from '../Middleware/Auth.js';

/* Public routes */
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/updateProfile', protect, updateProfileUser);
router.put('/changepassword', protect, changePassword);

router.post('/addLikedProduct', protect, addLikedProduct);
router.get('/viewAllLikedProduct', protect, viewAllLikedProduct);
router.delete('/deleteLikedProduct', protect, deleteLikedProduct);
router.get('/getLikedProduct', protect, getLikedProducts);
export default router;
