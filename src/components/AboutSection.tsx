import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Award, Users, Calendar, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

const STATS = [
  { icon: Calendar, label: 'Years Experience', value: '15+' },
  { icon: Users, label: 'Happy Customers', value: '12k+' },
  { icon: Award, label: 'Design Awards', value: '24' },
  { icon: Sparkles, label: 'Modern Pieces', value: '850+' },
];

export default function AboutSection() {
  return (
    <section className="py-24 bg-slate-50/75 border-t border-b border-slate-100 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text-based feature panel */}
          <motion.div 
            className="relative max-w-md mx-auto lg:mx-0 w-full"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative z-10 rounded-3xl border border-slate-200/50 bg-white p-8 md:p-10 shadow-xl">
              <p className="text-[#c71f2c] uppercase tracking-[0.25em] text-xs font-black mb-3">Crafted with care</p>
              <h3 className="text-2xl font-serif font-bold text-black mb-3">A studio-led approach to comfort and craftsmanship</h3>
              <p className="text-black text-sm leading-relaxed font-medium">
                We focus on the details that matter most: premium woods, clean silhouettes, and timeless comfort for everyday living.
              </p>
            </div>
          </motion.div>

          {/* Content Side */}
          <div className="flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="text-[#c71f2c] uppercase tracking-[0.25em] text-sm font-black mb-4 block animate-pulse">Our Heritage</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-black mb-6 leading-tight">
                Crafting Timeless Furniture <br /> <span className="text-[#c71f2c] italic">Since 2010</span>
              </h2>
              <p className="text-black text-base leading-relaxed mb-8 font-medium">
                At Hossana Furniture, we combine master craftsmanship, modern innovation, and luxury wood design to create furniture that transforms houses into elegant homes. Every piece in our collection is a testament to our commitment to quality.
              </p>
            </motion.div>
 
            <div className="grid grid-cols-2 gap-8 mb-8">
              {STATS.map((stat, index) => (
                <motion.div 
                   key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4"
                >
                  <div className="p-3 bg-[#c71f2c]/5 rounded-2xl text-[#c71f2c] border border-[#c71f2c]/10">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-serif font-black text-black">{stat.value}</p>
                    <p className="text-[10px] text-black uppercase tracking-widest font-black">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
 
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <Link to="/about">
                <Button className="bg-[#c71f2c] text-white hover:bg-slate-800 hover:text-white px-10 py-7 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-md">
                  Learn Our Story
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
