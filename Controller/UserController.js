import asyncHandler from 'express-async-handler';
import User from '../Models/UserModels.js';
import mongoose from 'mongoose';
import { generateToken } from '../Middleware/Auth.js';
import Order from '../Models/OrderModels.js';
import Queue from '../Models/QueueModels.js';
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
    const existingProduct = user.likedProduct.find(
      (product) => product.productId.toString() === productId.toString()
    );

    if (existingProduct) {
      // Nếu sản phẩm đã có, kiểm tra xem size có giống nhau không
      if (existingProduct.size === size) {
        return res
          .status(400)
          .json({ message: 'Product already liked with the same size' });
      } else {
        // Nếu size khác nhau, thêm sản phẩm mới vào danh sách yêu thích
        user.likedProduct.push({
          productId,
          size,
          color,
        });
        await user.save();
        return res.status(200).json({
          message: 'Product added to liked list with a different size',
        });
      }
    }

    // Nếu sản phẩm chưa có, thêm vào danh sách yêu thích
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

// statistical product in month, year

/* const statisticalSellProduct = asyncHandler(async (req, res) => {
  try {
    const { year, month } = req.query;

    // Chuyển giá trị tháng thành chuỗi để giữ số 0 ở đầu
    const monthString = month.toString();

    // Chuyển chuỗi tháng thành số và giữ số 0 ở đầu nếu cần
    const parsedMonth = parseInt(monthString, 10);

    console.log('Parsed month: ' + parsedMonth, typeof parsedMonth);
    if (isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
      console.error('Invalid month:', month);
      return res.status(400).json({ error: 'Invalid month' });
    }

    // Chuyển đổi tháng có một chữ số thành chuỗi có hai chữ số
    const formattedMonth =
      parsedMonth < 10 ? `0${parsedMonth}` : `${parsedMonth}`;
    const formattedMonthNum = Number(formattedMonth);
    console.log(
      'Formatted Month: ' + formattedMonthNum,
      typeof formattedMonthNum
    );
    // Tạo ngày bắt đầu và ngày kết thúc
    const startDate = new Date(`${year}-${formattedMonthNum}-01T00:00:00.000Z`);
    const endDate = new Date(
      `${year}-${formattedMonthNum + 1}-01T00:00:00.000Z`
    );

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error('Invalid startDate or endDate');
      return res.status(400).json({ error: 'Invalid startDate or endDate' });
    }

    // Truy vấn cơ sở dữ liệu để lấy thông tin sản phẩm theo tháng và năm
    const products = await Queue.find({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    res.status(200).json({ products });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}); */

// get Profile user

const getProfile = asyncHandler(async (req, res) => {
  const { fullName, email, phoneNumber, address, images } = req.user;
  res.json({
    fullName,
    email,
    phoneNumber,
    address,
    images,
  });
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
  getProfile,
};
