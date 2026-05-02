import { Router } from 'express';
import { db } from '../models/database';

const router = Router();

// GET /api/analytics/metrics - Get dashboard metrics
router.get('/metrics', (req, res) => {
  const metrics = db.getMetrics();
  res.json({ success: true, data: metrics });
});

// GET /api/analytics/ab-tests - Get A/B test results
router.get('/ab-tests', (req, res) => {
  const tests = db.getAllABTests();
  res.json({ success: true, data: tests });
});

// GET /api/analytics/performance - Get performance over time
router.get('/performance', (req, res) => {
  const content = db.getAllContent().filter(c => c.status === 'published');

  const dailyData = content.reduce((acc, c) => {
    const date = new Date(c.createdAt).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = { date, impressions: 0, clicks: 0, ctr: 0, count: 0 };
    }
    acc[date].impressions += c.performance.impressions;
    acc[date].clicks += c.performance.clicks;
    acc[date].ctr += c.performance.ctr;
    acc[date].count += 1;
    return acc;
  }, {} as Record<string, any>);

  const performance = Object.values(dailyData).map((d: any) => ({
    date: d.date,
    impressions: d.impressions,
    clicks: d.clicks,
    ctr: parseFloat((d.ctr / d.count).toFixed(2)),
  }));

  res.json({ success: true, data: performance });
});

export default router;
