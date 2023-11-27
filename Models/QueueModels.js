import mongoose from 'mongoose';

const QueueSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Thay 'User' bằng tên của schema User nếu có
    required: true
  },
  isConfirm: {
    type: Number,
    enum: [0, 1, 2, 3],
    //0: Chờ xác nhận
    //1: Đã xác nhận
    //2: Hủy đơn hàng
    //3: Hoàn thành đơn hàng
    required: true,
    default: 0,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Thay 'Product' bằng tên của schema Product nếu có
        required: true
      },
      quantity: {
        type: Number,
        ref: 'Quantity', 
        required: true,
      },
      size: {
        type: String,
        ref: 'Size', 
        required: true,
      },
      color: {
        type: String,
        ref: 'Color', 
        required: true,
      }
    }
  ],
  voucher: {
    type: mongoose.Schema.Types.ObjectId || null,
    //ref: 'Product', // Thay 'Product' bằng tên của schema Product nếu có
    //required: true
  },
  finalPrice: {
    type: Number,
    ref: 'FinalPrice', // Thay 'Product' bằng tên của schema Product nếu có
    required: true
  }
  
},{
  timestamps: true,
});
//udhbfu
const Queue = mongoose.model('Queue', QueueSchema);

export default Queue;
