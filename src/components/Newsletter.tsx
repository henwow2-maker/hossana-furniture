import React from 'react';
import { motion } from 'motion/react';
import { Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export default function Newsletter() {
  return (
    <section className="py-24 bg-[#fafbfc] border-t border-slate-100">
      <div className="container mx-auto px-6">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8 }}
           viewport={{ once: true }}
           className="relative overflow-hidden bg-white rounded-[44px] p-12 md:p-20 text-center border border-slate-200/80 shadow-md"
        >
          {/* Decorative Blur */}
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#c71f2c]/5 rounded-full blur-[100px]" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px]" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="text-[#c71f2c] uppercase tracking-[0.4em] text-[10px] md:text-xs font-black mb-6 block animate-pulse">Stay Inspired</span>
            <h2 className="text-4xl md:text-5xl font-serif font-black text-black mb-8 leading-tight">
              Get 15% Off Your <br /> <span className="text-[#c71f2c] italic">First Order</span>
            </h2>
            <p className="text-black text-base md:text-lg mb-12 font-medium leading-relaxed">
              Join Hossana. Subscribe to our newsletter and receive curated timber design inspiration, early access to new collections, and exclusive discount design offers.
            </p>

            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
               <div className="flex-grow">
                  <Input 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="h-16 bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 rounded-2xl text-lg px-8 focus:ring-1 focus:ring-gold focus:border-gold outline-none"
                  />
               </div>
               <Button className="h-16 bg-[#c71f2c] hover:bg-slate-800 text-white px-10 rounded-2xl font-bold uppercase tracking-widest text-xs transition-colors shadow-md">
                 Subscribe <Send className="ml-2 w-4 h-4" />
               </Button>
            </form>
            <p className="text-[10px] text-black font-semibold mt-6 uppercase tracking-widest">No spam. Only handcrafted quality. Unsubscribe at any time.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
