import { Policy } from './types';

export const POLICIES: Policy[] = [
  {
    id: '1',
    title: 'Life Insurance',
    type: 'Life',
    status: 'Active',
    coverage: '£500,000',
    benefits: [
      'Lump sum payment to beneficiaries',
      'Funeral cost support',
      'Terminal illness cover'
    ],
    exclusions: [
      'Self-inflicted injuries within first 12 months',
      'Non-disclosure of pre-existing conditions'
    ],
    color: 'from-orange-400 to-orange-600',
    icon: 'Heart',
    pointsReward: 50
  },
  {
    id: '2',
    title: 'Health Insurance',
    type: 'Health',
    status: 'Active',
    coverage: 'Full Private Medical',
    benefits: [
      'Private hospital stays',
      'Specialist consultations',
      'Diagnostic tests'
    ],
    exclusions: [
      'Cosmetic surgery',
      'Chronic conditions management'
    ],
    color: 'from-teal-400 to-teal-600',
    icon: 'Activity',
    pointsReward: 30
  },
  {
    id: '3',
    title: 'Dental Care',
    type: 'Dental',
    status: 'Active',
    coverage: '£1,000/year',
    benefits: [
      'Routine checkups',
      'Hygienist visits',
      'Emergency treatments'
    ],
    exclusions: [
      'Teeth whitening',
      'Orthodontics for adults'
    ],
    color: 'from-purple-400 to-purple-600',
    icon: 'Smile',
    pointsReward: 20
  },
  {
    id: '4',
    title: 'Income Protection',
    type: 'Income Protection',
    status: 'Active',
    coverage: '75% of salary',
    benefits: [
      'Monthly payments if unable to work',
      'Rehabilitation support',
      'Mental health counseling'
    ],
    exclusions: [
      'Short-term illness (< 4 weeks)',
      'Redundancy'
    ],
    color: 'from-blue-400 to-blue-600',
    icon: 'ShieldCheck',
    pointsReward: 40
  }
];

export const USER_MOCK = {
  name: 'Oleksandr',
  points: 1250,
  level: 5,
  streak: 12,
  badges: [
    { id: '1', name: 'Early Bird', icon: 'Sun', unlocked: true },
    { id: '2', name: 'Policy Pro', icon: 'Award', unlocked: true },
    { id: '3', name: 'Health Hero', icon: 'Zap', unlocked: false }
  ]
};
