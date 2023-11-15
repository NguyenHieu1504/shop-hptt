import mongoose from 'mongoose';
import Product from '../Models/ProductModels.js';
import asyncHandler from 'express-async-handler';
import User from '../Models/UserModels.js';

// api create product

const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    description,
    quantity,
    sizes,
    colors,
    price,
    images,
  } = req.body;

  if (
    !name ||
    !category ||
    !description ||
    !quantity ||
    !sizes ||
    !colors ||
    !price ||
    !images
  ) {
    return res.status(400).json({ error: 'Missing required field' });
  }

  // create a new product
  const product = new Product({
    name,
    category,
    description,
    quantity,
    sizes,
    colors,
    price,
    images,
  });
  product
    .save()
    .then(() => {
      res.status(201).json({ message: 'Product created successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to create product' });
    });
});

// api updateProduct
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      quantity,
      sizes,
      colors,
      price,
      images,
    } = req.body;
    const product = await Product.findById(req.params.id);
    /* console.log('userId: ' + userId); */
    if (product) {
      product.name = name || product.name;
      product.category = category || product.category;
      product.description = description || product.description;
      product.quantity = quantity || product.quantity;
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;
      product.price = price || product.price;
      product.images = images || product.images;
      const updatedProduct = await product.save();
      res.status(200).json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// api deleteProduct

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    /* console.log(product); */
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    await product.deleteOne();
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// view details product
const viewDetailProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Không tìm thấy sản phẩm');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// create review product

const createReviewProduct = asyncHandler(async (req, res) => {
  const { rating, comment, images } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      const alreadyReview = product.comments.find(
        (r) => r.userId.toString() === req.user._id.toString()
      );
      if (alreadyReview) {
        res.status(400);
        throw new Error('You already review this product');
      }
      // else create a new movie
      const review = {
        userName: req.user.fullName,
        userId: req.user._id,
        userImage: req.user.images,
        rating: Number(rating),
        comment,
        images,
      };
      product.comments.push(review);
      product.numberOfReviews = product.comments.length;
      product.rate =
        product.comments.reduce((acc, item) => item.rating + acc, 0) /
        product.comments.length;

      await product.save();
      res.status(201).json({
        message: 'Review addded',
      });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// delete review products

const deleteReviewProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    /* console.log(product); */
    if (product) {
      const reviewIndex = product.comments.findIndex(
        (r) => r._id.toString() === req.params.reviewId
      );
      /* console.log(product.comments); */
      /* console.log(reviewIndex); */
      /* console.log(reviewIndex); */
      if (reviewIndex !== -1) {
        const review = product.comments[reviewIndex];
        /* console.log(review); */
        // Kiểm tra quyền của người dùng hiện tại
        if (review.userId.toString() !== req.user._id.toString()) {
          res.status(403);
          throw new Error('Bạn không có quyền xóa đánh giá và bình luận này');
        }

        // Tiến hành xóa đánh giá và bình luận
        product.comments.splice(reviewIndex, 1);
        product.numberOfReviews = product.comments.length;

        if (product.comments.length > 0) {
          product.rate =
            product.comments.reduce((acc, item) => item.rating + acc, 0) /
            product.comments.length;
        } else {
          product.rate = 0;
        }

        await product.save();
        res.status(200).json({
          message: 'Đánh giá đã được xóa',
        });
      } else {
        res.status(404);
        throw new Error('Không tìm thấy đánh giá');
      }
    } else {
      res.status(404);
      throw new Error('Không tìm thấy sản phẩm');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// get all prodcuts from db
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

export {
  createProduct,
  updateProduct,
  deleteProduct,
  viewDetailProduct,
  createReviewProduct,
  deleteReviewProduct,
  getAllProducts,
};
