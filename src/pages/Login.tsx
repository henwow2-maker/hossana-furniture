import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'motion/react';
import { LogIn, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import HossanaLogo from '../components/HossanaLogo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(email);
      toast.success('Welcome back to Hossana');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-luxury-dark/40 backdrop-blur-xl p-10 border border-white/5 rounded-[40px] shadow-2xl relative overflow-hidden"
      >
        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold/10 rounded-full blur-3xl" />
        
        <div className="text-center mb-10 relative z-10">
          <HossanaLogo size={64} variant="brand" className="mx-auto mb-6 transition-all duration-500 hover:scale-105" />
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-500 text-sm font-light">Enter your credentials to access your collection</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input 
                type="email" 
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/50 border-white/10 pl-12 h-14 rounded-2xl focus:border-gold/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <Label className="text-[10px] uppercase tracking-widest text-gray-500">Password</Label>
              <button type="button" className="text-[9px] uppercase tracking-widest text-gold hover:text-white transition-colors">Forgot?</button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input 
                type="password" 
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black/50 border-white/10 pl-12 h-14 rounded-2xl focus:border-gold/50"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-white text-black hover:bg-gold hover:text-black font-bold uppercase tracking-widest text-xs h-14 rounded-2xl shadow-xl transition-all"
          >
            {isSubmitting ? 'Verifying...' : 'Sign In'} <LogIn className="ml-2 w-4 h-4" />
          </Button>

          <div className="text-center">
            <p className="text-[10px] text-gray-600 uppercase tracking-widest">
              Don't have an account? {' '}
              <button type="button" className="text-gold hover:text-white transition-colors font-bold">Create Account</button>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
