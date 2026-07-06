import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../data/mockData';
import { useProducts } from '../context/ProductContext';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2,
  DollarSign,
  Clock,
  X,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import ImageUpload from '../components/ImageUpload';
import HossanaLogo from '../components/HossanaLogo';
import { Product } from '../types';

const STATS = [
  { label: 'Total Revenue', value: '$124,500', icon: DollarSign, trend: '+12.5%', color: 'text-green-500' },
  { label: 'Active Orders', value: '42', icon: ShoppingCart, trend: '+8.2%', color: 'text-gold' },
  { label: 'Total Products', value: '158', icon: Package, trend: '+4', color: 'text-blue-500' },
  { label: 'Customer Trust', value: '98%', icon: Users, trend: '+1.4%', color: 'text-purple-500' },
];

export default function Admin() {
  const { user, login, isLoading } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/login', { state: { from: { pathname: '/admin' } } });
      }
    }
  }, [user, isLoading, navigate]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'sofa',
    price: '',
    description: '',
    image: '',
    material: '',
    colors: '',
    inStock: 'true',
    isBestSeller: false,
    discount: '',
    dimensions: '',
    features: '',
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    deleteProduct(id);
    toast.error('Product deleted successfully');
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'sofa',
      price: '',
      description: '',
      image: '',
      material: 'Wood',
      colors: 'Natural',
      inStock: 'true',
      isBestSeller: false,
      discount: '',
      dimensions: '',
      features: '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      description: product.description,
      image: product.image,
      material: product.material || 'Wood',
      colors: product.colors?.join(', ') || 'Natural',
      inStock: product.inStock !== false ? 'true' : 'false',
      isBestSeller: !!product.isBestSeller,
      discount: product.discount?.toString() || '',
      dimensions: product.dimensions || '',
      features: product.features?.join(', ') || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Explicit Validation to prevent silent blocking on scrolled elements
    if (!formData.name.trim()) {
      toast.error('Piece Name is required. Please specify a name for this masterpiece.');
      return;
    }
    
    const priceVal = Number(formData.price);
    if (!formData.price || isNaN(priceVal) || priceVal <= 0) {
      toast.error('A valid custom price greater than $0 is required.');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('A product description is required.');
      return;
    }

    const colorsArr = formData.colors ? formData.colors.split(',').map(c => c.trim()).filter(Boolean) : ['Natural'];
    const featuresArr = formData.features ? formData.features.split(',').map(f => f.trim()).filter(Boolean) : [];
    const discountVal = formData.discount ? Number(formData.discount) : undefined;
    const isBestSellerVal = formData.isBestSeller;
    const inStockVal = formData.inStock === 'true';
    const materialVal = formData.material || 'Wood';
    const dimensionsVal = formData.dimensions || undefined;

    const updatedProductData = {
      name: formData.name,
      category: formData.category,
      price: priceVal,
      description: formData.description,
      image: formData.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
      material: materialVal,
      colors: colorsArr,
      inStock: inStockVal,
      isBestSeller: isBestSellerVal,
      discount: discountVal,
      dimensions: dimensionsVal,
      features: featuresArr
    };

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        ...updatedProductData
      });
      toast.success('Product updated successfully');
    } else {
      addProduct(updatedProductData);
      toast.success('Product added successfully');
    }
    
    setIsDialogOpen(false);
  };

  if (user && user.role !== 'admin') {
    return (
      <div className="pt-32 min-h-screen bg-[#050505] text-white pb-24 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg bg-[#0e0a08]/90 border border-white/5 rounded-[40px] p-10 text-center relative overflow-hidden shadow-2xl backdrop-blur-xl"
        >
          {/* Subtle glow background */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold/10 rounded-full blur-3xl" />
          
          <HossanaLogo size={64} variant="brand" className="mx-auto mb-6 transition-all duration-500 hover:scale-105" />
          
          <span className="text-gold uppercase tracking-[0.25em] text-[10px] font-black mb-3 block">Elevated Access Required</span>
          <h2 className="text-3xl font-serif font-bold text-white uppercase tracking-tight mb-4">Master Curator Portal</h2>
          
          <p className="text-gray-400 text-sm font-light leading-relaxed mb-8">
            You are currently logged in with a standard patron license. To access the interactive management console, configure collections, and fulfill masterpiece orders in the sandbox, please bypass or switch to admin credentials.
          </p>
          
          <div className="space-y-4">
            <Button
              onClick={async () => {
                try {
                  const loader = toast.loading("Elevating session authorization...");
                  await login("admin@hossana.com");
                  toast.dismiss(loader);
                  toast.success("Successfully authenticated as Master Curator!");
                } catch (err) {
                  toast.dismiss();
                  toast.error("Failed to authenticate.");
                }
              }}
              className="w-full bg-white text-black hover:bg-gold hover:text-black font-bold uppercase tracking-widest text-xs h-14 rounded-2xl shadow-lg transition-all border-none animate-bounce"
            >
              Sign In to Admin Panel &rarr;
            </Button>
            
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-white font-bold uppercase tracking-widest text-[9px] transition-colors bg-transparent border-none outline-none block mx-auto mt-2 cursor-pointer"
            >
              Return to main showroom
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 min-h-screen bg-background pb-24">
      <div className="container mx-auto px-6">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 border-b border-white/5 pb-10">
          <div>
            <span className="text-gold uppercase tracking-[0.3em] text-[10px] font-bold mb-2 block">Management Console</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white uppercase tracking-tighter">Admin Dashboard</h1>
          </div>
          <div className="flex gap-3">
             <Button 
                onClick={handleOpenAdd}
                className="bg-white text-black hover:bg-gold hover:text-black font-bold uppercase tracking-widest text-[10px] h-12 px-8 rounded-xl shadow-xl transition-all"
             >
                <Plus className="w-4 h-4 mr-2" /> Add Piece
             </Button>
          </div>
        </div>

        {/* Form Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
           <DialogContent className="bg-luxury-dark border border-white/5 text-white sm:max-w-[550px] rounded-[32px] overflow-hidden">
              <DialogHeader>
                 <DialogTitle className="text-2xl font-serif text-gold">
                    {editingProduct ? 'Edit Masterpiece' : 'Add New Piece'}
                 </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 pt-2">
                 {/* Scrollable inputs container to keep it ultra-mobile/multi-screen friendly */}
                 <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-5 custom-scrollbar">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-slate-400">Name</Label>
                          <Input 
                             value={formData.name}
                             onChange={e => setFormData({...formData, name: e.target.value})}
                             className="bg-black/40 border-white/10 text-white focus:border-gold/50" 
                          />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-slate-400">Price ($)</Label>
                          <Input 
                             type="number"
                             value={formData.price}
                             onChange={e => setFormData({...formData, price: e.target.value})}
                             className="bg-black/40 border-white/10 text-white focus:border-gold/50" 
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-slate-400">Category</Label>
                          <Select 
                             value={formData.category} 
                             onValueChange={v => setFormData({...formData, category: v})}
                          >
                             <SelectTrigger className="bg-black/40 border-white/10 text-white">
                                <SelectValue placeholder="Select Category" />
                             </SelectTrigger>
                             <SelectContent className="bg-luxury-dark border-white/10 text-white">
                                {CATEGORIES.map(cat => (
                                   <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                ))}
                             </SelectContent>
                          </Select>
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-slate-400">Material</Label>
                          <Input 
                             placeholder="e.g. Oak Wood, Velvet, Brass"
                             value={formData.material || ''}
                             onChange={e => setFormData({...formData, material: e.target.value})}
                             className="bg-black/40 border-white/10 text-white focus:border-gold/50" 
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-slate-400">Colors (comma-separated)</Label>
                          <Input 
                             placeholder="e.g. Emerald, Charcoal, Slate"
                             value={formData.colors || ''}
                             onChange={e => setFormData({...formData, colors: e.target.value})}
                             className="bg-black/40 border-white/10 text-white focus:border-gold/50" 
                          />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-slate-400">Dimensions</Label>
                          <Input 
                             placeholder="e.g. 75H x 140W x 85D cm"
                             value={formData.dimensions || ''}
                             onChange={e => setFormData({...formData, dimensions: e.target.value})}
                             className="bg-black/40 border-white/10 text-white focus:border-gold/50" 
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-slate-400">Discount (%)</Label>
                          <Input 
                             type="number"
                             placeholder="e.g. 10"
                             value={formData.discount || ''}
                             onChange={e => setFormData({...formData, discount: e.target.value})}
                             className="bg-black/40 border-white/10 text-white focus:border-gold/50" 
                          />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-slate-400">Availability</Label>
                          <Select 
                             value={formData.inStock} 
                             onValueChange={v => setFormData({...formData, inStock: v})}
                          >
                             <SelectTrigger className="bg-black/40 border-white/10 text-white">
                                <SelectValue placeholder="Availability" />
                             </SelectTrigger>
                             <SelectContent className="bg-luxury-dark border-white/10 text-white">
                                <SelectItem value="true">In Stock</SelectItem>
                                <SelectItem value="false">Out of Stock</SelectItem>
                             </SelectContent>
                          </Select>
                       </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-2 pb-1">
                       <input 
                          type="checkbox"
                          id="isBestSeller"
                          checked={formData.isBestSeller}
                          onChange={e => setFormData({...formData, isBestSeller: e.target.checked})}
                          className="rounded border-white/10 bg-black/40 text-gold focus:ring-gold accent-gold w-4 h-4 cursor-pointer"
                       />
                       <Label htmlFor="isBestSeller" className="text-xs uppercase tracking-wider text-slate-200 cursor-pointer">Mark as Best Seller</Label>
                    </div>

                    <div className="space-y-2">
                       <Label className="text-[10px] uppercase tracking-widest text-slate-400">Custom Highlights / Features (comma-separated)</Label>
                       <Input 
                          placeholder="e.g. Hand-tufted velvet, Solid wood frame"
                          value={formData.features || ''}
                          onChange={e => setFormData({...formData, features: e.target.value})}
                          className="bg-black/40 border-white/10 text-white focus:border-gold/50" 
                       />
                    </div>

                    <div className="space-y-2">
                       <Label className="text-[10px] uppercase tracking-widest text-slate-400">Product Image</Label>
                       <ImageUpload 
                          value={formData.image}
                          onChange={url => setFormData({...formData, image: url})}
                       />
                    </div>

                    <div className="space-y-2">
                       <Label className="text-[10px] uppercase tracking-widest text-slate-400">Description</Label>
                       <Textarea 
                          value={formData.description}
                          onChange={e => setFormData({...formData, description: e.target.value})}
                          className="bg-black/40 border-white/10 h-24 text-white focus:border-gold/50" 
                       />
                    </div>
                 </div>

                 <DialogFooter className="pt-2 border-t border-white/5">
                    <Button type="submit" className="w-full bg-gold text-black hover:bg-white font-bold uppercase tracking-widest text-xs h-12 rounded-xl transition-all">
                       {editingProduct ? 'Save Changes' : 'Add to Collection'}
                    </Button>
                 </DialogFooter>
              </form>
           </DialogContent>
        </Dialog>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-luxury-dark border-white/5 p-6 rounded-[30px] flex flex-col gap-4">
                 <div className="flex justify-between items-start">
                    <div className={stat.color}>
                       <stat.icon className="w-6 h-6" />
                    </div>
                    <Badge className="bg-white/5 text-gray-400 border-none text-[10px] font-bold">{stat.trend}</Badge>
                 </div>
                 <div>
                    <p className="text-3xl font-serif font-bold text-white">{stat.value}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold mt-1">{stat.label}</p>
                 </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Content Tabs */}
        <div className="bg-luxury-dark/40 border border-white/5 rounded-[40px] p-8 backdrop-blur-md">
           <div className="flex gap-8 mb-8 border-b border-white/5">
              <button 
                 onClick={() => setActiveTab('products')}
                 className={`pb-4 text-xs font-bold uppercase tracking-[0.2em] transition-all relative ${activeTab === 'products' ? 'text-gold' : 'text-gray-500'}`}
              >
                 Inventory
                 {activeTab === 'products' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-[2px] bg-gold" />}
              </button>
              <button 
                 onClick={() => setActiveTab('orders')}
                 className={`pb-4 text-xs font-bold uppercase tracking-[0.2em] transition-all relative ${activeTab === 'orders' ? 'text-gold' : 'text-gray-500'}`}
              >
                 Recent Orders
                 {activeTab === 'orders' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-[2px] bg-gold" />}
              </button>
           </div>

           {activeTab === 'products' ? (
              <div className="space-y-6">
                 <div className="flex justify-between items-center gap-4 flex-wrap">
                    <div className="relative max-w-sm w-full">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                       <Input 
                          placeholder="Search inventory..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-12 bg-black/40 border-white/10 rounded-xl focus:border-gold/50" 
                       />
                    </div>
                 </div>

                 <div className="hidden sm:block overflow-hidden rounded-2xl border border-white/5">
                    <Table>
                       <TableHeader className="bg-white/5">
                          <TableRow>
                             <TableHead className="text-gray-400 uppercase tracking-widest text-[10px]">Product</TableHead>
                             <TableHead className="text-gray-400 uppercase tracking-widest text-[10px]">Category</TableHead>
                             <TableHead className="text-gray-400 uppercase tracking-widest text-[10px]">Price</TableHead>
                             <TableHead className="text-gray-400 uppercase tracking-widest text-[10px]">Rating</TableHead>
                             <TableHead className="text-gray-400 uppercase tracking-widest text-[10px] text-right">Actions</TableHead>
                          </TableRow>
                       </TableHeader>
                       <TableBody>
                          {filteredProducts.map((p) => (
                             <TableRow key={p.id} className="border-white/5 hover:bg-white/5 transition-colors">
                                <TableCell className="py-4">
                                   <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10">
                                         <img src={p.image} className="w-full h-full object-cover" />
                                      </div>
                                      <span className="text-white font-medium">{p.name}</span>
                                   </div>
                                </TableCell>
                                <TableCell><Badge variant="outline" className="border-white/10 text-gray-400 uppercase tracking-tighter text-[10px]">{p.category}</Badge></TableCell>
                                <TableCell className="text-white font-serif font-bold">${p.price.toLocaleString()}</TableCell>
                                <TableCell>
                                   <div className="flex items-center gap-1">
                                      <Star className="w-3 h-3 text-gold fill-gold" />
                                      <span className="text-xs">{p.rating}</span>
                                   </div>
                                </TableCell>
                                <TableCell className="text-right">
                                   <div className="flex justify-end gap-2">
                                      <Button 
                                         onClick={() => handleEdit(p)}
                                         variant="ghost" size="icon" className="hover:text-gold"
                                      >
                                         <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button 
                                         onClick={() => handleDelete(p.id)}
                                         variant="ghost" size="icon" className="hover:text-red-500"
                                      >
                                         <Trash2 className="w-4 h-4" />
                                      </Button>
                                   </div>
                                </TableCell>
                             </TableRow>
                          ))}
                       </TableBody>
                    </Table>
                 </div>

                 {/* Mobile Card View */}
                 <div className="block sm:hidden space-y-4">
                    {filteredProducts.length === 0 ? (
                       <p className="text-center text-xs text-gray-500 py-8">No products found matching your search.</p>
                    ) : (
                       filteredProducts.map((p) => (
                          <div key={p.id} className="bg-[#120d0aa0] border border-white/5 p-4 rounded-3xl flex flex-col gap-4">
                             <div className="flex gap-4">
                                <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                                   <img src={p.image} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                   <h4 className="text-white font-medium text-sm truncate">{p.name}</h4>
                                   <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="border-white/10 text-gray-400 uppercase tracking-tighter text-[9px] py-0 px-2">{p.category}</Badge>
                                      <div className="flex items-center gap-1 text-[11px] text-gray-400">
                                         <Star className="w-2.5 h-2.5 text-gold fill-gold" />
                                         <span className="text-xs text-gray-400">{p.rating}</span>
                                      </div>
                                   </div>
                                   <p className="text-gold font-serif font-bold text-sm mt-1.5">${p.price.toLocaleString()}</p>
                                 </div>
                             </div>
                             <div className="flex gap-2 justify-end border-t border-white/5 pt-3">
                                <Button 
                                   onClick={() => handleEdit(p)}
                                   variant="outline" 
                                   size="sm" 
                                   className="h-10 text-xs text-gray-300 border-white/10 hover:border-gold hover:text-gold flex-1 bg-transparent rounded-xl"
                                >
                                   <Edit className="w-3.5 h-3.5 mr-1" />
                                   Edit
                                </Button>
                                <Button 
                                   onClick={() => handleDelete(p.id)}
                                   variant="outline" 
                                   size="sm" 
                                   className="h-10 text-xs text-red-500 hover:text-white border-white/10 hover:border-red-500 hover:bg-red-500/20 flex-1 bg-transparent rounded-xl"
                                >
                                   <Trash2 className="w-3.5 h-3.5 mr-1" />
                                   Delete
                                </Button>
                             </div>
                          </div>
                       ))
                    )}
                 </div>
              </div>
           ) : (
              <div className="py-20 text-center text-gray-500 flex flex-col items-center gap-4">
                 <Clock className="w-12 h-12 text-gold/20" />
                 <p className="font-light italic">Order history integration coming soon with Firebase synchronization.</p>
              </div>
           )}
        </div>
      </div>
    </div>
  );
}

function Star(props: any) {
   return (
      <svg
         {...props}
         xmlns="http://www.w3.org/2000/svg"
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
      >
         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
   )
}
