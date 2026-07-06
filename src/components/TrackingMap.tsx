import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Navigation, 
  Compass, 
  MapPin, 
  Maximize2, 
  Minus, 
  Plus, 
  RotateCcw, 
  ShieldCheck, 
  Thermometer, 
  Wind, 
  Droplets,
  Radio,
  Eye,
  Activity,
  Share2,
  Check
} from 'lucide-react';

interface TrackingMapProps {
  orderId: string;
}

interface MapNode {
  name: string;
  description: string;
  lat: number;
  lng: number;
  x: number; // SVG mapping coordinates (0-800)
  y: number; // SVG mapping coordinates (0-500)
  status: 'completed' | 'current' | 'upcoming';
  detailedTelemetry?: {
    temp: string;
    humidity: string;
    pressure: string;
    securityBadge: string;
    statusText: string;
  };
}

// D3 Status Progress Chart Component
import * as d3 from 'd3';

interface StatusProgressChartProps {
  completed: number;
  total: number;
}

function StatusProgressChart({ completed, total }: StatusProgressChartProps) {
  const d3Container = React.useRef<SVGSVGElement | null>(null);
  const percentage = Math.round((completed / total) * 100);

  React.useEffect(() => {
    if (!d3Container.current) return;

    // Clear previous drawing
    d3.select(d3Container.current).selectAll("*").remove();

    const width = 140;
    const height = 140;
    const thickness = 8;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(d3Container.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Create background arc
    const arcBg = d3.arc()
      .innerRadius(radius - thickness)
      .outerRadius(radius)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    svg.append('path')
      .attr('d', arcBg as any)
      .attr('fill', 'rgba(255, 255, 255, 0.05)');

    // Create colored progress arc
    const arcFg = d3.arc()
      .innerRadius(radius - thickness)
      .outerRadius(radius)
      .startAngle(0)
      .cornerRadius(4);

    const endAngle = (percentage / 100) * 2 * Math.PI;

    // Transition animation
    svg.append('path')
      .datum({ endAngle: 0 })
      .attr('fill', '#D4AF37') // Luxury gold color
      .transition()
      .duration(1200)
      .ease(d3.easeQuadOut)
      .attrTween('d', function(d: any) {
        const interpolate = d3.interpolate(d.endAngle, endAngle);
        return function(t) {
          d.endAngle = interpolate(t);
          return arcFg(d) as string;
        };
      });

    // Add nested percentage text
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-4px')
      .attr('fill', '#ffffff')
      .attr('font-size', '20px')
      .attr('font-family', 'serif')
      .attr('font-weight', 'bold')
      .text(`${percentage}%`);

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '15px')
      .attr('fill', '#a1a1aa') // text-zinc-400
      .attr('font-size', '8px')
      .attr('font-family', 'sans-serif')
      .attr('letter-spacing', '0.1em')
      .attr('font-weight', 'bold')
      .text('COMPLETE');

    // Add subtle nodes completion count text
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '30px')
      .attr('fill', '#D4AF37') // Gold
      .attr('font-size', '8px')
      .attr('font-family', 'monospace')
      .text(`${completed} / ${total} Nodes`);

  }, [completed, total, percentage]);

  return (
    <div className="flex items-center justify-center bg-black/40 border border-white/5 py-4 rounded-3xl relative overflow-hidden">
      {/* Decorative pulse blur glow behind D3 SVG */}
      <div className="absolute inset-0 bg-radial-gradient from-gold/5 via-transparent to-transparent opacity-50 pointer-events-none" />
      <svg ref={d3Container} className="relative z-10" />
    </div>
  );
}

