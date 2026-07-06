import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRewards } from '../context/RewardsContext';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Package, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Mail, 
  Calendar, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Copy, 
  Check,
  ShieldCheck,
  Compass,
  History,
  Award,
  Ticket,
  Coins,
  Gift,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TrackingMap from '../components/TrackingMap';
import { formatCurrency } from '../lib/utils';

const MOCK_ORDERS = [
  { id: 'demo-order-001', date: '2026-06-05', total: 24500, status: 'In Transit', pieces: 4 },
  { id: 'ORD-7721', date: '2026-05-10', total: 2400, status: 'Processing', pieces: 2 },
  { id: 'ORD-6542', date: '2026-04-15', total: 1200, status: 'Delivered', pieces: 1 },
];

const MOCK_PAST_ORDERS = [
  { id: 'ORD-5291', completionDate: '2026-03-12', price: 4200, items: 'Bespoke Marble Console Cabinet', pieces: 1, status: 'Delivered' },
  { id: 'ORD-4102', completionDate: '2026-02-28', price: 1850, items: 'Hand-Blown Murano Glass Vase', pieces: 1, status: 'Delivered' },
  { id: 'ORD-3091', completionDate: '2025-12-15', price: 9800, items: 'Veronese Oil Painting Study Study', pieces: 1, status: 'Delivered' },
];

