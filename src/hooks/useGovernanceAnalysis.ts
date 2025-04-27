import { useState } from 'react';
import { pipe } from '@screenpipe/browser';
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
      // Try to use Screenpipe for analysis
      let context = '';
      
      try {
        const results = await pipe.queryScreenpipe({
          q: `Analyze this proposal: ${proposal.title} - ${proposal.description}. Consider its impact on the city's infrastructure, social fabric, environment, and economy.`,
          contentType: 'all',
          limit: 10,
          startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
          endTime: new Date().toISOString()
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
        console.warn('Screenpipe analysis failed, using fallback analysis:', screenpipeError);
        // Continue with fallback analysis
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