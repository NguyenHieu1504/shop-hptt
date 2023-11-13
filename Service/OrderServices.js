// orderService.js
import Product from '../Models/ProductModels.js';

const OrderService = {
  async getProductInfo(productId) {
    try {
      const product = await Product.findById(productId);
      if (product) {
        return {
          name: product.name,
          price: product.price,
          quantity: product.quantity,
          images: product.images,
        };
      }
      return null; // Trả về null nếu không tìm thấy sản phẩm
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

export default OrderService;
