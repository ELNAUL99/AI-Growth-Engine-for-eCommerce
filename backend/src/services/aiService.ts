import { GeneratedContent, ProductInput } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Simulated AI content generation - works without API key
// In production, replace with actual OpenAI calls

const AD_TEMPLATES = [
  "🔥 Stop scrolling! {name} is about to change how you {benefit}. Watch till the end! 👇",
  "POV: You just discovered {name} and your life will never be the same ✨",
  "I was skeptical about {name} until I tried it... here's what happened 🤯",
  "This {category} hack using {name} went viral for a reason 📈",
];

const DESCRIPTION_TEMPLATES = [
  "Elevate your {category} experience with {name}. Designed for {audience}, this premium solution delivers {benefit} with unmatched quality. {features}",
  "Meet {name} — the {category} that {audience} can't stop talking about. {benefit} meets effortless style. {features}",
];

const HEADLINE_TEMPLATES = [
  "{name}: The {category} That Changes Everything",
  "Why {audience} Are Switching to {name}",
  "{benefit} in Seconds — Meet {name}",
  "The {category} Secret Top {audience} Don't Want You to Know",
];

function generateMockCTR(): number {
  return parseFloat((Math.random() * 5 + 0.5).toFixed(2));
}

function generateMockEngagement(): number {
  return parseFloat((Math.random() * 8 + 1).toFixed(2));
}

function generateMockConversion(): number {
  return parseFloat((Math.random() * 3 + 0.2).toFixed(2));
}

function generateMockImpressions(): number {
  return Math.floor(Math.random() * 50000 + 1000);
}

function extractBenefits(description: string): string[] {
  const benefits = [
    "save time", "look better", "feel confident", "stay organized",
    "boost productivity", "improve health", "save money", "reduce stress"
  ];
  return benefits.sort(() => 0.5 - Math.random()).slice(0, 3);
}

function extractKeywords(name: string, description: string, category: string): string[] {
  const baseKeywords = [name.toLowerCase(), category.toLowerCase()];
  const descWords = description.toLowerCase().split(/\s+/).filter(w => w.length > 4);
  return [...new Set([...baseKeywords, ...descWords.slice(0, 5)])];
}

export async function generateAdScript(product: ProductInput, variation: 'A' | 'B'): Promise<GeneratedContent> {
  const benefits = extractBenefits(product.description);
  const template = AD_TEMPLATES[Math.floor(Math.random() * AD_TEMPLATES.length)];

  const content = template
    .replace('{name}', product.name)
    .replace('{benefit}', benefits[0])
    .replace('{category}', product.category)
    + `\n\n[HOOK - 0-3s]\n${benefits[0].charAt(0).toUpperCase() + benefits[0].slice(1)} with ${product.name}!\n\n[PROBLEM - 3-10s]\nTired of ${product.category} that don't deliver? You're not alone.\n\n[SOLUTION - 10-25s]\n${product.name} is designed for ${product.targetAudience} who want ${benefits[1]}. ${product.description.substring(0, 100)}...\n\n[CTA - 25-30s]\nLink in bio! Use code GROWTH20 for 20% off. Limited time! 🔗`;

  return {
    id: uuidv4(),
    productId: product.id,
    type: 'ad_script',
    content,
    variation,
    metadata: {
      tone: product.brandVoice,
      keywords: extractKeywords(product.name, product.description, product.category),
      wordCount: content.split(/\s+/).length,
      estimatedReadTime: Math.ceil(content.split(/\s+/).length / 200),
    },
    performance: {
      ctr: generateMockCTR(),
      engagement: generateMockEngagement(),
      conversion: generateMockConversion(),
      impressions: generateMockImpressions(),
      clicks: Math.floor(generateMockImpressions() * generateMockCTR() / 100),
    },
    status: 'generated',
    createdAt: new Date().toISOString(),
  };
}

