export interface CrisisData {
  crisisType: string;
  description: string;
  location: string;
  affectedPopulation: number;
  timestamp: string;
}

export interface AIRecommendation {
  crisisType: string;
  severityLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  recommendations: string[];
  estimatedResolutionTime: string;
  confidenceScore: number;
}

export interface AIResponse {
  data: AIRecommendation;
  status: 'success' | 'error';
  message?: string;
} 