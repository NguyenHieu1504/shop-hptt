import express from 'express';
import {
  addLikedProduct,
  changePassword,
  deleteLikedProduct,
  loginUser,
  registerUser,
  updateProfileUser,
} from '../Controller/UserController.js';
import { protect } from '../Middleware/Auth.js';

/* Public routes */
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/updateProfile', protect, updateProfileUser);
router.put('/changepassword', protect, changePassword);


router.post('/addLikedProduct', protect, addLikedProduct);
router.delete('/deleteLikedProduct', protect, deleteLikedProduct);
export default router;
