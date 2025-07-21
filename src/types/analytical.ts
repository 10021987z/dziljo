// Types pour le module Comptabilité Analytique

export interface AnalyticAxis {
  id: number;
  label: string;
  code: string;
  order: number;
  required: boolean;
  isActive: boolean;
  valueCount: number;
  description: string;
  createdDate: string;
  lastModified: string;
}

export interface AnalyticValue {
  id: number;
  axisId: number;
  code: string;
  label: string;
  description?: string;
  isActive: boolean;
  parentId?: number;
  level: number;
  usageCount: number;
}

export interface AnalyticEntry {
  id: number;
  bookingId: number;
  date: string;
  description: string;
  amount: number;
  axis1Value?: string;
  axis2Value?: string;
  axis3Value?: string;
  axis4Value?: string;
  createdDate: string;
  lastModified: string;
}

export interface AllocationRule {
  id: number;
  name: string;
  description: string;
  type: 'fixed' | 'formula' | 'percentage';
  sourceAccount: string;
  targetAxes: string[];
  formula?: string;
  percentage?: number;
  schedule: 'manual' | 'daily' | 'weekly' | 'monthly';
  isActive: boolean;
  lastExecution?: string;
  nextExecution?: string;
  executionCount: number;
  successRate: number;
  createdDate: string;
  conditions?: AllocationCondition[];
}

export interface AllocationCondition {
  id: number;
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
  value: string;
  axisValue: string;
}

export interface BudgetLine {
  id: number;
  name: string;
  period: string;
  startDate: string;
  endDate: string;
  axisType: string;
  axisValue: string;
  budgetAmount: number;
  actualAmount: number;
  variance: number;
  variancePercent: number;
  status: 'on-track' | 'warning' | 'overrun' | 'under-budget';
  alertThreshold: number;
  isActive: boolean;
  createdDate: string;
  lastUpdated: string;
  notes?: string;
}

export interface AnalyticalReport {
  id: string;
  name: string;
  type: 'pnl' | 'heatmap' | 'trends' | 'variance';
  axes: string[];
  period: string;
  startDate: string;
  endDate: string;
  data: any[];
  generatedDate: string;
  parameters: Record<string, any>;
}

export interface PnLData {
  dimension: string;
  revenue: number;
  costs: number;
  margin: number;
  marginPercent: number;
  budget?: number;
  variance?: number;
}

export interface BudgetAlert {
  id: number;
  budgetId: number;
  budgetName: string;
  type: 'threshold' | 'overrun' | 'forecast';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  currentAmount: number;
  budgetAmount: number;
  variance: number;
  triggeredDate: string;
  isRead: boolean;
  actionRequired: boolean;
}

export interface AnalyticalKPI {
  title: string;
  value: string;
  change: number;
  changeText: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

// API Response Types
export interface AnalyticalAPIResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
  success: boolean;
  message?: string;
}

// Filter Types
export interface AnalyticalFilter {
  axes?: string[];
  period?: string;
  startDate?: string;
  endDate?: string;
  groupBy?: string;
  metrics?: string[];
}

// Webhook Types
export interface AnalyticalWebhook {
  event: 'analytic.entry.created' | 'budget.overrun' | 'report.ready';
  data: any;
  timestamp: string;
  source: string;
}