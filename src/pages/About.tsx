import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { 
  Award, 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  ArrowRight,
  Compass,
  CheckCircle2,
  Users,
  TrendingUp,
  MapPin,
  ChevronDown,
  HelpCircle,
  Search,
  Share2,
  Check,
  X
} from 'lucide-react';

export default function About() {
  const combinationValues = [
    {
      icon: Award,
      title: 'Premium Craftsmanship',
      description: 'Master artisans hand-finish each component with meticulous focus on wood grains, seamless wood joints, and exact dimension stability.'
    },
    {
      icon: Compass,
      title: 'Modern Luxury Design',
      description: 'Minimalist Scandinavian shapes blended with ergonomic seating, presenting lightweight forms and premium structural engineering.'
    },
    {
      icon: ShieldCheck,
      title: 'Durable Materials',
      description: 'Only sustainably sourced European oak, American walnut, premium timber, and heavy-duty performance fabrics are used in our collections.'
    },
    {
      icon: Heart,
      title: 'Comfort-Focused Innovation',
      description: 'Sophisticated pocket-spring layouts, multi-density memory padding, and soft linen textiles refined for absolute everyday relaxation.'
    }
  ];

  const coreReasons = [
    {
      title: 'High-Quality Modern Furniture',
      desc: 'Sustainably crafted premium solid woods refined with natural eco-friendly oils.'
    },
    {
      title: 'Luxury and Minimalist Designs',
      desc: 'Elegant, timeless shapes that bring balance, tranquility, and style into your home.'
    },
    {
      title: 'Affordable Premium Collections',
      desc: 'Transparent pricing for genuine heirloom-quality furniture without extreme markup.'
    },
    {
      title: 'Trusted Customer Service',
      desc: 'Responsive chat, white-glove setup assistance, and simple custom requests.'
    },
    {
      title: 'Fast and Reliable Delivery',
      desc: 'Multi-layer bubble protective transport and real-time interactive coordinate tracking.'
    },
    {
      title: 'Furniture Crafted for Comfort & Durability',
      desc: 'Rigid stress-tested frames, heavy-gauge steel supports, and colorfast weave fabrics.'
    }
  ];

  // FAQ Categories of common user questions
  const faqCategories = [
    { id: 'all', label: 'All FAQs' },
    { id: 'care', label: 'Furniture Care' },
    { id: 'warranty', label: 'Warranty Details' },
    { id: 'returns', label: 'Returns & Policies' }
  ];

  // Detailed realistic FAQ questions covering Care, Warranties, and Returns
  const faqItems = [
    {
      category: 'care',
      question: 'How should I clean and maintain my solid wooden furniture pieces?',
      answer: 'To protect and maintain the exquisite natural texture and timber patterns of solid hardwoods, dust regularly with a soft, clean microfiber cloth lightly dampened with pure water. Avoid any harsh oil-soaps, chemical aerosol solvents, and heavy silicone polishes. We also recommend avoiding direct exposure to heaters or continuous intense sunlight to prevent micro-checks.'
    },
    {
      category: 'care',
      question: 'What upholstery care instructions are recommended for our sofas?',
      answer: 'Weekly light vacuuming using an upholstery brush attachment keeps dust and lint from settling deep into weave fabrics. For fluid spots (coffee, sauce, wine), soak fresh spills immediately with clean tissue towels, then treat with a mild detergent damp spot solution. Never scrub roughly. We recommend swapping seating cushions monthly to guarantee symmetrical wear patterns.'
    },
    {
      category: 'warranty',
      question: 'What specific coverages are included under Hossana’s structural warranty?',
      answer: 'Hossana Furniture protects your investment with a 10-Year Limited Lifetime Structural Warranty covering joint failure, load-bearing frames, sub-spring breakdowns, and structural alignment defaults. External fabric weaves, leather finishes, thread stitching tension, and foam density support are backed securely by a focused 2-Year limited warranty.'
    },
    {
      category: 'warranty',
      question: 'How can I submit a request for a warranty service repair?',
      answer: 'Please prepare your original order billing invoice details, take 2-3 clear photographs / a brief smartphone video demonstrating the issue, and contact us directly at hossanafurniture@gmail.com. Our in-house restoration carpenters will evaluate the information and schedule a white-glove diagnostic review or a simple unit swap within 48 business hours.'
    },
    {
      category: 'returns',
      question: 'What is Hossana’s timeline and restitution policy for product returns?',
      answer: 'We provide a comprehensive, risk-free 30-Day trial period. Standard in-stock catalog products qualify for complimentary courier pick-up service and a full-cash refund. For individually tailored specifications, custom fabrics, or specialized dimensions, a 15% raw materials restocking and processing fee is applied.'
    },
    {
      category: 'returns',
      question: 'Do you offer White-Glove in-home shipping and product setup?',
      answer: 'Absolutely. Complimentary white-glove delivery is included automatically for all orders exceeding $1,500. Under this service, our expert freight specialists will place each piece in your room of preference, execute precise mounting/alignment assembly, verify structural leveling, and transport all packaging materials to waste sorting depots.'
    }
  ];

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleShare = (e: React.MouseEvent, question: string) => {
    e.stopPropagation();
    const slug = slugify(question);
    const shareUrl = `${window.location.origin}${window.location.pathname}#${slug}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedText(question);
      setTimeout(() => {
        setCopiedText(null);
      }, 2000);
    });
  };

  React.useEffect(() => {
    if (window.location.hash) {
      const hash = window.location.hash.slice(1);
      const matchedFaq = faqItems.find(item => slugify(item.question) === hash);
      if (matchedFaq) {
        setOpenQuestion(matchedFaq.question);
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
      }
    }
  }, []);

  // Filtering questions based on state options
  const filteredFaqs = faqItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="pb-24 pt-32 bg-white text-black"
    >
      {/* Hero Banner Grid Layout */}
      <section className="container mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="text-[#c71f2c] uppercase tracking-[0.3em] text-xs font-black block">
              About Us – Hossana Furniture
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#c71f2c] font-black border border-slate-200 bg-slate-50 px-3 py-1 rounded-full">
              Version 1 — Luxury & Professional
            </span>
            <h1 className="text-5xl lg:text-7xl font-serif font-black text-black leading-tight">
              Welcome to <span className="text-[#c71f2c] italic font-normal">Hossana</span> <br /> Where Comfort Meets Timeless Design
            </h1>
            <p className="text-black text-lg lg:text-xl font-semibold leading-relaxed">
              At Hossana Furniture, we believe furniture is more than decoration. It is part of everyday life, family memories, and personal style. Our mission is to create elegant, modern, and high-quality furniture that transforms every house into a beautiful home.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-[40px] border border-slate-200 bg-slate-50 p-8 md:p-10 shadow-2xl flex items-center justify-center text-center">
              <div>
                <p className="text-[#c71f2c] uppercase tracking-[0.25em] text-xs font-black mb-3">Crafted with intention</p>
                <h3 className="text-2xl font-serif font-black text-black mb-3">Elegant interiors, thoughtfully made</h3>
                <p className="text-black text-sm leading-relaxed font-medium">Every piece is shaped around comfort, longevity, and timeless beauty.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Combination pillars */}
      <section className="bg-slate-50 py-20 border-y border-slate-200 mb-20 relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#c71f2c]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-[#c71f2c] uppercase tracking-[0.2em] text-xs font-black block">
              Our Craftsmanship Pillars
            </span>
            <h2 className="text-3xl lg:text-4xl font-serif font-black text-black">
              What We Combine
            </h2>
            <div className="w-12 h-[2px] bg-[#c71f2c] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {combinationValues.map((value, idx) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white hover:bg-slate-50 p-8 rounded-[32px] border border-slate-200 hover:border-[#c71f2c]/30 hover:shadow-lg transition-all duration-500"
              >
                <div className="w-14 h-14 bg-slate-100 border border-slate-250 group-hover:bg-[#c71f2c] group-hover:text-white rounded-2xl flex items-center justify-center text-[#c71f2c] mb-6 transition-all duration-300 shadow-sm">
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-black text-black mb-3 group-hover:text-[#c71f2c] transition-colors">
                  {value.title}
                </h3>
                <p className="text-black text-sm leading-relaxed font-semibold">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories & Selected piece message */}
      <section className="container mx-auto px-6 mb-20">
        <div className="max-w-4xl mx-auto text-center space-y-8 bg-slate-50 p-12 lg:p-16 rounded-[48px] border border-slate-200">
          <span className="text-[#c71f2c] uppercase tracking-[0.3em] font-black text-xs block">
            The Selected Standard
          </span>
          <p className="text-2xl lg:text-3.5xl font-serif text-black leading-relaxed font-black italic">
            "From stylish sofas and luxury beds to elegant dining tables and office furniture, every piece is carefully selected to bring beauty, comfort, and functionality into your space."
          </p>
          <div className="flex justify-center items-center gap-2 text-xs font-black uppercase tracking-widest text-[#c71f2c]">
            <span className="h-0.5 w-8 bg-[#c71f2c]" />
            <span>Curated Timber Collections</span>
            <span className="h-0.5 w-8 bg-[#c71f2c]" />
          </div>
        </div>
      </section>

      {/* Our Goal & Passion section */}
      <section className="container mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="rounded-[40px] border border-slate-200 shadow-lg bg-slate-50 p-10 lg:p-14 lg:order-2"
          >
            <div className="flex h-full flex-col justify-center">
              <p className="text-[#c71f2c] uppercase tracking-[0.25em] text-xs font-black mb-3">Built for everyday living</p>
              <h3 className="text-2xl font-serif font-black text-black mb-3">A modern studio where function and elegance meet</h3>
              <p className="text-black text-sm leading-relaxed font-medium">We design furniture that feels calm, elevated, and deeply personal in the spaces people live in every day.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6 lg:order-1"
          >
            <span className="text-[#c71f2c] uppercase tracking-[0.3em] text-xs font-black block text-left">
              Our Vision Statement
            </span>
            <h2 className="text-4xl lg:text-5xl font-serif font-black text-black leading-tight">
              Our Goal is Simple: To Deliver World-Class Furniture
            </h2>
            <p className="text-black text-base lg:text-lg font-medium leading-relaxed">
              We focus heavily on providing an exceptional end-to-end customer experience. Our teams of delivery experts and assembly designers work persistently to make sure the setup is smooth, perfect, and breathtaking.
            </p>
            <p className="text-black text-base lg:text-lg font-medium leading-relaxed">
              We are deeply passionate about helping customers create interiors that feel warm, modern, and inspiring.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Grid list */}
      <section className="bg-slate-50 py-20 border-y border-slate-200 mb-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-[#c71f2c] uppercase tracking-[0.2em] text-xs font-black block">
              Value Propositions
            </span>
            <h2 className="text-3xl lg:text-4xl font-serif font-black text-black">
              Why Choose Hossana Furniture?
            </h2>
            <div className="w-12 h-[2px] bg-[#c71f2c] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreReasons.map((reason, idx) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="flex gap-4 p-6 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50/50 transition-colors"
              >
                <div className="shrink-0 text-[#c71f2c] mt-1">
                  <CheckCircle2 className="w-5 h-5 fill-[#c71f2c]/10" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-serif font-black text-lg text-black leading-tight">
                    {reason.title}
                  </h4>
                  <p className="text-black text-sm leading-relaxed font-semibold">
                    {reason.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section with Accordion */}
      <section id="faq-section" className="container mx-auto px-6 mb-20">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <span className="text-[#c71f2c] uppercase tracking-[0.2em] text-xs font-black block">
              Hossana Help Desk
            </span>
            <h2 className="text-3xl lg:text-4xl font-serif font-black text-black">
              Frequently Asked FAQs
            </h2>
            <p className="text-black text-sm max-w-lg mx-auto font-semibold leading-relaxed">
              Find fast responses regarding solid furniture care, frame warranties, shipment returns, and complimentary white-glove installations.
            </p>
            <div className="w-12 h-[2px] bg-[#c71f2c] mx-auto" />
            
            <div className="relative max-w-md mx-auto pt-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                autoFocus
                placeholder="Type to filter FAQs in real-time..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-11 py-3 text-[11px] font-bold uppercase tracking-widest rounded-full border border-slate-300 bg-white text-black placeholder:text-slate-400 focus:border-[#c71f2c]/50 focus:ring-2 focus:ring-[#c71f2c]/15 outline-none transition-all shadow-xl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Controls: Category Filter */}
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center bg-slate-50 p-4 rounded-3xl border border-slate-200 shadow-sm">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 justify-center">
              {faqCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setOpenQuestion(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    activeCategory === cat.id
                      ? 'bg-[#c71f2c] text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-black hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Animated Interactive Accordion Rows list */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => {
                  const isCurrentOpen = openQuestion === faq.question;
                  const faqSlug = slugify(faq.question);
                  return (
                    <motion.div
                      layout
                      id={faqSlug}
                      key={`${faq.question}-${searchQuery ? 'search' : 'static'}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 24,
                        opacity: { duration: 0.25, ease: "easeOut" }
                      }}
                      className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:border-slate-300 transition-all duration-300"
                    >
                      <div className="w-full flex justify-between items-center px-8 py-6 gap-4 group/row text-black">
                        <div 
                          onClick={() => setOpenQuestion(isCurrentOpen ? null : faq.question)}
                          className="flex-1 flex items-center gap-4 cursor-pointer"
                        >
                          <HelpCircle className={`w-5 h-5 shrink-0 transition-colors duration-300 ${isCurrentOpen ? 'text-[#c71f2c]' : 'text-slate-400'}`} />
                          <span className="font-serif font-black text-black hover:text-[#c71f2c] transition-colors text-base lg:text-md leading-normal">
                            {faq.question}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {/* Share Icon Button */}
                          <div className="relative">
                            <button
                              onClick={(e) => handleShare(e, faq.question)}
                              title="Copy direct link to this FAQ"
                              className="p-2 rounded-xl bg-slate-100 hover:bg-[#c71f2c] hover:text-white text-black transition-all duration-200 border border-slate-200 flex items-center justify-center"
                            >
                              {copiedText === faq.question ? (
                                <Check className="w-3.5 h-3.5 text-green-600" />
                              ) : (
                                <Share2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                            {copiedText === faq.question && (
                              <div className="absolute -top-10 right-1/2 translate-x-1/2 bg-white text-green-600 text-[10px] font-bold py-1 px-3 rounded-md border border-green-500/20 shadow-md animate-fade-in z-20 whitespace-nowrap">
                                Link copied!
                              </div>
                            )}
                          </div>

                          {/* Original Toggle Trigger */}
                          <button
                            onClick={() => setOpenQuestion(isCurrentOpen ? null : faq.question)}
                            className={`p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-black transition-all duration-300 ${isCurrentOpen ? 'rotate-180 text-[#c71f2c] bg-[#c71f2c]/5' : ''}`}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <AnimatePresence initial={false}>
                        {isCurrentOpen && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                            className="overflow-hidden"
                          >
                            <div className="px-8 pb-6 text-black text-sm leading-relaxed font-medium border-t border-slate-200 pt-4">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 text-black text-xs font-mono uppercase tracking-widest bg-slate-50 rounded-3xl border border-slate-200"
                >
                  No matching questions found in criteria.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-slate-50 text-black rounded-[48px] p-12 lg:p-20 text-center relative overflow-hidden border border-slate-200 shadow-xl"
        >
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#c71f2c]/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#c71f2c]/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <span className="text-[#c71f2c] uppercase tracking-[0.3em] text-xs font-black block">
              Hossana Purpose Statement
            </span>
            <h2 className="text-3.5xl lg:text-5.5xl font-serif font-black text-black mb-6 leading-tight">
              At Hossana Furniture, we don’t just sell furniture — we help create spaces people love to live in.
            </h2>
            <div className="pt-2">
              <Link to="/shop">
                <Button className="bg-[#c71f2c] hover:bg-slate-800 text-white px-12 py-7 rounded-full text-xs font-bold uppercase tracking-widest transition-all">
                  Browse Premium Shop <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}
