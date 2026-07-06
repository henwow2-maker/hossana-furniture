import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Check, HelpCircle, Shield, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success('Your message has been safely received at Hossana Atelier!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: '',
      });
    }, 1500);
  };

  const contactOptions = [
    {
      icon: Phone,
      title: 'Direct Atelier Call',
      desc: 'Connect immediately to our design consulting team.',
      phones: [
        { label: '+251 973 664 387', href: 'tel:+251973664387' },
        { label: '+251 686 395 80', href: 'tel:+25168639580' }
      ],
    },
    {
      icon: Mail,
      title: 'Electronic Post',
      desc: 'Our administrative desk responds within 4 business hours.',
      value: 'hossanafurniture@gmail.com',
      actionLabel: 'Write Email',
      href: 'mailto:hossanafurniture@gmail.com',
    },
    {
      icon: MapPin,
      title: 'Our Grand Showroom',
      desc: 'Experience our masterpieces live in person.',
      value: '848 Golden Timber Blvd, NY 10012',
      actionLabel: 'Get Directions',
      href: 'https://maps.google.com',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="pb-24 pt-32 bg-white text-black min-h-screen"
    >
      <div className="container mx-auto px-6">
        {/* Header Header Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <span className="text-[#c71f2c] uppercase tracking-[0.25em] text-xs font-black block">
            Hossana Atelier
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-black text-black leading-tight">
            Connect With Our <br /> <span className="text-[#c71f2c] italic font-normal">Design Architects</span>
          </h1>
          <p className="text-black text-base md:text-lg font-medium leading-relaxed">
            Whether you want to customize wooden furniture configurations, schedule a complimentary showroom walkthrough, or query current order states, we are ready to assist.
          </p>
          <div className="w-16 h-[2.5px] bg-[#c71f2c] mx-auto" />
        </div>

        {/* Quick Contacts Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {contactOptions.map((opt, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-50 border border-slate-200 p-8 rounded-[32px] hover:border-[#c71f2c]/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#c71f2c]/5 border border-[#c71f2c]/10 flex items-center justify-center text-[#c71f2c]">
                  <opt.icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-black text-lg text-black">{opt.title}</h3>
                <p className="text-xs text-black font-semibold opacity-85 leading-relaxed">{opt.desc}</p>
                {opt.phones ? (
                  <div className="flex flex-col gap-2 pt-2">
                    {opt.phones.map((p, pIdx) => (
                      <a 
                        key={pIdx} 
                        href={p.href} 
                        className="text-sm font-black text-[#c71f2c] hover:text-black font-mono transition-colors block"
                      >
                        {p.label}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm font-black text-black font-mono pt-2">{opt.value}</p>
                )}
              </div>
              <div className="mt-8">
                {opt.phones ? (
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Click to call instantly
                  </span>
                ) : (
                  <a 
                    href={opt.href} 
                    target={opt.icon === MapPin ? "_blank" : "_self"}
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#c71f2c] hover:text-black transition-colors"
                  >
                    {opt.actionLabel} &rarr;
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Form and Hours Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
          
          {/* Left Block: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-[40px] p-8 sm:p-12"
          >
            <h2 className="text-2xl font-serif font-black text-black mb-2">Leave a Message</h2>
            <p className="text-xs text-black font-semibold opacity-80 mb-8">
              Fill out this form and a master craftsman or interior advisor will contact you directly to discuss.
            </p>

            {isSubmitted ? (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12 space-y-4 bg-white border border-slate-200/60 rounded-3xl p-6"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center mx-auto border border-green-500/20">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif font-bold text-black">Message Transmitted</h3>
                <p className="text-sm text-black font-medium max-w-sm mx-auto">
                  Thank you for connecting with Hossana. Your request was securely routed into our advisor's workspace and we will reply layout sketches/data shortly.
                </p>
                <Button 
                  onClick={() => setIsSubmitted(false)}
                  className="bg-[#c71f2c] hover:bg-black text-white font-bold uppercase tracking-widest text-[10px] py-4.5 px-6 rounded-full mt-4 transition-all"
                >
                  Send another inquiries
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact-name" className="block text-[10px] uppercase tracking-widest font-bold text-black mb-2">Your Full Name *</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="e.g. Christian Dior"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-slate-200 text-black rounded-2xl focus:border-[#c71f2c] outline-none p-4 text-sm font-semibold placeholder:text-slate-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-[10px] uppercase tracking-widest font-bold text-black mb-2">Email Address *</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="e.g. christian.dior@fashion.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-slate-200 text-black rounded-2xl focus:border-[#c71f2c] outline-none p-4 text-sm font-semibold placeholder:text-slate-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact-phone" className="block text-[10px] uppercase tracking-widest font-bold text-black mb-2">Phone Number</label>
                    <input
                      id="contact-phone"
                      type="tel"
                      placeholder="e.g. +1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-slate-200 text-black rounded-2xl focus:border-[#c71f2c] outline-none p-4 text-sm font-semibold placeholder:text-slate-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-subject" className="block text-[10px] uppercase tracking-widest font-bold text-black mb-2">Subject of Inquiry</label>
                    <select
                      id="contact-subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-white border border-slate-200 text-black rounded-2xl focus:border-[#c71f2c] outline-none p-4 text-sm font-semibold transition-colors"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Custom Furniture design">Custom Woodwork Design</option>
                      <option value="Atelier walkthrough">Showroom Appointment</option>
                      <option value="Shipping & installation">White-Glove Support</option>
                      <option value="Partnership">Partnerships & Trade</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-[10px] uppercase tracking-widest font-bold text-black mb-2">Message & Details *</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={6}
                    placeholder="Provide specific dimensions, materials of preference, or general design questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white border border-slate-200 text-black rounded-2xl focus:border-[#c71f2c] outline-none p-4 text-sm font-semibold placeholder:text-slate-400 transition-colors resize-none leading-relaxed"
                  />
                </div>

                <Button
                  id="submit-contact"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#c71f2c] hover:bg-slate-800 text-white font-bold uppercase tracking-widest text-[11px] h-14 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.01]"
                >
                  {isSubmitting ? (
                    'Transmitting Message...'
                  ) : (
                    <>
                      Send Message Inquiry <Send className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </motion.div>

          {/* Right Block: Working Hours & Additional Info */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-8"
          >
            {/* Atelier hours */}
            <div className="bg-slate-50 border border-slate-200 rounded-[40px] p-8 sm:p-10 space-y-6">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#c71f2c]" />
                <h3 className="font-serif font-black text-lg text-black">Opening Hours</h3>
              </div>
              <div className="space-y-4 text-sm border-t border-slate-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-black font-bold">Monday - Friday</span>
                  <span className="text-black font-semibold font-mono text-xs">9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black font-bold">Saturday</span>
                  <span className="text-black font-semibold font-mono text-xs">10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black font-bold">Sunday</span>
                  <span className="text-[#c71f2c] font-black text-xs font-mono">Special Appointments Only</span>
                </div>
              </div>
              <p className="text-[11px] text-black font-semibold uppercase tracking-wider opacity-80 pt-2 border-t border-slate-200 bg-slate-100/40 p-3 rounded-xl">
                ※ Customer care is responsive online 24/7.
              </p>
            </div>

            {/* Design Shield Trust Badges */}
            <div className="bg-slate-50 border border-slate-200 rounded-[40px] p-8 sm:p-10 space-y-6">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#c71f2c]" />
                <h3 className="font-serif font-black text-lg text-black">Our Service Guarantee</h3>
              </div>
              <div className="space-y-4 text-xs font-semibold text-black leading-relaxed">
                <p>
                  ✓ **10-Year Framework Warranty**: All handmade oak, walnut, and cherry structural frames come safeguarded with an automatic warrant.
                </p>
                <p>
                  ✓ **Complimentary White-Glove Installation**: Standard on home furniture over $1,500. We unpack, assemble, configure, and clean fully.
                </p>
                <p>
                  ✓ **Custom Timber Adaptation**: Our designers can adjust dimensional footprints specifically to optimize the flow in your blueprint.
                </p>
              </div>
            </div>

            {/* Micro FAQ helper link */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-[40px] p-8 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-[#c71f2c]" />
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-black text-black">Have general queries?</h4>
                  <p className="text-[11px] text-black font-semibold opacity-80">Check out our frequently asked answers.</p>
                </div>
              </div>
              <a 
                href="/about#faq-section" 
                className="px-4 py-2 border border-slate-200 bg-white hover:bg-[#c71f2c] hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                FAQs
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
