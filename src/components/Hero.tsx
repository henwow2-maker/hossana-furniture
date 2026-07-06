import { motion } from 'motion/react';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-slate-50/50">
      {/* Soft Overstock Red/Orange and Coral ambient glows */}
      <div className="absolute top-[-100px] right-[-100px] w-96 h-96 lg:w-[500px] lg:h-[500px] bg-[#c71f2c]/5 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-100px] left-[-100px] w-80 h-80 lg:w-[400px] lg:h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Content */}
        <div className="flex flex-col gap-8 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="text-[#c71f2c] uppercase tracking-[0.25em] text-xs font-bold block mb-4">Hossana Masterpiece Collection</span>
            <h1 className="text-3.5xl sm:text-5xl lg:text-7xl font-serif leading-[1.15] mb-8 text-black font-black">
              Hossana — Get <span className="text-[#c71f2c] italic font-normal">Quality</span> Furniture
            </h1>
            <p className="text-black text-base sm:text-lg lg:text-xl leading-relaxed mb-10 max-w-md font-medium">
              Build a modern, cozy, and stylish space with beautifully designed natural timber, soft linen sofas, and masterfully crafted tables.
            </p>
          </motion.div>
 
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link to="/shop" className="w-full sm:w-auto">
              <button className="bg-[#c71f2c] text-white px-8 py-4 sm:px-12 sm:py-5 font-bold tracking-[0.15em] text-[10px] sm:text-[11px] uppercase hover:bg-slate-900 transition-all duration-300 shadow-md rounded-full w-full">
                Shop Now
              </button>
            </Link>
            <Link to="/shop#categories" className="w-full sm:w-auto">
              <button className="border-2 border-slate-200 text-black bg-white px-8 py-4 sm:px-12 sm:py-5 font-bold tracking-[0.15em] text-[10px] sm:text-[11px] uppercase hover:border-slate-800 hover:text-slate-900 transition-all duration-300 rounded-full w-full shadow-sm">
                Explore Categories
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Right Content - Hero Image with Hossana Minimal Design Frame */}
        <motion.div
          className="relative flex justify-center lg:justify-end"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "circOut" }}
        >
          <div className="relative z-10 w-full max-w-[550px] aspect-[4/5]">
            <div className="absolute inset-0 bg-slate-100 rounded-[40px] overflow-hidden shadow-xl border border-slate-200/50">
              <img 
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1200" 
                alt="Hossana Furnishings" 
                className="w-full h-full object-cover opacity-95 transition-transform duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Floating Card exactly like Hossana design, in soft white */}
            <motion.div 
               className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-6 border border-slate-200/80 shadow-xl max-w-[280px] rounded-[24px]"
               initial={{ x: -20, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ delay: 0.8 }}
            >
               <span className="text-[10px] uppercase tracking-[0.25em] text-[#c71f2c] font-black block mb-2">HOT DEAL – 50% OFF</span>
               <p className="text-xl font-serif text-black font-black mb-1">Helen Wooden Chair</p>
               <div className="w-12 h-[2px] bg-[#c71f2c] mb-3"></div>
               <p className="text-xs text-black leading-relaxed font-black uppercase tracking-widest">Handmade Solid Oak</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll Down Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-70">
        <div className="w-[1.5px] h-12 bg-black"></div>
        <span className="text-[9px] uppercase tracking-[0.4em] text-black mt-3 font-semibold">Scroll</span>
      </div>
    </section>
  );
}
