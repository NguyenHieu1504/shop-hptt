import express from 'express';
import asyncHandler from 'express-async-handler';
import Voucher from '../Models/VoucherModels.js';

const createVoucher = asyncHandler(async (req, res) => {
  try {
    const { name, code, discountPrice, expiryDate, quantity, priceUsed } =
      req.body;

    // Tạo mới voucher
    const newVoucher = new Voucher({
      name,
      code,
      discountPrice,
      expiryDate,
      quantity,
      priceUsed,
    });

    // Lưu voucher vào database
    const savedVoucher = await newVoucher.save();

    res.status(201).json(savedVoucher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const showVoucher = asyncHandler(async (req, res) => {
  try {
    // Tìm tất cả các voucher từ cơ sở dữ liệu
    const vouchers = await Voucher.find();

    // Trả về danh sách các voucher nếu có
    res.status(200).json({ vouchers });
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(500).json({ error: error.message });
  }
});

export { createVoucher, showVoucher };
