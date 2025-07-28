const Product = require('../models/Product');
const Category = require('../models/Category');
const { validationResult } = require('express-validator');

// @desc    Lấy tất cả sản phẩm
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    let query = Product.find({ isActive: true });

    // Tìm kiếm
    if (req.query.search) {
      query = query.find({
        $text: { $search: req.query.search }
      });
    }

    // Lọc theo category
    if (req.query.category) {
      query = query.find({ category: req.query.category });
    }

    // Lọc theo giá
    if (req.query.minPrice || req.query.maxPrice) {
      const priceFilter = {};
      if (req.query.minPrice) priceFilter.$gte = req.query.minPrice;
      if (req.query.maxPrice) priceFilter.$lte = req.query.maxPrice;
      query = query.find({ price: priceFilter });
    }

    // Lọc theo thương hiệu
    if (req.query.brand) {
      query = query.find({ brand: req.query.brand });
    }

    // Lọc theo tags
    if (req.query.tags) {
      const tags = req.query.tags.split(',');
      query = query.find({ tags: { $in: tags } });
    }

    // Sắp xếp
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Phân trang
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Product.countDocuments(query);

    query = query.skip(startIndex).limit(limit).populate('category', 'name slug');

    const products = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pagination,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy sản phẩm theo ID
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('reviews.user', 'name avatar');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    // Tăng view count
    product.viewCount += 1;
    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Tạo sản phẩm mới
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array()
      });
    }

    // Kiểm tra category tồn tại
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Danh mục không tồn tại'
      });
    }

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cập nhật sản phẩm
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    // Kiểm tra category nếu có thay đổi
    if (req.body.category && req.body.category !== product.category.toString()) {
      const category = await Category.findById(req.body.category);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Danh mục không tồn tại'
        });
      }
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Xóa sản phẩm
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    await product.remove();

    res.status(200).json({
      success: true,
      message: 'Đã xóa sản phẩm'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Thêm đánh giá sản phẩm
// @route   POST /api/products/:id/reviews
// @access  Private
exports.addProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    // Kiểm tra user đã review chưa
    const alreadyReviewed = product.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'Bạn đã đánh giá sản phẩm này rồi'
      });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id
    };

    product.reviews.push(review);
    product.ratings.count = product.reviews.length;
    product.ratings.average = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Đã thêm đánh giá'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy sản phẩm nổi bật
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate('category', 'name slug')
      .limit(8)
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy sản phẩm bán chạy
// @route   GET /api/products/bestsellers
// @access  Public
exports.getBestSellingProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate('category', 'name slug')
      .sort('-soldCount')
      .limit(8);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};