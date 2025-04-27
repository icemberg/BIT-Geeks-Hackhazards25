import { ethers } from 'ethers';
import { CrisisManagerABI } from './CrisisManagerABI';

const CRISIS_MANAGER_ADDRESS = process.env.REACT_APP_CRISIS_MANAGER_ADDRESS || '';

export interface Crisis {
    id: number;
    crisisType: string;
    description: string;
    totalPoints: number;
    isActive: boolean;
}

export class CrisisContract {
    private contract: ethers.Contract;
    private provider: ethers.BrowserProvider;

    constructor(provider: ethers.BrowserProvider) {
        this.provider = provider;
        this.contract = new ethers.Contract(
            CRISIS_MANAGER_ADDRESS,
            CrisisManagerABI,
            provider // just the provider, not the signer
        );
    }

    async declareCrisis(crisisType: string, description: string): Promise<number> {
        const signer = await this.provider.getSigner();
        const contractWithSigner = this.contract.connect(signer) as any;
        const tx = await contractWithSigner.declareCrisis(crisisType, description);
        await tx.wait();
        return tx.hash;
    }

    async respondToCrisis(crisisId: number, points: number): Promise<void> {
        const signer = await this.provider.getSigner();
        const contractWithSigner = this.contract.connect(signer) as any;
        const tx = await contractWithSigner.respondToCrisis(crisisId, points);
        await tx.wait();
    }

    async getCrisis(crisisId: number): Promise<Crisis> {
        return await this.contract.getCrisis(crisisId);
    }

    async getPlayerPoints(address: string): Promise<number> {
        return await this.contract.getPlayerPoints(address);
    }

    // Event listeners
    onCrisisDeclared(callback: (crisisId: number, crisisType: string, description: string) => void) {
        this.contract.on('CrisisDeclared', callback);
    }

    onCrisisResponse(callback: (crisisId: number, responder: string, points: number) => void) {
        this.contract.on('CrisisResponse', callback);
    }
} 