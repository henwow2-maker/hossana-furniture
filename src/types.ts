export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'user';
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  features?: string[];
  dimensions?: string;
  discount?: number;
  isBestSeller?: boolean;
  colors?: string[];
  material?: string;
  inStock?: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}
