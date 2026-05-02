import { WorkflowRun, WorkflowStep, ProductInput } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { db } from './database';
import { generateAllContent } from '../services/aiService';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function runWorkflow(product: ProductInput): Promise<WorkflowRun> {
  const workflowId = uuidv4();

  const steps: WorkflowStep[] = [
    { id: uuidv4(), name: 'Validate Product Input', status: 'pending', duration: 0 },
    { id: uuidv4(), name: 'Generate Ad Script', status: 'pending', duration: 0 },
    { id: uuidv4(), name: 'Generate Product Description', status: 'pending', duration: 0 },
    { id: uuidv4(), name: 'Generate SEO Blog Post', status: 'pending', duration: 0 },
    { id: uuidv4(), name: 'Generate Ad Headlines', status: 'pending', duration: 0 },
    { id: uuidv4(), name: 'Generate Social Media Posts', status: 'pending', duration: 0 },
    { id: uuidv4(), name: 'Generate Email Sequence', status: 'pending', duration: 0 },
    { id: uuidv4(), name: 'Store Content in Database', status: 'pending', duration: 0 },
    { id: uuidv4(), name: 'Run A/B Test Simulation', status: 'pending', duration: 0 },
  ];

  const workflow: WorkflowRun = {
    id: workflowId,
    productId: product.id,
    status: 'running',
    steps,
    startedAt: new Date().toISOString(),
  };

  db.addWorkflow(workflow);

  // Step 1: Validate
  await executeStep(workflow, 0, async () => {
    await sleep(500);
    if (!product.name || !product.description) {
      throw new Error('Product name and description are required');
    }
    return 'Product input validated successfully';
  });

  // Step 2-7: Generate content
  const contentTypes = [
    { index: 1, name: 'Ad Script' },
    { index: 2, name: 'Product Description' },
    { index: 3, name: 'SEO Blog' },
    { index: 4, name: 'Ad Headlines' },
    { index: 5, name: 'Social Posts' },
    { index: 6, name: 'Email Sequence' },
  ];

  let generatedContent: any[] = [];

  for (const { index, name } of contentTypes) {
    await executeStep(workflow, index, async () => {
      await sleep(800 + Math.random() * 1000);
      return `Generated ${name} (Variations A & B)`;
    });
  }

  // Actually generate content
  try {
    generatedContent = await generateAllContent(product);
    generatedContent.forEach(c => db.addContent(c));
  } catch (error) {
    workflow.status = 'failed';
    db.updateWorkflow(workflow);
    throw error;
  }

  // Step 8: Store
  await executeStep(workflow, 7, async () => {
    await sleep(300);
    return `Stored ${generatedContent.length} content pieces`;
  });

  // Step 9: A/B Test
  await executeStep(workflow, 8, async () => {
    await sleep(600);
    // Simulate A/B test results
    const types = ['ad_script', 'product_description', 'seo_blog'];
    for (const type of types) {
      const items = generatedContent.filter(c => c.type === type);
      if (items.length >= 2) {
        const a = items.find(c => c.variation === 'A')!;
        const b = items.find(c => c.variation === 'B')!;
        const scoreA = a.performance.ctr * a.performance.engagement;
        const scoreB = b.performance.ctr * b.performance.engagement;
        const winner = scoreA > scoreB ? 'A' : scoreB > scoreA ? 'B' : 'tie';
        const improvement = winner === 'A' 
          ? ((scoreA - scoreB) / scoreB * 100) 
          : winner === 'B' 
            ? ((scoreB - scoreA) / scoreA * 100) 
            : 0;

        db.addABTest({
          contentId: a.id,
          variationA: a,
          variationB: b,
          winner,
          confidence: parseFloat((85 + Math.random() * 14).toFixed(1)),
          improvement: parseFloat(improvement.toFixed(1)),
        });
      }
    }
    return 'A/B test simulation completed';
  });

  workflow.status = 'completed';
  workflow.completedAt = new Date().toISOString();
  db.updateWorkflow(workflow);

  return workflow;
}

async function executeStep(
  workflow: WorkflowRun, 
  stepIndex: number, 
  action: () => Promise<string>
): Promise<void> {
  const step = workflow.steps[stepIndex];
  const startTime = Date.now();

  step.status = 'running';
  db.updateWorkflow(workflow);

  try {
    const output = await action();
    step.status = 'completed';
    step.output = output;
  } catch (error) {
    step.status = 'failed';
    step.error = error instanceof Error ? error.message : 'Unknown error';
    workflow.status = 'failed';
    db.updateWorkflow(workflow);
    throw error;
  }

  step.duration = Date.now() - startTime;
  db.updateWorkflow(workflow);
}
