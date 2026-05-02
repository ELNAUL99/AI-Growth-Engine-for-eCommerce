import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../models/database';
import { runWorkflow } from '../services/workflowEngine';
import { ProductInput } from '../types';

const router = Router();

// GET /api/products - List all products
router.get('/', (req, res) => {
  const products = db.getAllProducts();
  res.json({ success: true, data: products });
});

// GET /api/products/:id - Get single product
router.get('/:id', (req, res) => {
  const product = db.getProduct(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  res.json({ success: true, data: product });
});

// POST /api/products - Create product and trigger workflow
router.post('/', async (req, res) => {
  try {
    const { name, description, category, price, targetAudience, brandVoice } = req.body;

    if (!name || !description) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name and description are required' 
      });
    }

    const product: ProductInput = {
      id: uuidv4(),
      name,
      description,
      category: category || 'General',
      price: price || 0,
      targetAudience: targetAudience || 'General consumers',
      brandVoice: brandVoice || 'casual',
      createdAt: new Date().toISOString(),
    };

    db.addProduct(product);

    // Start workflow asynchronously
    runWorkflow(product).catch(console.error);

    res.status(201).json({ 
      success: true, 
      data: product,
      message: 'Product created. AI content generation started.'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Server error' 
    });
  }
});

export default router;
