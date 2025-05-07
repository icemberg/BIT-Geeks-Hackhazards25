import { useState } from 'react';
import {
  calculateEconomicImpact,
  calculateSocialImpact,
  calculateEnvironmentalImpact,
  calculateInfrastructureImpact,
  calculatePositiveSentiment,
  calculateNeutralSentiment,
  calculateNegativeSentiment,
  extractKeyInsights,
  generateRecommendations,
  determineRiskLevel,
  identifyRiskFactors,
  generateMitigationStrategies
} from '../utils/proposalAnalysis';

interface ScreenpipeResult {
  type: 'OCR' | 'Audio' | 'UI';
  content: {
    text?: string;
    transcript?: string;
  };
}

export interface Proposal {
  title: string;
  description: string;
  category: 'infrastructure' | 'social' | 'environmental' | 'economic';
  budget: number;
  timeline: {
    start: Date;
    end: Date;
  };
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  creator: string;
  createdAt: Date;
}

export interface ProposalAnalysis {
  proposal: Proposal;
  impactAnalysis: {
    economic: number;
    social: number;
    environmental: number;
    infrastructure: number;
  };
  citizenSentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  keyInsights: string[];
  recommendations: string[];
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
    mitigationStrategies: string[];
  };
}

// Mock implementation to replace @screenpipe/browser
const mockScreenpipe = {
  queryScreenpipe: async ({ q }: { q: string }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate mock responses based on the query
    const mockResponses = [
      "Citizens have expressed concerns about traffic congestion in the proposed area.",
      "Environmental impact studies suggest minimal disruption to local ecosystems.",
      "Economic projections indicate a 15% increase in local business activity.",
      "Community surveys show 78% support for the initiative.",
      "Infrastructure assessments reveal the need for additional road maintenance.",
      "Social media sentiment analysis shows positive engagement with the proposal.",
      "Historical data from similar projects suggests a 3-year timeline for completion.",
      "Budget analysis indicates the proposal is within expected cost parameters.",
      "Stakeholder interviews reveal strong support from local businesses.",
      "Technical feasibility studies confirm the project can be implemented as planned."
    ];
    
    // Return a random subset of responses
    const shuffled = [...mockResponses].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.floor(Math.random() * 5) + 3);
    
    return {
      data: selected.map(text => ({
        type: "UI",
        content: { 
          text,
          transcript: text // For Audio type compatibility
        }
      }))
    };
  }
};

export const useGovernanceAnalysis = () => {
  const [analysis, setAnalysis] = useState<ProposalAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProposal = (data: Omit<Proposal, 'status' | 'createdAt'>): Proposal => {
    return {
      ...data,
      status: 'draft',
      createdAt: new Date()
    };
  };

  const analyzeProposal = async (proposal: Proposal): Promise<ProposalAnalysis> => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to use mock Screenpipe for analysis
      let context = '';
      
      try {
        const results = await mockScreenpipe.queryScreenpipe({
          q: `Analyze this proposal: ${proposal.title} - ${proposal.description}. Consider its impact on the city's infrastructure, social fabric, environment, and economy.`
        });

        if (results?.data) {
          context = results.data.map((item: any) => {
            if (item.type === 'OCR') return item.content?.text || '';
            if (item.type === 'Audio') return item.content?.transcript || '';
            if (item.type === 'UI') return item.content?.text || '';
            return '';
          }).join(' ');
        }
      } catch (screenpipeError) {
        console.error('Error querying Screenpipe:', screenpipeError);
        // Continue with default analysis if Screenpipe fails
      }

      // If Screenpipe failed or returned no data, use a fallback context
      if (!context) {
        context = `Proposal: ${proposal.title} - ${proposal.description}. Category: ${proposal.category}. Budget: ${proposal.budget}.`;
      }

      const newAnalysis: ProposalAnalysis = {
        proposal,
        impactAnalysis: {
          economic: calculateEconomicImpact(proposal, context),
          social: calculateSocialImpact(proposal, context),
          environmental: calculateEnvironmentalImpact(proposal, context),
          infrastructure: calculateInfrastructureImpact(proposal, context)
        },
        citizenSentiment: {
          positive: calculatePositiveSentiment(context),
          neutral: calculateNeutralSentiment(context),
          negative: calculateNegativeSentiment(context)
        },
        keyInsights: extractKeyInsights(proposal, context),
        recommendations: generateRecommendations(proposal, context),
        riskAssessment: {
          level: determineRiskLevel(proposal, context),
          factors: identifyRiskFactors(proposal, context),
          mitigationStrategies: generateMitigationStrategies(proposal, context)
        }
      };

      setAnalysis(newAnalysis);
      return newAnalysis;
    } catch (error) {
      console.error('Error analyzing proposal:', error);
      setError('Failed to analyze proposal. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    analysis,
    loading,
    error,
    createProposal,
    analyzeProposal
  };
}; 