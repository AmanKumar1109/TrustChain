import React, { useState, useEffect, useRef } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Layers,
  QrCode,
  X,
  Edit2,
  Trash2,
  Upload,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';
import { ProductItem } from '../types';
import { api } from '../../../services/api';
import { toast } from '../../../services/toast';

const DEFAULT_IMAGE =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260423_164207_f243351d-ed59-48ec-83a0-a5e996bdbe3c.png&w=1280&q=85';

export const ProductsScreen: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modals & form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('Pharmaceutical');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch products from backend
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await api.products.getProducts({
        search: searchTerm || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
      });

      if (res.success && res.data) {
        const rawProducts = Array.isArray(res.data) ? res.data : res.data.products || [];
        const mapped: ProductItem[] = rawProducts.map((p: any) => ({
          id: p._id || p.id,
          sku: p.sku || 'SKU-UNKNOWN',
          name: p.name || 'Unnamed Product',
          category: p.category || 'General',
          description: p.description || '',
          image: p.images && p.images.length > 0 ? p.images[0] : (p.image || DEFAULT_IMAGE),
          price: p.price || 0,
          totalBatches: p.totalBatches || p.batchCount || 0,
          activeUnits: p.activeUnits || p.unitsCount || 0,
          createdAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN') : 'Recent',
        }));
        setProducts(mapped);
      }
    } catch (err: any) {
      console.warn('Failed to load products, using fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName('');
    setCategory('Pharmaceutical');
    setSku(`MED-CIP-${Math.floor(100 + Math.random() * 900)}`);
    setPrice(250);
    setDescription('');
    setSelectedFile(null);
    setImagePreview('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (prod: ProductItem) => {
    setEditingProduct(prod);
    setName(prod.name);
    setCategory(prod.category);
    setSku(prod.sku);
    setPrice((prod as any).price || 0);
    setDescription(prod.description);
    setSelectedFile(null);
    setImagePreview(prod.image);
    setShowAddModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('category', category);
      formData.append('sku', sku.toUpperCase().trim());
      formData.append('price', String(price));
      formData.append('description', description);
      if (selectedFile) {
        formData.append('images', selectedFile);
      }

      if (editingProduct) {
        const res = await api.products.updateProduct(editingProduct.id, formData);
        if (res.success) {
          toast.success('Product updated successfully!');
          setShowAddModal(false);
          fetchProducts();
        }
      } else {
        const res = await api.products.createProduct(formData);
        if (res.success) {
          toast.success('New product catalog entry registered!');
          setShowAddModal(false);
          fetchProducts();
        }
      }
    } catch (err: any) {
      console.error('Product save error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    setIsDeletingId(id);
    try {
      const res = await api.products.deleteProduct(id);
      if (res.success) {
        toast.success(`Product "${name}" deleted.`);
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err: any) {
      console.error('Delete error:', err);
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2
            className="text-3xl font-medium tracking-tight text-black"
            style={{ letterSpacing: '-0.03em' }}
          >
            Product Catalog
          </h2>
          <p className="text-black/60 text-sm mt-1">
            Manage your registered physical goods, assign SKUs, and view deployed batches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchProducts}
            disabled={isLoading}
            className="p-2.5 rounded-full bg-white hover:bg-black/5 text-black/70 border border-black/5 transition-colors cursor-pointer"
            title="Refresh Catalog"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-full text-xs font-medium hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-black/5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-black/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product name or SKU..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#F5F5F5] border border-black/5 text-black placeholder:text-black/40 text-xs font-medium focus:outline-none focus:border-black"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-black/40 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Category:
          </span>
          {['All', 'Pharmaceutical', 'Electronics', 'Cosmetics', 'Luxury', 'FMCG'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-black text-white'
                  : 'bg-[#F5F5F5] text-black/60 hover:text-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid or Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-5 border border-black/5 animate-pulse space-y-3">
              <div className="w-full h-36 bg-black/5 rounded-2xl" />
              <div className="h-4 bg-black/5 rounded w-1/3" />
              <div className="h-5 bg-black/5 rounded w-2/3" />
              <div className="h-3 bg-black/5 rounded w-full" />
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl p-5 border border-black/5 shadow-sm flex flex-col justify-between group hover:-translate-y-1 transition-all duration-200"
            >
              <div>
                <div
                  className="w-full h-36 rounded-2xl overflow-hidden mb-4 bg-[#F5F5F5] border border-black/5 relative group"
                  style={{
                    backgroundImage: `url("${prod.image}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-lg text-[10px] font-mono">
                    ₹{((prod as any).price || 0).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-black/50 bg-[#F5F5F5] px-2.5 py-0.5 rounded-full border border-black/5">
                    {prod.category}
                  </span>
                  <span className="text-[10px] font-mono font-medium text-black/40">{prod.sku}</span>
                </div>

                <h3 className="text-base font-medium text-black leading-snug mb-1">{prod.name}</h3>
                <p className="text-black/60 text-xs line-clamp-2 leading-relaxed mb-4">
                  {prod.description || 'Authentic registered pharmaceutical formulation.'}
                </p>
              </div>

              <div className="pt-3 border-t border-black/5">
                <div className="flex justify-between items-center text-xs text-black/60 mb-3">
                  <span>{prod.totalBatches} Minted Batches</span>
                  <span className="font-semibold text-black">{prod.activeUnits.toLocaleString()} units</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(prod)}
                    className="flex-1 py-2 text-xs font-medium bg-[#F5F5F5] hover:bg-black/5 rounded-xl transition-colors text-black flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-black/60" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(prod.id, prod.name)}
                    disabled={isDeletingId === prod.id}
                    className="p-2 text-xs font-medium bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors text-rose-700 flex items-center justify-center cursor-pointer"
                    title="Delete Product"
                  >
                    {isDeletingId === prod.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-black/5 shadow-sm space-y-4 max-w-md mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-[#F5F5F5] text-black/40 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-black">No Products Found</h3>
            <p className="text-xs text-black/60 mt-1">
              Add your first product line to start generating blockchain-verified batches.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-6 py-2.5 bg-black text-white rounded-full text-xs font-medium hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Add Your First Product
          </button>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/5 text-black max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-black/50 hover:text-black hover:bg-black/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-medium tracking-tight text-black mb-1">
              {editingProduct ? 'Edit Product Catalog Item' : 'Add New Product Line'}
            </h3>
            <p className="text-xs text-black/60 mb-6">
              Create an immutable SKU reference for production batch issuance and QR generation.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cipla Asthalin Inhaler 100mcg"
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black cursor-pointer"
                  >
                    <option value="Pharmaceutical">Pharmaceutical</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Cosmetics">Cosmetics</option>
                    <option value="Luxury">Luxury</option>
                    <option value="FMCG">FMCG</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="MED-CIP-ASTH-100"
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-mono uppercase focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                  Retail Price (INR)
                </label>
                <input
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="185"
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                  Product Description & Packaging Specs
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe unit dimensions, formulation, or packaging details..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black resize-none"
                />
              </div>

              {/* Product Image Upload */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                  Product Packaging Image (Optional)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-colors ${
                    selectedFile || imagePreview
                      ? 'border-emerald-500 bg-emerald-50/40'
                      : 'border-black/15 hover:border-black/30 bg-[#F5F5F5]'
                  }`}
                >
                  {imagePreview ? (
                    <div className="flex items-center justify-center gap-3">
                      <img src={imagePreview} alt="Preview" className="w-12 h-12 object-cover rounded-xl border border-black/10" />
                      <div className="text-left text-xs text-black/80 font-medium">
                        <div>{selectedFile ? selectedFile.name : 'Current Image'}</div>
                        <span className="text-[11px] text-emerald-700">Click to replace photo</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-5 h-5 mx-auto mb-1 text-black/50" />
                      <span className="text-xs text-black/60 font-medium">
                        Click to select packaging photo (PNG, JPG)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                      <span>Saving Product to Registry...</span>
                    </>
                  ) : (
                    <span>{editingProduct ? 'Save Changes' : 'Register Product in Catalog'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsScreen;
