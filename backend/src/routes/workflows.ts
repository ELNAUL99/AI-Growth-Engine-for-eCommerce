import { Router } from 'express';
import { db } from '../models/database';

const router = Router();

// GET /api/workflows - List all workflows
router.get('/', (req, res) => {
  const workflows = db.getAllWorkflows();
  res.json({ success: true, data: workflows });
});

// GET /api/workflows/:id - Get single workflow
router.get('/:id', (req, res) => {
  const workflow = db.getWorkflow(req.params.id);
  if (!workflow) {
    return res.status(404).json({ success: false, error: 'Workflow not found' });
  }
  res.json({ success: true, data: workflow });
});

export default router;