interface TrackingStep {
  title: string;
  description: string;
  time: string;
  location: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface TrackingDetails {
  carrier: string;
  trackingNo: string;
  estimatedDelivery: string;
  service: string;
  steps: TrackingStep[];
}

const MOCK_TRACKING_STEPS: Record<string, TrackingDetails> = {
  'demo-order-001': {
    carrier: 'Hossana Ethiopian Imperial Logistics',
    trackingNo: 'HOS-AQ-AB8RN',
    estimatedDelivery: 'June 12, 2026 at 2:00 PM',
    service: 'Sovereign Armored Escort & White-Glove Installation',
    steps: [
      { 
        title: 'Order Verified & Sovereign Wood Selection', 
        description: 'Premium seasoned Wanza hardwood logged and registered in Gullele High-Altitude Curing Labs.', 
        time: 'June 01, 2026 • 09:00 AM', 
        location: 'Hossana Gullele Master Studio', 
        status: 'completed' 
      },
      { 
        title: 'Artisan Hand-Carving & Sanding', 
        description: 'Hand-finished with natural traditional beeswax polish by elder craftsman. Signed under frame.', 
        time: 'June 03, 2026 • 11:30 AM', 
        location: 'Hossana Gullele Master Studio', 
        status: 'completed' 
      },
      { 
        title: 'Imperial Escrow Dispatch', 
        description: 'Packaged in shock-proof custom timber boxes. Handed over to our private armored escort vehicle with constant climate telemetry.', 
        time: 'June 05, 2026 • 08:00 AM', 
        location: 'Bole Premium Showroom Hub', 
        status: 'completed' 
      },
      { 
        title: 'Secured Transit - Route Bole-Palace', 
        description: 'Active GPS/satellite route mapping. Fine timber humectant levels continuously monitored to ensure perfection.', 
        time: 'June 07, 2026 • 04:30 PM', 
        location: 'Addis Ababa Ring Road Sky Segment', 
        status: 'current' 
      },
      { 
        title: 'Bespoke Placement & Handover', 
        description: 'Complete placement, assembly verification, and final presentation registry signature at your primary residence.', 
        time: 'Estimated June 12, 2026', 
        location: 'President Estate, Addis Ababa', 
        status: 'upcoming' 
      }
    ]
  },
  'demo-order-002': {
    carrier: 'Hossana Ethiopian Imperial Logistics',
    trackingNo: 'HOS-AQ-AB8RN',
    estimatedDelivery: 'June 12, 2026 at 2:00 PM',
    service: 'Sovereign Armored Escort & White-Glove Installation',
    steps: [
      { 
        title: 'Order Verified & Sovereign Wood Selection', 
        description: 'Premium seasoned Wanza hardwood logged and registered in Gullele High-Altitude Curing Labs.', 
        time: 'June 01, 2026 • 09:00 AM', 
        location: 'Hossana Gullele Master Studio', 
        status: 'completed' 
      },
      { 
        title: 'Artisan Hand-Carving & Sanding', 
        description: 'Hand-finished with natural traditional beeswax polish by elder craftsman. Signed under frame.', 
        time: 'June 03, 2026 • 11:30 AM', 
        location: 'Hossana Gullele Master Studio', 
        status: 'completed' 
      },
      { 
        title: 'Imperial Escrow Dispatch', 
        description: 'Packaged in shock-proof custom timber boxes. Handed over to our private armored escort vehicle with constant climate telemetry.', 
        time: 'June 05, 2026 • 08:00 AM', 
        location: 'Bole Premium Showroom Hub', 
        status: 'completed' 
      },
      { 
        title: 'Secured Transit - Route Bole-Palace', 
        description: 'Active GPS/satellite route mapping. Fine timber humectant levels continuously monitored to ensure perfection.', 
        time: 'June 07, 2026 • 04:30 PM', 
        location: 'Addis Ababa Ring Road Sky Segment', 
        status: 'current' 
      },
      { 
        title: 'Bespoke Placement & Handover', 
        description: 'Complete placement, assembly verification, and final presentation registry signature at your primary residence.', 
        time: 'Estimated June 12, 2026', 
        location: 'President Estate, Addis Ababa', 
        status: 'upcoming' 
      }
    ]
  },
  'ORD-7721': {
    carrier: 'Hossana Luxury Freight',
    trackingNo: 'HOS-7721-X9A',
    estimatedDelivery: 'May 15, 2026 at 5:00 PM',
    service: 'White-Glove Courier & In-Home Assembly',
    steps: [
      { 
        title: 'Order Confirmed', 
        description: 'Your premium reservation is secured and payment verified.', 
        time: 'May 10, 2026 • 10:30 AM', 
        location: 'Hossana Milan Atelier', 
        status: 'completed' 
      },
      { 
        title: 'Curatorial Verification', 
        description: 'Certified authentic. Specially vacuum-sealed with hologram seals of provenance.', 
        time: 'May 11, 2026 • 02:15 PM', 
        location: 'Quality & Provenance Lab', 
        status: 'completed' 
      },
      { 
        title: 'Dispatched in Protective Escrow', 
        description: 'Loaded onto temperature-controlled climate carrier for specialized fine art transport.', 
        time: 'May 12, 2026 • 09:00 AM', 
        location: 'West European Cargo Hub', 
        status: 'completed' 
      },
      { 
        title: 'In Regional Transit', 
        description: 'Undergoing local custom logistics classification. Monitored security escort active.', 
        time: 'May 13, 2026 • 04:30 PM', 
        location: 'Munich Airport Fine Art Flight 412', 
        status: 'current' 
      },
      { 
        title: 'Delivered & Curated In-Situ', 
        description: 'Concluded personal courier arrival, placement, and unboxing at your private gallery.', 
        time: 'Estimated May 15, 2026', 
        location: 'Your Primary Residence', 
        status: 'upcoming' 
      },
    ]
  },
  'ORD-6542': {
    carrier: 'Specialized Direct Transit',
    trackingNo: 'HOS-6542-C11',
    estimatedDelivery: 'Delivered April 17, 2026',
    service: 'Signature Concierge White-Glove delivery',
    steps: [
      { 
        title: 'Order Confirmed', 
        description: 'Payment verified and bespoke frame packing requested.', 
        time: 'April 15, 2026 • 08:30 AM', 
        location: 'Hossana Venice Atelier', 
        status: 'completed' 
      },
      { 
        title: 'Art Director Approval', 
        description: 'Hand-signed by lead collection curator.', 
        time: 'April 15, 2026 • 11:20 AM', 
        location: 'Hossana Venice Atelier', 
        status: 'completed' 
      },
      { 
        title: 'Signature Dispatch', 
        description: 'Personally handed over to elite private carrier.', 
        time: 'April 16, 2026 • 10:00 AM', 
        location: 'Veneto Transit Node', 
        status: 'completed' 
      },
      { 
        title: 'Delivered & Signed', 
        description: 'Arrived intact and hand-signed by recipient at main residence entrance.', 
        time: 'April 17, 2026 • 01:15 PM', 
        location: 'Private Residence, Rome', 
        status: 'completed' 
      },
    ]
  },
  'ORD-5291': {
    carrier: 'Hossana Heavy Freight',
    trackingNo: 'HOS-5291-Y7B',
    estimatedDelivery: 'Delivered March 12, 2026',
    service: 'Specialized Direct Transit & In-Home Placement',
    steps: [
      { 
        title: 'Order Confirmed', 
        description: 'Payment verified and bespoke packing requested.', 
        time: 'March 8, 2026 • 09:15 AM', 
        location: 'Hossana Milan Atelier', 
        status: 'completed' 
      },
      { 
        title: 'Atelier Inspection & Certification', 
        description: 'Handchecked and signed by the master stonemason.', 
        time: 'March 9, 2026 • 11:00 AM', 
        location: 'Carrara Marble Studio', 
        status: 'completed' 
      },
      { 
        title: 'Direct Elite Shipping Dispatch', 
        description: 'Loaded onto specialized heavy-lift fine art carrier.', 
        time: 'March 10, 2026 • 08:30 AM', 
        location: 'Milan North Depot', 
        status: 'completed' 
      },
      { 
        title: 'Delivered & Installed', 
        description: 'Delivered, unboxed, and installed on-premise at your primary residence.', 
        time: 'March 12, 2026 • 03:45 PM', 
        location: 'Your Primary Residence', 
        status: 'completed' 
      }
    ]
  },
  'ORD-4102': {
    carrier: 'Signature Fragile Parcel Express',
    trackingNo: 'HOS-4102-K32',
    estimatedDelivery: 'Delivered February 28, 2026',
    service: 'White-Glove Insured Courier Service',
    steps: [
      { 
        title: 'Order Confirmed', 
        description: 'Premium glasswork reservation verified.', 
        time: 'February 25, 2026 • 02:40 PM', 
        location: 'Hossana Murano Workshop', 
        status: 'completed' 
      },
      { 
        title: 'Double-Walled Specialized Packing', 
        description: 'Packed inside double-walled premium container with dynamic shock-absorbing foam.', 
        time: 'February 26, 2026 • 10:15 AM', 
        location: 'Murano Glass Lab', 
        status: 'completed' 
      },
      { 
        title: 'High-Priority Courier Dispatch', 
        description: 'Security locked transit parcel handed over.', 
        time: 'February 27, 2026 • 11:30 AM', 
        location: 'Venice Airport Cargo Terminal', 
        status: 'completed' 
      },
      { 
        title: 'Hand-Delivered & Signed', 
        description: 'Direct courier delivery completed with consignee signature.', 
        time: 'February 28, 2026 • 04:10 PM', 
        location: 'Private Residence, Milan', 
        status: 'completed' 
      }
    ]
  },
  'ORD-3091': {
    carrier: 'Escorted Armored Fine Art Carriage',
    trackingNo: 'HOS-3091-M11',
    estimatedDelivery: 'Delivered December 15, 2025',
    service: 'Armed Escort Armored Vehicle Fine Art Freight',
    steps: [
      { 
        title: 'Bespoke Curatorial Verification', 
        description: 'X-ray analysis, provenance tagging, and archival certificate issuance.', 
        time: 'December 10, 2025 • 09:00 AM', 
        location: 'Hossana Curator Gallery', 
        status: 'completed' 
      },
      { 
        title: 'Custom-Crate Construction', 
        description: 'Fitted into airtight, moisture-controlled carbon-fiber wood crates.', 
        time: 'December 11, 2025 • 03:30 PM', 
        location: 'Hossana Curator Gallery', 
        status: 'completed' 
      },
      { 
        title: 'Secure Escorted Carriage Dispatch', 
        description: 'Transport under constant GPS tracking with armed transit unit.', 
        time: 'December 12, 2025 • 10:00 AM', 
        location: 'Rome Security Port', 
        status: 'completed' 
      },
      { 
        title: 'Delivered to Vault & Unpacked', 
        description: 'Safely placed in private collection vault and verified by onsite registrar.', 
        time: 'December 15, 2025 • 11:15 AM', 
        location: 'Your Secondary Residence', 
        status: 'completed' 
      }
    ]
  }
};

export default function Profile() {
  const { user, logout } = useAuth();
  const { pointsBalance, pointsHistory, vouchers, rewardsTier, redeemVoucher } = useRewards();
  const navigate = useNavigate();
  const [selectedOrderTracking, setSelectedOrderTracking] = useState<string>('demo-order-001');
  const [activeTab, setActiveTab] = useState<'tracking' | 'history' | 'rewards'>('tracking');
  const [copiedTrackingId, setCopiedTrackingId] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const currentTrackingId = selectedOrderTracking;
  const trackingInfo = MOCK_TRACKING_STEPS[currentTrackingId];

  const handleCopyTracking = (trackingNo: string) => {
    navigator.clipboard.writeText(trackingNo);
    setCopiedTrackingId(true);
    setTimeout(() => setCopiedTrackingId(false), 2000);
  };

  return (
    <div className="pt-32 min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.08),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(239,68,68,0.08),_transparent_26%)] pb-24">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Sidebar Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="bg-slate-950/90 backdrop-blur-xl rounded-[40px] p-10 border border-emerald-500/15 text-center shadow-[0_25px_80px_rgba(16,185,129,0.12)]">
              <div className="relative inline-flex items-center justify-center mb-6 p-1 rounded-full bg-gradient-to-br from-emerald-500 via-yellow-400 to-rose-500 shadow-lg">
                <div className="rounded-full bg-slate-950 p-1">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-32 h-32 rounded-full border-2 border-slate-900 object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-slate-950 border-2 border-white/10 flex items-center justify-center shadow-sm">
                   <Settings className="w-4 h-4 text-emerald-300" />
                </div>
              </div>
              <h2 className="text-2xl font-serif font-bold text-white mb-2">{user.name}</h2>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="h-2 w-8 rounded-full bg-emerald-500" />
                <span className="h-2 w-8 rounded-full bg-yellow-400" />
                <span className="h-2 w-8 rounded-full bg-rose-600" />
              </div>
              <p className="text-emerald-300 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">Premium Member</p>
              <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-semibold mb-6">Ethiopian Heritage</p>
              
              <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <Mail className="w-4 h-4 text-emerald-300" />
                  <span className="font-light">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <Calendar className="w-4 h-4 text-emerald-300" />
                  <span className="font-light">Joined May 2026</span>
                </div>
              </div>

              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="w-full mt-10 border-white/10 text-gray-400 hover:text-red-500 hover:border-red-500/50 rounded-2xl h-12 uppercase tracking-widest text-[10px] font-bold"
              >
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
            </div>

            <div className="bg-luxury-dark/40 backdrop-blur-md rounded-[40px] p-10 border border-white/5">
               <h3 className="text-xs uppercase tracking-widest text-emerald-300 font-bold mb-6">Quick Links</h3>
               <nav className="space-y-2">
                  {['My Wishlist', 'Address Book', 'Payment Methods', 'Account Settings'].map(link => (
                    <button 
                      key={link} 
                      onClick={() => {
                        if (link === 'My Wishlist') navigate('/wishlist');
                      }}
                      className="w-full text-left py-3 px-4 rounded-xl text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-all flex justify-between items-center group"
                    >
                      {link}
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
               </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-10"
          >
            <div>
               <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 uppercase tracking-tighter">My Account</h1>
               <p className="text-gray-500 font-light leading-relaxed">View your orders, track shipments in real-time, and manage your account preferences.</p>
            </div>

            {/* Premium Tab Bar Selector */}
            <div className="border-b border-white/5 flex gap-1 sm:gap-6 overflow-x-auto pb-px scrollbar-none">
              {[
                { id: 'tracking', label: 'Active Fulfillments', icon: Package },
                { id: 'history', label: 'Order History', icon: History },
                { id: 'rewards', label: 'VIP Rewards Portfolio', icon: Award }
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'tracking' | 'history' | 'rewards')}
                    className={`pb-4 px-2 md:px-4 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold transition-all relative flex items-center gap-2 border-b-2 shrink-0 ${
                      isActive 
                        ? 'text-emerald-300 border-emerald-400 font-extrabold' 
                        : 'text-gray-400 border-transparent hover:text-white hover:border-white/20'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-300' : 'text-gray-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'tracking' && (
                <motion.div
                  key="tracking-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-12"
                >
                  {/* Orders Section */}
                  <section>
                    <div className="flex justify-between items-end mb-8">
                      <h3 className="text-xl font-serif font-bold text-white">Recent Purchases</h3>
                      <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Select any order to track live</span>
                    </div>

                    <div className="space-y-4">
                      {MOCK_ORDERS.map(order => {
                        const isCurrentTracked = selectedOrderTracking === order.id;
                        return (
                          <div 
                            key={order.id} 
                            onClick={() => setSelectedOrderTracking(order.id)}
                            className={`cursor-pointer rounded-[30px] p-8 border transition-all duration-300 flex flex-wrap items-center justify-between gap-6 ${
                              isCurrentTracked 
                                ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_4px_30px_rgba(16,185,129,0.12)]' 
                                : 'border-white/5 bg-luxury-dark/40 hover:border-emerald-400/30'
                            }`}
                          >
                             <div className="flex items-center gap-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                                  isCurrentTracked ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/5 text-gray-400'
                                }`}>
                                   <Package className="w-6 h-6" />
                                </div>
                                <div>
                                   <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Order #{order.id}</p>
                                   <p className="text-sm text-white font-medium">{order.pieces} Pieces • {formatCurrency(order.total)}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-8">
                                <div className="text-right">
                                   <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Status</p>
                                   <p className={`text-[10px] uppercase tracking-widest font-bold ${order.status === 'Delivered' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                      {order.status}
                                   </p>
                                </div>
                                <Button 
                                  variant={isCurrentTracked ? 'default' : 'outline'}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedOrderTracking(order.id);
                                  }}
                                  className={`rounded-xl px-6 h-10 uppercase tracking-widest text-[9px] font-bold transition-all ${
                                    isCurrentTracked 
                                      ? 'bg-emerald-500 text-black hover:bg-white' 
                                      : 'border-white/10 hover:bg-white/5 hover:border-white text-white'
                                  }`}
                                >
                                  Live Map & Track
                                </Button>
                             </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* Order Tracking Timeline Section */}
                  <AnimatePresence mode="wait">
                    {trackingInfo && (
                      <motion.section 
                        key={currentTrackingId}
                        id="tracking-section"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="bg-luxury-dark/40 backdrop-blur-md rounded-[40px] p-8 sm:p-10 border border-white/5 relative overflow-hidden scroll-mt-32"
                      >
                        {/* Decorative glowing background accent */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-white/5 mb-8">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-emerald-300 uppercase tracking-[0.2em] text-[10px] font-bold">Real-time Fulfillment Pipeline</span>
                              <span className="inline-flex w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-white uppercase tracking-tight">Fulfillment Status {currentTrackingId}</h3>
                            <p className="text-xs text-gray-400 mt-1">{trackingInfo.service}</p>
                          </div>

                          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col min-w-[180px]">
                            <span className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Estimated In-Home Placement</span>
                            <span className="text-sm font-serif font-semibold text-emerald-300">{trackingInfo.estimatedDelivery}</span>
                          </div>
                        </div>

                        {/* Meta Stats Row (Carrier & Tracking info) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 bg-black/40 border border-white/5 rounded-[24px] p-6 text-sm backdrop-blur-xl">
                          <div>
                            <span className="text-[10px] uppercase tracking-widest text-gray-500 block mb-1">Premium Carrier Partner</span>
                            <span className="text-white font-medium flex items-center gap-2">
                              <Truck className="w-4 h-4 text-emerald-300 shrink-0" />
                              {trackingInfo.carrier}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase tracking-widest text-gray-500 block mb-1">Secure Tracking Key</span>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-mono text-xs">{trackingInfo.trackingNo}</span>
                              <button 
                                onClick={() => handleCopyTracking(trackingInfo.trackingNo)}
                                className="hover:text-emerald-300 transition-colors text-gray-400 outline-none"
                                title="Copy tracking number"
                              >
                                {copiedTrackingId ? (
                                  <Check className="w-4 h-4 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase tracking-widest text-gray-500 block mb-1">Protection Tier</span>
                            <span className="text-white font-medium flex items-center gap-1.5 text-xs">
                              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                              Fully Bonded & Escorted Fine Art
                            </span>
                          </div>
                        </div>

                        {/* Interactive Logistics Map */}
                        <div className="mb-12">
                          <TrackingMap orderId={currentTrackingId} />
                        </div>

                        {/* Vertical Progress Stepper */}
                        <div className="relative pl-6 sm:pl-8 space-y-10">
                          
                          {/* Stepper Connecting Rod Line */}
                          <div className="absolute left-[13px] sm:left-[17px] top-2 bottom-2 w-[1.5px] bg-white/5" />

                          {trackingInfo.steps.map((step, idx) => {
                            const isCompleted = step.status === 'completed';
                            const isCurrent = step.status === 'current';
                            const isUpcoming = step.status === 'upcoming';

                            return (
                              <motion.div 
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6 group"
                              >
                                {/* Stepper Icon Point Indicator */}
                                <div className="absolute -left-[20px] sm:-left-[24px] top-1 z-10 flex items-center justify-center">
                                  {isCompleted && (
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500 flex items-center justify-center text-black border-2 border-black transition-transform duration-300 group-hover:scale-110">
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                    </div>
                                  )}
                                  {isCurrent && (
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-black flex items-center justify-center border-2 border-emerald-500 relative">
                                      <span className="absolute inset-0.5 rounded-full bg-emerald-500 animate-pulse" />
                                      <span className="absolute -inset-1.5 rounded-full border border-emerald-500/30 animate-ping duration-1000" />
                                    </div>
                                  )}
                                  {isUpcoming && (
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-neutral-900 flex items-center justify-center border border-white/20 text-gray-600">
                                      <Clock className="w-3 h-3" />
                                    </div>
                                  )}
                                </div>

                                {/* Detail of Node step */}
                                <div className="flex-1">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                    <h4 className={`text-base font-serif font-bold ${
                                      isCompleted ? 'text-white' : isCurrent ? 'text-emerald-300' : 'text-gray-500'
                                    }`}>
                                      {step.title}
                                    </h4>
                                    <span className="font-mono text-[10px] text-gray-500 shrink-0">
                                      {step.time}
                                    </span>
                                  </div>

                                  <p className="text-xs text-gray-400 mt-1 font-light leading-relaxed max-w-xl">
                                    {step.description}
                                  </p>

                                  {step.location && (
                                    <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                                      <MapPin className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                                      <span className="font-light">{step.location}</span>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>

                        <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-4 items-center justify-between">
                          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center gap-2">
                            <Compass className="w-4 h-4 text-emerald-300" /> Questions about shipment? Contact our 24/7 Curator Helpline
                          </p>
                          <Button variant="link" className="text-emerald-300 uppercase tracking-widest text-[10px] font-bold hover:text-white p-0">
                            Request Curator Call &rarr;
                          </Button>
                        </div>
                      </motion.section>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {activeTab === 'history' && (
                <motion.div
                  key="history-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
                  {/* Order History Section */}
                  <section className="bg-luxury-dark/40 backdrop-blur-md rounded-[40px] p-8 sm:p-10 border border-white/5 space-y-8">
                    <div className="flex justify-between items-end pb-4 border-b border-white/5">
                      <div>
                        <span className="text-emerald-300 uppercase tracking-[0.2em] font-bold text-[10px] block mb-1">Archived Reservations</span>
                        <h3 className="text-2xl font-serif text-white font-bold tracking-tight">Order History</h3>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-[10px] uppercase tracking-widest font-mono">
                        <History className="w-4 h-4 text-emerald-300" /> {MOCK_PAST_ORDERS.length} Archives
                      </div>
                    </div>

                    <div className="space-y-4">
                      {MOCK_PAST_ORDERS.map((pastOrder) => {
                        const isCurrentTracked = selectedOrderTracking === pastOrder.id;
                        return (
                          <div 
                            key={pastOrder.id}
                            onClick={() => {
                              setSelectedOrderTracking(pastOrder.id);
                              setActiveTab('tracking');
                              setTimeout(() => {
                                document.getElementById('tracking-section')?.scrollIntoView({ behavior: 'smooth' });
                              }, 100);
                            }}
                            className={`cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-[24px] border transition-all duration-300 gap-4 ${
                              isCurrentTracked 
                                ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_4px_30px_rgba(16,185,129,0.12)]' 
                                : 'border-white/5 bg-black/40 hover:border-emerald-400/30'
                            }`}
                          >
                            <div className="flex items-center gap-5">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                                isCurrentTracked ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/5 text-gray-400'
                              }`}>
                                <History className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2.5">
                                  <span className="text-xs uppercase font-mono tracking-wider text-gray-400">#{pastOrder.id}</span>
                                  <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 uppercase tracking-widest">
                                    {pastOrder.status}
                                  </span>
                                </div>
                                <h4 className="text-sm font-sans font-medium text-white mt-1">{pastOrder.items}</h4>
                                <p className="text-xs text-gray-500 font-light mt-0.5">Completed on {new Date(pastOrder.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0">
                              <div className="sm:text-right">
                                <span className="text-[10px] uppercase tracking-widest text-gray-500 block">Total Investment</span>
                                <span className="text-base font-serif font-semibold text-emerald-300 mt-0.5 block">{formatCurrency(pastOrder.price)}</span>
                              </div>
                              <Button 
                                variant={isCurrentTracked ? 'default' : 'outline'}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedOrderTracking(pastOrder.id);
                                  setActiveTab('tracking');
                                  setTimeout(() => {
                                    document.getElementById('tracking-section')?.scrollIntoView({ behavior: 'smooth' });
                                  }, 100);
                                }}
                                className={`rounded-xl px-4 h-9 uppercase tracking-widest text-[9px] font-bold transition-all ${
                                  isCurrentTracked 
                                    ? 'bg-emerald-500 text-black hover:bg-white' 
                                    : 'border-white/10 hover:bg-white/5 hover:border-white text-white'
                                }`}
                              >
                                View Steps
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </motion.div>
              )}

              {activeTab === 'rewards' && (
                <motion.div
                  key="rewards-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-12"
                >
                  {/* Loyalty / Rewards section */}
                  <section className="space-y-8">
                    <div className="bg-luxury-dark/40 backdrop-blur-md rounded-[40px] p-8 sm:p-10 border border-white/5 relative overflow-hidden">
                      {/* Visual back glow */}
                      <div className={`absolute -right-24 -top-24 w-60 h-60 rounded-full bg-gradient-to-tr ${rewardsTier.color} opacity-10 blur-3xl pointer-events-none`} />
                      
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8 pb-8 border-b border-white/5 relative z-10">
                        <div>
                          <span className="text-emerald-300 uppercase tracking-[0.2em] font-black text-[10px] block mb-2">Hossana Rewards Program</span>
                          <h3 className="text-3xl font-serif font-bold text-white tracking-tight flex items-center gap-3">
                            <Award className="w-8 h-8 text-emerald-300 animate-pulse shrink-0" />
                            Atelier Collector Circle
                          </h3>
                          <p className="text-xs text-gray-400 mt-1.5 font-light">
                            Collect points with every bespoke purchase to unlock curated discounts and priority curator access tiers.
                          </p>
                        </div>

                        <div className="bg-[#0e0f11]/80 border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center text-center min-w-[200px]">
                          <span className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 font-bold">Points Balance</span>
                          <span className="text-4.5xl font-serif font-black text-amber-400 font-mono tracking-tight">{pointsBalance}</span>
                          <div className={`mt-2.5 px-3 py-1 rounded-full bg-gradient-to-r ${rewardsTier.color} border text-[9px] uppercase tracking-widest font-black flex items-center gap-1.5`}>
                            <Sparkles className="w-2.5 h-2.5" />
                            {rewardsTier.name} ({rewardsTier.multiplier}x)
                          </div>
                        </div>
                      </div>

                      {/* Tier progress indicators */}
                      {rewardsTier.nextTierPoints > 0 ? (
                        <div className="mb-10 bg-black/30 border border-white/5 rounded-2xl p-4 text-xs font-light tracking-wide text-gray-300 relative z-10">
                          <div className="flex justify-between mb-2">
                            <span>Progression to Next Status Tier</span>
                            <strong className="text-emerald-300 font-bold">{rewardsTier.nextTierPoints} Pts to upgrade</strong>
                          </div>
                          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-amber-400 h-full rounded-full transition-all duration-1000" 
                              style={{ width: `${Math.min(100, Math.max(10, (1 - (rewardsTier.nextTierPoints / 1500)) * 100))}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="mb-10 bg-[#c71f2c]/10 border border-[#c71f2c]/20 rounded-2xl p-4 text-xs font-light text-red-300 relative z-10 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-red-400 shrink-0" />
                          <span>You have attained the absolute ultimate status tier: <strong>Atelier Sovereign</strong>. You receive double points on resources and early access invitations.</span>
                        </div>
                      )}

                      {/* Dynamic redeem catalog list */}
                      <div className="relative z-10 space-y-6">
                        <div>
                          <h4 className="text-sm font-serif font-bold text-white mb-2 uppercase tracking-wider flex items-center gap-2">
                            <Ticket className="w-4 h-4 text-emerald-300" />
                            Redeem Points for Curatorial Discounts
                          </h4>
                          <p className="text-xs text-gray-500 font-light mb-4">
                            Transform your collected loyalty points balance into immediate checkout discount credits.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                          {[
                            { val: 20, cost: 200, title: "Lighthouse Voucher" },
                            { val: 50, cost: 500, title: "Artisan Voucher" },
                            { val: 100, cost: 1000, title: "Atelier Premium Credit" },
                            { val: 250, cost: 2000, title: "Grand Maestro Statement Credit" }
                          ].map((opt) => {
                            const progressPct = Math.min(100, (pointsBalance / opt.cost) * 100);
                            const isAffordable = pointsBalance >= opt.cost;

                            return (
                              <div 
                                key={opt.cost} 
                                className={`rounded-2xl p-5 border flex flex-col justify-between gap-4 transition-all ${
                                  isAffordable 
                                    ? 'bg-black/30 border-amber-400/30 hover:border-amber-400/80 hover:shadow-lg' 
                                    : 'bg-white/[0.01] border-white/5 opacity-70'
                                }`}
                              >
                                <div>
                                  <span className="text-[10px] uppercase tracking-widest text-gray-500 block font-bold mb-1">{opt.title}</span>
                                  <h5 className="text-xl font-serif font-black text-white">${opt.val} Discount</h5>
                                  <span className="text-[10px] text-amber-300 font-mono font-bold mt-1.5 block">{opt.cost} Points required</span>
                                </div>

                                <div className="space-y-3.5">
                                  {!isAffordable && (
                                    <div className="space-y-1">
                                      <div className="flex justify-between text-[9px] text-gray-500">
                                        <span>Progress</span>
                                        <span>{pointsBalance}/{opt.cost} ({Math.round(progressPct)}%)</span>
                                      </div>
                                      <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                        <div className="bg-amber-400/40 h-full rounded-full" style={{ width: `${progressPct}%` }} />
                                      </div>
                                    </div>
                                  )}

                                  <Button
                                    disabled={!isAffordable}
                                    onClick={() => redeemVoucher(opt.cost, opt.val)}
                                    className={`w-full py-1.5 h-8.5 rounded-xl uppercase tracking-widest text-[9px] font-black transition-all ${
                                      isAffordable 
                                        ? 'bg-amber-400 text-black hover:bg-white hover:scale-[1.02] cursor-pointer' 
                                        : 'bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed'
                                    }`}
                                  >
                                    Redeem Voucher
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* My Active Vouchers Display */}
                      {vouchers.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-white/5 relative z-10 space-y-4">
                          <div className="flex items-center gap-2">
                            <Gift className="w-4 h-4 text-emerald-500" />
                            <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wider">Your Active Unlocked Vouchers</h4>
                          </div>
                          <p className="text-xs text-gray-400 font-light">Copy these codes to copy-paste during checkout to adjust your invoice totals:</p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {vouchers.map((v) => (
                              <div 
                                key={v.code} 
                                className="bg-[#0c0d10] border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-[0_4px_12px_rgba(16,185,129,0.03)]"
                              >
                                <div className="space-y-1">
                                  <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-extrabold flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Active ${v.value} Off
                                  </span>
                                  <span className="font-mono text-xs text-white uppercase font-bold select-all">{v.code}</span>
                                </div>
                                
                                <Button
                                  onClick={() => handleCopyCode(v.code)}
                                  variant="outline"
                                  className="h-8 rounded-xl px-3 border-white/10 hover:border-emerald-500 text-[10px] uppercase font-black font-sans tracking-widest hover:bg-emerald-950/20 text-white cursor-pointer flex items-center gap-1.5"
                                >
                                  {copiedCode === v.code ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                                      Copied!
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3 text-gray-400" />
                                      Copy Code
                                    </>
                                  )}
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Point transaction history ledger */}
                    <div className="bg-luxury-dark/40 backdrop-blur-md rounded-[40px] p-8 sm:p-10 border border-white/5 space-y-6">
                      <div>
                        <h4 className="text-lg font-serif font-bold text-white tracking-tight flex items-center gap-2">
                          <Coins className="w-5 h-5 text-emerald-300" />
                          Points Ledger & Activity Log
                        </h4>
                        <p className="text-xs text-gray-500 font-light mt-1">Review the historical earning and redemption entries in your VIP portfolio.</p>
                      </div>

                      <div className="space-y-3 max-h-[250px] overflow-auto pr-2 custom-scrollbar">
                        {pointsHistory.map((tx) => (
                          <div 
                            key={tx.id} 
                            className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-2xl text-xs"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                tx.type === 'earn' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#c71f2c]/10 text-[#c71f2c]'
                              }`}>
                                <Coins className="w-4 h-4 text-emerald-300" />
                              </div>
                              <div>
                                <p className="font-medium text-white">{tx.description}</p>
                                <span className="text-[10px] text-gray-500 font-light">{tx.date}</span>
                              </div>
                            </div>
                            
                            <span className={`font-mono font-bold tracking-tight text-right ${
                              tx.type === 'earn' ? 'text-amber-400' : 'text-[#c71f2c]'
                            }`}>
                              {tx.type === 'earn' ? '+' : '-'}{tx.amount} Pts
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
