import { CATEGORIES } from '../data/mockData';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CategoriesSection() {
  return (
    <section id="categories" className="py-24 bg-white overflow-hidden border-t border-slate-100">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-2xl font-serif uppercase tracking-widest text-black leading-tight font-black">
            Collections
          </h2>
          <Link to="/shop" className="text-[10px] uppercase tracking-widest text-black hover:text-[#c71f2c] transition-colors font-bold">
            View All Categories &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((category, index) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.id}`}
              className="group cursor-pointer block"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-slate-100 aspect-[4/5] rounded-[24px] border border-slate-200/60 overflow-hidden flex items-center justify-center mb-4 transition-all group-hover:border-[#c71f2c]/40 relative shadow-sm">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-[#c71f2c]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-350 pointer-events-none" />
                </div>
                <h3 className="text-sm uppercase tracking-widest font-bold text-black group-hover:text-[#c71f2c] transition-colors">{category.name}</h3>
                <p className="text-[11px] text-black mt-1 uppercase tracking-widest">{category.description.split(' ').slice(0, 3).join(' ')}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
