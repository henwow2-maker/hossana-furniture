import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Compass, 
  ArrowRight, 
  AlertCircle,
  Copy,
  Check,
  Package,
  Calendar,
  Thermometer,
  Droplets,
  Radio
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import TrackingMap from '../components/TrackingMap';
import { toast } from 'sonner';

// Replicating the tracking step structure from Profile so it works beautifully and stand-alone
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
  status: string;
  pieces: number;
  totalInvestment: number;
  steps: TrackingStep[];
}

const ORDER_TRACKING_DB: Record<string, TrackingDetails> = {
  'demo-order-001': {
    carrier: 'Hossana Ethiopian Imperial Logistics',
    trackingNo: 'HOS-AQ-AB8RN',
    estimatedDelivery: 'June 12, 2026 at 2:00 PM',
    service: 'Sovereign Armored Escort & White-Glove Installation',
    status: 'In Transit',
    pieces: 4,
    totalInvestment: 24500,
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
    status: 'In Transit',
    pieces: 4,
    totalInvestment: 24500,
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
  'YYTYTWYTWY': {
    carrier: 'Atelier Sovereign Air Cargo',
    trackingNo: 'HOS-YYTY-XWY',
    estimatedDelivery: 'June 18, 2026 at 3:30 PM',
    service: 'Sovereign Secured Armored Fine Art Air Service',
    status: 'In Transit',
    pieces: 3,
    totalInvestment: 14500,
    steps: [
      { 
        title: 'Order Confirmed', 
        description: 'Bespoke design commission verified and registered by lead studio curator.', 
        time: 'June 10, 2026 • 09:15 AM', 
        location: 'Hossana Milan Atelier', 
        status: 'completed' 
      },
      { 
        title: 'Provenance & Artistry Signed', 
        description: 'Master artisan physical stamp of authenticity sealed with protective holograms.', 
        time: 'June 11, 2026 • 11:30 AM', 
        location: 'Atelier Fine Art Certification Lab', 
        status: 'completed' 
      },
      { 
        title: 'Dispatched to Airport Hub', 
        description: 'Transferred by climate-controlled armored courier escort line with constant satellite safety uplink.', 
        time: 'June 12, 2026 • 08:00 AM', 
        location: 'West European Cargo Hub', 
        status: 'completed' 
      },
      { 
        title: 'Flight Transit Active - Skies Secure', 
        description: 'Handed over for high-altitude air carriage. Dynamic climate metrics and active escape protocols logged.', 
        time: 'June 13, 2026 • 11:45 AM', 
        location: 'Alpine Airspace Flight HOS-99', 
        status: 'current' 
      },
      { 
        title: 'Premium Handover', 
        description: 'Arrival, custom customs classification, and final white-glove setup at your private estate.', 
        time: 'Estimated June 18, 2026', 
        location: 'Your Primary Residence', 
        status: 'upcoming' 
      }
    ]
  },
  'ORD-7721': {
    carrier: 'Hossana Luxury Freight',
    trackingNo: 'HOS-7721-X9A',
    estimatedDelivery: 'June 15, 2026 at 5:00 PM',
    service: 'White-Glove Courier & In-Home Assembly',
    status: 'In Transit',
    pieces: 2,
    totalInvestment: 2400,
    steps: [
      { 
        title: 'Order Confirmed', 
        description: 'Your premium reservation is secured and payment verified.', 
        time: 'June 10, 2026 • 10:30 AM', 
        location: 'Hossana Milan Atelier', 
        status: 'completed' 
      },
      { 
        title: 'Curatorial Verification', 
        description: 'Certified authentic. Specially vacuum-sealed with hologram seals of provenance.', 
        time: 'June 11, 2026 • 02:15 PM', 
        location: 'Quality & Provenance Lab', 
        status: 'completed' 
      },
      { 
        title: 'Dispatched in Protective Escrow', 
        description: 'Loaded onto temperature-controlled climate carrier for specialized fine art transport.', 
        time: 'June 12, 2026 • 09:00 AM', 
        location: 'West European Cargo Hub', 
        status: 'completed' 
      },
      { 
        title: 'In Regional Transit', 
        description: 'Undergoing local custom logistics classification. Monitored security escort active.', 
        time: 'June 13, 2026 • 04:30 PM', 
        location: 'Munich Airport Fine Art Flight 412', 
        status: 'current' 
      },
      { 
        title: 'Delivered & Curated In-Situ', 
        description: 'Concluded personal courier arrival, placement, and unboxing at your private gallery.', 
        time: 'Estimated June 15, 2026', 
        location: 'Your Primary Residence', 
        status: 'upcoming' 
      },
    ]
  },
  'ORD-6542': {
    carrier: 'Specialized Direct Transit',
    trackingNo: 'HOS-6542-C11',
    estimatedDelivery: 'Delivered June 05, 2026',
    service: 'Signature Concierge White-Glove delivery',
    status: 'Delivered',
    pieces: 1,
    totalInvestment: 1200,
    steps: [
      { 
        title: 'Order Confirmed', 
        description: 'Payment verified and bespoke frame packing requested.', 
        time: 'June 03, 2026 • 08:30 AM', 
        location: 'Hossana Venice Atelier', 
        status: 'completed' 
      },
      { 
        title: 'Art Director Approval', 
        description: 'Hand-signed by lead collection curator.', 
        time: 'June 03, 2026 • 11:20 AM', 
        location: 'Hossana Venice Atelier', 
        status: 'completed' 
      },
      { 
        title: 'Signature Dispatch', 
        description: 'Personally handed over to elite private carrier.', 
        time: 'June 04, 2026 • 10:00 AM', 
        location: 'Veneto Transit Node', 
        status: 'completed' 
      },
      { 
        title: 'Delivered & Signed', 
        description: 'Arrived intact and hand-signed by recipient at main residence entrance.', 
        time: 'June 05, 2026 • 01:15 PM', 
        location: 'Private Residence, Rome', 
        status: 'completed' 
      },
    ]
  },
  'ORD-5291': {
    carrier: 'Hossana Heavy Freight',
    trackingNo: 'HOS-5291-Y7B',
    estimatedDelivery: 'Delivered May 12, 2026',
    service: 'Specialized Direct Transit & In-Home Placement',
    status: 'Delivered',
    pieces: 1,
    totalInvestment: 4200,
    steps: [
      { 
        title: 'Order Confirmed', 
        description: 'Payment verified and bespoke packing requested.', 
        time: 'May 08, 2026 • 09:15 AM', 
        location: 'Hossana Milan Atelier', 
        status: 'completed' 
      },
      { 
        title: 'Atelier Inspection & Certification', 
        description: 'Handchecked and signed by the master stonemason.', 
        time: 'May 09, 2026 • 11:00 AM', 
        location: 'Carrara Marble Studio', 
        status: 'completed' 
      },
      { 
        title: 'Direct Elite Shipping Dispatch', 
        description: 'Loaded onto specialized heavy-lift fine art carrier.', 
        time: 'May 10, 2026 • 08:30 AM', 
        location: 'Milan North Depot', 
        status: 'completed' 
      },
      { 
        title: 'Delivered & Installed', 
        description: 'Delivered, unboxed, and installed on-premise at your primary residence.', 
        time: 'May 12, 2026 • 03:45 PM', 
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
    status: 'Delivered',
    pieces: 1,
    totalInvestment: 1850,
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
    status: 'Delivered',
    pieces: 1,
    totalInvestment: 9800,
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

export default function OrderTracking() {
  const location = useLocation();
  const [orderQuery, setOrderQuery] = useState('');
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [copiedTrackingNo, setCopiedTrackingNo] = useState(false);

  // Parse order ID from URL query parameters (e.g. /order-tracking?id=ORD-7721)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idParam = params.get('id') || params.get('track');
    if (idParam) {
      const sanitizedId = idParam.trim().toUpperCase();
      setOrderQuery(sanitizedId);
      if (ORDER_TRACKING_DB[sanitizedId]) {
        setActiveOrderId(sanitizedId);
        setHasSearched(true);
        setErrorText(null);
      } else {
        setHasSearched(true);
        setActiveOrderId(null);
        setErrorText(`Order ID "${idParam}" could not be verified in our premium roster.`);
      }
    }
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = orderQuery.trim().toUpperCase();
    
    if (!cleanId) {
      toast.error('Please enter an Order ID.');
      return;
    }

    setHasSearched(true);
    if (ORDER_TRACKING_DB[cleanId]) {
      setActiveOrderId(cleanId);
      setErrorText(null);
      toast.success(`Securely loaded active delivery status for order ${cleanId}`);
    } else {
      setActiveOrderId(null);
      setErrorText(`We could not find an active luxury delivery mapping for "${cleanId}".`);
      toast.error(`Invalid Order ID code.`);
    }
  };

  const handleQuickSelect = (id: string) => {
    setOrderQuery(id);
    setActiveOrderId(id);
    setHasSearched(true);
    setErrorText(null);
    toast.success(`Loaded active delivery status for order ${id}`);
  };

  const handleCopyTracking = (no: string) => {
    navigator.clipboard.writeText(no);
    setCopiedTrackingNo(true);
    toast.success('Tracking registration key copied.');
    setTimeout(() => setCopiedTrackingNo(false), 2000);
  };

  const activeTracking = activeOrderId ? ORDER_TRACKING_DB[activeOrderId] : null;

  return (
    <div className="pt-32 min-h-screen bg-white pb-24 text-black">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Page Title */}
        <div className="mb-12 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#c71f2c] uppercase tracking-[0.3em] text-xs font-black mb-4 block">Fulfillment Operations</span>
            <h1 className="text-4xl md:text-5xl font-serif font-black text-black uppercase tracking-tight">Order Escrow Tracking</h1>
            <p className="text-slate-600 mt-3 font-medium text-base max-w-2xl">
              Track your authentic handcrafted masterpieces via real-time climate monitors and secured transit links.
            </p>
          </motion.div>
        </div>

        {/* Search Widget */}
        <div className="max-w-2xl mx-auto md:mx-0 mb-12">
          <Card className="p-6 bg-slate-50 border-slate-200 rounded-3xl shadow-sm">
            <h3 className="text-sm uppercase tracking-widest text-[#c71f2c] font-black mb-4 flex items-center gap-2">
              <Search className="w-4 h-4" /> Transit Intelligence Access
            </h3>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <Input 
                type="text"
                required
                placeholder="Enter order reference (e.g. ORD-7721)"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                className="bg-white border-slate-200 text-black h-14 rounded-2xl font-semibold placeholder:text-slate-400 focus-visible:border-[#c71f2c] focus-visible:ring-0 w-full"
              />
              <Button 
                type="submit"
                className="bg-[#c71f2c] hover:bg-slate-800 text-white font-bold h-14 rounded-2xl px-8 uppercase tracking-widest text-xs shrink-0 transition-colors border-none"
              >
                Query Tracker
              </Button>
            </form>

            {/* Quick-test simulations indicator */}
            <div className="mt-5 pt-4 border-t border-slate-200 flex flex-wrap gap-2 items-center">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mr-2">Click to Simulate:</span>
              {Object.keys(ORDER_TRACKING_DB)
                .filter((id) => id !== 'demo-order-002')
                .map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleQuickSelect(id)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all ${
                      activeOrderId === id || (id === 'demo-order-001' && activeOrderId === 'demo-order-002')
                        ? 'bg-[#c71f2c] text-white shadow-sm'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {id.length > 15 ? `${id.substring(0, 10)}...` : id}
                  </button>
                ))}
            </div>
          </Card>
        </div>

        {/* Error or Search Prompt */}
        <AnimatePresence mode="wait">
          {errorText && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mb-12"
            >
              <Card className="bg-red-50 border border-red-100 p-8 rounded-3xl flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-red-900 font-black uppercase text-xs tracking-wider mb-2">Unrecognized Escrow Code</h4>
                  <p className="text-red-700 text-sm font-medium leading-relaxed">
                    {errorText} If you recently created this order, please wait up to 10 minutes for your curatorial verification numbers to compile on our radar terminals. Alternatively, try running one of our active simulation orders above.
                  </p>
                </div>
              </Card>
            </motion.div>
          )}

          {!hasSearched && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 border-2 border-dashed border-slate-200 rounded-[40px] bg-slate-50"
            >
              <Package className="w-12 h-12 text-[#c71f2c]/50 mx-auto mb-4" />
              <h3 className="text-xl font-serif text-slate-800 font-black italic mb-2">Awaiting Cargo Identity</h3>
              <p className="text-slate-500 text-sm font-medium max-w-sm mx-auto">
                Please insert your authenticated order ID code above to establish an encrypted satellite escrow communication link.
              </p>
            </motion.div>
          )}

          {activeTracking && activeOrderId && (
            <motion.div
              key={activeOrderId}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              
              {/* Tracking Information Display */}
              <div className="bg-slate-50 border border-slate-200 rounded-[40px] p-8 sm:p-10 relative overflow-hidden shadow-sm">
                
                {/* Visual Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-slate-200 mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#c71f2c] uppercase tracking-[0.2em] text-[10px] font-black">Real-time Fulfillment Pipeline</span>
                      <span className={`inline-flex w-2.5 h-2.5 rounded-full ${activeTracking.status === 'Delivered' ? 'bg-emerald-500' : 'bg-[#c71f2c] animate-pulse'}`} />
                    </div>
                    <h3 className="text-2xl font-serif font-black text-black uppercase tracking-tight">Status: {activeTracking.status} ({activeOrderId})</h3>
                    <p className="text-xs text-slate-500 mt-1 font-semibold uppercase tracking-wider">{activeTracking.service}</p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col min-w-[200px]">
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-black">Expected Placement</span>
                    <span className="text-sm font-serif font-black text-[#c71f2c]">{activeTracking.estimatedDelivery}</span>
                  </div>
                </div>

                {/* Sub Stats Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 bg-white border border-slate-200 rounded-[24px] p-6 text-sm shadow-sm">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 block mb-1 font-black">Escort carrier partner</span>
                    <span className="text-black font-black flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#c71f2c] shrink-0" />
                      {activeTracking.carrier}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 block mb-1 font-black">Secure registration key</span>
                    <div className="flex items-center gap-2">
                      <span className="text-black font-mono text-xs font-bold">{activeTracking.trackingNo}</span>
                      <button 
                        onClick={() => handleCopyTracking(activeTracking.trackingNo)}
                        className="hover:text-[#c71f2c] text-slate-400 transition-colors outline-none"
                        title="Copy tracking key"
                      >
                        {copiedTrackingNo ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 block mb-1 font-black">Safety escrow guarantee</span>
                    <span className="text-black font-black flex items-center gap-1.5 text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      Fully Bonded fine art transport
                    </span>
                  </div>
                </div>

                {/* Interactive Map Component */}
                <div className="mb-12">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-widest text-[#c71f2c] font-black inline-flex items-center gap-1.5 bg-[#c71f2c]/5 px-3 py-1 rounded-full border border-[#c71f2c]/10">
                      <Radio className="w-3 h-3 text-[#c71f2c] animate-pulse" /> Live Escorted Vector Terminal
                    </span>
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono">D3 Framework Rendering</span>
                  </div>
                  <TrackingMap orderId={activeOrderId} />
                </div>

                {/* Vertical Stepper timeline */}
                <div className="relative pl-6 sm:pl-8 space-y-10 border-t border-slate-200 pt-10">
                  <h4 className="text-lg font-serif font-black text-black uppercase tracking-tight mb-6">Fulfillment milestones history</h4>
                  
                  {/* Stepper Vertical Connecting Line */}
                  <div className="absolute left-[13px] sm:left-[17px] top-[102px] bottom-10 w-[2px] bg-slate-200" />

                  {activeTracking.steps.map((step, idx) => {
                    const isCompleted = step.status === 'completed';
                    const isCurrent = step.status === 'current';
                    const isUpcoming = step.status === 'upcoming';

                    return (
                      <motion.div 
                        key={idx}
                        className="relative flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6 group"
                      >
                        {/* Stepper Checkpoint Dot Icon */}
                        <div className="absolute -left-[20px] sm:-left-[24px] top-1 z-10 flex items-center justify-center">
                          {isCompleted && (
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#c71f2c] flex items-center justify-center text-white border-2 border-white transition-all">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                          )}
                          {isCurrent && (
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white flex items-center justify-center border-2 border-[#c71f2c] relative">
                              <span className="absolute inset-0.5 rounded-full bg-[#c71f2c] animate-pulse" />
                              <span className="absolute -inset-1.5 rounded-full border border-[#c71f2c]/30 animate-ping duration-1000" />
                            </div>
                          )}
                          {isUpcoming && (
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-50 flex items-center justify-center border border-slate-300 text-slate-400">
                              <Clock className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>

                        {/* Node details */}
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <h4 className={`text-base font-serif font-black ${
                              isCompleted ? 'text-black' : isCurrent ? 'text-[#c71f2c]' : 'text-slate-400'
                            }`}>
                              {step.title}
                            </h4>
                            <span className="font-mono text-[10px] text-slate-400 shrink-0 font-bold">
                              {step.time}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 mt-1 font-semibold leading-relaxed max-w-xl">
                            {step.description}
                          </p>

                          {step.location && (
                            <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 font-bold">
                              <MapPin className="w-3.5 h-3.5 text-[#c71f2c] shrink-0" />
                              <span>{step.location}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Support footer */}
                <div className="mt-12 pt-8 border-t border-slate-200 flex flex-wrap gap-4 items-center justify-between">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#c71f2c]" /> Questions about curation transit? Our Concierge Desk is live 24/7.
                  </p>
                  <Button variant="link" className="text-[#c71f2c] uppercase tracking-widest text-[10px] font-black hover:text-slate-800 p-0 border-none">
                    Request Call with Curator &rarr;
                  </Button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
