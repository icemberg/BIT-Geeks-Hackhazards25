import { Proposal } from '../hooks/useGovernanceAnalysis';

// Impact Calculation Functions
export const calculateEconomicImpact = (proposal: Proposal, context: string): number => {
  // Calculate economic impact based on budget, timeline, and context
  const baseScore = (proposal.budget / 1000000) * 0.3; // Normalize budget impact
  const timelineFactor = (proposal.timeline.end.getTime() - proposal.timeline.start.getTime()) / (30 * 24 * 60 * 60 * 1000); // Months
  return Math.min(100, Math.floor((baseScore + timelineFactor) * 50));
};

export const calculateSocialImpact = (proposal: Proposal, context: string): number => {
  // Analyze social impact based on proposal category and context
  const categoryWeight = proposal.category === 'social' ? 0.7 : 0.3;
  const contextSentiment = analyzeTextSentiment(context);
  return Math.min(100, Math.floor((categoryWeight + contextSentiment) * 50));
};

export const calculateEnvironmentalImpact = (proposal: Proposal, context: string): number => {
  // Calculate environmental impact based on proposal details
  const categoryWeight = proposal.category === 'environmental' ? 0.7 : 0.3;
  const resourceImpact = calculateResourceImpact(proposal);
  return Math.min(100, Math.floor((categoryWeight + resourceImpact) * 50));
};

export const calculateInfrastructureImpact = (proposal: Proposal, context: string): number => {
  // Calculate infrastructure impact based on proposal category and budget
  const categoryWeight = proposal.category === 'infrastructure' ? 0.7 : 0.3;
  const budgetImpact = proposal.budget / 2000000; // Normalize budget
  return Math.min(100, Math.floor((categoryWeight + budgetImpact) * 50));
};

// Sentiment Analysis Functions
export const calculatePositiveSentiment = (context: string): number => {
  const positiveKeywords = ['support', 'benefit', 'improve', 'enhance', 'progress'];
  return calculateSentimentScore(context, positiveKeywords);
};

export const calculateNeutralSentiment = (context: string): number => {
  const neutralKeywords = ['consider', 'review', 'discuss', 'evaluate', 'assess'];
  return calculateSentimentScore(context, neutralKeywords);
};

export const calculateNegativeSentiment = (context: string): number => {
  const negativeKeywords = ['concern', 'oppose', 'risk', 'challenge', 'issue'];
  return calculateSentimentScore(context, negativeKeywords);
};

const calculateSentimentScore = (text: string, keywords: string[]): number => {
  const matches = keywords.filter(keyword => 
    text.toLowerCase().includes(keyword.toLowerCase())
  ).length;
  return Math.min(100, Math.floor((matches / keywords.length) * 100));
};

// Insight Generation Functions
export const extractKeyInsights = (proposal: Proposal, context: string): string[] => {
  const insights: string[] = [];
  
  // Add category-specific insights
  if (proposal.category === 'infrastructure') {
    insights.push('Infrastructure development will improve city connectivity');
  } else if (proposal.category === 'social') {
    insights.push('Social programs will enhance community well-being');
  } else if (proposal.category === 'environmental') {
    insights.push('Environmental initiatives will reduce carbon footprint');
  } else if (proposal.category === 'economic') {
    insights.push('Economic measures will stimulate local growth');
  }

  // Add budget-related insights
  if (proposal.budget > 1000000) {
    insights.push('Large-scale investment requires careful resource allocation');
  }

  // Add timeline-related insights
  const duration = (proposal.timeline.end.getTime() - proposal.timeline.start.getTime()) / (30 * 24 * 60 * 60 * 1000);
  if (duration > 12) {
    insights.push('Long-term project requires phased implementation');
  }

  return insights;
};

export const generateRecommendations = (proposal: Proposal, context: string): string[] => {
  const recommendations: string[] = [];

  // Add category-specific recommendations
  if (proposal.category === 'infrastructure') {
    recommendations.push('Conduct thorough site analysis before construction');
  } else if (proposal.category === 'social') {
    recommendations.push('Engage community stakeholders in program design');
  } else if (proposal.category === 'environmental') {
    recommendations.push('Implement environmental impact monitoring system');
  } else if (proposal.category === 'economic') {
    recommendations.push('Develop detailed cost-benefit analysis');
  }

  // Add budget-related recommendations
  if (proposal.budget > 500000) {
    recommendations.push('Establish financial oversight committee');
  }

  return recommendations;
};

// Risk Assessment Functions
export const determineRiskLevel = (proposal: Proposal, context: string): 'low' | 'medium' | 'high' => {
  const riskScore = calculateRiskScore(proposal);
  if (riskScore < 30) return 'low';
  if (riskScore < 70) return 'medium';
  return 'high';
};

export const identifyRiskFactors = (proposal: Proposal, context: string): string[] => {
  const factors: string[] = [];

  // Budget risks
  if (proposal.budget > 1000000) {
    factors.push('High financial investment risk');
  }

  // Timeline risks
  const duration = (proposal.timeline.end.getTime() - proposal.timeline.start.getTime()) / (30 * 24 * 60 * 60 * 1000);
  if (duration > 6) {
    factors.push('Extended project timeline risk');
  }

  // Category-specific risks
  if (proposal.category === 'infrastructure') {
    factors.push('Construction delays and cost overruns');
  } else if (proposal.category === 'environmental') {
    factors.push('Regulatory compliance challenges');
  }

  return factors;
};

export const generateMitigationStrategies = (proposal: Proposal, context: string): string[] => {
  const strategies: string[] = [];

  // Add general mitigation strategies
  strategies.push('Regular progress monitoring and reporting');
  strategies.push('Contingency planning for key risks');

  // Add category-specific strategies
  if (proposal.category === 'infrastructure') {
    strategies.push('Phased construction approach');
  } else if (proposal.category === 'social') {
    strategies.push('Community engagement program');
  }

  return strategies;
};

// Helper Functions
const calculateRiskScore = (proposal: Proposal): number => {
  let score = 0;
  
  // Budget risk (0-40 points)
  score += Math.min(40, (proposal.budget / 1000000) * 10);
  
  // Timeline risk (0-30 points)
  const duration = (proposal.timeline.end.getTime() - proposal.timeline.start.getTime()) / (30 * 24 * 60 * 60 * 1000);
  score += Math.min(30, duration * 5);
  
  // Category risk (0-30 points)
  if (proposal.category === 'infrastructure') score += 30;
  else if (proposal.category === 'environmental') score += 20;
  else if (proposal.category === 'social') score += 10;
  
  return Math.min(100, score);
};

const analyzeTextSentiment = (text: string): number => {
  const positiveWords = text.match(/\b(support|benefit|improve|enhance|progress)\b/gi)?.length || 0;
  const negativeWords = text.match(/\b(concern|oppose|risk|challenge|issue)\b/gi)?.length || 0;
  const totalWords = text.split(/\s+/).length;
  return (positiveWords - negativeWords) / totalWords;
};

const calculateResourceImpact = (proposal: Proposal): number => {
  // Calculate resource impact based on proposal details
  const budgetFactor = proposal.budget / 1000000;
  const durationFactor = (proposal.timeline.end.getTime() - proposal.timeline.start.getTime()) / (365 * 24 * 60 * 60 * 1000);
  return Math.min(1, (budgetFactor + durationFactor) / 2);
}; 