import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { toast } from 'sonner';

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    const savedWishlist = localStorage.getItem('hossana_wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('hossana_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product: Product) => {
    if (wishlist.find((item) => item.id === product.id)) {
      toast.info('Item already in wishlist');
      return;
    }
    setWishlist((prev) => [...prev, product]);
    toast.success('Added to your wishlist collection');
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
    toast.info('Removed from wishlist');
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
