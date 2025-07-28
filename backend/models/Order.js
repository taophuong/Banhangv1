const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Đơn hàng phải thuộc về một khách hàng']
  },
  items: [{
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Số lượng phải ít nhất là 1']
    },
    image: String,
    sku: String
  }],
  shippingAddress: {
    fullName: {
      type: String,
      required: [true, 'Vui lòng nhập họ tên người nhận']
    },
    phone: {
      type: String,
      required: [true, 'Vui lòng nhập số điện thoại']
    },
    email: String,
    street: {
      type: String,
      required: [true, 'Vui lòng nhập địa chỉ']
    },
    city: {
      type: String,
      required: [true, 'Vui lòng nhập thành phố']
    },
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'Vietnam'
    }
  },
  paymentMethod: {
    type: String,
    required: [true, 'Vui lòng chọn phương thức thanh toán'],
    enum: ['cod', 'bank_transfer', 'credit_card', 'e_wallet']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentDetails: {
    transactionId: String,
    paymentDate: Date,
    paymentMethod: String,
    amount: Number
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  shippingFee: {
    type: Number,
    default: 0,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  trackingNumber: String,
  shippingMethod: {
    type: String,
    enum: ['standard', 'express', 'overnight'],
    default: 'standard'
  },
  estimatedDelivery: Date,
  actualDelivery: Date,
  notes: String,
  adminNotes: String,
  statusHistory: [{
    status: String,
    date: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  }],
  couponCode: String,
  refundAmount: {
    type: Number,
    default: 0
  },
  refundReason: String,
  refundDate: Date
}, {
  timestamps: true
});

// Tạo order number tự động
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Tìm số thứ tự cuối cùng trong ngày
    const lastOrder = await this.constructor.findOne({
      createdAt: {
        $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
      }
    }).sort({ createdAt: -1 });
    
    let sequence = 1;
    if (lastOrder && lastOrder.orderNumber) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-4));
      sequence = lastSequence + 1;
    }
    
    this.orderNumber = `ORD${year}${month}${day}${sequence.toString().padStart(4, '0')}`;
  }
  next();
});

// Index
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderNumber: 1 });

module.exports = mongoose.model('Order', orderSchema);