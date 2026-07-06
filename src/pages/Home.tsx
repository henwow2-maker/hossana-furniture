import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import CategoriesSection from '../components/CategoriesSection';
import AboutSection from '../components/AboutSection';
import Features from '../components/Features';
import Reviews from '../components/Reviews';
import Newsletter from '../components/Newsletter';
import ScrollReveal from '../components/ScrollReveal';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <ScrollReveal direction="up" delay={0.1} threshold={0.05}>
        <FeaturedProducts />
      </ScrollReveal>
      
      <ScrollReveal direction="scale" delay={0.1} threshold={0.05}>
        <CategoriesSection />
      </ScrollReveal>
      
      <ScrollReveal direction="up" delay={0.1} threshold={0.05}>
        <AboutSection />
      </ScrollReveal>
      
      <ScrollReveal direction="up" delay={0.1} threshold={0.05}>
        <Features />
      </ScrollReveal>
      
      <ScrollReveal direction="scale" delay={0.1} threshold={0.05}>
        <Reviews />
      </ScrollReveal>
      
      <ScrollReveal direction="scale" delay={0.1} threshold={0.05}>
        <Newsletter />
      </ScrollReveal>
    </div>
  );
}
