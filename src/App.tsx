/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { Toaster } from '@/components/ui/sonner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CompareModal from './components/CompareModal';
import CompareFloatingBar from './components/CompareFloatingBar';
import DesignerChatWidget from './components/DesignerChatWidget';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import OrderTracking from './pages/OrderTracking';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ProductProvider } from './context/ProductContext';
import { CompareProvider } from './context/CompareContext';
import { RewardsProvider } from './context/RewardsContext';

function AppRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/order-tracking" element={<OrderTracking />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <WishlistProvider>
            <CompareProvider>
              <RewardsProvider>
                <Router>
                  <div className="flex min-h-screen flex-col bg-luxury-black text-white selection:bg-gold selection:text-black relative overflow-hidden">
                    {/* Global Luxury Background Blooms */}
                    <div className="fixed top-[-200px] right-[-100px] w-[600px] h-[600px] bg-[#3e89a3] opacity-[0.08] rounded-full blur-[150px] pointer-events-none z-0" />
                    <div className="fixed bottom-[-100px] left-[-200px] w-[500px] h-[500px] bg-gold opacity-[0.04] rounded-full blur-[120px] pointer-events-none z-0" />
                    
                    <Navbar />
                    <main className="flex-grow relative z-10">
                      <AppRoutes />
                    </main>
                    <Footer />
                    <CompareFloatingBar />
                    <CompareModal />
                    <DesignerChatWidget />
                    <Toaster position="bottom-right" />
                  </div>
                </Router>
              </RewardsProvider>
            </CompareProvider>
          </WishlistProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
