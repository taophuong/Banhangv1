import React from 'react';
import { Laptop, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Laptop className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">LaptopStore</h3>
                <p className="text-sm text-gray-400">Tech Excellence</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              Chuyên cung cấp laptop chính hãng với giá tốt nhất thị trường. 
              Cam kết chất lượng và dịch vụ hậu mại tận tâm.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-pink-500 cursor-pointer transition-colors" />
              <Youtube className="h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Về chúng tôi</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Sản phẩm</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Khuyến mãi</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Tin tức</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Hỗ trợ</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Danh mục</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Laptop Gaming</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">MacBook</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Ultrabook</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Laptop Doanh nghiệp</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Phụ kiện</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Liên hệ</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-sm">123 Đường ABC, Quận 1, TP.HCM</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-sm">0901 234 567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-sm">info@laptopstore.vn</span>
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm font-medium text-white mb-2">Giờ làm việc:</p>
              <p className="text-xs text-gray-400">T2-T6: 8:00 - 20:00</p>
              <p className="text-xs text-gray-400">T7-CN: 8:00 - 18:00</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © 2024 LaptopStore. All rights reserved. | 
            <a href="#" className="hover:text-blue-400 transition-colors"> Chính sách bảo mật</a> | 
            <a href="#" className="hover:text-blue-400 transition-colors"> Điều khoản sử dụng</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;