export default function TrackingMap({ orderId }: TrackingMapProps) {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
  const [viewMode, setViewMode] = useState<'standard' | 'telemetry' | 'scout'>('telemetry');
  const [isShared, setIsShared] = useState(false);

  // Define realistic tracking routes for each order mapped on a custom coordinate space.
  const routeData = useMemo(() => {
    if (orderId === 'demo-order-001' || orderId === 'demo-order-002') {
      return {
        title: "Vanguard Trans-Abyssinian Imperial Link",
        startLabel: "Gullele Master Ateliers",
        endLabel: "Sovereign Palace Estate",
        zoomDefault: 1.25,
        panDefault: { x: -30, y: -20 },
        nodes: [
          {
            name: "Hossana Gullele Master Studio",
            description: "Solid premium Wanza hardwood logged, seasoned and handchecked in highlands.",
            lat: 9.0734, lng: 38.7118,
            x: 210, y: 150,
            status: "completed",
            detailedTelemetry: {
              temp: "19.5°C",
              humidity: "45%",
              pressure: "1015 hPa",
              securityBadge: "Artisan Selection Secured",
              statusText: "Timber Humidity Calibrated 11.2%"
            }
          },
          {
            name: "Bole Design & Fine Art Hub",
            description: "Signature gold branding and certified structural lacquer application completed.",
            lat: 9.0028, lng: 38.7864,
            x: 390, y: 220,
            status: "completed",
            detailedTelemetry: {
              temp: "21.0°C",
              humidity: "41%",
              pressure: "1012 hPa",
              securityBadge: "Sovereign Mark Stamped",
              statusText: "Passed 40-Point QC Check"
            }
          },
          {
            name: "Addis Ababa Sky-Transit Lounge",
            description: "Secured loading on elite humectant-locked private courier vehicle.",
            lat: 9.0228, lng: 38.7464,
            x: 520, y: 310,
            status: "current",
            detailedTelemetry: {
              temp: "20.5°C",
              humidity: "42%",
              pressure: "1014 hPa (Pressurized Escrow)",
              securityBadge: "Active GPS Beacon Up",
              statusText: "Armored Vehicle Moving Smoothly"
            }
          },
          {
            name: "Imperial Palace Estate",
            description: "Personal white-glove arrival, custom room-by-room positioning, and registration.",
            lat: 9.0300, lng: 38.7600,
            x: 650, y: 440,
            status: "upcoming",
            detailedTelemetry: {
              temp: "N/A",
              humidity: "N/A",
              pressure: "N/A",
              securityBadge: "VIP Escorted Protocol Set",
              statusText: "Awaiting Arrival - EST June 12"
            }
          }
        ] as MapNode[]
      };
    } else if (orderId === 'YYTYTWYTWY') {
      return {
        title: "Sovereign Trans-Alpine Sky Corridor",
        startLabel: "Milan Atelier",
        endLabel: "Sovereign Private Estate",
        zoomDefault: 1.15,
        panDefault: { x: -40, y: -30 },
        nodes: [
          { 
            name: 'Hossana Milan Atelier', 
            description: 'Bespoke design commission verified and registered by lead studio curator.', 
            lat: 45.4642, lng: 9.1900,
            x: 420, y: 390,
            status: 'completed',
            detailedTelemetry: {
              temp: "20.1°C", humidity: "42%", pressure: "1013 hPa",
              securityBadge: "Atelier Signature Approved", statusText: "Completed Selection Verification"
            }
          },
          { 
            name: 'Atelier Fine Art Certification Lab', 
            description: 'Master artisan physical stamp of authenticity sealed with protective holograms.', 
            lat: 47.5596, lng: 7.5886,
            x: 290, y: 280,
            status: 'completed',
            detailedTelemetry: {
              temp: "19.8°C", humidity: "40%", pressure: "1011 hPa",
              securityBadge: "Certified Authentic Piece", statusText: "Finished Fine Calibration scan"
            }
          },
          { 
            name: 'West European Cargo Hub', 
            description: 'Secured transfer to climate-controlled cargo aircraft. Sealed flight capsule deployed.', 
            lat: 48.5734, lng: 7.7521,
            x: 230, y: 200,
            status: 'completed',
            detailedTelemetry: {
              temp: "19.5°C", humidity: "45%", pressure: "1009 hPa",
              securityBadge: "Satellite Escrow Calibrated", statusText: "Handed over to Sovereign Carrier"
            }
          },
          { 
            name: 'Alpine Airspace Flight HOS-99', 
            description: 'Active satellite-guided high-altitude fine arts transportation routing. Realtime telemetry logs constant.', 
            lat: 46.5000, lng: 10.0000,
            x: 460, y: 170,
            status: 'current',
            detailedTelemetry: {
              temp: "-42.3°C External / +19.1°C Chamber", humidity: "43%", pressure: "1010 hPa (Pressurized Vault)",
              securityBadge: "Active Escorted Radar Beacon", statusText: "In Air Carriage - Stable Flight"
            }
          },
          { 
            name: 'Your Primary Residence', 
            description: 'Secure, temperature-regulated premium final placement with white-glove setup and registry log.', 
            lat: 48.1500, lng: 11.6000,
            x: 610, y: 130,
            status: 'upcoming',
            detailedTelemetry: {
              temp: "N/A", humidity: "N/A", pressure: "N/A",
              securityBadge: "Awaiting Arrival VIP Desk", statusText: "Landed Logistics Inbound Soon"
            }
          }
        ] as MapNode[]
      };
    } else if (orderId === 'ORD-7721') {
      return {
        title: "Trans-European Golden Route",
        startLabel: "Milan Atelier",
        endLabel: "Munich Residence",
        zoomDefault: 1.1,
        panDefault: { x: -30, y: -20 },
        nodes: [
          { 
            name: 'Hossana Milan Atelier', 
            description: 'Order packaging & secure vacuum packing with carbon reinforcement.', 
            lat: 45.4642, lng: 9.1900,
            x: 420, y: 390,
            status: 'completed',
            detailedTelemetry: {
              temp: "20.1°C", humidity: "42%", pressure: "1013 hPa",
              securityBadge: "Sealed (Atelier-Secure)", statusText: "Completed Packing"
            }
          },
          { 
            name: 'Quality & Provenance Lab', 
            description: 'Spectrometric artwork evaluation and high-precision physical logging.', 
            lat: 47.5596, lng: 7.5886,
            x: 290, y: 280,
            status: 'completed',
            detailedTelemetry: {
              temp: "19.8°C", humidity: "40%", pressure: "1011 hPa",
              securityBadge: "Certified Authentic", statusText: "Passed Lab Verification"
            }
          },
          { 
            name: 'West European Cargo Hub', 
            description: 'Consolidated protection transit node & bonded customs clearance escort.', 
            lat: 48.5734, lng: 7.7521,
            x: 230, y: 200,
            status: 'completed',
            detailedTelemetry: {
              temp: "19.5°C", humidity: "45%", pressure: "1009 hPa",
              securityBadge: "Customs Inspected", statusText: "Cargo Dispatch Certified"
            }
          },
          { 
            name: 'Munich Airport / Flight 412', 
            description: 'Regional logistic sorting center. Undergoing active escort by safe-vessel.', 
            lat: 48.1351, lng: 11.5820,
            x: 510, y: 230,
            status: 'current',
            detailedTelemetry: {
              temp: "19.2°C", humidity: "43%", pressure: "1008 hPa",
              securityBadge: "Escorted Active Transit", statusText: "Vessel En Route - Safe & Stable"
            }
          },
          { 
            name: 'Private Munich Residence', 
            description: 'Unboxing, certification handover, and in-situ positioning.', 
            lat: 48.1500, lng: 11.6000,
            x: 610, y: 150,
            status: 'upcoming',
            detailedTelemetry: {
              temp: "N/A", humidity: "N/A", pressure: "N/A",
              securityBadge: "Awaiting Client Reception", statusText: "En-Route ETA Tomorrow"
            }
          },
        ] as MapNode[]
      };
    } else if (orderId === 'ORD-5291') {
      return {
        title: "Carrara-Munich Stonemason Pass",
        startLabel: "Carrara Marble Studio",
        endLabel: "Primary Residence",
        zoomDefault: 1.2,
        panDefault: { x: -80, y: -40 },
        nodes: [
          { 
            name: 'Carrara Marble Studio', 
            description: 'Handchecked, signed, and packaged with structural shock-absorbing support.', 
            lat: 44.0793, lng: 10.0983,
            x: 390, y: 350,
            status: 'completed',
            detailedTelemetry: {
              temp: "18.5°C", humidity: "45%", pressure: "1015 hPa",
              securityBadge: "Stonemason Confirmed", statusText: "Passed Quality Control"
            }
          },
          { 
            name: 'Milan Depot', 
            description: 'Logistics verification and preparation for trans-alpine shipping.', 
            lat: 45.4642, lng: 9.1900,
            x: 420, y: 280,
            status: 'completed',
            detailedTelemetry: {
              temp: "19.0°C", humidity: "41%", pressure: "1013 hPa",
              securityBadge: "Approved Logistics Escort", statusText: "Dispatched to Destination"
            }
          },
          { 
            name: 'Your Primary Residence', 
            description: 'Unboxed, signed, and carefully positioned inside entry gallery.', 
            lat: 48.1351, lng: 11.5820,
            x: 520, y: 160,
            status: 'completed',
            detailedTelemetry: {
              temp: "21.0°C", humidity: "43%", pressure: "1012 hPa",
              securityBadge: "Signed & Installed", statusText: "Bespoke Fitting Completed"
            }
          },
        ] as MapNode[]
      };
    } else if (orderId === 'ORD-4102') {
      return {
        title: "Murano Glass Elite Transit",
        startLabel: "Murano Workshop",
        endLabel: "Private Residence Milan",
        zoomDefault: 1.3,
        panDefault: { x: -120, y: -80 },
        nodes: [
          { 
            name: 'Hossana Murano Workshop', 
            description: 'Artisanal glasswork packaged in custom dynamic double-walled cargo container.', 
            lat: 45.4578, lng: 12.3534,
            x: 500, y: 260,
            status: 'completed',
            detailedTelemetry: {
              temp: "22.3°C", humidity: "38%", pressure: "1016 hPa",
              securityBadge: "Masterpiece Verified", statusText: "Airtight Thermal Seal Active"
            }
          },
          { 
            name: 'Venice Airport Cargo Terminal', 
            description: 'Pre-flight security check and transport handover under courier care.', 
            lat: 45.5050, lng: 12.3519,
            x: 520, y: 200,
            status: 'completed',
            detailedTelemetry: {
              temp: "19.5°C", humidity: "42%", pressure: "1014 hPa",
              securityBadge: "Signature Escort Registered", statusText: "Dispatched High-Priority"
            }
          },
          { 
            name: 'Private Residence, Milan', 
            description: 'Arrived intact and hand-signed by recipient at residence entrance.', 
            lat: 45.4642, lng: 9.1900,
            x: 420, y: 220,
            status: 'completed',
            detailedTelemetry: {
              temp: "20.1°C", humidity: "43%", pressure: "1013 hPa",
              securityBadge: "Consignee Confirmed", statusText: "Hand-Delivered with Signature"
            }
          },
        ] as MapNode[]
      };
    } else if (orderId === 'ORD-3091') {
      return {
        title: "Verona Archival Escort",
        startLabel: "Hossana Curator Gallery",
        endLabel: "Secondary Residence",
        zoomDefault: 1.15,
        panDefault: { x: -60, y: -30 },
        nodes: [
          { 
            name: 'Hossana Curator Gallery', 
            description: 'Bespoke wood-crate packing, climate log set and security registration.', 
            lat: 45.4384, lng: 10.9916,
            x: 450, y: 310,
            status: 'completed',
            detailedTelemetry: {
              temp: "18.0°C", humidity: "42%", pressure: "1013 hPa",
              securityBadge: "Curator Signed Archive", statusText: "Hermetically Sealed"
            }
          },
          { 
            name: 'Rome Security Port', 
            description: 'Under transport under constant GPS tracking with armed transit unit.', 
            lat: 41.9028, lng: 12.4964,
            x: 490, y: 420,
            status: 'completed',
            detailedTelemetry: {
              temp: "19.1°C", humidity: "45%", pressure: "1012 hPa",
              securityBadge: "Armed Escort Logged", statusText: "Passed Transit Milestone"
            }
          },
          { 
            name: 'Your Secondary Residence', 
            description: 'Delivered directly to private vault under curator registrar supervision.', 
            lat: 43.7696, lng: 11.2558,
            x: 470, y: 360,
            status: 'completed',
            detailedTelemetry: {
              temp: "18.5°C", humidity: "40%", pressure: "1011 hPa",
              securityBadge: "Registrar Custody Confirmed", statusText: "Archived in Vault"
            }
          },
        ] as MapNode[]
      };
    } else {
      // ORD-6542
      return {
        title: "Veneto-Apennine Luxury Link",
        startLabel: "Venice Atelier",
        endLabel: "Rome Residence",
        zoomDefault: 1.25,
        panDefault: { x: -100, y: -70 },
        nodes: [
          { 
            name: 'Hossana Venice Atelier', 
            description: 'Artwork release approvals and curated client container custom packing.', 
            lat: 45.4408, lng: 12.3155,
            x: 480, y: 250,
            status: 'completed',
            detailedTelemetry: {
              temp: "19.0°C", humidity: "44%", pressure: "1014 hPa",
              securityBadge: "Atelier Signature Approved", statusText: "Verified by Lead Curator"
            }
          },
          { 
            name: 'Veneto Transit Node', 
            description: 'Physical security escort allocation and regional dispatch.', 
            lat: 44.4949, lng: 11.3426,
            x: 420, y: 320,
            status: 'completed',
            detailedTelemetry: {
              temp: "18.9°C", humidity: "41%", pressure: "1013 hPa",
              securityBadge: "Transport Escort Approved", statusText: "Dispatched Direct Transit"
            }
          },
          { 
            name: 'Rome Private Gallery', 
            description: 'Handover complete. In-home custom positioning certified.', 
            lat: 41.9028, lng: 12.4964,
            x: 520, y: 440,
            status: 'completed',
            detailedTelemetry: {
              temp: "21.2°C", humidity: "42%", pressure: "1012 hPa",
              securityBadge: "Signed & Secured", statusText: "Handed Over to Client"
            }
          },
        ] as MapNode[]
      };
    }
  }, [orderId]);

  // Adjust zoom and position dynamically to fit the current order route on change
  React.useEffect(() => {
    setZoom(routeData.zoomDefault);
    setPan(routeData.panDefault);
    setSelectedNode(routeData.nodes.find(n => n.status === 'current') || routeData.nodes[routeData.nodes.length - 1]);
  }, [routeData]);

  // Handle Dragging / Panning on SVG
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(prev => {
      const step = 0.25;
      const next = direction === 'in' ? prev + step : prev - step;
      return Math.max(0.6, Math.min(3, next));
    });
  };

  const handleReset = () => {
    setZoom(routeData.zoomDefault);
    setPan(routeData.panDefault);
  };

  const handleCenterOnDelivery = () => {
    const deliveryNode = routeData.nodes[routeData.nodes.length - 1];
    if (deliveryNode) {
      const zoomLevel = 1.6; // High precision focus level
      setZoom(zoomLevel);
      // Center the (x, y) coordinates of the delivery node relative to the container viewport center (400, 225)
      setPan({
        x: 400 - (deliveryNode.x * zoomLevel),
        y: 225 - (deliveryNode.y * zoomLevel)
      });
      setSelectedNode(deliveryNode);
    }
  };

  const handleShareTracking = () => {
    const shareUrl = `${window.location.origin}/profile?track=${orderId}`;
    navigator.clipboard.writeText(shareUrl);
    setIsShared(true);
    setTimeout(() => {
      setIsShared(false);
    }, 2000);
  };

  // Find dynamic current position along the vector route
  const currentTransitLocation = useMemo(() => {
    const currentNodeIdx = routeData.nodes.findIndex(n => n.status === 'current');
    if (currentNodeIdx !== -1) {
      // Return current node coordinates
      return {
        x: routeData.nodes[currentNodeIdx].x,
        y: routeData.nodes[currentNodeIdx].y,
        name: routeData.nodes[currentNodeIdx].name
      };
    }
    // If all completed, return last node
    const lastNode = routeData.nodes[routeData.nodes.length - 1];
    return {
      x: lastNode.x,
      y: lastNode.y,
      name: lastNode.name
    };
  }, [routeData]);

  return (
    <div id="shipping-map-container" className="grid grid-cols-1 xl:grid-cols-12 gap-6 bg-black/60 rounded-[32px] p-6 border border-white/5 overflow-hidden">
      
      {/* Map visualization area (col-span-8) */}
      <div className="xl:col-span-8 relative bg-neutral-950/80 rounded-2xl border border-white/5 h-[360px] sm:h-[450px] overflow-hidden group select-none cursor-grab active:cursor-grabbing">
        
        {/* Radar grids back drop decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
          <div className="absolute inset-0 bg-[radial-gradient(#1c1917_1.5px,transparent_1px)] [background-size:24px_24px]" />
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <line x1="10%" y1="0" x2="10%" y2="100%" stroke="rgba(212, 175, 55, 0.05)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(212, 175, 55, 0.05)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="90%" y1="0" x2="90%" y2="100%" stroke="rgba(212, 175, 55, 0.05)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="20%" x2="100%" y2="20%" stroke="rgba(212, 175, 55, 0.05)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(212, 175, 55, 0.05)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="80%" x2="100%" y2="80%" stroke="rgba(212, 175, 55, 0.05)" strokeWidth="1" strokeDasharray="4 4" />
            
            {/* Radar Sweep Arc Circles */}
            <circle cx="50%" cy="50%" r="90" fill="none" stroke="rgba(212, 175, 55, 0.03)" strokeWidth="1" />
            <circle cx="50%" cy="50%" r="220" fill="none" stroke="rgba(212, 175, 55, 0.02)" strokeWidth="1" />
          </svg>
        </div>

        {/* Dynamic Canvas Container with Drag + Zoom Map */}
        <div 
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="absolute inset-0 w-full h-full"
        >
          <motion.div
            style={{ 
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0px 0px' 
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="w-[800px] h-[500px] relative pointer-events-auto"
          >
            {/* Stylized Simulated Topography Vectors of Europe (Alpine, Italian, French coastlines) */}
            <svg viewBox="0 0 800 500" className="w-[800px] h-[500px] absolute inset-0 select-none pointer-events-none fill-none">
              
              {/* Simulated Country borders & Topography Outlines */}
              {/* Alpine & Northern Italy bounds */}
              <path d="M 200,450 C 230,420 300,400 350,420 C 400,440 430,480 440,500 L 490,500 C 500,470 510,420 500,380 C 490,340 410,290 440,240 C 470,190 530,220 580,200 C 630,180 660,140 700,110" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" />
              
              {/* Southern France, Switzerland, Germany Boundaries */}
              <path d="M 50,220 C 110,240 180,220 220,200 C 260,180 300,120 340,110 C 380,100 450,140 490,130 C 530,120 590,80 650,50" stroke="rgba(255,255,255,0.025)" strokeWidth="1.5" strokeDasharray="2 3" />
              
              {/* Luxury Routing Path Connector (Golden trail) */}
              {routeData.nodes.length > 1 && (
                <>
                  {/* Pulse path line */}
                  <path 
                    d={`M ${routeData.nodes[0].x},${routeData.nodes[0].y} 
                       ${routeData.nodes.slice(1).map(n => `L ${n.x},${n.y}`).join(' ')}`} 
                    stroke="rgba(212, 175, 55, 0.15)" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  {/* Active glowing route path line */}
                  <motion.path 
                    d={`M ${routeData.nodes[0].x},${routeData.nodes[0].y} 
                       ${routeData.nodes.slice(1).map(n => `L ${n.x},${n.y}`).join(' ')}`} 
                    stroke="#D4AF37" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeDasharray="8 6"
                    animate={{ strokeDashoffset: [-60, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  />
                </>
              )}

              {/* Node to Node grid ticks */}
              {routeData.nodes.map((node, i) => (
                <circle 
                  key={`dot-${i}`} 
                  cx={node.x} 
                  cy={node.y} 
                  r={3} 
                  fill={node.status === 'completed' ? '#D4AF37' : node.status === 'current' ? '#ffffff' : '#404040'} 
                  opacity={0.6}
                />
              ))}
            </svg>

            {/* Simulated Live delivery truck/transport vehicle position point on map! */}
            <motion.div 
              style={{ x: currentTransitLocation.x - 12, y: currentTransitLocation.y - 12 }}
              animate={{
                scale: [1, 1.1, 1],
                boxShadow: ["0 0 0px rgba(212,175,55,0)", "0 0 15px rgba(212,175,55,0.4)", "0 0 0px rgba(212,175,55,0)"]
              }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="absolute z-30 w-6 h-6 rounded-full bg-gold text-black flex items-center justify-center p-0.5 border-2 border-white cursor-pointer"
              title={`Live transit escort beacon at: ${currentTransitLocation.name}`}
            >
              <Navigation className="w-3.5 h-3.5 fill-current transform rotate-45" />
            </motion.div>

            {/* Geographical Map Markers */}
            {routeData.nodes.map((node, idx) => {
              const isActive = selectedNode?.name === node.name;
              return (
                <div 
                  key={idx}
                  style={{ left: node.x, top: node.y }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  <button
                    onClick={() => setSelectedNode(node)}
                    className="relative group outline-none"
                  >
                    {node.status === 'current' ? (
                      <span className="absolute -inset-3 rounded-full bg-gold/20 animate-ping duration-1000" />
                    ) : null}

                    {/* Styled dot */}
                    <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                      isActive 
                        ? 'bg-white border-gold scale-125 shadow-[0_0_15px_rgba(212,175,55,1)]' 
                        : node.status === 'completed'
                        ? 'bg-neutral-900 border-gold hover:bg-gold/40'
                        : 'bg-neutral-900 border-neutral-700 hover:border-gold/50'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        isActive ? 'bg-black' : node.status === 'completed' ? 'bg-gold' : 'bg-neutral-700'
                      }`} />
                    </div>

                    {/* Small tag visible permanently */}
                    <div className={`absolute left-5 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/5 whitespace-nowrap transition-colors ${
                      isActive ? 'border-gold/30' : 'group-hover:border-white/15'
                    }`}>
                      <span className={`text-[9px] uppercase tracking-wider block font-serif font-bold ${
                        isActive ? 'text-gold' : 'text-gray-400'
                      }`}>
                        {node.name.replace('Hossana ', '').replace('Private ', '')}
                      </span>
                    </div>
                  </button>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Dynamic Zoom & Control Panel Layer */}
        <div className="absolute left-4 bottom-4 flex flex-col gap-2 z-40 bg-zinc-950/80 backdrop-blur-md rounded-2xl border border-white/5 p-2 shadow-2xl">
          <button 
            onClick={() => handleZoom('in')}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-gold hover:text-black text-gray-400 flex items-center justify-center transition-all border border-transparent hover:border-gold"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleZoom('out')}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-gold hover:text-black text-gray-400 flex items-center justify-center transition-all border border-transparent hover:border-gold"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button 
            onClick={handleReset}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white hover:text-black text-gray-400 flex items-center justify-center transition-all border border-transparent hover:border-white"
            title="Reset position"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Map Control Pill Buttons */}
        <div className="absolute left-[72px] bottom-4 z-40 flex flex-wrap gap-2 mr-4">
          <button 
            onClick={handleCenterOnDelivery}
            className="h-10 px-4 rounded-xl bg-zinc-950/90 backdrop-blur-md text-gold hover:text-black hover:bg-gold flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold transition-all border border-gold/30 hover:border-gold shadow-2xl cursor-pointer"
            title="Center map on final delivery address"
          >
            <MapPin className="w-4 h-4 shrink-0" />
            Center on Delivery
          </button>

          <button 
            onClick={handleShareTracking}
            className="h-10 px-4 rounded-xl bg-zinc-950/90 backdrop-blur-md text-gold hover:text-black hover:bg-gold flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold transition-all border border-gold/30 hover:border-gold shadow-2xl cursor-pointer"
            title="Copy tracking link to clipboard"
          >
            {isShared ? (
              <>
                <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                Copied!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 shrink-0" />
                Share Tracking
              </>
            )}
          </button>
        </div>

        {/* View Mode Map Overlay Toggles */}
        <div className="absolute right-4 top-4 flex items-center gap-2 z-40 bg-black/60 backdrop-blur-md rounded-2xl border border-white/5 p-1">
          {(['telemetry', 'scout', 'standard'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-xl text-[9px] uppercase tracking-widest font-bold transition-all ${
                viewMode === mode 
                  ? 'bg-gold text-black shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Tracking Overlay Compass and Stats */}
        <div className="absolute left-4 top-4 pointer-events-none flex items-center gap-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/5 p-3 px-4">
          <Compass className="w-4 h-4 text-gold shrink-0 animate-spin-slow" />
          <div>
            <span className="text-[10px] uppercase tracking-widest text-gray-500 block">Routing Mode</span>
            <span className="text-[10px] text-white font-medium block uppercase tracking-wider">{routeData.title}</span>
          </div>
        </div>

        {/* Map Drag help overlay tip */}
        <div className="absolute right-4 bottom-4 pointer-events-none text-gray-500 font-mono text-[9px] uppercase tracking-widest bg-black/20 p-2 rounded-xl border border-white/5 select-none">
          🔍 Scroll / Drag map to pan & zoom
        </div>
      </div>

      {/* Selected checkpoint panel and telemetry detail (col-span-4) */}
      <div className="xl:col-span-4 flex flex-col justify-between h-full space-y-6">
        <div className="space-y-6">
          <div className="pb-4 border-b border-white/5">
            <span className="text-gold uppercase tracking-[0.2em] font-bold text-[10px] block mb-1 flex items-center gap-2">
              <Radio className="w-3 h-3 text-gold animate-pulse" /> Live Escort Node Telemetry
            </span>
            <h3 className="text-xl font-serif text-white font-bold tracking-tight">Checkpoint Details</h3>
          </div>

          {/* D3 Status Progress Chart widget */}
          <div className="bg-zinc-950/45 p-5 rounded-3xl border border-white/5 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-gold uppercase tracking-[0.2em] font-bold text-[9px] block">Security Escrow</span>
                <h4 className="text-sm font-serif font-bold text-white uppercase tracking-tight">Fulfillment Route Arc</h4>
              </div>
              <span className="text-[8px] uppercase tracking-widest text-gray-500 font-mono border border-white/5 bg-black/45 px-2 py-0.5 rounded-full">D3 Realtime</span>
            </div>
            <StatusProgressChart 
              completed={routeData.nodes.filter(n => n.status === 'completed').length} 
              total={routeData.nodes.length} 
            />
          </div>

          <AnimatePresence mode="wait">
            {selectedNode ? (
              <motion.div 
                key={selectedNode.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h4 className="text-white font-serif font-bold text-lg leading-snug">{selectedNode.name}</h4>
                  <p className="text-xs text-gold uppercase tracking-wider font-bold mt-1 inline-flex items-center gap-1.5 bg-gold/10 px-2 py-0.5 rounded-full border border-gold/20">
                    {selectedNode.status === 'completed' && <ShieldCheck className="w-3 h-3" />}
                    {selectedNode.status === 'current' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold animate-ping" />}
                    Fulfillment Node - {selectedNode.status}
                  </p>
                  <p className="text-gray-400 text-xs font-light leading-relaxed mt-4">
                    {selectedNode.description}
                  </p>
                </div>

                {/* Simulated high-end art-transport climate & container secure telemetry logs */}
                {selectedNode.detailedTelemetry && viewMode === 'telemetry' && (
                  <div className="space-y-4">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-gray-500 block">Art Container Environment Sensors</span>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center">
                        <Thermometer className="w-4 h-4 text-gold mx-auto mb-1 opacity-75" />
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest block">Temp</span>
                        <span className="text-xs font-serif font-semibold text-white mt-0.5 block">{selectedNode.detailedTelemetry.temp}</span>
                      </div>
                      <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center">
                        <Droplets className="w-4 h-4 text-gold mx-auto mb-1 opacity-75" />
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest block">Humidity</span>
                        <span className="text-xs font-serif font-semibold text-white mt-0.5 block">{selectedNode.detailedTelemetry.humidity}</span>
                      </div>
                      <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center">
                        <Wind className="w-4 h-4 text-gold mx-auto mb-1 opacity-75" />
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest block">Pressure</span>
                        <span className="text-xs font-serif font-semibold text-white mt-0.5 block">{selectedNode.detailedTelemetry.pressure}</span>
                      </div>
                    </div>

                    <div className="bg-zinc-950/60 border border-white/5 rounded-2xl p-4 space-y-2.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500 font-light font-sans">Shield Encryption:</span>
                        <span className="text-white font-mono text-[11px] font-bold">{selectedNode.detailedTelemetry.securityBadge}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500 font-light font-sans">Verification Code:</span>
                        <span className="text-white font-mono text-[11px] uppercase">{orderId}-{selectedNode.name.slice(0, 3)}-SEC</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500 font-light font-sans">Escort Status:</span>
                        <span className="text-emerald-500 font-bold tracking-wide uppercase text-[10px] inline-flex items-center gap-1">
                          <Activity className="w-3.5 h-3.5" /> SECURE & ESCORTED
                        </span>
                      </div>
                    </div>
                  </div>
                )} {selectedNode && viewMode === 'scout' && (
                  <div className="bg-zinc-950/80 border border-white/5 rounded-2xl p-4 text-xs font-light space-y-3">
                     <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
                        <span className="text-gold uppercase tracking-[0.2em] font-bold text-[9px]">Live Stream Logs</span>
                     </div>
                     <p className="font-mono text-[10px] text-gray-400 leading-normal bg-black/40 p-3 rounded-lg border border-white/5 h-[140px] overflow-y-auto">
                        [RECON SECURE] Connected to fine-art ESCORT vessel.<br />
                        [TELEMETRY] Ambient sensor scan active. Zero shocks registered.<br />
                        [TRANSIT-GRID] Destination: {routeData.endLabel}<br />
                        [STATUS] {selectedNode.detailedTelemetry?.statusText}<br />
                        [ESCORT-OPS] Signal strength: 98% (Secure Escrow Uplink)
                     </p>
                  </div>
                )} {selectedNode && viewMode === 'standard' && (
                  <div className="bg-zinc-950/40 p-4 rounded-2xl border border-white/5 flex gap-4 items-center">
                     <div className="w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center text-gold shrink-0">
                        <MapPin className="w-5 h-5" />
                     </div>
                     <div>
                        <h4 className="text-white text-xs uppercase tracking-widest font-bold font-sans">Geographic Point</h4>
                        <p className="text-gray-400 font-light font-mono text-[11px] mt-0.5">Lat: {selectedNode.lat.toFixed(4)} • Lng: {selectedNode.lng.toFixed(4)}</p>
                     </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl">
                <Eye className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                <p className="text-gray-500 font-serif font-light text-sm italic">Click a waypoint checkpoint node on the map to explore sensor metrics and state logs</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="pt-6 border-t border-white/5 space-y-2 bg-black/40 p-4 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Escort Carrier Bonded Active</span>
          </div>
          <p className="text-[11px] font-sans text-gray-500 leading-normal font-light">
            Each fine art cargo container possesses isolated thermal, hygroscopic, and kinetic shock security monitoring connected over private satellite escrow telemetry.
          </p>
        </div>
      </div>
    </div>
  );
}