export async function generateProductDescription(product: ProductInput, variation: 'A' | 'B'): Promise<GeneratedContent> {
  const benefits = extractBenefits(product.description);
  const template = DESCRIPTION_TEMPLATES[Math.floor(Math.random() * DESCRIPTION_TEMPLATES.length)];

  const features = `✓ ${benefits[0].charAt(0).toUpperCase() + benefits[0].slice(1)}\n✓ Premium ${product.category} quality\n✓ Designed for ${product.targetAudience}\n✓ ${benefits[1].charAt(0).toUpperCase() + benefits[1].slice(1)} guaranteed`;

  const content = template
    .replace('{name}', product.name)
    .replace('{category}', product.category)
    .replace('{audience}', product.targetAudience)
    .replace('{benefit}', benefits[0])
    .replace('{features}', features);

  return {
    id: uuidv4(),
    productId: product.id,
    type: 'product_description',
    content,
    variation,
    metadata: {
      tone: product.brandVoice,
      keywords: extractKeywords(product.name, product.description, product.category),
      wordCount: content.split(/\s+/).length,
      estimatedReadTime: Math.ceil(content.split(/\s+/).length / 200),
    },
    performance: {
      ctr: generateMockCTR(),
      engagement: generateMockEngagement(),
      conversion: generateMockConversion(),
      impressions: generateMockImpressions(),
      clicks: Math.floor(generateMockImpressions() * generateMockCTR() / 100),
    },
    status: 'generated',
    createdAt: new Date().toISOString(),
  };
}

export async function generateSEOBlog(product: ProductInput, variation: 'A' | 'B'): Promise<GeneratedContent> {
  const benefits = extractBenefits(product.description);
  const keywords = extractKeywords(product.name, product.description, product.category);

  const content = `# The Ultimate Guide to ${product.category}: Why ${product.name} is a Game-Changer

## Introduction

In today's fast-paced world, ${product.targetAudience} are constantly searching for ways to ${benefits[0]}. Enter ${product.name} — a revolutionary ${product.category} that's taking the market by storm.

## What Makes ${product.name} Different?

Unlike traditional ${product.category} solutions, ${product.name} was built with one goal in mind: helping ${product.targetAudience} ${benefits[1]} without the usual hassle.

**Key Features:**
- Advanced ${product.category} technology
- Designed specifically for ${product.targetAudience}
- Proven to ${benefits[0]} and ${benefits[1]}
- Premium quality at an accessible price point

## Real Results

Users report ${benefits[2]} within just weeks of using ${product.name}. The secret? A unique approach that combines innovation with practicality.

## How to Get Started

1. Visit our website and explore ${product.name}
2. Choose the package that fits your needs
3. Start experiencing ${benefits[0]} today

## Conclusion

If you're ready to ${benefits[1]} and take your ${product.category} experience to the next level, ${product.name} is the solution you've been waiting for.

---
*Keywords: ${keywords.join(', ')}*`;

  return {
    id: uuidv4(),
    productId: product.id,
    type: 'seo_blog',
    content,
    variation,
    metadata: {
      tone: product.brandVoice,
      keywords,
      wordCount: content.split(/\s+/).length,
      estimatedReadTime: Math.ceil(content.split(/\s+/).length / 200),
    },
    performance: {
      ctr: generateMockCTR(),
      engagement: generateMockEngagement(),
      conversion: generateMockConversion(),
      impressions: generateMockImpressions(),
      clicks: Math.floor(generateMockImpressions() * generateMockCTR() / 100),
    },
    status: 'generated',
    createdAt: new Date().toISOString(),
  };
}

export async function generateAdHeadlines(product: ProductInput, variation: 'A' | 'B'): Promise<GeneratedContent> {
  const benefits = extractBenefits(product.description);
  const keywords = extractKeywords(product.name, product.description, product.category);

  const headlines = HEADLINE_TEMPLATES.map(t => 
    t.replace('{name}', product.name)
     .replace('{category}', product.category)
     .replace('{audience}', product.targetAudience)
     .replace('{benefit}', benefits[0])
  );

  const content = headlines.map((h, i) => `${i + 1}. ${h}`).join('\n') + 
    `\n\n**Primary:** ${headlines[0]}\n**Secondary:** ${headlines[1]}\n**Social Proof:** "${product.targetAudience} love ${product.name}"\n**Urgency:** "Limited: ${product.name} at ${product.price} — ends soon"`;

  return {
    id: uuidv4(),
    productId: product.id,
    type: 'ad_headlines',
    content,
    variation,
    metadata: {
      tone: product.brandVoice,
      keywords,
      wordCount: content.split(/\s+/).length,
      estimatedReadTime: 1,
    },
    performance: {
      ctr: generateMockCTR(),
      engagement: generateMockEngagement(),
      conversion: generateMockConversion(),
      impressions: generateMockImpressions(),
      clicks: Math.floor(generateMockImpressions() * generateMockCTR() / 100),
    },
    status: 'generated',
    createdAt: new Date().toISOString(),
  };
}

