/**
 * ExperienceSimulator.ts - 簡略化版（独立動作用）
 */

import type { VirtualUserSimple as VirtualUser, ServiceConfig } from '../types/index.js';

export interface ExperienceReport {
  userId: string;
  satisfaction: number;
  converted: boolean;
  feedback: string;
  npsScore: number;
  metrics: {
    satisfactionScore: number;
    usabilityScore: number;
    completionTime: number;
  };
}

export interface SimulationConfig {
  serviceConfig: ServiceConfig;
  detailLevel: string;
  emotionalTracking: boolean;
  realTimeAnalytics: boolean;
  parallelSimulations: number;
}

export interface ABTestResults {
  variant: string;
  conversionRate: number;
  userCount: number;
}

export class ExperienceSimulator {
  constructor() {
    console.log('🎭 ExperienceSimulator initialized - Simplified Version');
  }

  async simulateExperiences(users: VirtualUser[], config: SimulationConfig): Promise<ExperienceReport[]> {
    console.log(`🎭 Simulating experiences for ${users.length} users...`);
    
    const reports: ExperienceReport[] = [];
    
    for (const user of users) {
      const satisfaction = Math.random();
      const converted = satisfaction > 0.6;
      
      reports.push({
        userId: user.id,
        satisfaction,
        converted,
        feedback: `User ${user.name} had a ${satisfaction > 0.7 ? 'positive' : 'mixed'} experience`,
        npsScore: Math.floor((satisfaction - 0.5) * 20),
        metrics: {
          satisfactionScore: satisfaction,
          usabilityScore: Math.random(),
          completionTime: Math.random() * 300 + 30
        }
      });
    }
    
    console.log(`✅ Generated ${reports.length} experience reports`);
    return reports;
  }
}