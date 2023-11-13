import mongoose from 'mongoose';

const VoucherSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    discountPrice: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    quantity: { type: Number, required: true },
    priceUsed: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Voucher', VoucherSchema);
