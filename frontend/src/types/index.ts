export interface ProductInput {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  targetAudience: string;
  brandVoice: 'professional' | 'casual' | 'playful' | 'luxury';
  createdAt: string;
}

export interface GeneratedContent {
  id: string;
  productId: string;
  type: 'ad_script' | 'product_description' | 'seo_blog' | 'ad_headlines' | 'social_post' | 'email_sequence';
  content: string;
  variation: 'A' | 'B';
  metadata: {
    tone: string;
    keywords: string[];
    wordCount: number;
    estimatedReadTime: number;
  };
  performance: {
    ctr: number;
    engagement: number;
    conversion: number;
    impressions: number;
    clicks: number;
  };
  status: 'generated' | 'published' | 'archived';
  createdAt: string;
  publishedAt?: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  duration: number;
  output?: string;
  error?: string;
}

export interface WorkflowRun {
  id: string;
  productId: string;
  status: 'running' | 'completed' | 'failed';
  steps: WorkflowStep[];
  startedAt: string;
  completedAt?: string;
}

export interface DashboardMetrics {
  totalProducts: number;
  totalContentPieces: number;
  avgCTR: number;
  avgEngagement: number;
  topPerformingContent: GeneratedContent[];
  recentWorkflows: WorkflowRun[];
  contentByType: Record<string, number>;
}

export interface ABBTestResult {
  contentId: string;
  variationA: GeneratedContent;
  variationB: GeneratedContent;
  winner: 'A' | 'B' | 'tie';
  confidence: number;
  improvement: number;
}

export interface PerformanceData {
  date: string;
  impressions: number;
  clicks: number;
  ctr: number;
}
