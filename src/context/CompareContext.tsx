import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { toast } from 'sonner';

interface CompareContextType {
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompareList: () => void;
  isCompareModalOpen: boolean;
  setCompareModalOpen: (open: boolean) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareModalOpen, setCompareModalOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('hossana_compare');
    if (saved) {
      try {
        setCompareList(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse compare list', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('hossana_compare', JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (product: Product) => {
    if (compareList.some((item) => item.id === product.id)) {
      toast.info('Item is already in your comparison list');
      return;
    }
    if (compareList.length >= 4) {
      toast.warning('You can compare a maximum of 4 products at a time');
      return;
    }
    setCompareList((prev) => [...prev, product]);
    toast.success(`${product.name} added to comparison list`);
  };

  const removeFromCompare = (productId: string) => {
    setCompareList((prev) => prev.filter((item) => item.id !== productId));
    toast.info('Removed from comparison list');
  };

  const isInCompare = (productId: string) => {
    return compareList.some((item) => item.id === productId);
  };

  const clearCompareList = () => {
    setCompareList([]);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompareList,
        isCompareModalOpen,
        setCompareModalOpen,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
