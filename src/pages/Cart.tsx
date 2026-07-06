import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';

export default function Cart() {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useCart();
  const { addToWishlist } = useWishlist();
  const navigate = useNavigate();

  const handleMoveToWishlist = (item: any) => {
    const product = {
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      rating: item.rating,
      image: item.image,
      description: item.description,
      features: item.features,
      dimensions: item.dimensions,
      discount: item.discount,
      isBestSeller: item.isBestSeller,
      colors: item.colors,
      material: item.material,
      inStock: item.inStock,
    };
    addToWishlist(product);
    removeFromCart(item.id);
    toast.success(`Successfully moved "${item.name}" to Wishlist.`, {
      description: "You can find this masterpiece saved in your design wishlist.",
      action: {
        label: "View Wishlist",
        onClick: () => navigate('/wishlist'),
      },
    });
  };

  return (
    <div className="pt-32 min-h-screen bg-white pb-24 text-black">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-[#c71f2c] uppercase tracking-[0.3em] text-xs font-black mb-4 block">Review Order</span>
            <h1 className="text-4xl md:text-5xl font-serif font-black text-black">Shopping Cart</h1>
          </motion.div>
        </div>

        {cart.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-50 rounded-[40px] p-24 border border-slate-200 text-center"
          >
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-200">
              <ShoppingBag className="w-10 h-10 text-[#c71f2c] opacity-80" />
            </div>
            <h2 className="text-2xl font-serif text-black mb-4 font-black italic">Your collection is empty</h2>
            <p className="text-slate-600 mb-10 max-w-sm mx-auto font-medium">Explore our curated collection and add some luxury pieces to your living space.</p>
            <Link to="/shop">
               <Button className="bg-[#c71f2c] text-white hover:bg-slate-800 px-12 h-14 rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-md transition-all">
                  Browse Gallery
               </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Items List */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-[30px] p-6 border border-slate-200 flex gap-6 items-center flex-wrap sm:flex-nowrap group hover:border-[#c71f2c]/20 transition-colors shadow-sm"
                >
                  <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-200 bg-slate-50">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  <div className="flex-grow min-w-[200px]">
                    <div className="flex justify-between items-start mb-2">
                       <div>
                          <p className="text-[10px] text-[#c71f2c] uppercase tracking-widest font-black mb-1">{item.category}</p>
                          <Link to={`/product/${item.id}`} className="text-xl font-serif font-black text-black hover:text-[#c71f2c] transition-colors">
                             {item.name}
                          </Link>
                       </div>
                       <div className="flex items-center gap-1">
                          <Button 
                             variant="ghost" 
                             size="icon" 
                             className="text-slate-400 hover:text-[#c71f2c] hover:bg-rose-50 transition-colors rounded-full"
                             onClick={() => handleMoveToWishlist(item)}
                             title="Save to Wishlist"
                          >
                             <Heart className="w-5 h-5" />
                          </Button>
                          <Button 
                             variant="ghost" 
                             size="icon" 
                             className="text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded-full"
                             onClick={() => removeFromCart(item.id)}
                             title="Remove from / Delete Item"
                          >
                             <Trash2 className="w-5 h-5" />
                          </Button>
                       </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center gap-4 bg-slate-100 p-1 rounded-xl border border-slate-200">
                        <Button 
                           variant="ghost" size="icon" className="h-8 w-8 text-black hover:bg-slate-200"
                           onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                           <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm font-black w-4 text-center text-black">{item.quantity}</span>
                        <Button 
                           variant="ghost" size="icon" className="h-8 w-8 text-black hover:bg-slate-200"
                           onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                           <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="text-right">
                         <p className="text-lg font-serif font-black text-black">
                            {formatCurrency((item.discount ? item.price * (1 - item.discount/100) : item.price) * item.quantity)}
                         </p>
                         <p className="text-[10px] text-slate-500 uppercase font-bold">
                            {formatCurrency(item.discount ? item.price * (1 - item.discount/100) : item.price)} / unit
                         </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-50 border-slate-200 rounded-[40px] p-8 sticky top-32 shadow-sm">
               <h3 className="text-2xl font-serif font-black text-black mb-8">Order Summary</h3>
               
               <div className="flex flex-col gap-4 text-sm text-slate-600 font-semibold">
                  <div className="flex justify-between">
                     <span>Subtotal</span>
                     <span className="text-black font-black">{formatCurrency(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                     <span>Shipping</span>
                     <span className="text-black font-black">Free</span>
                  </div>
                  <div className="flex justify-between">
                     <span>Tax (Calculated at checkout)</span>
                     <span className="text-black font-black">{formatCurrency(0)}</span>
                  </div>
               </div>
               
               <Separator className="my-8 bg-slate-200" />
               
               <div className="flex justify-between items-end mb-8">
                  <span className="text-slate-500 uppercase tracking-widest text-xs font-black font-sans">Total</span>
                  <span className="text-3xl font-serif font-black text-black">{formatCurrency(cartTotal)}</span>
               </div>
               
               <Link to="/checkout border-none">
                  <Button className="w-full bg-[#c71f2c] hover:bg-slate-800 text-white h-16 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-md transition-all hover:scale-[1.02] border-none">
                     Proceed to Checkout <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
               </Link>
               
               <div className="mt-8 pt-8 border-t border-slate-200 flex flex-col gap-4">
                  <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest font-bold">Secure Checkout Powered by Stripe</p>
                  <div className="flex justify-center gap-4 opacity-75 grayscale hover:grayscale-0 transition-all">
                     <div className="w-10 h-6 bg-slate-200 rounded flex items-center justify-center text-[8px] font-black text-slate-800 border border-slate-300">VISA</div>
                     <div className="w-10 h-6 bg-slate-200 rounded flex items-center justify-center text-[8px] font-black text-slate-800 border border-slate-300">MC</div>
                     <div className="w-10 h-6 bg-slate-200 rounded flex items-center justify-center text-[8px] font-black text-slate-800 border border-slate-300">AMEX</div>
                  </div>
               </div>
            </Card>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
