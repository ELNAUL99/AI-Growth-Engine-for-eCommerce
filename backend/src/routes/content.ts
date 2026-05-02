import { Router } from 'express';
import { db } from '../models/database';

const router = Router();

// GET /api/content - List all content
router.get('/', (req, res) => {
  const { productId, type, status } = req.query;
  let content = db.getAllContent();

  if (productId) {
    content = content.filter(c => c.productId === productId);
  }
  if (type) {
    content = content.filter(c => c.type === type);
  }
  if (status) {
    content = content.filter(c => c.status === status);
  }

  res.json({ success: true, data: content });
});

// GET /api/content/:id - Get single content
router.get('/:id', (req, res) => {
  const content = db.getContent(req.params.id);
  if (!content) {
    return res.status(404).json({ success: false, error: 'Content not found' });
  }
  res.json({ success: true, data: content });
});

// POST /api/content/:id/publish - Publish content
router.post('/:id/publish', (req, res) => {
  const content = db.updateContentStatus(req.params.id, 'published');
  if (!content) {
    return res.status(404).json({ success: false, error: 'Content not found' });
  }
  res.json({ success: true, data: content, message: 'Content published successfully' });
});

// POST /api/content/:id/archive - Archive content
router.post('/:id/archive', (req, res) => {
  const content = db.updateContentStatus(req.params.id, 'archived');
  if (!content) {
    return res.status(404).json({ success: false, error: 'Content not found' });
  }
  res.json({ success: true, data: content, message: 'Content archived' });
});

export default router;
