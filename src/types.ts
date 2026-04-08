export interface Agent {
  id: string;
  name: string;
  status: 'Active' | 'Idle';
  latency: string;
  tokensRemaining: string;
  daysRemaining: number;
  model?: string;
  contextWindow?: string;
  performanceData?: { time: string; latency: number; tokens: number }[];
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
  bonus?: {
    credit: string;
    duration: string;
  };
}

export interface Skill {
  id: string;
  name: string;
  price: number;
  icon: string;
}
