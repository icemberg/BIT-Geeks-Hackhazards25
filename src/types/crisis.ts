export type CrisisSeverity = 'low' | 'medium' | 'high' | 'critical';
export type CrisisType = 'environmental' | 'health' | 'social' | 'economic' | 'infrastructure';

export interface CrisisAction {
  id: string;
  action: string;
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo: string;
}

export interface Crisis {
  id: string;
  title: string;
  description: string;
  type: CrisisType;
  severity: CrisisSeverity;
  affectedMetrics: string[];
  startTime: Date;
  status: string;
  progress: number;
  requiredActions: string[];
  currentActions: string[];
  participants: string[];
} 