import { ProductInput, GeneratedContent, WorkflowRun, ABBTestResult } from '../types';

class Database {
  private products: Map<string, ProductInput> = new Map();
  private content: Map<string, GeneratedContent> = new Map();
  private workflows: Map<string, WorkflowRun> = new Map();
  private abTests: Map<string, ABBTestResult> = new Map();

  // Products
  addProduct(product: ProductInput): ProductInput {
    this.products.set(product.id, product);
    return product;
  }

  getProduct(id: string): ProductInput | undefined {
    return this.products.get(id);
  }

  getAllProducts(): ProductInput[] {
    return Array.from(this.products.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // Content
  addContent(content: GeneratedContent): GeneratedContent {
    this.content.set(content.id, content);
    return content;
  }

  getContent(id: string): GeneratedContent | undefined {
    return this.content.get(id);
  }

  getContentByProduct(productId: string): GeneratedContent[] {
    return Array.from(this.content.values())
      .filter(c => c.productId === productId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getAllContent(): GeneratedContent[] {
    return Array.from(this.content.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  updateContentStatus(id: string, status: GeneratedContent['status']): GeneratedContent | undefined {
    const content = this.content.get(id);
    if (content) {
      content.status = status;
      if (status === 'published') {
        content.publishedAt = new Date().toISOString();
      }
      this.content.set(id, content);
    }
    return content;
  }

  // Workflows
  addWorkflow(workflow: WorkflowRun): WorkflowRun {
    this.workflows.set(workflow.id, workflow);
    return workflow;
  }

  getWorkflow(id: string): WorkflowRun | undefined {
    return this.workflows.get(id);
  }

  getAllWorkflows(): WorkflowRun[] {
    return Array.from(this.workflows.values()).sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
  }

  updateWorkflow(workflow: WorkflowRun): WorkflowRun {
    this.workflows.set(workflow.id, workflow);
    return workflow;
  }

  // A/B Tests
  addABTest(test: ABBTestResult): ABBTestResult {
    this.abTests.set(test.contentId, test);
    return test;
  }

  getAllABTests(): ABBTestResult[] {
    return Array.from(this.abTests.values());
  }

  // Analytics
  getMetrics() {
    const allContent = this.getAllContent();
    const published = allContent.filter(c => c.status === 'published');

    const avgCTR = published.length > 0 
      ? published.reduce((sum, c) => sum + c.performance.ctr, 0) / published.length 
      : 0;

    const avgEngagement = published.length > 0 
      ? published.reduce((sum, c) => sum + c.performance.engagement, 0) / published.length 
      : 0;

    const contentByType: Record<string, number> = {};
    allContent.forEach(c => {
      contentByType[c.type] = (contentByType[c.type] || 0) + 1;
    });

    const topPerforming = [...allContent]
      .sort((a, b) => (b.performance.ctr * b.performance.engagement) - (a.performance.ctr * a.performance.engagement))
      .slice(0, 5);

    return {
      totalProducts: this.products.size,
      totalContentPieces: allContent.length,
      avgCTR: parseFloat(avgCTR.toFixed(2)),
      avgEngagement: parseFloat(avgEngagement.toFixed(2)),
      topPerformingContent: topPerforming,
      recentWorkflows: this.getAllWorkflows().slice(0, 5),
      contentByType,
    };
  }
}

export const db = new Database();
