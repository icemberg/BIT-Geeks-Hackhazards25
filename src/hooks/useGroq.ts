import { Groq } from 'groq-sdk';

const client = new Groq({ 
  apiKey: process.env.REACT_APP_GROQ_API_KEY,
  dangerouslyAllowBrowser: true 
});

interface CrisisResponse {
  crisis: string;
  proposals: string[];
}

export async function getGameExplanation(imageUrl: string): Promise<string> {
  try {
    if (!process.env.REACT_APP_GROQ_API_KEY) {
      console.error('GROQ API key is not set');
      return "Error: API key not configured";
    }

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Explain this game based on the image. Focus on the city management and resource aspects." },
            { type: "image_url", image_url: { url: imageUrl } }
          ]
        }
      ],
      max_tokens: 500
    });

    if (!completion.choices?.[0]?.message?.content) {
      console.error('No content in Groq response');
      return "Error: No response from AI";
    }

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error in getGameExplanation:', error);
    return "Error: Failed to get game explanation";
  }
}

export async function generateCrisisAndProposals(
  cityName: string,
  resources: { water: number; pollution: number; energy: number; health: number }
): Promise<CrisisResponse> {
  try {
    if (!process.env.REACT_APP_GROQ_API_KEY) {
      console.error('GROQ API key is not set');
      return {
        crisis: "Error: API key not configured",
        proposals: []
      };
    }

    const systemPrompt = `
You are a Crisis management assistant for a city-building game. Given the resource levels for a city, generate a unique Crisis situation affecting water, pollution, energy, and health resources, and provide three detailed proposals to address it. The crisis should be realistic and challenging, and the proposals should be practical solutions that players can implement.

Respond with a JSON object in this format:
{
  "crisis": "Detailed description of the crisis situation",
  "proposals": [
    "Proposal 1: Detailed solution addressing one or more resources",
    "Proposal 2: Detailed solution addressing one or more resources",
    "Proposal 3: Detailed solution addressing one or more resources"
  ]
}
    `;

    const userPrompt = `
City: ${cityName}
Current Resource Levels:
- Water: ${resources.water}%
- Pollution: ${resources.pollution}%
- Energy: ${resources.energy}%
- Health: ${resources.health}%

Generate a unique crisis situation and proposals based on these specific resource levels. The crisis should be challenging but solvable, and the proposals should be practical solutions that players can implement.
    `;

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000
    });

    if (!completion.choices?.[0]?.message?.content) {
      console.error('No content in Groq response');
      return {
        crisis: "Error: No response from AI",
        proposals: []
      };
    }

    const response: CrisisResponse = JSON.parse(completion.choices[0].message.content);
    return response;
  } catch (error) {
    console.error('Error in generateCrisisAndProposals:', error);
    return {
      crisis: "Error: Failed to generate crisis and proposals",
      proposals: []
    };
  }
}