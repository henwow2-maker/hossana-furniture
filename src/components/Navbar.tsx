import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, Landmark, LayoutDashboard, Heart, Sparkles, MapPin, ExternalLink, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatCurrency } from '../lib/utils';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { CATEGORIES } from '../data/mockData';
import HossanaLogo from './HossanaLogo';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Shop', path: '/shop' },
  { name: 'Manage Panel', path: '/admin' },
  { name: 'Track Order', path: '/order-tracking' },
  { name: 'About', path: '/about' },
  { name: 'Contact Us', path: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchCategory, setSelectedSearchCategory] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const { user } = useAuth();
  const { products } = useProducts();

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedSearchCategory ? p.category === selectedSearchCategory : true;
    const matchesSearch = searchQuery 
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  }).slice(0, 5);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearchOpen(false);
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedSearchCategory) params.set('category', selectedSearchCategory);
    navigate(`/shop?${params.toString()}`);
  };

  const startVoiceListening = () => {
    // If already listening, stop
    if (isListening && (window as any)._activeRecognition) {
      try {
        (window as any)._activeRecognition.stop();
      } catch (err) {
        console.error(err);
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError("Speech recognition is not supported in this browser. Please try Chrome, Safari, or Edge.");
      return;
    }

    setSpeechError(null);
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      (window as any)._activeRecognition = recognition;
    };

    recognition.onerror = (event: any) => {
      console.error(event);
      if (event.error !== 'aborted') {
        setSpeechError(`Voice input error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      (window as any)._activeRecognition = null;
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        const cleanedText = transcript.trim().replace(/\.$/, '');
        setSearchQuery(cleanedText);
      }
    };

    recognition.start();
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-900/70 bg-slate-950/85 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link to="/" className="flex items-center gap-3 transition-transform duration-300 hover:-translate-y-0.5">
          <HossanaLogo size={40} variant="brand" className="shrink-0" />
          <div className="hidden md:flex flex-col leading-tight">
            <span className="text-sm sm:text-base font-serif font-black uppercase tracking-[0.2em] text-white">HOSSANA</span>
            <span className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Luxury Furnishing Studio</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1 rounded-full bg-slate-900/80 p-1 shadow-inner">
          {NAV_LINKS.map((link) => {
            const isActive = link.path === '/'
              ? location.pathname === '/' && !location.hash
              : link.path.includes('#')
                ? location.pathname + location.hash === link.path
                : location.pathname === link.path;

            return (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  'relative rounded-full px-4 py-2 text-[12px] uppercase tracking-[0.25em] transition duration-300',
                  isActive
                    ? 'bg-[#c71f2c] text-slate-950 shadow-[0_8px_30px_rgba(199,31,44,0.18)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          <Button
            onClick={() => setIsSearchOpen(true)}
            variant="ghost"
            size="icon"
            className="rounded-full border border-slate-800/50 bg-slate-900/70 text-slate-100 hover:bg-slate-800 hover:text-white transition"
          >
            <Search className="w-[18px] h-[18px] stroke-[2.2]" />
          </Button>

          <Link to="/wishlist" className="hidden sm:inline-flex">
            <Button variant="ghost" size="icon" className="relative rounded-full bg-slate-900/70 text-slate-100 hover:text-white hover:bg-slate-800 transition">
              <Heart className="w-[18px] h-[18px] stroke-[2.2]" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#c71f2c] text-[8px] font-black text-white">
                  {wishlist.length}
                </span>
              )}
            </Button>
          </Link>

          {user?.role === 'admin' && (
            <Link to="/admin" className="hidden sm:inline-flex">
              <Button variant="ghost" size="icon" className="rounded-full bg-slate-900/70 text-slate-100 hover:bg-slate-800 hover:text-white transition">
                <LayoutDashboard className="w-[18px] h-[18px] stroke-[2.2]" />
              </Button>
            </Link>
          )}

          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative rounded-full bg-slate-900/75 text-slate-100 hover:bg-slate-800 hover:text-white transition">
              <ShoppingCart className="w-[18px] h-[18px] stroke-[2.2]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#c71f2c] text-[8px] font-black text-white">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          <Link to={user ? '/profile' : '/login'} className="hidden sm:inline-flex">
            <Button variant="ghost" size="icon" className="rounded-full bg-slate-900/70 text-slate-100 hover:bg-slate-800 hover:text-white transition">
              {user ? (
                <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full border border-gold object-cover" />
              ) : (
                <User className="w-[18px] h-[18px] stroke-[2.2]" />
              )}
            </Button>
          </Link>

          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <Button
                onClick={() => setIsMobileMenuOpen(true)}
                variant="ghost"
                size="icon"
                className="rounded-full bg-slate-900/75 text-slate-100 hover:bg-slate-800 hover:text-white transition"
              >
                <Menu className="w-5 h-5 stroke-[2.5]" />
              </Button>
              <SheetContent side="right" className="bg-white text-slate-900 border-slate-200 p-8 w-[320px]">
                <div className="flex items-center gap-3 border-b border-slate-200 pb-5 mb-6">
                  <HossanaLogo size={36} variant="brand" />
                  <div>
                    <h3 className="text-xs font-serif font-black uppercase tracking-wider text-slate-900">HOSSANA</h3>
                    <p className="text-[9px] uppercase tracking-[0.35em] text-[#c71f2c] font-bold">Modern Luxury</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {NAV_LINKS.map((link) => {
                    const isActive = link.path === '/'
                      ? location.pathname === '/' && !location.hash
                      : link.path.includes('#')
                        ? location.pathname + location.hash === link.path
                        : location.pathname === link.path;

                    return (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center justify-between rounded-2xl px-4 py-3 text-sm uppercase tracking-[0.3em] transition',
                          isActive
                            ? 'bg-[#c71f2c] text-white shadow-lg'
                            : 'text-slate-700 hover:bg-slate-100'
                        )}
                      >
                        <span>{link.name}</span>
                        {isActive && <Sparkles className="w-4 h-4 text-white" />}
                      </Link>
                    );
                  })}

                  <div className="mt-5 border-t border-slate-200 pt-5 flex flex-col gap-3">
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3 text-slate-800 font-bold hover:bg-slate-200 transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#c71f2c]" />
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      to="/wishlist"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3 text-slate-800 font-bold hover:bg-slate-200 transition"
                    >
                      <Heart className="w-4 h-4 text-[#c71f2c]" />
                      Wishlist ({wishlist.length})
                    </Link>
                    <Link
                      to="/cart"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3 text-slate-800 font-bold hover:bg-slate-200 transition"
                    >
                      <ShoppingCart className="w-4 h-4 text-[#c71f2c]" />
                      Cart ({cartCount})
                    </Link>
                    <Link
                      to={user ? '/profile' : '/login'}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3 text-slate-800 font-bold hover:bg-slate-200 transition"
                    >
                      {user ? (
                        <img src={user.avatar} alt={user.name} className="h-5 w-5 rounded-full object-cover border border-slate-300" />
                      ) : (
                        <User className="w-4 h-4 text-[#c71f2c]" />
                      )}
                      {user ? 'Profile' : 'Sign In'}
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-center gap-4 border-t border-slate-900/70 bg-slate-950/70 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-slate-400">
        <span className="text-white">Free delivery on orders over $150</span>
        <span className="hidden lg:inline">|</span>
        <span className="text-slate-400">Expert design guidance for every room</span>
      </div>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/98 backdrop-blur-3xl flex flex-col p-6 sm:p-20"
          >
            <div className="container mx-auto max-w-4xl">
              <div className="flex justify-between items-center mb-12">
                <span className="text-gold uppercase tracking-[0.4em] font-bold text-[10px] flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#c71f2c]" /> SEARCH HOSSANA FURNITURE
                </span>
                <Button
                  onClick={() => setIsSearchOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="text-slate-800 hover:text-[#c71f2c] rounded-full bg-slate-100 border border-slate-200 w-10 h-10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <form onSubmit={handleSearchSubmit} className="relative mb-8">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-[#c71f2c]" />
                <Input
                  autoFocus
                  placeholder={isListening ? "Listening ... say 'wooden table'" : "What are you looking for?"}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "bg-transparent border-0 border-b border-slate-200 rounded-none h-24 text-2.5xl sm:text-6xl font-serif text-slate-800 focus-visible:ring-0 focus-visible:border-gold transition-all pl-14 pr-24 placeholder:text-slate-300 w-full",
                    isListening && "border-[#c71f2c] text-[#c71f2c] placeholder:text-[#c71f2c]/30"
                  )}
                />

                <button
                  type="button"
                  onClick={startVoiceListening}
                  className={cn(
                    "absolute right-2 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center transition-all bg-slate-100 shadow-sm focus:outline-none",
                    isListening
                      ? "bg-[#c71f2c] text-white ring-4 ring-[#c71f2c]/20"
                      : "text-slate-500 hover:text-[#c71f2c] hover:bg-slate-200"
                  )}
                  title="Search with Voice Command"
                >
                  {isListening ? (
                    <MicOff className="w-6 h-6 animate-pulse" />
                  ) : (
                    <Mic className="w-6 h-6" />
                  )}
                </button>
              </form>

              {isListening && (
                <div className="flex items-center gap-2 text-[#c71f2c] text-xs font-mono font-bold uppercase tracking-wider mb-6 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-[#c71f2c] animate-ping" />
                  Listening... try saying "wooden chair" or "sofa"
                </div>
              )}
              {speechError && (
                <div className="text-amber-600 text-xs font-mono font-bold uppercase tracking-wider mb-6">
                  {speechError}
                </div>
              )}

              <div className="flex flex-wrap gap-2.5 items-center mb-12">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black font-mono mr-2">Filter By Category:</span>
                <button
                  type="button"
                  onClick={() => setSelectedSearchCategory(null)}
                  className={cn(
                    "px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-black transition-all duration-300",
                    selectedSearchCategory === null
                      ? "bg-[#c71f2c] text-white shadow-sm"
                      : "bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200"
                  )}
                >
                  All Shop
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedSearchCategory(cat.id)}
                    className={cn(
                      "px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-black transition-all duration-300",
                      selectedSearchCategory === cat.id
                        ? "bg-[#c71f2c] text-white shadow-sm"
                        : "bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200"
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                    {searchQuery ? `Search Results for "${searchQuery}"` : "Featured Masterpieces"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleSearchSubmit()}
                    className="text-[10px] uppercase tracking-widest text-[#c71f2c] hover:text-slate-900 font-mono font-bold transition-colors underline underline-offset-4"
                  >
                    View All Matching Items →
                  </button>
                </div>

                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredProducts.map((p) => (
                      <Link
                        key={p.id}
                        to={`/product/${p.id}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="group flex items-center gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#c71f2c]/30 transition-all"
                      >
                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-200">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div>
                          <h4 className="text-slate-800 font-serif text-lg leading-tight group-hover:text-[#c71f2c] transition-colors">{p.name}</h4>
                          <span className="text-[10px] uppercase tracking-widest text-[#c71f2c] font-mono inline-block mt-1 bg-[#c71f2c]/5 px-2 py-0.5 rounded border border-[#c71f2c]/10">
                            {CATEGORIES.find((c) => c.id === p.category)?.name || p.category}
                          </span>
                          <span className="text-[11px] font-bold text-slate-600 ml-3 font-serif">{formatCurrency(p.price)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic mt-10">No masterpieces found matching the current selections.</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
