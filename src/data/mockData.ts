import { Product, Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'sofa',
    name: 'Sofas',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    description: 'Luxury comfort for your living room.'
  },
  {
    id: 'chair',
    name: 'Chairs',
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800',
    description: 'Elegant seating for any space.'
  },
  {
    id: 'table',
    name: 'Tables',
    image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=800',
    description: 'Artisanal tables crafted from natural stone and wood.'
  },
  {
    id: 'lighting',
    name: 'Lighting',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800',
    description: 'Luminous statement pieces to set the mood.'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Luxury Chesterfield Sofa',
    category: 'sofa',
    price: 2400,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?auto=format&fit=crop&q=80&w=800',
    description: 'A classic Chesterfield sofa reimagined for the modern home. Hand-tufted velvet with mahogany legs.',
    isBestSeller: true,
    discount: 10,
    colors: ['Emerald', 'Charcoal', 'Burgundy'],
    material: 'Velvet',
    inStock: true
  },
  {
    id: '2',
    name: 'Minimalist Lounge Chair',
    category: 'chair',
    price: 850,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800',
    description: 'Clean lines and ergonomic design make this lounge chair a perfect addition to any modern study.',
    isBestSeller: true,
    colors: ['Oatmeal', 'Slate', 'Black'],
    material: 'Linen',
    inStock: true
  },
  {
    id: '3',
    name: 'Carrara Marble Dining Table',
    category: 'table',
    price: 3200,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=800',
    description: 'An architectural dining centerpiece composed of solid hand-selected Carrara marble and a fluted oak pedestal.',
    isBestSeller: true,
    colors: ['Carrara White', 'Marquina Black'],
    material: 'Marble',
    inStock: true,
    dimensions: "76cm H x 200cm W x 100cm D"
  },
  {
    id: '4',
    name: 'Aurelia Gold Leaf Chandelier',
    category: 'lighting',
    price: 1850,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1543294001-f7cbfe92237e?auto=format&fit=crop&q=80&w=800',
    description: 'A hand-hammered brass body dripping in luxury gold leaf scales, casting a warm, romantic glow.',
    isBestSeller: true,
    colors: ['Champagne Gold', 'Antique Brass'],
    material: 'Brass',
    inStock: true
  },
  {
    id: '5',
    name: 'Velvet Armchair',
    category: 'chair',
    price: 450,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&q=80&w=800',
    description: 'Soft velvet texture with elegant curves and custom polished metal endpoints.',
    colors: ['Rose', 'Teal'],
    material: 'Velvet',
    inStock: true
  },
  {
    id: '6',
    name: 'Travertine Fluted Coffee Table',
    category: 'table',
    price: 1450,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800',
    description: 'Carved from single-block Italian Travertine, featuring a fluted column frame that embodies ancient sculpture.',
    colors: ['Classic Cream', 'Noce Ivory'],
    material: 'Travertine',
    inStock: true,
    dimensions: "42cm H x 120cm W x 70cm D"
  },
  {
    id: '7',
    name: 'Sora Alabaster Table Lamp',
    category: 'lighting',
    price: 640,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800',
    description: 'A solid alabaster block sculpted into minimalist cylinders, emitting an ethereal ambient light through translucent mineral veins.',
    colors: ['Translucent Alabaster'],
    material: 'Alabaster',
    inStock: true
  }
];
