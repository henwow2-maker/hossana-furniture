import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CATEGORIES } from '../data/mockData';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, ChevronDown, X, Filter, Mic, Sofa, Armchair, Table, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { motion, AnimatePresence } from 'motion/react';
import SkeletonGallery from '../components/SkeletonGallery';
import ScrollReveal from '../components/ScrollReveal';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';

export default function Shop() {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search') || searchParams.get('q') || '';
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Keep selectedCategory and searchQuery in sync with URL parameter changes
  useEffect(() => {
    const cat = searchParams.get('category');
    setSelectedCategory(cat);
    
    const search = searchParams.get('search') || searchParams.get('q') || '';
    setSearchQuery(search);
  }, [searchParams]);

  // Synchronize state back to URL parameters on changes
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (searchQuery) params.set('search', searchQuery);
    
    setSearchParams(params, { replace: true });
  }, [selectedCategory, searchQuery, setSearchParams]);

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser or environment.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      try {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-US';

        rec.onstart = () => {
          setIsListening(true);
          toast.info("Listening... Speak clearly into your device.");
        };

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setSearchQuery(transcript);
          setIsListening(false);
          toast.success(`Search set to: "${transcript}"`);
        };

        rec.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            toast.error("Microphone access denied. Please allow microphone permissions in the frame/browser.");
          } else if (event.error === 'no-speech') {
            toast.error("No speech detected. Try speaking again.");
          } else {
            toast.error(`Speech recognition error: ${event.error}`);
          }
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
        rec.start();
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
        setIsListening(false);
      }
    }
  };

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Derived filters
  const materials = useMemo(() => Array.from(new Set(products.map(p => p.material).filter(Boolean) as string[])), [products]);
  const allColors = useMemo(() => Array.from(new Set(products.flatMap(p => p.colors || []))), [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesMaterial = selectedMaterials.length === 0 || (product.material && selectedMaterials.includes(product.material));
      const matchesColor = selectedColors.length === 0 || (product.colors && product.colors.some(c => selectedColors.includes(c)));
      const matchesStock = onlyInStock ? product.inStock : true;

      return matchesCategory && matchesSearch && matchesPrice && matchesMaterial && matchesColor && matchesStock;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [products, selectedCategory, searchQuery, sortBy, priceRange, selectedMaterials, selectedColors, onlyInStock]);

  const toggleMaterial = (m: string) => {
    setSelectedMaterials(prev => prev.includes(m) ? prev.filter(item => item !== m) : [...prev, m]);
  };

  const toggleColor = (c: string) => {
    setSelectedColors(prev => prev.includes(c) ? prev.filter(item => item !== c) : [...prev, c]);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setPriceRange([0, 5000]);
    setSelectedMaterials([]);
    setSelectedColors([]);
    setOnlyInStock(false);
  };

  const FilterContent = () => {
    const getCategoryIcon = (id: string) => {
      switch (id.toLowerCase()) {
        case 'sofa':
          return <Sofa className="w-3.5 h-3.5" />;
        case 'chair':
          return <Armchair className="w-3.5 h-3.5" />;
        case 'table':
          return <Table className="w-3.5 h-3.5" />;
        case 'lighting':
          return <Lightbulb className="w-3.5 h-3.5" />;
        default:
          return null;
      }
    };

    return (
      <div className="space-y-10">
        {/* Categories Group with Live Counts */}
        <div className="space-y-6">
          <Label className="text-xs uppercase tracking-[0.2em] font-black text-white/50 block mb-4">Masterpiece Types</Label>
          <div className="space-y-2">
            <div 
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-300",
                selectedCategory === null 
                  ? "border-gold bg-gold/10 text-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]" 
                  : "border-white/5 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white"
              )}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] uppercase tracking-widest font-black">All Collections</span>
              </div>
              <span className="text-[10px] font-mono opacity-80 bg-white/5 px-2 py-0.5 rounded-full">({products.length})</span>
            </div>
            {CATEGORIES.map(category => {
              const count = products.filter(p => p.category === category.id).length;
              return (
                <div 
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-300",
                    selectedCategory === category.id 
                      ? "border-gold bg-gold/10 text-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]" 
                      : "border-white/5 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="opacity-80">{getCategoryIcon(category.id)}</span>
                    <span className="text-[11px] uppercase tracking-widest font-bold">{category.name}</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-80 bg-white/5 px-2 py-0.5 rounded-full">({count})</span>
                </div>
              );
            })}
          </div>
        </div>

        <Separator className="bg-white/5" />

        {/* Price Range */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Label className="text-xs uppercase tracking-[0.2em] font-bold text-white">Price Range</Label>
            <span className="text-[10px] text-gold font-mono">${priceRange[0]} - ${priceRange[1]}</span>
          </div>
          <Slider 
            value={priceRange} 
            min={0} 
            max={5000} 
            step={100} 
            onValueChange={setPriceRange}
            className="py-4"
          />
        </div>

        <Separator className="bg-white/5" />

        {/* Materials */}
        <div className="space-y-6">
          <Label className="text-xs uppercase tracking-[0.2em] font-bold text-white block mb-4">Materials</Label>
          <div className="space-y-3">
            {materials.map(material => (
              <div key={material} className="flex items-center space-x-3 group cursor-pointer" onClick={() => toggleMaterial(material!)}>
                <Checkbox 
                  checked={selectedMaterials.includes(material!)} 
                  className="border-white/20 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                />
                <span className={`text-[11px] uppercase tracking-widest transition-colors ${selectedMaterials.includes(material!) ? 'text-gold' : 'text-gray-400 group-hover:text-white'}`}>
                  {material}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-white/5" />

        {/* Colors */}
        <div className="space-y-6">
          <Label className="text-xs uppercase tracking-[0.2em] font-bold text-white block mb-4">Colors</Label>
          <div className="flex flex-wrap gap-2">
            {allColors.map(color => (
              <button
                key={color}
                onClick={() => toggleColor(color)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-bold border transition-all",
                  selectedColors.includes(color) 
                    ? "bg-gold border-gold text-black" 
                    : "bg-transparent border-white/10 text-gray-400 hover:border-white/40"
                )}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        <Separator className="bg-white/5" />

        {/* Availability */}
        <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => setOnlyInStock(!onlyInStock)}>
          <Checkbox 
            checked={onlyInStock} 
            className="border-white/20 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
          />
          <Label className="text-xs uppercase tracking-[0.2em] font-bold text-white cursor-pointer group-hover:text-gold transition-colors">
            In Stock Only
          </Label>
        </div>

        {(selectedCategory || selectedMaterials.length > 0 || selectedColors.length > 0 || onlyInStock || priceRange[0] > 0 || priceRange[1] < 5000) && (
          <Button 
            variant="ghost" 
            onClick={clearFilters}
            className="w-full text-gold hover:text-white hover:bg-white/5 text-[10px] uppercase tracking-[0.2em] pt-8"
          >
            Reset All Filters
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="pt-32 min-h-screen bg-background">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <ScrollReveal direction="up" delay={0.05} duration={0.7} threshold={0.05}>
          <div className="mb-12 border-b border-white/5 pb-12">
            <span className="text-gold uppercase tracking-[0.3em] text-xs font-bold mb-4 block">Hossana Store</span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">Our Collection</h1>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
               <p className="text-gray-400 max-w-2xl font-light leading-relaxed">
                 From hand-tufted sofas to artisanal lighting, explore our meticulously curated collection of luxury furniture pieces designed to elevate your living experience.
               </p>
               <div className="flex gap-2">
                  <Sheet>
                     <SheetTrigger
                        render={
                          <Button variant="outline" className="border-white/10 text-white lg:hidden h-12 rounded-xl">
                             <Filter className="w-4 h-4 mr-2" /> Filters
                          </Button>
                        }
                     />
                     <SheetContent side="left" className="bg-luxury-black border-white/10 w-80 text-white">
                        <SheetHeader className="mb-8">
                           <SheetTitle className="text-white font-serif text-2xl">Advanced Filters</SheetTitle>
                        </SheetHeader>
                        <FilterContent />
                     </SheetContent>
                  </Sheet>
                  <div className="relative group">
                     <select 
                        className="bg-black/50 border border-white/10 text-white rounded-xl h-12 px-6 focus:outline-none focus:border-gold/50 text-xs uppercase tracking-widest font-bold appearance-none min-w-[200px]"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                     >
                        <option value="featured">Sort: Featured</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Rating: High to Low</option>
                     </select>
                     <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
               </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="flex gap-12">
           {/* Sidebar Filter - Desktop */}
           <ScrollReveal 
              direction="right" 
              delay={0.1} 
              threshold={0.01}
              className="hidden lg:block w-72 flex-shrink-0 sticky top-32 h-[calc(100vh-200px)] overflow-y-auto pr-4 custom-scrollbar"
           >
              <aside>
                 <h3 className="text-xl font-serif font-bold text-white mb-8 border-b border-white/5 pb-4">Filters</h3>
                 <FilterContent />
              </aside>
           </ScrollReveal>

           {/* Main Content */}
           <ScrollReveal 
              direction="up" 
              delay={0.15} 
              threshold={0.01}
              className="flex-grow"
           >
              {/* Category & Search Area */}
              <div className="mb-12 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                 <div className="flex flex-wrap gap-2">
                    <button 
                       onClick={() => setSelectedCategory(null)}
                       className={`px-6 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${selectedCategory === null ? 'bg-gold text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                    >
                       All
                    </button>
                    {CATEGORIES.map(cat => (
                       <button 
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`px-6 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${selectedCategory === cat.id ? 'bg-gold text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                       >
                          {cat.name}
                       </button>
                    ))}
                 </div>
                 <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input 
                       placeholder={isListening ? "Listening... Speak now..." : "Search collections..."}
                       className={cn(
                          "pl-12 pr-14 bg-white/5 border-white/10 rounded-xl h-12 text-xs text-white transition-all w-full",
                          isListening && "border-gold/50 ring-2 ring-gold/15 bg-gold/5"
                       )}
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 z-20">
                       {searchQuery && (
                          <button
                             type="button"
                             onClick={() => setSearchQuery('')}
                             className="p-1.5 hover:text-white text-gray-400 transition-colors"
                             title="Clear Search"
                          >
                             <X className="w-3.5 h-3.5" />
                          </button>
                       )}
                       <button
                          type="button"
                          onClick={toggleListening}
                          className={cn(
                            "p-1.5 rounded-full transition-all duration-300 relative overflow-hidden flex items-center justify-center",
                            isListening ? "bg-red-500 text-white animate-pulse" : "text-gray-400 hover:text-gold hover:bg-white/5"
                          )}
                          title="Search with Voice"
                       >
                          {isListening ? (
                             <>
                               <span className="absolute inset-0 bg-red-400 opacity-20 rounded-full animate-ping" />
                               <Mic className="w-3.5 h-3.5 relative z-10" />
                             </>
                          ) : (
                             <Mic className="w-3.5 h-3.5" />
                          )}
                       </button>
                    </div>
                 </div>
              </div>

              {/* Active Filter Badges */}
              <div className="flex flex-wrap gap-2 mb-8">
                {selectedCategory && (
                  <Badge variant="secondary" className="bg-gold/10 text-gold border-gold/20 flex items-center gap-1 py-1 px-3">
                    {CATEGORIES.find(c => c.id === selectedCategory)?.name}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory(null)} />
                  </Badge>
                )}
                {selectedMaterials.map(m => (
                  <Badge key={m} variant="secondary" className="bg-white/10 text-white border-white/20 flex items-center gap-1 py-1 px-3">
                    {m}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => toggleMaterial(m)} />
                  </Badge>
                ))}
                {selectedColors.map(c => (
                  <Badge key={c} variant="secondary" className="bg-white/10 text-white border-white/20 flex items-center gap-1 py-1 px-3">
                    {c}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => toggleColor(c)} />
                  </Badge>
                ))}
              </div>

              {/* Product Grid */}
              <div className="mb-24 min-h-[600px]">
                {isLoading ? (
                  <SkeletonGallery />
                ) : (
                  <AnimatePresence mode="popLayout">
                     {filteredProducts.length > 0 ? (
                        <motion.div 
                           layout
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                        >
                           {filteredProducts.map((product) => (
                              <ProductCard key={product.id} product={product} />
                           ))}
                        </motion.div>
                     ) : (
                        <motion.div 
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           className="py-32 text-center"
                        >
                           <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                              <Search className="w-8 h-8 text-gold/20" />
                           </div>
                           <h3 className="text-3xl font-serif text-white mb-2 uppercase tracking-tighter">No masterpieces found</h3>
                           <p className="text-gray-500 font-light text-sm max-w-xs mx-auto">
                              Try adjusting your filters or search keywords to find the perfect piece for your space.
                           </p>
                           <Button variant="link" className="text-gold mt-6 uppercase tracking-widest text-[10px]" onClick={clearFilters}>
                              Clear all filters
                           </Button>
                        </motion.div>
                     )}
                  </AnimatePresence>
                )}
              </div>
           </ScrollReveal>
        </div>
      </div>
      <style>{`
         .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
         }
         .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
         }
         .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #C9A227;
            border-radius: 10px;
         }
      `}</style>
    </div>
  );
}
