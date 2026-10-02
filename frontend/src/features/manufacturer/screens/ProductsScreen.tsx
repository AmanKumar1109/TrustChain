import React, { useState } from 'react';
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
} from 'lucide-react';
import { ProductItem } from '../types';

export const ProductsScreen: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>([
    {
      id: 'prod-1',
      sku: 'MED-CIP-ASTH-100',
      name: 'Cipla Asthalin Inhaler 100mcg',
      category: 'Pharmaceutical',
      description: 'Salbutamol inhalation aerosol with dose counter for bronchospasm relief.',
      image:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260423_164207_f243351d-ed59-48ec-83a0-a5e996bdbe3c.png&w=1280&q=85',
      totalBatches: 28,
      activeUnits: 280000,
      createdAt: '12 Jan 2026',
    },
    {
      id: 'prod-2',
      sku: 'MED-CIP-MONT-10',
      name: 'Cipla Montair-LC Tablets',
      category: 'Pharmaceutical',
      description: 'Montelukast and Levocetirizine anti-allergy formulation 10mg.',
      image:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260423_164207_f243351d-ed59-48ec-83a0-a5e996bdbe3c.png&w=1280&q=85',
      totalBatches: 42,
      activeUnits: 420000,
      createdAt: '04 Feb 2026',
    },
    {
      id: 'prod-3',
      sku: 'MED-CIP-BUD-400',
      name: 'Cipla Foracort 400 Rotacaps',
      category: 'Pharmaceutical',
      description: 'Budesonide and Formoterol Fumarate powder for dry inhalation.',
      image:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260423_164207_f243351d-ed59-48ec-83a0-a5e996bdbe3c.png&w=1280&q=85',
      totalBatches: 18,
      activeUnits: 180000,
      createdAt: '18 Mar 2026',
    },
    {
      id: 'prod-4',
      sku: 'MED-CIP-OMID-20',
      name: 'Cipla Omez 20mg Capsules',
      category: 'Pharmaceutical',
      description: 'Omeprazole gastro-resistant capsules for acid reduction.',
      image:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260423_164207_f243351d-ed59-48ec-83a0-a5e996bdbe3c.png&w=1280&q=85',
      totalBatches: 36,
      activeUnits: 360000,
      createdAt: '22 Apr 2026',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Pharmaceutical' as ProductItem['category'],
    sku: '',
    description: '',
    image:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260423_164207_f243351d-ed59-48ec-83a0-a5e996bdbe3c.png&w=1280&q=85',
  });

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Pharmaceutical',
      sku: '',
      description: '',
      image:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260423_164207_f243351d-ed59-48ec-83a0-a5e996bdbe3c.png&w=1280&q=85',
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (prod: ProductItem) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      category: prod.category,
      sku: prod.sku,
      description: prod.description,
      image: prod.image,
    });
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? { ...p, ...formData }
            : p
        )
      );
    } else {
      const newProd: ProductItem = {
        id: `prod-${Date.now()}`,
        sku: formData.sku || `SKU-${Date.now().toString().slice(-6)}`,
        name: formData.name,
        category: formData.category,
        description: formData.description,
        image: formData.image,
        totalBatches: 0,
        activeUnits: 0,
        createdAt: 'Just now',
      };
      setProducts([newProd, ...products]);
    }
    setShowAddModal(false);
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

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-full text-xs font-medium hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-black/5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-black/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product name or SKU..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#F5F5F5] border border-black/5 text-black placeholder:text-black/40 text-xs font-medium focus:outline-none focus:border-black"
          />
        </div>

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
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
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

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-3xl p-5 border border-black/5 shadow-sm flex flex-col justify-between group hover:-translate-y-1 transition-all duration-200"
          >
            <div>
              <div
                className="w-full h-36 rounded-2xl overflow-hidden mb-4 bg-[#F5F5F5] border border-black/5"
                style={{
                  backgroundImage: `url("${prod.image}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />

              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-black/50 bg-[#F5F5F5] px-2.5 py-0.5 rounded-full border border-black/5">
                  {prod.category}
                </span>
                <span className="text-[10px] font-mono font-medium text-black/40">{prod.sku}</span>
              </div>

              <h3 className="text-base font-medium text-black leading-snug mb-1">{prod.name}</h3>
              <p className="text-black/60 text-xs line-clamp-2 leading-relaxed mb-4">
                {prod.description}
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
                  className="flex-1 py-2 text-xs font-medium bg-[#F5F5F5] hover:bg-black/5 rounded-xl transition-colors text-black flex items-center justify-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5 text-black/60" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/5 text-black">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-black/50 hover:text-black hover:bg-black/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-medium tracking-tight text-black mb-1">
              {editingProduct ? 'Edit Product Line' : 'Add New Product Line'}
            </h3>
            <p className="text-xs text-black/60 mb-6">
              Create an immutable SKU reference for Polygon blockchain batch issuance.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as ProductItem['category'],
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
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
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="MED-CIP-ASTH-100"
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-mono uppercase focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                  Product Description & Packaging Specs
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe unit dimensions, formulation, or packaging details..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors shadow-sm"
                >
                  {editingProduct ? 'Save Changes' : 'Register Product on Polygon'}
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
