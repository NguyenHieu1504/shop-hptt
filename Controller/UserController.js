import asyncHandler from 'express-async-handler';
import User from '../Models/UserModels.js';
import mongoose from 'mongoose';
import { generateToken } from '../Middleware/Auth.js';

// register user
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, phoneNumber, address, password, images } = req.body;
  try {
    const userExits = await User.findOne({ email });
    // check if user already exists
    if (userExits) {
      res.status(400);
      throw new Error(
        'Email already exists, please register with another email address'
      );
    }

    // create new user in MongoDB without hashing the password
    const user = await User.create({
      _id: new mongoose.Types.ObjectId(),
      fullName,
      email,
      phoneNumber,
      address,
      password, // Here, the password is stored as plain text
      images,
    });

    // if create user successfully, send user token to client
    if (user) {
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        images: user.images,
        role: user.role,
        likedProduct: user.likedProduct,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// login useer
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && user.password === password) {
      res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        images: user.images,
        role: user.role,
        likedProduct: user.likedProduct,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error: ' + error.message });
  }
});

// update profile user
const updateProfileUser = asyncHandler(async (req, res) => {
  const { fullName, phoneNumber, address, images } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.fullName = fullName || user.fullName;
      user.phoneNumber = phoneNumber || user.phoneNumber;
      user.address = address || user.address;
      user.images = images || user.images;
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        address: updatedUser.address,
        images: updatedUser.images,
        role: updatedUser.role,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// change password user
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    /* console.log('user', user); */
    if (user && user.password === oldPassword) {
      // Kiểm tra mật khẩu cũ trùng khớp
      user.password = newPassword; // Gán mật khẩu mới trực tiếp vào user object
      await user.save();
      res.json({ message: 'Password changed' });
    } else {
      res.status(401);
      throw new Error('Invalid old password');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// add product like list

const addLikedProduct = asyncHandler(async (req, res) => {
  const { productId, size, color } = req.body;

  try {
    // Tìm người dùng bằng id
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Kiểm tra xem sản phẩm đã có trong danh sách yêu thích chưa
    const existingProductIndex = user.likedProduct.findIndex(
      (product) => product.productId === productId
    );

    if (existingProductIndex !== -1) {
      return res.status(400).json({ message: 'Product already liked' });
    }

    // Thêm sản phẩm vào danh sách yêu thích với thông tin thêm
    user.likedProduct.push({
      productId,
      size,
      color,
    });
    await user.save();

    res.status(200).json({ message: 'Product added to liked list' });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// view all likedProduct
const viewAllLikedProduct = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    // Truy vấn người dùng để lấy danh sách sản phẩm yêu thích
    const user = await User.findById(userId).populate('likedProduct.productId');

    // Kiểm tra xem người dùng có tồn tại không
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Lấy danh sách sản phẩm yêu thích từ user.likedProduct
    const likedProducts = user.likedProduct;

    // Trả về danh sách sản phẩm yêu thích
    res.status(200).json({ likedProducts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// list product from addLikedProduct
const getLikedProducts = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    'likedProduct.productId'
  );

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json(user.likedProduct);
});
// delete product liked list

const deleteLikedProduct = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  try {
    // Tìm người dùng bằng id
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Kiểm tra xem sản phẩm có trong danh sách yêu thích không
    const likedProductIndex = user.likedProduct.findIndex(
      (product) => String(product.productId) === String(productId)
    );

    if (likedProductIndex === -1) {
      return res.status(400).json({ message: 'Product is not liked yet' });
    }

    // Xóa sản phẩm khỏi danh sách yêu thích
    user.likedProduct.splice(likedProductIndex, 1);
    await user.save();

    res.status(200).json({ message: 'Product removed from liked list' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export {
  registerUser,
  loginUser,
  updateProfileUser,
  changePassword,
  addLikedProduct,
  deleteLikedProduct,
  getLikedProducts,
  viewAllLikedProduct,
};
