import mongoose from 'mongoose';

const QueueSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Thay 'User' bằng tên của schema User nếu có
    required: true
  },
  isConfirm:{
    type: Number,
    enum: [0, 1, 2],
    required: true,
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Thay 'Product' bằng tên của schema Product nếu có
    required: true
  }]
});

const Queue = mongoose.model('Queue', QueueSchema);

export default Queue;
