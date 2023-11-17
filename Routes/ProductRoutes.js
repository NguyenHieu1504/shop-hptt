import express from 'express';
import { isAdmin, protect } from '../Middleware/Auth.js';
import {
  createProduct,
  createReviewProduct,
  deleteProduct,
  deleteReviewProduct,
  updateProduct,
  viewDetailProduct,
  showProductGender,
  showNewProducts,
  showTrendProduct,
  showAllProducts
} from '../Controller/ProductController.js';

/* Public routes */
const router = express.Router();

router.post('/createProduct', protect, isAdmin, createProduct);
router.put('/:id/updateProduct', protect, isAdmin, updateProduct);
router.delete('/:id/deleteProduct', protect, isAdmin, deleteProduct);
router.get('/:id/viewProduct', viewDetailProduct);
router.get('/list/:gender', showProductGender);
router.get('/new/list/', showNewProducts);
router.get('/trend/list/', showTrendProduct);
router.get('/all/list/', showAllProducts);

// review product
router.post('/:id/reviewProduct', protect, createReviewProduct);
router.delete(
  '/:id/deleteReviewProduct/:reviewId',
  protect,
  deleteReviewProduct
);
export default router;
