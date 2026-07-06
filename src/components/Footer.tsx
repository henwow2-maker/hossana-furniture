import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Landmark, Globe, Camera, Box, Share2, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import HossanaLogo from './HossanaLogo';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter an email address.');
      return;
    }
    
    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API registration
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      toast.success(`Successfully subscribed ${email} to Hossana Atelier updates!`);
      setEmail('');
    }, 1200);
  };

  return (
    <footer className="bg-[#fafbfc] border-t border-slate-200 pt-20 pb-10 text-black">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <HossanaLogo size={46} variant="brand" className="transition-all duration-500 group-hover:scale-105" />
              <div className="flex flex-col">
                <span className="text-xl font-serif font-black tracking-[0.1em] text-black uppercase">
                  HOSSANA
                </span>
                <span className="text-[6px] tracking-[0.25em] text-[#c71f2c] uppercase font-black -mt-0.5 opacity-90">Atelier of Masterpieces</span>
              </div>
            </Link>
            <p className="text-slate-600 text-sm font-medium leading-relaxed">
              Crafting timeless luxury furniture since 2010. Our pieces combine traditional craftsmanship with modern innovation to transform your space.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2.5 bg-slate-100 rounded-full hover:bg-[#c71f2c] hover:text-white transition-all text-[#c71f2c] shadow-sm">
                <Camera className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 bg-slate-100 rounded-full hover:bg-[#c71f2c] hover:text-white transition-all text-[#c71f2c] shadow-sm">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 bg-slate-100 rounded-full hover:bg-[#c71f2c] hover:text-white transition-all text-[#c71f2c] shadow-sm">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">Company</h4>
            <ul className="flex flex-col gap-3 text-sm text-slate-600">
              <li><Link to="/" className="hover:text-[#c71f2c] transition-colors font-semibold">Home</Link></li>
              <li><Link to="/shop" className="hover:text-[#c71f2c] transition-colors font-semibold">Our Shop</Link></li>
              <li><Link to="/about" className="hover:text-[#c71f2c] transition-colors font-semibold">About Us</Link></li>
              <li><Link to="/blog" className="hover:text-[#c71f2c] transition-colors font-semibold">Latest Blog</Link></li>
              <li><Link to="/careers" className="hover:text-[#c71f2c] transition-colors font-semibold">Careers</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-6">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">Support</h4>
            <ul className="flex flex-col gap-3 text-sm text-slate-600">
              <li><Link to="/help" className="hover:text-[#c71f2c] transition-colors font-semibold">Help Center</Link></li>
              <li><Link to="/shipping" className="hover:text-[#c71f2c] transition-colors font-semibold">Shipping Policy</Link></li>
              <li><Link to="/returns" className="hover:text-[#c71f2c] transition-colors font-semibold">Returns & Refunds</Link></li>
              <li><Link to="/faq" className="hover:text-[#c71f2c] transition-colors font-semibold">FAQs</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-6">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">Contact Us</h4>
            <ul className="flex flex-col gap-3 text-sm text-slate-600 font-semibold">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#c71f2c] shrink-0" />
                <a href="mailto:hossanafurniture@gmail.com" className="hover:text-[#c71f2c] transition-colors">hossanafurniture@gmail.com</a>
              </li>
              <li className="flex flex-col gap-1.5">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#c71f2c] shrink-0" />
                  <a href="tel:+251973664387" className="hover:text-[#c71f2c] transition-colors">+251 973 664 387</a>
                </div>
                <div className="flex items-center gap-3 pl-7">
                  <a href="tel:+25168639580" className="hover:text-[#c71f2c] transition-colors">+251 686 395 80</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#c71f2c] shrink-0" />
                <span className="text-slate-600">123 Hossana Ave, Design District</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-y border-slate-200 py-12 mb-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-xl font-serif text-black mb-2 font-black">Join our newsletter</h3>
            <p className="text-black text-sm font-medium">Subscribe to receive exclusive offers and design inspiration.</p>
          </div>
          <div className="w-full md:w-auto">
            {isSubscribed ? (
              <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 px-6 py-4 rounded-3xl text-green-700">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-black uppercase tracking-wider">Subscription Confirmed</p>
                  <p className="text-[11px] font-medium opacity-90">Thank you for joining Hossana's luxury circle.</p>
                </div>
                <button 
                  onClick={() => setIsSubscribed(false)}
                  className="text-xs decoration-dashed underline hover:text-[#c71f2c] ml-4 font-black transition-colors"
                >
                  Reset
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
                <input 
                  type="email"
                  required
                  placeholder="Enter your email address" 
                  value={email}
                  disabled={isSubmitting}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border border-slate-300 text-black py-3.5 px-6 rounded-full text-sm font-semibold focus:border-[#c71f2c] focus:outline-none min-w-[280px] w-full focus:ring-1 focus:ring-[#c71f2c] transition-all placeholder:text-slate-400" 
                />
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#c71f2c] hover:bg-slate-800 text-white px-8 h-12 uppercase font-black tracking-widest text-xs transition-colors rounded-full shadow-sm border-none flex items-center justify-center min-w-[120px]"
                >
                  {isSubmitting ? 'Joining...' : 'Subscribe'}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-black uppercase tracking-widest font-black">
          <p>© 2026 Hossana Furniture. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#c71f2c] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#c71f2c] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
