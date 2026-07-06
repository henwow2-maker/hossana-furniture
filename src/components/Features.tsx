import { motion } from 'motion/react';
import { ShieldCheck, Truck, Palette, ScrollText } from 'lucide-react';

const FEATURES = [
  {
    icon: Palette,
    title: 'Modern Design',
    description: 'Elegant furniture styles crafted by world-class interior designers.'
  },
  {
    icon: ShieldCheck,
    title: 'Premium Quality',
    description: 'We use the finest materials to ensure your furniture lasts for generations.'
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Worldwide white-glove shipping right to your doorstep.'
  },
  {
    icon: ScrollText,
    title: 'Long Warranty',
    description: 'Peace of mind with our comprehensive 10-year luxury guarantee.'
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-[#c71f2c] uppercase tracking-[0.25em] text-sm font-black mb-4 block">Exclusive Service</span>
          <h2 className="text-4xl font-serif font-black text-black mb-6">Why Choose Hossana</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group p-10 bg-slate-50 rounded-[32px] border border-slate-200/60 transition-all duration-500 hover:shadow-md hover:border-[#c71f2c]/30"
            >
              <div className="w-16 h-16 bg-[#c71f2c]/5 rounded-2xl flex items-center justify-center text-[#c71f2c] mb-8 transition-transform group-hover:rotate-12 group-hover:scale-110 border border-[#c71f2c]/10">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-black text-black mb-4 group-hover:text-[#c71f2c] transition-colors">{feature.title}</h3>
              <p className="text-black text-sm leading-relaxed font-medium line-clamp-3">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
