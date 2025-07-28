const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên sản phẩm'],
    trim: true,
    maxlength: [100, 'Tên sản phẩm không được vượt quá 100 ký tự']
  },
  description: {
    type: String,
    required: [true, 'Vui lòng nhập mô tả sản phẩm'],
    maxlength: [2000, 'Mô tả không được vượt quá 2000 ký tự']
  },
  price: {
    type: Number,
    required: [true, 'Vui lòng nhập giá sản phẩm'],
    min: [0, 'Giá sản phẩm không được âm']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Giá gốc không được âm']
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Vui lòng chọn danh mục sản phẩm']
  },
  brand: {
    type: String,
    maxlength: [50, 'Thương hiệu không được vượt quá 50 ký tự']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String
  }],
  stock: {
    type: Number,
    required: [true, 'Vui lòng nhập số lượng tồn kho'],
    min: [0, 'Số lượng tồn kho không được âm'],
    default: 0
  },
  sku: {
    type: String,
    unique: true,
    required: [true, 'Vui lòng nhập mã SKU']
  },
  weight: {
    type: Number,
    min: [0, 'Trọng lượng không được âm']
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  tags: [String],
  specifications: [{
    name: String,
    value: String
  }],
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Đánh giá không được âm'],
      max: [5, 'Đánh giá không được vượt quá 5']
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  soldCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual cho discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Index cho tìm kiếm
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ soldCount: -1 });
productSchema.index({ 'ratings.average': -1 });

module.exports = mongoose.model('Product', productSchema);