import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const REVIEWS = [
  {
    name: 'Selamawit Bekele',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200',
    review: 'The quality of the Hossana Helen Chair exceeded my expectations. It is truly the centerpiece of our design showroom in Addis Ababa. Highly recommended!',
    rating: 5,
    role: 'Principal Architect, Addis Atelier'
  },
  {
    name: 'Dawit Yohannes',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    review: 'Fast delivery and white-glove service. The solid pine table is stunning and the carpentry craftsmanship is evident in every joint.',
    rating: 5,
    role: 'Luxury Homeowner & Developer'
  },
  {
    name: 'Hanna Alene',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=200',
    review: 'Hossana Furniture has a unique eye for earthy, minimalist luxury. Their modern timber collections have transformed our home into a serene haven.',
    rating: 5,
    role: 'CEO, Ghion Luxury Interiors'
  }
];

export default function Reviews() {
  return (
    <section className="py-24 bg-slate-50/75 relative overflow-hidden border-t border-b border-slate-100">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-[#c71f2c]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-[#c71f2c] uppercase tracking-[0.25em] text-sm font-black mb-4 block">Testimonials</span>
          <h2 className="text-4xl md:text-5xl font-serif font-black text-black mb-6">What Our Clients Say</h2>
          <p className="text-black font-medium leading-relaxed">
            Real stories from homeowners and designers who chose Hossana for their premium interior needs.
          </p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          className="reviews-swiper !pb-16"
        >
          {REVIEWS.map((review, index) => (
            <SwiperSlide key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-10 rounded-[32px] border border-slate-200/60 h-full flex flex-col justify-between group transition-all duration-500 hover:border-[#c71f2c]/30 hover:shadow-md"
              >
                <div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`} 
                        referrerPolicy="no-referrer"
                      />
                    ))}
                  </div>
                  <Quote className="w-10 h-10 text-[#c71f2c]/10 mb-4" />
                  <p className="text-black italic font-semibold leading-relaxed mb-8">"{review.review}"</p>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <div>
                    <h4 className="text-black font-black tracking-tight">{review.name}</h4>
                    <p className="text-[#c71f2c] text-[10px] uppercase tracking-widest font-black">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      <style>{`
        .reviews-swiper .swiper-pagination-bullet {
          background: #c71f2c;
          opacity: 0.2;
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
        }
        .reviews-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          width: 24px;
          border-radius: 4px;
        }
      `}</style>
    </section>
  );
}
