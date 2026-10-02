const { z } = require('zod');

const createProductSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional().default(''),
  sku: z.string().min(2, 'SKU must be at least 2 characters'),
  price: z.preprocess(
    val => (val !== undefined && val !== '' ? Number(val) : 0),
    z.number().min(0, 'Price must be a positive number').optional().default(0)
  ),
  brand: z.string().optional(),
});

const updateProductSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  description: z.string().optional(),
  sku: z.string().min(2, 'SKU must be at least 2 characters').optional(),
  price: z.preprocess(
    val => (val !== undefined && val !== '' ? Number(val) : undefined),
    z.number().min(0, 'Price must be a positive number').optional()
  ),
  isActive: z.preprocess(
    val => (val === 'true' || val === true ? true : val === 'false' || val === false ? false : undefined),
    z.boolean().optional()
  ),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
};
