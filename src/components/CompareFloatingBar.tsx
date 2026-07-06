import React from 'react';
import { useCompare } from '../context/CompareContext';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeftRight, X, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

export default function CompareFloatingBar() {
  const { 
    compareList, 
    removeFromCompare, 
    clearCompareList, 
    setCompareModalOpen 
  } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 100, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] w-[calc(100%-2rem)] max-w-2xl bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] p-4 md:py-3 md:px-5 flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center bg-[#c71f2c] rounded-xl w-9 h-9 border border-red-500 shadow-md">
              <ArrowLeftRight className="w-4 h-4 text-white" />
              <div className="absolute -top-1.5 -right-1.5 bg-white text-black text-[9px] font-black rounded-full w-5 h-5 flex items-center justify-center border border-slate-900">
                {compareList.length}
              </div>
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-black uppercase tracking-wider text-white">Compare Items</p>
              <p className="text-[10px] text-slate-400 font-bold">Max 4 items grouped</p>
            </div>
          </div>

          {/* Item Thumbnails */}
          <div className="flex items-center gap-2.5">
            {compareList.map((item) => (
              <div key={item.id} className="relative group/thumb">
                <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                  {/* Hover dark layer */}
                  <div className="opacity-0 group-hover/thumb:opacity-100 absolute inset-0 bg-black/60 transition-opacity duration-200" />
                </div>
                
                {/* Remove item button from float tracker */}
                <button
                  onClick={() => removeFromCompare(item.id)}
                  type="button"
                  className="absolute -top-1 -right-1 z-10 bg-black/80 hover:bg-red-600 rounded-full p-0.5 text-slate-300 hover:text-white border border-slate-700 hover:border-red-500 transition-all shadow"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
            
            {/* Empty slots placeholders */}
            {Array.from({ length: Math.max(0, 3 - compareList.length) }).map((_, i) => (
              <div key={i} className="hidden sm:block w-11 h-11 border border-dashed border-slate-755/50 rounded-lg flex items-center justify-center text-slate-600">
                <span className="text-[14px] font-bold">+</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
          <Button
            variant="ghost"
            onClick={clearCompareList}
            className="text-[10px] text-slate-400 hover:text-red-400 uppercase tracking-widest font-extrabold h-9 px-3 rounded-lg hover:bg-slate-800 border-none w-1/3 md:w-auto"
          >
            Clear
          </Button>
          <Button
            onClick={() => setCompareModalOpen(true)}
            className="flex-1 md:flex-initial bg-amber-400 hover:bg-[#c71f2c] text-black hover:text-white hover:scale-[1.02] h-10 px-5 rounded-lg text-[10px] uppercase font-serif font-black tracking-widest transition-all shadow-md flex items-center justify-center gap-1.5 border-none"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current animate-pulse text-slate-950 hover:text-white" /> Compare Now
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
