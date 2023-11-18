import mongoose from 'mongoose';
import Order from '../Models/OrderModels.js';
import asyncHandler from 'express-async-handler';
import Product from '../Models/ProductModels.js';
import User from '../Models/UserModels.js';
import OrderService from '../Service/OrderServices.js';
/* import { getProductInfo } from './order.statis.js'; */

// order.controller.js
const createOrder = asyncHandler(async (req, res) => {
  try {
    // Lấy thông tin shipping từ người dùng
    const { address, phoneNumber } = req.user;
    const userId = req.user._id;

    // Lấy thông tin sản phẩm từ body request
    const { orderItems, paymentInfo, voucher, totalPrice, orderStatus } =
      req.body;

    // Tạo đơn hàng
    const newOrder = new Order({
      shippingInfo: { address, phoneNumber, userId },
      orderItems: [], // Bắt đầu với một mảng trống
      userId: req.user._id,
      paymentInfo,
      shippingPrice: 25000,
      voucher,
      totalPrice,
      orderStatus: 'Chờ xác nhận',
    });

    // Thêm từng sản phẩm vào orderItems một cách tuần tự
    for (const item of orderItems) {
      const productInfo = await Order.getProductInfo(item.productId);
      if (productInfo) {
        newOrder.orderItems.push({
          productId: item.productId,
          name: productInfo.name,
          price: productInfo.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          images: Array.isArray(productInfo.images)
            ? productInfo.images.join(', ')
            : productInfo.images,
        });
      }
    }

    // Lưu đơn hàng vào cơ sở dữ liệu
    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getMyOrder = asyncHandler(async (req, res) => {
  try {
    const myOrder = await Order.find({ user: req.user.userId });
    /* console.log(req.user.userId); */
    if (!myOrder) {
      res.status(404).json({
        message:
          'Your order could not be found or you do not have an order yet ',
      });
    }
    res.status(200).json(myOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export { createOrder, getMyOrder };
