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

const getAllVouchers = asyncHandler(async (req, res) => {
  const vouchers = await Voucher.find({});
  res.status(200).json(vouchers);
});

export { createVoucher, getAllVouchers };
