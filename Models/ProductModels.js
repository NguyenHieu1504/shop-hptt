import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
  {
    userName: { type: String, required: true },
    userImage: { type: String },
    rating: { type: Number },
    comment: { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now(),
    },
    images: { type: String },
  },
  {
    timestamps: true,
  }
);

const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      /* maxLength: [255, 'Describe product not longer 255 character....'], */
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    sizes: [
      {
        type: String,
        enum: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
        required: true,
      },
    ],
    gender: {
      type: String,
      enum: ['M', 'L'],
      required: true,
    },

    colors: [
      {
        type: String,
        enum: [
          'Blue',
          'Red',
          'White',
          'Yellow',
          'Orange',
          'Green',
          'Pink',
          'Black',
        ],
        required: true,
      },
    ],
    rate: {
      type: Number,
      require: true,
      default: 0,
    },
    images: [
      {
        type: String,
        /*  required: true, */
      },
    ],
    vouchers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Voucher',
      },
    ],
    numberOfReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    comments: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Product', ProductSchema);
