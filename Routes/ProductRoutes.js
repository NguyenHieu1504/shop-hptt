import express from 'express';
import { isAdmin, protect, isBoss } from '../Middleware/Auth.js';
import {
  createProduct,
  createReviewProduct,
  deleteProduct,
  deleteReviewProduct,
  getAllProducts,
  updateProduct,
  viewDetailProduct,
  showProductGender,
  showNewProducts,
  showTrendProduct,
  showAllProducts,
  addProductsToQueue,
  getQueueList,
  getQueueListWithIsConfirmZero,
  getQueueListWithIsConfirmOne,
  getQueueListWithIsConfirmTwo,
  updateIsConfirm,
  getQueueListByUser,
  getQueueDetail,
  getStatistical
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
router.post('/queue/add',protect, addProductsToQueue);
router.get('/queue/user/list/:userId',protect, getQueueListByUser);
router.get('/queue/user/detail/:queueId',protect, getQueueDetail);
router.get('/queue/list/',protect, isAdmin, getQueueList);
router.get('/isConfirmZero/queue/',protect, isAdmin, getQueueListWithIsConfirmZero);
router.get('/isConfirmOne/queue/',protect, isAdmin, getQueueListWithIsConfirmOne);
router.get('/isConfirmTwo/queue/',protect, isAdmin, getQueueListWithIsConfirmTwo);
router.post('/updateIsConfirm/queue', protect, isAdmin, updateIsConfirm);
router.get('/statistical/queue', protect, isBoss, getStatistical);



// review product
router.post('/:id/reviewProduct', protect, createReviewProduct);
router.delete(
  '/:id/deleteReviewProduct/:reviewId',
  protect,
  deleteReviewProduct
);

//
router.get('/getAllProducts', getAllProducts);
export default router;
