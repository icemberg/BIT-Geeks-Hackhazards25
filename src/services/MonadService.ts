import { ethers } from 'ethers';
import { Groq } from 'groq-sdk';

interface ProposalData {
  id: number;
  title: string;
  description: string;
  deadline: number;
  votes: {
    for: number;
    against: number;
    abstain: number;
  };
  impactAnalysis?: {
    economic: number;
    social: number;
    environmental: number;
  };
  aiInsights?: string;
}

interface StructureNFT {
  tokenId: number;
  buildingType: string;
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: {
      type: string;
      value: string;
    }[];
  };
  priority: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
}

class MonadService {
  private static instance: MonadService;
  private provider: ethers.BrowserProvider;
  private groq: Groq;
  private proposals: Map<number, ProposalData> = new Map();
  private structures: Map<string, StructureNFT[]> = new Map();
  private constructionQueue: StructureNFT[] = [];

  private constructor() {
    if (typeof (window as any).ethereum !== 'undefined') {
      this.provider = new ethers.BrowserProvider((window as any).ethereum);
    } else {
      throw new Error('Web3 provider not found');
    }
    
    this.groq = new Groq({
      apiKey: process.env.REACT_APP_GROQ_API_KEY
    });
  }

  public static getInstance(): MonadService {
    if (!MonadService.instance) {
      MonadService.instance = new MonadService();
    }
    return MonadService.instance;
  }

  // Governance Functions
  public async submitProposal(title: string, description: string, deadline: number): Promise<number> {
    const proposalId = this.proposals.size + 1;
    
    // Get AI analysis from Groq
    const aiAnalysis = await this.analyzeProposal(description);
    
    this.proposals.set(proposalId, {
      id: proposalId,
      title,
      description,
      deadline,
      votes: { for: 0, against: 0, abstain: 0 },
      impactAnalysis: aiAnalysis.impact,
      aiInsights: aiAnalysis.insights
    });
    
    return proposalId;
  }

  private async analyzeProposal(description: string) {
    const prompt = `Analyze the following civic proposal and provide:
    1. Impact scores (0-100) for economic, social, and environmental factors
    2. Key insights and recommendations
    
    Proposal: ${description}`;

    const response = await this.groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'mixtral-8x7b-32768',
      temperature: 0.7,
    });

    // Parse the AI response to extract impact scores and insights
    const content = response.choices[0].message.content || '';
    const impactMatch = content.match(/Impact scores:.*?(\d+).*?(\d+).*?(\d+)/s);
    const insightsMatch = content.match(/Key insights:.*?(?=Impact scores|$)/s);

    return {
      impact: {
        economic: parseInt(impactMatch?.[1] || '50'),
        social: parseInt(impactMatch?.[2] || '50'),
        environmental: parseInt(impactMatch?.[3] || '50')
      },
      insights: insightsMatch?.[0] || 'No insights available'
    };
  }

  public async castVote(proposalId: number, vote: 'for' | 'against' | 'abstain'): Promise<void> {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) throw new Error('Proposal not found');
    
    proposal.votes[vote] += 1;
  }

  public async getProposals(): Promise<ProposalData[]> {
    return Array.from(this.proposals.values());
  }

  public async getProposalVotes(proposalId: number): Promise<{ for: number; against: number; abstain: number }> {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) throw new Error('Proposal not found');
    return proposal.votes;
  }

  // NFT Functions
  public async mintStructureNFT(buildingType: string, metadata: any): Promise<number> {
    const tokenId = Math.floor(Math.random() * 1000000);
    const structure: StructureNFT = {
      tokenId,
      buildingType,
      metadata,
      priority: this.constructionQueue.length + 1,
      status: 'pending'
    };
    
    const address = await this.provider.getSigner().then(signer => signer.getAddress());
    if (!this.structures.has(address)) {
      this.structures.set(address, []);
    }
    this.structures.get(address)?.push(structure);
    this.constructionQueue.push(structure);
    
    return tokenId;
  }

  public async getStructureNFTs(address: string): Promise<StructureNFT[]> {
    return this.structures.get(address) || [];
  }

  public async getConstructionQueue(): Promise<StructureNFT[]> {
    return [...this.constructionQueue].sort((a, b) => a.priority - b.priority);
  }

  public async updateConstructionPriority(tokenId: number, newPriority: number): Promise<void> {
    const structure = this.constructionQueue.find(s => s.tokenId === tokenId);
    if (!structure) throw new Error('Structure not found in construction queue');
    structure.priority = newPriority;
  }

  public async updateStructureStatus(tokenId: number, status: StructureNFT['status']): Promise<void> {
    const structure = this.constructionQueue.find(s => s.tokenId === tokenId);
    if (!structure) throw new Error('Structure not found in construction queue');
    structure.status = status;
  }
}

export default MonadService; 