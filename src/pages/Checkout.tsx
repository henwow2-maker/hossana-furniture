import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Truck, ShieldCheck, CheckCircle2, ArrowLeft, Sparkles, Ticket, Trash2, Coins } from 'lucide-react';
import { useRewards } from '../context/RewardsContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { formatCurrency } from '../lib/utils';
import { Separator } from '../components/ui/separator';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, isLoading } = useAuth();
  const { earnPointsFromPurchase, appliedVoucher, applyVoucher, removeVoucher, vouchers, pointsBalance } = useRewards();
  const navigate = useNavigate();
  const [isOrdered, setIsOrdered] = useState(false);
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [earnedPoints, setEarnedPoints] = useState<number>(0);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name,
        email: user.email
      }));
    }
  }, [user, isLoading, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const discountValue = appliedVoucher ? appliedVoucher.value : 0;
    const finalAmount = Math.max(1, cartTotal - discountValue);
    const calculatedPoints = Math.floor(finalAmount / 10);
    
    setEarnedPoints(calculatedPoints);
    earnPointsFromPurchase(finalAmount, 'ORD-7721');
    
    setIsOrdered(true);
    clearCart();
    // applied voucher gets automatically processed out
  };

  if (isOrdered) {
    return (
      <div className="pt-40 container mx-auto px-6 text-center min-h-[70vh] flex flex-col items-center justify-center gap-8 bg-white text-black">
        <motion.div
           initial={{ scale: 0 }}
           animate={{ scale: 1 }}
           transition={{ type: "spring", damping: 10 }}
           className="w-32 h-32 bg-green-500/10 rounded-full flex items-center justify-center mb-4 border border-green-500/20"
        >
          <CheckCircle2 className="w-16 h-16 text-green-600" />
        </motion.div>
        <div className="flex flex-col gap-4 text-center">
           <h1 className="text-4xl md:text-5xl font-serif font-black text-black uppercase tracking-tighter">Order Confirmed</h1>
           <p className="text-slate-600 max-w-lg mx-auto font-medium text-lg">
             Thank you for choosing Hossana. Your luxury pieces are being prepared for white-glove delivery.
           </p>
           {earnedPoints > 0 && (
             <div className="mt-2 text-emerald-700 font-bold tracking-wide text-xs flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-100 py-3 px-6 rounded-2xl max-w-md mx-auto shadow-sm">
               <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
               <span>You acquired <strong className="font-extrabold text-emerald-800">{earnedPoints} Points</strong> on this curation! View logs on your Profile.</span>
             </div>
           )}
           <div className="mt-3 inline-flex flex-col items-center gap-2 bg-slate-50 border border-slate-200 py-4 px-8 rounded-2xl max-w-sm mx-auto shadow-sm">
             <span className="text-[10px] uppercase tracking-widest text-slate-500 font-extrabold block">Your Tracking Reference</span>
             <span className="text-lg font-mono font-black text-[#c71f2c] tracking-widest">ORD-7721</span>
           </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link to="/order-tracking?id=ORD-7721">
            <Button className="bg-[#c71f2c] hover:bg-slate-800 text-white px-10 h-16 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all hover:scale-105 border-none">
              Track Delivery Status
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="border-slate-300 text-slate-700 hover:text-black hover:bg-slate-50 px-10 h-16 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all hover:scale-105 bg-white">
              Return to Gallery
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="pt-40 container mx-auto px-6 text-center h-screen bg-white text-black">
         <h1 className="text-4xl font-serif mb-4 text-black font-black">No Items for Checkout</h1>
         <Link to="/shop"><Button className="bg-[#c71f2c] text-white">Shop Now</Button></Link>
      </div>
    );
  }

  return (
    <div className="pt-32 min-h-screen bg-white pb-24 text-black">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <Link to="/cart" className="inline-flex items-center gap-2 text-[#c71f2c] font-black uppercase tracking-widest text-[10px] mb-8 hover:gap-4 transition-all">
            <ArrowLeft className="w-3 h-3" /> Back to Cart
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-black uppercase tracking-tighter">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Form Side */}
          <div className="lg:col-span-2 flex flex-col gap-12">
             {/* Shipping Information */}
             <div className="space-y-8">
                <div className="flex items-center gap-4 text-[#c71f2c] mb-8">
                   <div className="w-10 h-10 rounded-full border border-[#c71f2c] flex items-center justify-center font-black font-serif italic text-xl bg-[#c71f2c]/5">1</div>
                   <h3 className="text-2xl font-serif font-black text-black">Shipping Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-slate-500">Full Name</label>
                      <Input 
                        required 
                        className="h-14 bg-white border-slate-200 text-black rounded-xl focus-visible:border-[#c71f2c] focus-visible:ring-0 placeholder:text-slate-400" 
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={e => setFormData({...formData, fullName: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-slate-500">Email Address</label>
                      <Input 
                        required 
                        type="email" 
                        className="h-14 bg-white border-slate-200 text-black rounded-xl focus-visible:border-[#c71f2c] focus-visible:ring-0 placeholder:text-slate-400" 
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                   </div>
                   <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-slate-500">Street Address</label>
                      <Input 
                        required 
                        className="h-14 bg-white border-slate-200 text-black rounded-xl focus-visible:border-[#c71f2c] focus-visible:ring-0 placeholder:text-slate-400" 
                        placeholder="123 Luxury Ave"
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-slate-500">City</label>
                      <Input 
                        required 
                        className="h-14 bg-white border-slate-200 text-black rounded-xl focus-visible:border-[#c71f2c] focus-visible:ring-0 placeholder:text-slate-400" 
                        placeholder="Design District"
                        value={formData.city}
                        onChange={e => setFormData({...formData, city: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-slate-500">ZIP Code</label>
                      <Input 
                        required 
                        className="h-14 bg-white border-slate-200 text-black rounded-xl focus-visible:border-[#c71f2c] focus-visible:ring-0 placeholder:text-slate-400" 
                        placeholder="12345"
                        value={formData.zip}
                        onChange={e => setFormData({...formData, zip: e.target.value})}
                      />
                   </div>
                </div>
             </div>

             <Separator className="bg-slate-200" />

             {/* Payment Information */}
             <div className="space-y-8">
                <div className="flex items-center gap-4 text-[#c71f2c] mb-8">
                   <div className="w-10 h-10 rounded-full border border-[#c71f2c] flex items-center justify-center font-black font-serif italic text-xl bg-[#c71f2c]/5">2</div>
                   <h3 className="text-2xl font-serif font-black text-black">Payment Method</h3>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 space-y-6">
                   <div className="flex items-center gap-4 mb-4">
                      <CreditCard className="w-6 h-6 text-[#c71f2c]" />
                      <span className="text-black font-black uppercase tracking-widest text-xs">Credit or Debit Card</span>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-slate-500">Card Number</label>
                      <Input 
                        required 
                        className="h-14 bg-white border-slate-200 text-black rounded-xl focus-visible:border-[#c71f2c] focus-visible:ring-0 placeholder:text-slate-400 font-mono" 
                        placeholder="0000 0000 0000 0000"
                        value={formData.cardNumber}
                        onChange={e => setFormData({...formData, cardNumber: e.target.value})}
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] uppercase font-black tracking-widest text-slate-500">Expiry Date</label>
                         <Input 
                           required 
                           className="h-14 bg-white border-slate-200 text-black rounded-xl focus-visible:border-[#c71f2c] focus-visible:ring-0 placeholder:text-slate-400 font-mono" 
                           placeholder="MM/YY"
                           value={formData.expiry}
                           onChange={e => setFormData({...formData, expiry: e.target.value})}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] uppercase font-black tracking-widest text-slate-500">CVV</label>
                         <Input 
                           required 
                           className="h-14 bg-white border-slate-200 text-black rounded-xl focus-visible:border-[#c71f2c] focus-visible:ring-0 placeholder:text-slate-400 font-mono" 
                           placeholder="000"
                           value={formData.cvv}
                           onChange={e => setFormData({...formData, cvv: e.target.value})}
                         />
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
             <Card className="bg-slate-50 border-slate-200 rounded-[40px] p-10 flex flex-col gap-8 sticky top-32 shadow-sm">
                <div>
                   <h4 className="text-xl font-serif font-black text-black mb-6 uppercase tracking-tight">Order Review</h4>
                   <div className="flex flex-col gap-4 max-h-[260px] overflow-auto pr-2 custom-scrollbar">
                      {cart.map((item) => (
                         <div key={item.id} className="flex justify-between items-center gap-4">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 bg-white">
                                  <img src={item.image} className="w-full h-full object-cover" />
                               </div>
                               <div>
                                  <p className="text-xs text-black font-black line-clamp-1">{item.name}</p>
                                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                               </div>
                            </div>
                            <span className="text-sm font-serif font-black text-black">
                               {formatCurrency((item.discount ? item.price * (1 - item.discount/100) : item.price) * item.quantity)}
                            </span>
                         </div>
                      ))}
                   </div>
                </div>

                <Separator className="bg-slate-200" />

                {/* Loyalty Rewards Voucher Box */}
                <div className="space-y-4">
                   <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-[#c71f2c]" />
                      <h5 className="text-[10px] uppercase font-black tracking-widest text-black">Apply Rewards Credit</h5>
                   </div>

                   {appliedVoucher ? (
                      <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-slate-700 font-medium font-sans">
                         <div className="flex items-center gap-2 max-w-[85%]">
                            <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
                            <div className="overflow-hidden text-left">
                               <span className="font-extrabold text-emerald-800 text-[11px] block">Applied Voucher</span>
                               <p className="text-[10px] text-emerald-600 font-mono font-bold truncate">{appliedVoucher.code} (-{formatCurrency(appliedVoucher.value)})</p>
                            </div>
                         </div>
                         <button 
                            type="button"
                            onClick={removeVoucher}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                            title="Clear voucher"
                         >
                            <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                   ) : (
                      <div className="space-y-3 font-sans">
                         <div className="flex gap-2">
                            <Input 
                               type="text"
                               placeholder="Enter voucher code"
                               value={voucherCodeInput}
                               onChange={(e) => setVoucherCodeInput(e.target.value)}
                               className="h-10 text-xs bg-white border-slate-200 text-black rounded-lg focus-visible:border-[#c71f2c] focus-visible:ring-0 placeholder:text-slate-400 flex-grow"
                            />
                            <Button 
                               type="button"
                               onClick={() => {
                                  if (applyVoucher(voucherCodeInput)) {
                                     setVoucherCodeInput('');
                                  }
                                }}
                               className="h-10 px-4 bg-black hover:bg-slate-800 text-white rounded-lg font-bold uppercase tracking-widest text-[9px] border-none shrink-0"
                            >
                               Apply
                            </Button>
                         </div>

                         {/* Quick selection of redeemed, active vouchers */}
                         {vouchers.filter(v => !v.isRedeemed).length > 0 && (
                            <div className="space-y-1.5 text-left">
                               <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block mb-1">Your Unlocked credits:</span>
                               <div className="flex flex-col gap-1.5 max-h-[100px] overflow-auto pr-1 custom-scrollbar">
                                  {vouchers.filter(v => !v.isRedeemed).map((v) => (
                                     <button
                                        key={v.code}
                                        type="button"
                                        onClick={() => applyVoucher(v.code)}
                                        className="w-full text-left bg-slate-100 hover:bg-amber-100/50 border border-slate-100 hover:border-amber-400/30 rounded-lg p-2 flex justify-between items-center text-[10px] transition-colors font-sans cursor-pointer"
                                     >
                                        <span className="font-mono text-slate-600 font-bold truncate max-w-[55%]">{v.code}</span>
                                        <strong className="text-amber-600 font-extrabold shrink-0">+ Apply {formatCurrency(v.value)} Off</strong>
                                     </button>
                                  ))}
                                </div>
                            </div>
                         )}
                      </div>
                   )}
                </div>

                <Separator className="bg-slate-200" />

                <div className="space-y-4">
                   <div className="flex justify-between text-xs text-slate-500 font-black uppercase tracking-widest">
                      <span>Subtotal</span>
                      <span className="text-black font-black">{formatCurrency(cartTotal)}</span>
                   </div>
                   {appliedVoucher && (
                      <div className="flex justify-between text-xs text-[#c71f2c] font-black uppercase tracking-widest">
                         <span>Loyalty Reward</span>
                         <span className="font-black">-{formatCurrency(appliedVoucher.value)}</span>
                      </div>
                   )}
                   <div className="flex justify-between text-xs text-slate-500 font-black uppercase tracking-widest">
                      <span>Shipping</span>
                      <span className="text-green-600 font-black">FREE</span>
                   </div>
                   <Separator className="bg-slate-200" />
                   <div className="flex justify-between items-end">
                      <span className="text-slate-500 uppercase tracking-widest text-[10px] font-black">Total</span>
                      <span className="text-3xl font-serif font-black text-black">
                         {formatCurrency(Math.max(0, cartTotal - (appliedVoucher ? appliedVoucher.value : 0)))}
                      </span>
                   </div>
                </div>

                <Button type="submit" className="w-full h-16 bg-[#c71f2c] hover:bg-slate-800 text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-md transition-all hover:scale-[1.02] border-none">
                   Complete Order
                </Button>

                <div className="flex flex-col gap-4 pt-4 border-t border-slate-200">
                   <div className="flex items-center gap-3 text-xs text-slate-600 font-semibold">
                      <ShieldCheck className="w-4 h-4 text-[#c71f2c]" />
                      <span>Secure SSL Encryption</span>
                   </div>
                   <div className="flex items-center gap-3 text-xs text-slate-600 font-semibold">
                      <Truck className="w-4 h-4 text-[#c71f2c]" />
                      <span>Complimentary White-Glove Support</span>
                   </div>
                </div>
             </Card>
          </div>
        </form>
      </div>
      
      <style>{`
         .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
         }
         .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.05);
         }
         .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #c71f2c;
            border-radius: 10px;
         }
      `}</style>
    </div>
  );
}
