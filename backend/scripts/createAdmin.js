const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Kết nối database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Đã kết nối database');

    // Tạo admin user
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (!adminExists) {
      const admin = await User.create({
        name: 'Administrator',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin',
        phone: '0123456789'
      });

      console.log('Đã tạo admin user:', admin.email);
    } else {
      console.log('Admin user đã tồn tại');
    }

    // Tạo một số danh mục mẫu
    const categories = [
      { name: 'Điện thoại', description: 'Điện thoại thông minh' },
      { name: 'Laptop', description: 'Máy tính xách tay' },
      { name: 'Tablet', description: 'Máy tính bảng' },
      { name: 'Phụ kiện', description: 'Phụ kiện điện tử' },
      { name: 'Đồng hồ', description: 'Đồng hồ thông minh' }
    ];

    for (const categoryData of categories) {
      const exists = await Category.findOne({ name: categoryData.name });
      if (!exists) {
        await Category.create(categoryData);
        console.log(`Đã tạo danh mục: ${categoryData.name}`);
      }
    }

    console.log('Khởi tạo dữ liệu hoàn tất!');
    process.exit(0);

  } catch (error) {
    console.error('Lỗi:', error);
    process.exit(1);
  }
};

createAdmin();