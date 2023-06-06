// backend\controllers\productController.js

import asyncHandler from '../middleware/asyncHandler.js';
import { db } from '../database/prisma/prismaClient.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(process.env.PAGINATION_LIMIT);
  console.log('productController.js getProducts() pageSize:', pageSize);
  const page = Number(req.query.pageNumber) || 1;
  console.log('productController.js getProducts() page:', page);

  const keyword = req.query.keyword
    ? {
      name: {
        contains: req.query.keyword,
        mode: 'insensitive'
      },
    }
    : {};

  const count = await db.product.count({
    where: keyword,
  });

  const products = await db.product.findMany({
    where: keyword,
    take: pageSize,
    skip: pageSize * (page - 1),
  });

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await db.product.findUnique({
    where: { id: Number(req.params.id) }
  });

  if (product) {
    return res.json(product);
  }
  res.status(404);
  throw new Error('Resource not found');
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = {
    name: 'Sample name',
    price: 0,
    userId: req.user.id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  };

  const createdProduct = await db.product.create({ data: product });
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } = req.body;

  const product = await db.product.update({
    where: { id: Number(req.params.id) },
    data: { name, price, description, image, brand, category, countInStock },
  });

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await db.product.delete({
    where: { id: Number(req.params.id) }
  });

  if (product) {
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await db.product.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.userId.toString() === req.user.id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      userId: req.user.id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await db.product.update({
      where: { id: Number(req.params.id) },
      data: { reviews: product.reviews, numReviews: product.numReviews, rating: product.rating },
    });

    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await db.product.findMany({
    orderBy: { rating: 'desc' },
    take: 3,
  });

  res.json(products);
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
};

