import { Agent, Plan, Skill } from './types';

export const AGENTS: Agent[] = [
  {
    id: '1',
    name: 'ALPHA-01',
    status: 'Active',
    latency: '45ms',
    tokensRemaining: '850k',
    daysRemaining: 12,
    model: 'GPT-4',
    contextWindow: '32k',
    performanceData: [
      { time: '00:00', latency: 42, tokens: 120 },
      { time: '04:00', latency: 45, tokens: 150 },
      { time: '08:00', latency: 48, tokens: 200 },
      { time: '12:00', latency: 45, tokens: 180 },
      { time: '16:00', latency: 43, tokens: 220 },
      { time: '20:00', latency: 45, tokens: 190 },
    ]
  },
  {
    id: '2',
    name: 'BETA-02',
    status: 'Active',
    latency: '50ms',
    tokensRemaining: '620k',
    daysRemaining: 24,
    model: 'GPT-4',
    contextWindow: '32k',
    performanceData: [
      { time: '00:00', latency: 48, tokens: 80 },
      { time: '04:00', latency: 52, tokens: 110 },
      { time: '08:00', latency: 55, tokens: 140 },
      { time: '12:00', latency: 50, tokens: 120 },
      { time: '16:00', latency: 49, tokens: 160 },
      { time: '20:00', latency: 50, tokens: 130 },
    ]
  },
  {
    id: '3',
    name: 'GAMMA-03',
    status: 'Idle',
    latency: '--',
    tokensRemaining: '1.2M',
    daysRemaining: 5,
    model: 'Claude 3',
    contextWindow: '200k',
    performanceData: []
  },
  {
    id: '4',
    name: 'DELTA-04',
    status: 'Active',
    latency: '38ms',
    tokensRemaining: '450k',
    daysRemaining: 18,
    model: 'Gemini Pro',
    contextWindow: '1M',
    performanceData: [
      { time: '00:00', latency: 35, tokens: 300 },
      { time: '04:00', latency: 38, tokens: 350 },
      { time: '08:00', latency: 40, tokens: 400 },
      { time: '12:00', latency: 38, tokens: 380 },
      { time: '16:00', latency: 37, tokens: 420 },
      { time: '20:00', latency: 38, tokens: 390 },
    ]
  }
];

export const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'BASIC',
    price: 29,
    features: ['2GB RAM', '3 Max Skills', 'Basic Support'],
    bonus: {
      credit: '$30',
      duration: 'Free for your 1st month'
    }
  },
  {
    id: 'advance',
    name: 'ADVANCE',
    price: 59,
    features: ['8GB RAM', '5 Max Skills', 'Advanced NLP', 'Priority Email Support', 'API Access'],
    popular: true,
    bonus: {
      credit: '$300',
      duration: 'Free for 3 months'
    }
  },
  {
    id: 'pro',
    name: 'PRO',
    price: 99,
    features: ['32GB RAM', 'Unlimited Max Skills', 'Full Autonomous Capabilities', '24/7 Dedicated Support', 'Custom Integrations', 'Data Encryption'],
    bonus: {
      credit: '$1000',
      duration: 'Free for 5 months'
    }
  }
];

export const SKILLS: Skill[] = [
  { id: 'trans', name: 'Translation Module', price: 5, icon: 'Languages' },
  { id: 'data', name: 'Data Analysis Suite', price: 10, icon: 'BarChart3' },
  { id: 'creative', name: 'Creative Content Generation', price: 15, icon: 'PenTool' },
  { id: 'security', name: 'Enhanced Security', price: 8, icon: 'ShieldCheck' },
  { id: 'scheduling', name: 'Advanced Scheduling', price: 4, icon: 'Calendar' },
  { id: 'voice', name: 'Voice Interaction', price: 7, icon: 'Mic' }
];
