import { useParams, Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { motion } from "motion/react";
import {
  Star,
  ShoppingCart,
  Heart,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Plus,
  Minus,
  Ruler,
  Share2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";import { formatCurrency } from '../lib/utils';import ProductCard from "../components/ProductCard";
import ProductReviews from "../components/ProductReviews";
import SizeGuideModal from "../components/SizeGuideModal";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { products } = useProducts();
  const product = products.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Dynamic Sizing parsing for the details panel
  const getProductSizing = () => {
    if (!product) return { width: 0, height: 0, depth: 0, seatHeight: 0 };
    if (product.dimensions) {
      const dims = product.dimensions.toLowerCase();
      const getDim = (key: string, def: number) => {
        const match = dims.match(new RegExp(`(\\d+)\\s*(?:cm|in)?\\s*${key}`));
        return match ? parseInt(match[1]) : def;
      };
      return {
        width: getDim('w', 180),
        height: getDim('h', 85),
        depth: getDim('d', 90),
        seatHeight: getDim('seat', 45)
      };
    }

    switch (product.category.toLowerCase()) {
      case 'sofa':
        return { width: 220, height: 85, depth: 100, seatHeight: 45 };
      case 'chair':
        return { width: 75, height: 80, depth: 82, seatHeight: 44 };
      case 'table':
      default:
        return { width: 180, height: 76, depth: 90, seatHeight: 0 };
    }
  };

  const sizing = getProductSizing();

  if (!product) {
    return (
      <div className="pt-32 container mx-auto px-6 text-center h-screen">
        <h1 className="text-4xl font-serif mb-4 text-black">Piece Not Found</h1>
        <Link to="/shop">
          <Button variant="outline" className="border-[#c71f2c] text-[#c71f2c]">
            Back to Shop
          </Button>
        </Link>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="pt-32 min-h-screen bg-white text-black">
      <div className="container mx-auto px-6">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-[#c71f2c] font-bold uppercase tracking-widest text-[10px] mb-8 hover:gap-4 transition-all"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Collection
        </Link>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-square rounded-[40px] overflow-hidden border border-slate-200 shadow-2xl bg-slate-50">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            {product.isBestSeller && (
              <Badge className="absolute top-8 left-8 bg-[#c71f2c] text-white border-none px-4 py-2 font-bold uppercase tracking-widest text-[10px]">
                Best Seller
              </Badge>
            )}
          </motion.div>

          {/* Info Side */}
          <div className="flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Badge
                  variant="outline"
                  className="border-slate-200 text-[#c71f2c] uppercase tracking-[0.2em] text-[10px]"
                >
                  {product.category}
                </Badge>
                <a href="#reviews-section" className="flex items-center gap-1 ml-4 hover:opacity-80 transition-opacity cursor-pointer">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < Math.round(product.rating) ? "text-[#c71f2c] fill-[#c71f2c]" : "text-slate-300"}`}
                    />
                  ))}
                  <span className="text-[10px] text-[#c71f2c] underline ml-2 font-mono font-bold">
                    ({product.rating.toFixed(1)} / 5.0)
                  </span>
                </a>
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-black text-black mb-4 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-8">
                <span className="text-3xl font-serif font-black text-black">
                  {formatCurrency(product.discount
                    ? product.price * (1 - product.discount / 100)
                    : product.price
                  )}
                </span>
                {product.discount && (
                  <span className="text-xl text-slate-400 line-through">
                    {formatCurrency(product.price)}
                  </span>
                )}
              </div>
              <p className="text-black/80 text-base leading-relaxed font-semibold mb-8 max-w-xl">
                {product.description} Elegant, sophisticated, and built to last.
                Our {product.name} is a testament to timeless luxury design.
              </p>
            </motion.div>

            {/* Interaction */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-10">
                <div className="flex items-center gap-4 bg-slate-100 p-2 rounded-2xl border border-slate-200">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-black hover:text-[#c71f2c]"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-xl font-bold w-8 text-center text-black">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-black hover:text-[#c71f2c]"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-14 h-14 rounded-full border border-slate-200 hover:border-[#c71f2c] hover:text-[#c71f2c]"
                >
                  <Heart className="w-6 h-6 text-slate-600" />
                </Button>
              </div>

              <Button
                onClick={handleAddToCart}
                className="bg-[#c71f2c] hover:bg-slate-800 text-white h-16 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-md transition-all hover:scale-[1.02] border-none"
              >
                Add to Cart <ShoppingCart className="ml-2 w-4 h-4" />
              </Button>
            </div>

            <button
              onClick={() => setIsSizeGuideOpen(true)}
              className="inline-flex items-center gap-2 text-slate-500 hover:text-[#c71f2c] text-xs font-black uppercase tracking-wider self-start mt-2 transition-colors focus:outline-none cursor-pointer animate-fade-in"
            >
              <Ruler className="w-3.5 h-3.5" /> View Sizing & Interactive Guide
            </button>

            {/* Premium Social Sharing Tray */}
            <div className="mt-4 pt-6 border-t border-slate-150">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 block mb-3">
                Share this Masterpiece
              </span>
              <div className="flex items-center gap-2.5">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl border border-slate-200 hover:border-[#c71f2c] text-slate-600 hover:text-[#c71f2c] flex items-center justify-center transition-all hover:bg-slate-50 shadow-sm"
                  title="Share on Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                  </svg>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Masterpiece link copied!", {
                      description: "Share this look elegantly on your Instagram stories.",
                    });
                  }}
                  className="w-10 h-10 rounded-xl border border-slate-200 hover:border-[#c71f2c] text-slate-600 hover:text-[#c71f2c] flex items-center justify-center transition-all hover:bg-slate-50 shadow-sm cursor-pointer"
                  title="Copy Link for Instagram"
                >
                  <svg className="w-4 h-4 text-slate-600 stroke-current hover:text-[#c71f2c]" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </button>
                <a
                  href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(product.image)}&description=${encodeURIComponent(product.name + ' — A bespoke luxury statement design by Hossana Furniture.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl border border-slate-200 hover:border-[#c71f2c] text-slate-600 hover:text-[#c71f2c] flex items-center justify-center transition-all hover:bg-slate-50 shadow-sm"
                  title="Pin on Pinterest"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.63 11.16-.1-.95-.2-2.4.04-3.43.22-.93 1.4-5.93 1.4-5.93s-.36-.71-.36-1.77c0-1.66.96-2.9 2.16-2.9 1.02 0 1.51.77 1.51 1.69 0 1.03-.65 2.56-.99 3.99-.28 1.19.6 2.16 1.77 2.16 2.12 0 3.76-2.24 3.76-5.47 0-2.86-2.06-4.86-5-4.86-3.4 0-5.4 2.55-5.4 5.19 0 1.03.4 2.13.89 2.73.1.12.11.23.08.35-.09.37-.29 1.17-.33 1.33-.05.21-.18.26-.41.15-1.52-.7-2.48-2.92-2.48-4.7 0-3.83 2.78-7.35 8.03-7.35 4.22 0 7.5 3.01 7.5 7.03 0 4.19-2.64 7.56-6.3 7.56-1.23 0-2.39-.64-2.79-1.4l-.76 2.9c-.27 1.05-1.02 2.37-1.52 3.19C10.09 23.83 11.02 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z"/>
                  </svg>
                </a>
                <button
                  type="button"
                  onClick={async () => {
                    if (navigator.share) {
                      try {
                        await navigator.share({
                          title: `${product.name} | Hossana Furniture`,
                          text: `Explore the beautiful ${product.name} at Hossana Furniture Atelier.`,
                          url: window.location.href,
                        });
                        toast.success("Design piece shared successfully!");
                      } catch (err) {
                        console.log("Error sharing via Web Share API", err);
                      }
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Masterpiece link copied to clipboard!");
                    }
                  }}
                  className="ml-auto text-xs text-[#c71f2c] flex items-center gap-1.5 cursor-pointer bg-transparent border-none outline-none font-bold uppercase tracking-widest text-[10px] hover:opacity-85 transition-opacity"
                  title="Share options"
                >
                  <Share2 className="w-3.5 h-3.5" /> Direct Share
                </button>
              </div>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-200">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#c71f2c]" />
                <span className="text-xs uppercase tracking-widest font-black text-black">
                  10 Year Warranty
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-[#c71f2c]" />
                <span className="text-xs uppercase tracking-widest font-black text-black">
                  Free White Glove Delivery
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Extra Info Tabs/Sections */}
        <div className="mb-24 grid grid-cols-1 md:grid-cols-3 gap-12 border-y border-slate-200 py-16">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-serif font-black text-black mb-4 uppercase tracking-wider">
                Dimensions
              </h4>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-xs text-[#c71f2c] hover:underline font-bold flex items-center gap-1 focus:outline-none cursor-pointer"
              >
                <Ruler className="w-3 h-3" /> Size Guide
              </button>
            </div>
            <ul className="text-sm text-black/80 flex flex-col gap-2 font-semibold font-mono text-xs">
              <li className="flex justify-between border-b border-dashed border-slate-100 pb-1.5">
                <span className="font-sans font-bold text-slate-400 uppercase tracking-widest text-[9px]">Width:</span> <span className="text-black font-extrabold">{sizing.width} cm</span>
              </li>
              <li className="flex justify-between border-b border-dashed border-slate-100 pb-1.5">
                <span className="font-sans font-bold text-slate-400 uppercase tracking-widest text-[9px]">Height:</span> <span className="text-black font-extrabold">{sizing.height} cm</span>
              </li>
              <li className="flex justify-between border-b border-dashed border-slate-100 pb-1.5">
                <span className="font-sans font-bold text-slate-400 uppercase tracking-widest text-[9px]">Depth:</span> <span className="text-black font-extrabold">{sizing.depth} cm</span>
              </li>
              {sizing.seatHeight > 0 && (
                <li className="flex justify-between">
                  <span className="font-sans font-bold text-slate-400 uppercase tracking-widest text-[9px]">Seat Height:</span> <span className="text-black font-extrabold">{sizing.seatHeight} cm</span>
                </li>
              )}
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="text-lg font-serif font-black text-black mb-4 uppercase tracking-wider">
              Composition & Care
            </h4>
            <p className="text-sm text-black/80 leading-relaxed font-semibold">
              Crafted from hand-selected premium materials. For daily care, use
              a soft, dry cloth. Professional cleaning is recommended for deep
              stains. Avoid direct sunlight to maintain the integrity of the
              finish.
            </p>
          </div>
        </div>

        {/* Product Reviews Section */}
        <ProductReviews productId={product.id} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-24">
            <h2 className="text-3xl font-serif font-black text-black mb-10">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sizing & Dimensions Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        product={product}
      />
    </div>
  );
}
