import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../data/mockData';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'rating'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('hossana_products_v4');
    if (stored) {
      try {
        setProducts(JSON.parse(stored));
      } catch (err) {
        console.error('Failed to parse stored products:', err);
        setProducts(PRODUCTS);
      }
    } else {
      setProducts(PRODUCTS);
      localStorage.setItem('hossana_products_v4', JSON.stringify(PRODUCTS));
    }
  }, []);

  const saveProducts = (updatedList: Product[]) => {
    setProducts(updatedList);
    localStorage.setItem('hossana_products_v4', JSON.stringify(updatedList));
  };

  const addProduct = (productData: Omit<Product, 'id' | 'rating'>) => {
    const newProduct: Product = {
      ...productData,
      id: Math.random().toString(36).substr(2, 9),
      rating: 5.0,
    };
    const updated = [newProduct, ...products];
    saveProducts(updated);
  };

  const updateProduct = (updatedProduct: Product) => {
    const updated = products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
    saveProducts(updated);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
