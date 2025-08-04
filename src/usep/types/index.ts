/**
 * USEP Core Types - Unified Type Definitions
 * Universal Service Evolution Platform
 */

// Service Configuration
export interface ServiceConfig {
  type: string;
  name: string;
  features: string[];
  serviceName?: string; // Legacy compatibility
  description?: string; // Added for compatibility
}

// HaQei Service Configuration
export interface HaQeiServiceConfig extends ServiceConfig {
  type: 'haqei';
  serviceName?: string;
  description?: string; // Added for compatibility
}

// Virtual User - Simplified Interface
export interface VirtualUserSimple {
  id: string;
  name: string;
  age: number;
  interests: string[];
  behavior: string;
}

// Persona Dimension - For compatibility
export interface PersonaDimension {
  name: string;
  value: number;
  confidence: number;
}

// Improvement Suggestion
export interface ImprovementSuggestion {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedImpact: {
    conversionImprovement: number;
    satisfactionImprovement: number;
  };
  implementationComplexity: 'low' | 'medium' | 'high';
}

// Simulation Configuration
export interface SimulationConfig {
  userCount: number;
  duration: number;
  scenarios: string[];
}

// Virtual User Full Interface  
export interface VirtualUser extends VirtualUserSimple {
  demographics: {
    location: string;
    income: string;
    education: string;
  };
  psychographics: {
    personality: string;
    values: string[];
    lifestyle: string;
  };
  behavioral: {
    onlineTime: number;
    purchaseHistory: string[];
    searchBehavior: string;
  };
  contextual: {
    device: string;
    timeOfDay: string;
    mood: string;
  };
  techLevel: string;
  device: string;
  getHaqeiProfile?: () => any;
  setHaqeiProfile?: (profile: any) => void;
}

// Experience Report
export interface ExperienceReport {
  userId: string;
  timestamp: number;
  converted: boolean;
  satisfaction: number;
  issues: string[];
  feedback: string;
}

// Improvement Analysis
export interface ImprovementAnalysis {
  overallScore: number;
  suggestions: ImprovementSuggestion[];
  trends: {
    conversionTrend: number;
    satisfactionTrend: number;
  };
  recommendations: {
    immediate: string[];
    longTerm: string[];
  };
}

// Re-export to avoid conflicts
export type { ServiceConfig as USEPServiceConfig, HaQeiServiceConfig as USEPHaQeiServiceConfig, SimulationConfig as USEPSimulationConfig };