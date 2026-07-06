import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Ruler, Maximize2, Sliders, Home, ArrowRight, CornerDownRight, Sparkles, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Product } from '../types';
import { cn } from '../lib/utils';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export default function SizeGuideModal({ isOpen, onClose, product }: SizeGuideModalProps) {
  const [activeTab, setActiveTab] = useState<'scaling' | 'clearance' | 'checklist'>('scaling');
  const [humanHeight, setHumanHeight] = useState<number>(175); // in cm

  if (!isOpen) return null;

  // Sizing parsing/defaults based on category
  const getProductSizing = () => {
    if (product.dimensions) {
      // If product has a dimensions string like "75cm H x 120cm W x 80cm D"
      const dims = product.dimensions.toLowerCase();
      const getDim = (key: string, def: number) => {
        const match = dims.match(new RegExp(`(\\d+)\\s*(?:cm|in)?\\s*${key}`));
        return match ? parseInt(match[1]) : def;
      };
      return {
        width: getDim('w', 180),
        height: getDim('h', 85),
        depth: getDim('d', 90),
        seatHeight: getDim('seat', 45),
        isCustom: true
      };
    }

    // Category defaults in cm
    switch (product.category.toLowerCase()) {
      case 'sofa':
        return { width: 220, height: 85, depth: 100, seatHeight: 45, isCustom: false };
      case 'chair':
        return { width: 75, height: 80, depth: 82, seatHeight: 44, isCustom: false };
      case 'table':
      default:
        return { width: 180, height: 76, depth: 90, seatHeight: 0, isCustom: false };
    }
  };

  const sizing = getProductSizing();

  // Scale calculations for the silhouette visualizer (max visual height represents 220cm)
  const maxVisualHeight = 220;
  const humanVisualHeight = (humanHeight / maxVisualHeight) * 100;
  const productVisualHeight = (sizing.height / maxVisualHeight) * 100;
  const productVisualWidth = (sizing.width / 300) * 100; // max width 300cm

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-6 overflow-y-auto">
        {/* Backdrop Closer */}
        <div className="absolute inset-0 cursor-default" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-4xl bg-white text-black rounded-3xl shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 md:px-8 md:py-6 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#c71f2c]/5 rounded-xl border border-[#c71f2c]/10 text-[#c71f2c]">
                <Ruler className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-black uppercase tracking-tight text-slate-900">
                  Luxury Sizing & Placement Guide
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Analyze spatial fits, human scale ratios, and layout tolerances for <span className="text-[#c71f2c]">{product.name}</span>
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-400 hover:text-black hover:bg-slate-100 transition-colors rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-100 px-6 bg-slate-50/50">
            {[
              { id: 'scaling', label: 'Interactive Scale Comparison', icon: Sliders },
              { id: 'clearance', label: 'Room Placement & Clearances', icon: Home },
              { id: 'checklist', label: 'Fits-Through-Doorways Checklist', icon: Check },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'flex items-center gap-2 py-4 px-3 border-b-2 text-xs font-black uppercase tracking-widest transition-all focus:outline-none shrink-0',
                    isActive
                      ? 'border-[#c71f2c] text-[#c71f2c] opacity-100'
                      : 'border-transparent text-slate-400 hover:text-slate-700 opacity-80'
                  )}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="inline sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Content Body */}
          <div className="flex-grow overflow-y-auto p-6 md:p-8 custom-scrollbar">
            
            {/* Dynamic Sizing Stats Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 border border-slate-200/60 p-5 rounded-2xl mb-8">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Product Width</span>
                <span className="text-xl font-black font-sans text-slate-900 mt-1">{sizing.width} cm <span className="text-[10px] text-slate-400 font-bold">({(sizing.width / 2.54).toFixed(0)}″)</span></span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Product Height</span>
                <span className="text-xl font-black font-sans text-slate-900 mt-1">{sizing.height} cm <span className="text-[10px] text-slate-400 font-bold">({(sizing.height / 2.54).toFixed(0)}″)</span></span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Product Depth</span>
                <span className="text-xl font-black font-sans text-slate-900 mt-1">{sizing.depth} cm <span className="text-[10px] text-slate-400 font-bold">({(sizing.depth / 2.54).toFixed(0)}″)</span></span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Seat Height Estimate</span>
                <span className="text-xl font-black font-sans text-slate-900 mt-1">{sizing.seatHeight ? `${sizing.seatHeight} cm` : 'N/A'} <span className="text-[10px] text-slate-400 font-bold">{sizing.seatHeight ? `(${(sizing.seatHeight / 2.54).toFixed(0)}″)` : ''}</span></span>
              </div>
            </div>

            {/* TAB CONTENT: 1. SCALING */}
            {activeTab === 'scaling' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                  {/* Human Height Control Slider */}
                  <div className="space-y-4">
                    <h4 className="text-base font-serif font-black uppercase text-slate-900 tracking-tight">
                      Calibrate Scale Reference
                    </h4>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Caliberate your custom height silhouette below to witness real-life relative scaling. This allows you to visually project standard height-clearances of this beautiful handcrafted piece against yourself or a dynamic reference object.
                    </p>
                    <div className="pt-2">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
                        <span>Your / Reference Height:</span>
                        <span className="text-[#c71f2c] font-black">{humanHeight} cm ({(humanHeight / 30.48).toFixed(1)} ft)</span>
                      </div>
                      <input
                        type="range"
                        min="140"
                        max="210"
                        value={humanHeight}
                        onChange={(e) => setHumanHeight(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#c71f2c] focus:outline-none"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                        <span>140 cm (4.6 ft)</span>
                        <span>175 cm (Avg Human)</span>
                        <span>210 cm (6.9 ft)</span>
                      </div>
                    </div>
                  </div>

                  {/* Visual Silhouette Box */}
                  <div className="relative aspect-[4/3] w-full rounded-2xl bg-[#0b0f19] border border-slate-950/20 overflow-hidden flex items-end justify-center gap-12 p-6 shadow-sm">
                    {/* Measurement markings */}
                    <div className="absolute left-4 inset-y-6 flex flex-col justify-between text-[9px] font-mono text-slate-500 border-r border-slate-800 pr-2">
                      <span>200 cm</span>
                      <span>150 cm</span>
                      <span>100 cm</span>
                      <span>50 cm</span>
                      <span>0 cm</span>
                    </div>

                    {/* Human silhouette */}
                    <div className="flex flex-col items-center shrink-0" style={{ height: `${humanVisualHeight}%` }}>
                      <div className="text-[9px] font-mono text-slate-400 mb-1">Human ({humanHeight}cm)</div>
                      <div className="w-16 flex-grow relative bg-slate-800/80 rounded-t-full flex justify-center border-l border-t border-slate-700">
                        {/* Human head outline */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-800 border-t border-slate-700" />
                        {/* Custom visual lines */}
                        <div className="self-center w-0.5 h-1/2 bg-slate-700/50" />
                      </div>
                    </div>

                    {/* Product visual block */}
                    <div className="flex flex-col items-center shrink-0" style={{ height: `${productVisualHeight}%` }}>
                      <span className="text-[9px] font-mono text-amber-400 mb-1 font-bold">{product.name.split(' ')[0]} ({sizing.height}cm)</span>
                      <div 
                        className="bg-amber-500/80 border-t border-x border-amber-400/50 rounded-lg flex items-center justify-center text-center p-2 text-white font-serif font-black text-xs uppercase shadow-lg shadow-amber-500/10 min-w-[100px]"
                        style={{ width: `${Math.max(100, productVisualWidth)}px` }}
                      >
                        <div className="text-[8px] sm:text-[9px] font-sans lowercase font-bold tracking-tight">
                          w: {sizing.width}cm<br/>
                          h: {sizing.height}cm
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sizing insights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border border-slate-100 p-5 rounded-2xl bg-white">
                    <h5 className="text-xs font-black uppercase text-slate-900 tracking-wider mb-2">Ergonomics</h5>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      With a height of {sizing.height}cm, this piece sits beautifully in a standard line-of-sight plane, creating visual stability without obstructing panoramic windows.
                    </p>
                  </div>
                  <div className="border border-slate-100 p-5 rounded-2xl bg-white">
                    <h5 className="text-xs font-black uppercase text-slate-900 tracking-wider mb-2">Footprint Scale</h5>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Occupies Approx. {( (sizing.width * sizing.depth) / 10000 ).toFixed(2)} square meters of surface area. Ensure your designed layout leaves ample spatial depth.
                    </p>
                  </div>
                  <div className="border border-slate-100 p-5 rounded-2xl bg-white">
                    <h5 className="text-xs font-black uppercase text-slate-900 tracking-wider mb-2">Ideal Pairing</h5>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      {sizing.seatHeight ? `Pairs ideally with low-slung credenzas and coffee tables of 40cm-48cm in height for optimized spatial flow.` : `Pairs perfectly with seating that has a standard seat-to-shelf clearance margin.`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 2. CLEARANCE */}
            {activeTab === 'clearance' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Standard Clearances Card */}
                  <div className="border border-slate-100 p-6 md:p-8 rounded-3xl bg-slate-50/50 space-y-6">
                    <h4 className="text-base font-serif font-black uppercase text-slate-900 tracking-tight flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500 fill-current" /> Recommended Space Clearance
                    </h4>
                    
                    <div className="space-y-5">
                      <div className="flex gap-4 items-start">
                        <div className="w-7 h-7 bg-[#c71f2c]/10 text-[#c71f2c] rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</div>
                        <div>
                          <h5 className="text-xs font-black uppercase text-slate-900 tracking-wider">Walking Path Clearances</h5>
                          <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-1">
                            Leave at least <strong>75cm to 90cm</strong> of open pathway clearance around the main perimeter of the item. This ensures comfortable movement without touching corners.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 items-start">
                        <div className="w-7 h-7 bg-[#c71f2c]/10 text-[#c71f2c] rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</div>
                        <div>
                          <h5 className="text-xs font-black uppercase text-slate-900 tracking-wider">Companion Tables Distance</h5>
                          <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-1">
                            When combining sofas or lounge chairs with central coffee tables, keep a gap of exactly <strong>40cm to 48cm</strong>. This allows comfortable access to objects while leaving clear legroom.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 items-start">
                        <div className="w-7 h-7 bg-[#c71f2c]/10 text-[#c71f2c] rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</div>
                        <div>
                          <h5 className="text-xs font-black uppercase text-slate-900 tracking-wider">Wall Buffer Spacing</h5>
                          <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-1">
                            We advocate placing this piece at least <strong>5cm to 10cm</strong> away from solid walls to let the wood grain silhouettes breathe and avoid heat traps.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Architectural Clearance blueprint layout graphic */}
                  <div className="border border-slate-200/60 p-6 rounded-3xl bg-stone-950 text-stone-200 font-mono text-center flex flex-col justify-between aspect-square md:aspect-auto">
                    <div>
                      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block mb-4">Space Planner Blueprint Sketch</span>
                      <p className="text-[11px] text-stone-400 leading-relaxed font-light mb-8 italic">
                        "Visualizing the spatial footprint of {product.name} in a high-end luxury setup."
                      </p>
                    </div>

                    {/* Room container simulation */}
                    <div className="border border-dashed border-stone-800 rounded-xl p-8 relative flex items-center justify-center bg-stone-900/30">
                      
                      {/* Walkway zones markings */}
                      <div className="absolute inset-x-2 top-2 text-[8px] text-stone-600 uppercase tracking-widest flex justify-between">
                        <span>← Clear Walkway (90cm) →</span>
                        <span>← Clear Walkway (90cm) →</span>
                      </div>

                      {/* Sofa center item representation */}
                      <div className="border-2 border-amber-500/30 bg-amber-500/10 rounded-lg py-6 px-10 text-center relative max-w-[80%]">
                        <span className="text-[10px] text-amber-400 font-bold max-w-full block truncate">{product.name}</span>
                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] text-stone-500">
                          {sizing.width}cm Width
                        </div>
                        <div className="absolute -right-12 top-1/2 -translate-y-1/2 text-[8px] text-stone-500 rotate-90 origin-center">
                          {sizing.depth}cm Depth
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-stone-900 text-[9px] text-stone-500">
                      Standard Scale Ratio: 1 : 25 | All numbers represent metric units in cm.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 3. CHECKLIST */}
            {activeTab === 'checklist' && (
              <div className="space-y-6">
                <div className="bg-[#c71f2c]/5 border border-[#c71f2c]/10 text-[#c71f2c] px-6 py-4 rounded-2xl flex items-start gap-3.5">
                  <Ruler className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-sm">Will it Fit? Let's Cross-Check Your Entryways</h5>
                    <p className="text-slate-600 text-xs font-semibold leading-relaxed mt-1">
                      Before completing your order, please take a quick tape measure and record clearances for your doors, stairs, and elevator pathways to avoid shipping setbacks.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  {[
                    {
                      step: '01',
                      title: 'Doorway Clearances',
                      desc: `Your main doorway height must be greater than ${sizing.height}cm (the product's height) or the width must be wider than ${Math.min(sizing.depth, sizing.width)}cm if carried in edge-wise.`
                    },
                    {
                      step: '02',
                      title: 'Hallway Passages',
                      desc: `Corner turns in corridors require at least ${Math.round(sizing.width * 0.75)}cm width clearances to swing or rotate pieces safely during transit.`
                    },
                    {
                      step: '03',
                      title: 'Elevator & Stairwell',
                      desc: `Compare the staircase ceiling clearances with the ${sizing.width}cm length. Elevator heights must accommodate diagonal fitting if length exceeds the entry doors.`
                    }
                  ].map((chk, idx) => (
                    <div key={idx} className="border border-slate-100 bg-white p-5 rounded-2xl relative">
                      <div className="absolute -top-3 left-4 bg-[#c71f2c] text-white text-[9px] font-black tracking-widest px-2 py-0.5 rounded-md">
                        STEP {chk.step}
                      </div>
                      <h5 className="text-xs font-black uppercase text-slate-900 tracking-wider mt-2.5 mb-2">{chk.title}</h5>
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                        {chk.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border border-slate-100 p-6 rounded-2xl bg-slate-50/50 mt-4 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Measuring Guide Quick Summary Table</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[11px] text-slate-600 font-medium">
                      <thead>
                        <tr className="border-b border-slate-200 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                          <th className="text-left pb-2">Measurement Step</th>
                          <th className="text-left pb-2">Our Item Dimension</th>
                          <th className="text-left pb-2">Min. Required Opening Clearance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="py-2.5 font-bold text-slate-900">1. Straight Entryway Passage</td>
                          <td className="py-2.5">{sizing.height} cm H x {sizing.depth} cm D</td>
                          <td className="py-2.5 text-[#c71f2c] font-black">Min. {Math.round(sizing.height + 5)} cm Height (or depth)</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-bold text-slate-900">2. Tight Corner Swivel Angle</td>
                          <td className="py-2.5">{sizing.width} cm Length</td>
                          <td className="py-2.5 text-[#c71f2c] font-black">Min. {Math.round(sizing.width * 0.75)} cm Turn Corner Diagonal</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-bold text-slate-900">3. Ceiling / Staircase Height</td>
                          <td className="py-2.5">{sizing.width} cm Length</td>
                          <td className="py-2.5 text-[#c71f2c] font-black">Min. {Math.round(sizing.width * 0.85)} cm Carriage Clearance</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <CornerDownRight className="w-3.5 h-3.5 text-[#c71f2c]" /> Needs special assistance? Contact design desk
            </div>
            <Button
              onClick={onClose}
              className="bg-slate-900 hover:bg-[#c71f2c] text-white font-bold px-6 py-2 rounded-xl text-xs uppercase tracking-widest transition-all shadow-md"
            >
              Alright, Got it
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
