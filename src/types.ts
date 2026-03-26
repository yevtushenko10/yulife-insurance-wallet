export type PolicyType = string;

export interface Policy {
  id: string;
  title: string;
  type: PolicyType;
  status: 'Active' | 'Pending' | 'Claiming';
  coverage: string;
  benefits: string[];
  exclusions: string[];
  color: string;
  icon: string;
  pointsReward: number;
}

export interface User {
  name: string;
  points: number;
  level: number;
  streak: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}
