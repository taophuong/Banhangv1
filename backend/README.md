# Hệ Thống Back-end Bán Hàng và Trang Quản Trị

Một hệ thống back-end hoàn chỉnh cho website bán hàng với trang quản trị web hiện đại.

## Tính Năng

### API Backend
- ✅ Authentication & Authorization (JWT)
- ✅ Quản lý sản phẩm (CRUD)
- ✅ Quản lý danh mục (CRUD)
- ✅ Quản lý đơn hàng
- ✅ Quản lý khách hàng
- ✅ Hệ thống đánh giá sản phẩm
- ✅ Tìm kiếm và lọc sản phẩm
- ✅ Phân trang
- ✅ Upload file
- ✅ Rate limiting
- ✅ Security middleware

### Trang Quản Trị
- ✅ Dashboard với thống kê tổng quan
- ✅ Quản lý sản phẩm
- ✅ Quản lý đơn hàng
- ✅ Quản lý danh mục
- ✅ Quản lý khách hàng
- ✅ Thống kê và báo cáo
- ✅ Giao diện responsive
- ✅ Authentication

## Công Nghệ Sử Dụng

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT
- **Security**: Helmet, CORS, Rate Limiting
- **Frontend Admin**: HTML5, CSS3, JavaScript ES6+, Bootstrap 5
- **Charts**: Chart.js

## Cài Đặt

### 1. Clone repository
```bash
git clone <repository-url>
cd backend
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình môi trường
Tạo file `.env` với nội dung:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRE=7d
NODE_ENV=development
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

### 4. Khởi tạo database
```bash
node scripts/createAdmin.js
```

### 5. Chạy server
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/me` - Lấy thông tin user hiện tại
- `PUT /api/auth/me` - Cập nhật thông tin
- `PUT /api/auth/password` - Đổi mật khẩu

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy sản phẩm theo ID
- `POST /api/products` - Tạo sản phẩm mới (Admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (Admin)
- `POST /api/products/:id/reviews` - Thêm đánh giá
- `GET /api/products/featured` - Sản phẩm nổi bật
- `GET /api/products/bestsellers` - Sản phẩm bán chạy

### Categories
- `GET /api/categories` - Lấy danh sách danh mục
- `GET /api/categories/:id` - Lấy danh mục theo ID
- `POST /api/categories` - Tạo danh mục mới (Admin)
- `PUT /api/categories/:id` - Cập nhật danh mục (Admin)
- `DELETE /api/categories/:id` - Xóa danh mục (Admin)

### Orders
- `POST /api/orders` - Tạo đơn hàng mới
- `GET /api/orders/my` - Lấy đơn hàng của user hiện tại
- `GET /api/orders/:id` - Lấy đơn hàng theo ID
- `PUT /api/orders/:id/cancel` - Hủy đơn hàng
- `GET /api/orders` - Lấy tất cả đơn hàng (Admin)
- `PUT /api/orders/:id/status` - Cập nhật trạng thái đơn hàng (Admin)
- `GET /api/orders/stats` - Thống kê đơn hàng (Admin)

### Users
- `GET /api/users` - Lấy danh sách users (Admin)
- `GET /api/users/:id` - Lấy user theo ID (Admin)
- `PUT /api/users/:id` - Cập nhật user (Admin)
- `DELETE /api/users/:id` - Xóa user (Admin)
- `PUT /api/users/:id/toggle-status` - Khóa/mở khóa user (Admin)

## Trang Quản Trị

Truy cập trang quản trị tại: `http://localhost:5000/admin`

### Thông tin đăng nhập mặc định:
- **Email**: admin@example.com
- **Password**: admin123

### Các chức năng:
1. **Dashboard**: Thống kê tổng quan, đơn hàng gần đây
2. **Sản Phẩm**: Thêm, sửa, xóa sản phẩm
3. **Danh Mục**: Quản lý danh mục sản phẩm
4. **Đơn Hàng**: Xem và cập nhật trạng thái đơn hàng
5. **Khách Hàng**: Quản lý tài khoản khách hàng
6. **Thống Kê**: Biểu đồ doanh thu và báo cáo
7. **Cài Đặt**: Cấu hình hệ thống

## Cấu Trúc Thư Mục

```
backend/
├── config/
│   └── database.js
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│   ├── categoryController.js
│   └── userController.js
├── middleware/
│   ├── auth.js
│   └── error.js
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   └── Order.js
├── routes/
│   ├── auth.js
│   ├── products.js
│   ├── orders.js
│   ├── categories.js
│   └── users.js
├── public/
│   └── admin/
│       ├── index.html
│       ├── css/
│       │   └── admin.css
│       └── js/
│           └── admin.js
├── scripts/
│   └── createAdmin.js
├── uploads/
├── .env
├── server.js
└── package.json
```

## Security Features

- JWT Authentication
- Password hashing với bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- SQL injection protection
- XSS protection

## Tính Năng Nâng Cao

- Phân trang tự động
- Tìm kiếm full-text
- Lọc và sắp xếp
- Upload và quản lý file
- Email notifications (có thể mở rộng)
- Payment integration ready
- RESTful API design
- Error handling toàn diện

## Mở Rộng

Hệ thống được thiết kế để dễ dàng mở rộng:

1. **Payment Gateway**: Tích hợp Stripe, PayPal
2. **Email Service**: SendGrid, Mailgun
3. **File Storage**: AWS S3, Cloudinary
4. **Caching**: Redis
5. **Search Engine**: Elasticsearch
6. **Monitoring**: Winston logging

## Hỗ Trợ

Nếu bạn gặp vấn đề, vui lòng:
1. Kiểm tra logs trong console
2. Đảm bảo MongoDB đang chạy
3. Kiểm tra file .env
4. Restart server

## License

MIT License