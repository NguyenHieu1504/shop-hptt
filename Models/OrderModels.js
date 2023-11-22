import mongoose from 'mongoose';
import OrderService from '../Service/OrderServices.js';
const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: { type: String, required: true },
    /* pinCode: {
      type: Number,
      required: true,
    }, */
    phoneNumber: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      /* required: true, */
    },
  },
  orderItems: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        /* required: true, */
      },
      name: {
        type: String,
      },
      price: {
        type: Number,
      },

      /* product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      }, */
      quantity: {
        type: Number,
        required: true,
      },
      size: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
      images: {
        type: String,
        /* required: true, */
      },
      voucher: { type: String, default: '' },
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  paymentInfo: {
    id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Unpaid', 'Paid'],
      default: 'Unpaid',
    },
    paymentMethods: {
      type: String,
      enum: ['Thanh toán khi nhận hàng', 'Thanh toán qua ví điện tử'],
      required: true,
    },
  },
  /* paidAt: {
    type: Date,
    required: true,
  }, */
  itemsPrice: {
    type: Number,
  },
  taxPrice: {
    type: Number,
    default: 0,
  },
  shippingPrice: {
    type: Number,
    default: 25000,
  },
  voucher: {
    type: String,
  },
  totalPrice: {
    type: Number,
  },
  orderStatus: {
    type: String,
    required: true,
    enum: [
      'Chờ xác nhận',
      'Đã xác nhận',
      'Đang đóng gói',
      'Đang gửi hàng',
      'Hoàn thành đơn hàng',
      'Hủy đơn hàng',
      'Hoàn tiền',
    ],
    default: 'Chờ xác nhận',
  },
  deliveriedAt: Date,
  createdAt: { type: Date, default: Date.now() },
});

orderSchema.statics.getProductInfo = async function (productId) {
  return OrderService.getProductInfo(productId);
};
export default mongoose.model('Order', orderSchema);
