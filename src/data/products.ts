import { Product } from '../types/Product';

export const products: Product[] = [
  {
    id: '1',
    name: 'MacBook Pro 14" M3',
    brand: 'Apple',
    price: 52000000,
    originalPrice: 55000000,
    image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'macbook',
    specs: {
      processor: 'Apple M3 8-core CPU',
      ram: '16GB Unified Memory',
      storage: '512GB SSD',
      graphics: '10-core GPU',
      display: '14.2" Liquid Retina XDR',
      battery: 'Up to 18 hours'
    },
    description: 'MacBook Pro mới với chip M3 mạnh mẽ, hoàn hảo cho công việc chuyên nghiệp.',
    inStock: true,
    rating: 4.8,
    reviewCount: 124,
    featured: true
  },
  {
    id: '2',
    name: 'Dell XPS 13 Plus',
    brand: 'Dell',
    price: 45000000,
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
    category: 'ultrabook',
    specs: {
      processor: 'Intel Core i7-13700H',
      ram: '16GB LPDDR5',
      storage: '1TB SSD',
      graphics: 'Intel Iris Xe',
      display: '13.4" OLED Touch',
      battery: 'Up to 12 hours'
    },
    description: 'Ultrabook cao cấp với thiết kế tinh tế và hiệu năng vượt trội.',
    inStock: true,
    rating: 4.6,
    reviewCount: 89,
    featured: true
  },
  {
    id: '3',
    name: 'ASUS ROG Strix G15',
    brand: 'ASUS',
    price: 35000000,
    originalPrice: 38000000,
    image: 'https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'gaming',
    specs: {
      processor: 'AMD Ryzen 7 6800H',
      ram: '16GB DDR5',
      storage: '1TB SSD',
      graphics: 'NVIDIA RTX 4060',
      display: '15.6" 144Hz IPS',
      battery: 'Up to 8 hours'
    },
    description: 'Laptop gaming mạnh mẽ với card đồ họa RTX 4060 cho trải nghiệm gaming tuyệt vời.',
    inStock: true,
    rating: 4.7,
    reviewCount: 156,
    featured: true
  },
  {
    id: '4',
    name: 'Lenovo ThinkPad X1 Carbon',
    brand: 'Lenovo',
    price: 42000000,
    image: 'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'business',
    specs: {
      processor: 'Intel Core i7-13700U',
      ram: '16GB LPDDR5',
      storage: '512GB SSD',
      graphics: 'Intel Iris Xe',
      display: '14" 2.8K OLED',
      battery: 'Up to 15 hours'
    },
    description: 'Laptop doanh nghiệp hàng đầu với độ bền cao và bảo mật tốt.',
    inStock: true,
    rating: 4.5,
    reviewCount: 73
  },
  {
    id: '5',
    name: 'HP Spectre x360 14',
    brand: 'HP',
    price: 38000000,
    image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'convertible',
    specs: {
      processor: 'Intel Core i7-13700H',
      ram: '16GB DDR4',
      storage: '1TB SSD',
      graphics: 'Intel Iris Xe',
      display: '13.5" 3K2K Touch',
      battery: 'Up to 13 hours'
    },
    description: 'Laptop 2-in-1 linh hoạt với thiết kế sang trọng và hiệu năng cao.',
    inStock: true,
    rating: 4.4,
    reviewCount: 92
  },
  {
    id: '6',
    name: 'Acer Predator Helios 300',
    brand: 'Acer',
    price: 32000000,
    originalPrice: 35000000,
    image: 'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'gaming',
    specs: {
      processor: 'Intel Core i7-12700H',
      ram: '16GB DDR4',
      storage: '512GB SSD',
      graphics: 'NVIDIA RTX 4050',
      display: '15.6" 144Hz IPS',
      battery: 'Up to 6 hours'
    },
    description: 'Laptop gaming hiệu suất cao với mức giá hợp lý cho game thủ.',
    inStock: false,
    rating: 4.3,
    reviewCount: 67
  }
];

export const categories = [
  { id: 'all', name: 'Tất cả', count: products.length },
  { id: 'macbook', name: 'MacBook', count: products.filter(p => p.category === 'macbook').length },
  { id: 'gaming', name: 'Gaming', count: products.filter(p => p.category === 'gaming').length },
  { id: 'ultrabook', name: 'Ultrabook', count: products.filter(p => p.category === 'ultrabook').length },
  { id: 'business', name: 'Doanh nghiệp', count: products.filter(p => p.category === 'business').length },
  { id: 'convertible', name: 'Laptop 2-in-1', count: products.filter(p => p.category === 'convertible').length }
];