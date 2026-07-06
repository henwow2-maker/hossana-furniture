import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { useProducts } from '../context/ProductContext';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

export default function FeaturedProducts() {
  const { products } = useProducts();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <section className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
       {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#c71f2c]/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-amber-500/5 blur-[100px] rounded-full" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-[#c71f2c] uppercase tracking-[0.3em] text-xs font-black mb-4 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#c71f2c]" /> Complete Showroom
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-black text-black leading-tight">
              Our Masterpieces Collection
            </h2>
          </div>
          
          <Link to="/shop">
            <Button className="px-8 h-12 rounded-full border border-slate-200 bg-white text-black hover:bg-slate-50 hover:text-slate-900 shadow-sm font-bold uppercase tracking-widest text-[10px] transition-all">
              Go to Full Shop <ArrowRight className="ml-2 w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {/* Category Filters inside Section */}
        <div className="flex flex-wrap gap-2 md:gap-3 mb-10 pb-4 border-b border-slate-100">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2.5 rounded-full text-[10.5px] uppercase tracking-widest font-black transition-all duration-300 ${
              activeCategory === 'all'
                ? 'bg-[#c71f2c] text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            All Products ({products.length})
          </button>
          
          {CATEGORIES.map(category => {
            const count = products.filter(p => p.category === category.id).length;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-2.5 rounded-full text-[10.5px] uppercase tracking-widest font-black transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-[#c71f2c] text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {category.name} ({count})
              </button>
            );
          })}
        </div>

        <motion.div 
          layout 
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 italic">No elegant creations available in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}
