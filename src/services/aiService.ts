import { Groq } from 'groq-sdk';
import { CrisisData, AIResponse, AIRecommendation } from '../types/ai';

const client = new Groq({
  apiKey: process.env.REACT_APP_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

export const aiService = {
  async getRecommendations(crisisData: CrisisData): Promise<AIResponse> {
    try {
      if (!process.env.REACT_APP_GROQ_API_KEY) {
        return {
          data: {
            crisisType: crisisData.crisisType,
            severityLevel: 'Medium',
            recommendations: ['Error: GROQ API key not configured'],
            estimatedResolutionTime: 'Unknown',
            confidenceScore: 0,
          },
          status: 'error',
          message: 'GROQ API key is not set',
        };
      }

      const systemPrompt = `You are an AI assistant for crisis management in a city simulation game. Given a crisis event, analyze the situation and provide:
- Severity level (Low, Medium, High, Critical)
- 2-3 actionable recommendations
- Estimated resolution time
- Confidence score (0-1)
Respond in this JSON format:
{
  "crisisType": "...",
  "severityLevel": "Low|Medium|High|Critical",
  "recommendations": ["...", "..."],
  "estimatedResolutionTime": "...",
  "confidenceScore": 0.0
}`;

      const userPrompt = `Crisis Type: ${crisisData.crisisType}\nDescription: ${crisisData.description}\nLocation: ${crisisData.location}\nAffected Population: ${crisisData.affectedPopulation}\nTimestamp: ${crisisData.timestamp}`;

      const completion = await client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 500
      });

      const content = completion.choices?.[0]?.message?.content;
      if (!content) {
        return {
          data: {
            crisisType: crisisData.crisisType,
            severityLevel: 'Medium',
            recommendations: ['No response from AI'],
            estimatedResolutionTime: 'Unknown',
            confidenceScore: 0,
          },
          status: 'error',
          message: 'No response from AI',
        };
      }

      let aiRecommendation: AIRecommendation;
      try {
        aiRecommendation = JSON.parse(content);
      } catch (e) {
        return {
          data: {
            crisisType: crisisData.crisisType,
            severityLevel: 'Medium',
            recommendations: ['Failed to parse AI response'],
            estimatedResolutionTime: 'Unknown',
            confidenceScore: 0,
          },
          status: 'error',
          message: 'Failed to parse AI response',
        };
      }

      return {
        data: aiRecommendation,
        status: 'success',
      };
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      return {
        data: {
          crisisType: crisisData.crisisType,
          severityLevel: 'Medium',
          recommendations: ['Analyzing situation...'],
          estimatedResolutionTime: 'Unknown',
          confidenceScore: 0,
        },
        status: 'error',
        message: 'Failed to fetch AI recommendations',
      };
    }
  },
}; 