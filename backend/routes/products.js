const express = require('express');
const { body } = require('express-validator');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
  getFeaturedProducts,
  getBestSellingProducts
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const productValidation = [
  body('name')
    .notEmpty()
    .withMessage('Vui lòng nhập tên sản phẩm')
    .isLength({ max: 100 })
    .withMessage('Tên sản phẩm không được vượt quá 100 ký tự'),
  body('description')
    .notEmpty()
    .withMessage('Vui lòng nhập mô tả sản phẩm'),
  body('price')
    .isNumeric()
    .withMessage('Giá sản phẩm phải là số')
    .isFloat({ min: 0 })
    .withMessage('Giá sản phẩm không được âm'),
  body('category')
    .notEmpty()
    .withMessage('Vui lòng chọn danh mục'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Số lượng tồn kho phải là số nguyên không âm'),
  body('sku')
    .notEmpty()
    .withMessage('Vui lòng nhập mã SKU')
];

const reviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Đánh giá phải từ 1-5 sao'),
  body('comment')
    .notEmpty()
    .withMessage('Vui lòng nhập bình luận')
    .isLength({ max: 500 })
    .withMessage('Bình luận không được vượt quá 500 ký tự')
];

// Public routes
router.get('/featured', getFeaturedProducts);
router.get('/bestsellers', getBestSellingProducts);
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes
router.post('/:id/reviews', protect, reviewValidation, addProductReview);

// Admin routes
router.post('/', protect, adminOnly, productValidation, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;