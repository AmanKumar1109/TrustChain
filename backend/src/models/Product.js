const mongoose = require('mongoose');

const productImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      default: 'product.jpg',
    },
    originalName: {
      type: String,
      default: 'product.jpg',
    },
    path: {
      type: String,
      default: '',
    },
    mimetype: {
      type: String,
      default: 'image/jpeg',
    },
    size: {
      type: Number,
      default: 0,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    sku: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    images: [productImageSchema],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      default: null,
    },
    brandName: {
      type: String,
      trim: true,
      default: '',
    },
    manufacturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    mrp: {
      type: Number,
      default: 0,
      min: 0,
    },
    protectionLevelDefault: {
      type: String,
      default: 'Standard',
    },
    warrantyPeriodMonths: {
      type: Number,
      default: 12,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-convert string image URLs to schema objects if needed
productSchema.pre('validate', function(next) {
  if (Array.isArray(this.images)) {
    this.images = this.images.map(img => {
      if (typeof img === 'string') {
        return { url: img, filename: 'product.jpg', originalName: 'product.jpg', path: img, mimetype: 'image/jpeg', size: 1024 };
      }
      return img;
    });
  }
  if (this.mrp && !this.price) {
    this.price = this.mrp;
  }
  next();
});

// Compound index to ensure SKU is unique per manufacturer
productSchema.index({ manufacturer: 1, sku: 1 }, { unique: true });

// Text index for search functionality
productSchema.index({ name: 'text', description: 'text', sku: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
