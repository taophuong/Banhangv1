export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  specs: {
    processor: string;
    ram: string;
    storage: string;
    graphics: string;
    display: string;
    battery: string;
  };
  description: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}