export async function generateSocialPost(product: ProductInput, variation: 'A' | 'B'): Promise<GeneratedContent> {
  const benefits = extractBenefits(product.description);
  const keywords = extractKeywords(product.name, product.description, product.category);

  const content = variation === 'A' 
    ? `✨ ${product.name} is HERE ✨\n\n${product.targetAudience}, this one's for you!\n\n${product.description.substring(0, 120)}...\n\n${benefits[0]} ✅\n${benefits[1]} ✅\n${benefits[2]} ✅\n\nLink in bio 👆 #${keywords[0].replace(/\s/g, '')} #${product.category.replace(/\s/g, '')}`
    : `🚨 PSA for ${product.targetAudience} 🚨\n\nStop settling for mediocre ${product.category}. ${product.name} is the upgrade you deserve.\n\n"I can't believe I waited this long" — Real customer\n\nTap the link → ${product.name} at ${product.price}\n\n#${keywords[0].replace(/\s/g, '')} #musthave`;

  return {
    id: uuidv4(),
    productId: product.id,
    type: 'social_post',
    content,
    variation,
    metadata: {
      tone: product.brandVoice,
      keywords,
      wordCount: content.split(/\s+/).length,
      estimatedReadTime: 1,
    },
    performance: {
      ctr: generateMockCTR(),
      engagement: generateMockEngagement(),
      conversion: generateMockConversion(),
      impressions: generateMockImpressions(),
      clicks: Math.floor(generateMockImpressions() * generateMockCTR() / 100),
    },
    status: 'generated',
    createdAt: new Date().toISOString(),
  };
}

export async function generateEmailSequence(product: ProductInput, variation: 'A' | 'B'): Promise<GeneratedContent> {
  const benefits = extractBenefits(product.description);

  const content = `**Email 1: Welcome + Value**\nSubject: Your ${product.name} journey starts now 🚀\n\nHi there,\n\nWelcome! You're about to discover why ${product.targetAudience} are raving about ${product.name}.\n\nHere's what to expect:\n• ${benefits[0]}\n• ${benefits[1]}\n• ${benefits[2]}\n\n**Email 2: Social Proof**\nSubject: "I wish I found this sooner" — Sarah, ${product.targetAudience}\n\nReal results from real people using ${product.name}...\n\n**Email 3: Urgency**\nSubject: Last chance: ${product.name} special ends tonight\n\nDon't miss out. ${product.name} is changing how ${product.targetAudience} ${benefits[0]}.`;

  return {
    id: uuidv4(),
    productId: product.id,
    type: 'email_sequence',
    content,
    variation,
    metadata: {
      tone: product.brandVoice,
      keywords: extractKeywords(product.name, product.description, product.category),
      wordCount: content.split(/\s+/).length,
      estimatedReadTime: Math.ceil(content.split(/\s+/).length / 200),
    },
    performance: {
      ctr: generateMockCTR(),
      engagement: generateMockEngagement(),
      conversion: generateMockConversion(),
      impressions: generateMockImpressions(),
      clicks: Math.floor(generateMockImpressions() * generateMockCTR() / 100),
    },
    status: 'generated',
    createdAt: new Date().toISOString(),
  };
}

export async function generateAllContent(product: ProductInput): Promise<GeneratedContent[]> {
  const types = [
    generateAdScript,
    generateProductDescription,
    generateSEOBlog,
    generateAdHeadlines,
    generateSocialPost,
    generateEmailSequence,
  ];

  const results: GeneratedContent[] = [];

  for (const generator of types) {
    const contentA = await generator(product, 'A');
    const contentB = await generator(product, 'B');
    results.push(contentA, contentB);
  }

  return results;
}
