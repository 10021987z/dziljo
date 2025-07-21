// Service pour les API du module Comptabilité Analytique

import { 
  AnalyticAxis, 
  AnalyticValue, 
  AnalyticEntry, 
  AllocationRule, 
  BudgetLine, 
  AnalyticalReport,
  AnalyticalAPIResponse,
  AnalyticalFilter 
} from '../types/analytical';

class AnalyticalService {
  private baseURL = '/api/analytic';

  // Axes Analytiques
  async getAxes(): Promise<AnalyticAxis[]> {
    const response = await fetch(`${this.baseURL}/axes`);
    const data: AnalyticalAPIResponse<AnalyticAxis[]> = await response.json();
    return data.data;
  }

  async createAxis(axis: Partial<AnalyticAxis>): Promise<AnalyticAxis> {
    const response = await fetch(`${this.baseURL}/axes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(axis)
    });
    const data: AnalyticalAPIResponse<AnalyticAxis> = await response.json();
    return data.data;
  }

  async updateAxis(id: number, axis: Partial<AnalyticAxis>): Promise<AnalyticAxis> {
    const response = await fetch(`${this.baseURL}/axes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(axis)
    });
    const data: AnalyticalAPIResponse<AnalyticAxis> = await response.json();
    return data.data;
  }

  async deleteAxis(id: number): Promise<void> {
    await fetch(`${this.baseURL}/axes/${id}`, {
      method: 'DELETE'
    });
  }

  // Valeurs Analytiques
  async getValues(axisId?: number): Promise<AnalyticValue[]> {
    const url = axisId ? `${this.baseURL}/values?axisId=${axisId}` : `${this.baseURL}/values`;
    const response = await fetch(url);
    const data: AnalyticalAPIResponse<AnalyticValue[]> = await response.json();
    return data.data;
  }

  async createValue(value: Partial<AnalyticValue>): Promise<AnalyticValue> {
    const response = await fetch(`${this.baseURL}/values`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(value)
    });
    const data: AnalyticalAPIResponse<AnalyticValue> = await response.json();
    return data.data;
  }

  async updateValue(id: number, value: Partial<AnalyticValue>): Promise<AnalyticValue> {
    const response = await fetch(`${this.baseURL}/values/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(value)
    });
    const data: AnalyticalAPIResponse<AnalyticValue> = await response.json();
    return data.data;
  }

  async deleteValue(id: number): Promise<void> {
    await fetch(`${this.baseURL}/values/${id}`, {
      method: 'DELETE'
    });
  }

  // Écritures Analytiques
  async getEntries(filter?: AnalyticalFilter): Promise<AnalyticEntry[]> {
    const params = new URLSearchParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }
    
    const response = await fetch(`${this.baseURL}/entries?${params}`);
    const data: AnalyticalAPIResponse<AnalyticEntry[]> = await response.json();
    return data.data;
  }

  async createEntry(entry: Partial<AnalyticEntry>): Promise<AnalyticEntry> {
    const response = await fetch(`${this.baseURL}/entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
    const data: AnalyticalAPIResponse<AnalyticEntry> = await response.json();
    return data.data;
  }

  async updateEntry(id: number, entry: Partial<AnalyticEntry>): Promise<AnalyticEntry> {
    const response = await fetch(`${this.baseURL}/entries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
    const data: AnalyticalAPIResponse<AnalyticEntry> = await response.json();
    return data.data;
  }

  async deleteEntry(id: number): Promise<void> {
    await fetch(`${this.baseURL}/entries/${id}`, {
      method: 'DELETE'
    });
  }

  // Règles d'Allocation
  async getAllocationRules(): Promise<AllocationRule[]> {
    const response = await fetch(`${this.baseURL}/allocation-rules`);
    const data: AnalyticalAPIResponse<AllocationRule[]> = await response.json();
    return data.data;
  }

  async createAllocationRule(rule: Partial<AllocationRule>): Promise<AllocationRule> {
    const response = await fetch(`${this.baseURL}/allocation-rules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rule)
    });
    const data: AnalyticalAPIResponse<AllocationRule> = await response.json();
    return data.data;
  }

  async executeAllocationRule(id: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseURL}/allocation-rules/${id}/execute`, {
      method: 'POST'
    });
    return await response.json();
  }

  // Budgets
  async getBudgets(): Promise<BudgetLine[]> {
    const response = await fetch(`${this.baseURL}/budgets`);
    const data: AnalyticalAPIResponse<BudgetLine[]> = await response.json();
    return data.data;
  }

  async createBudget(budget: Partial<BudgetLine>): Promise<BudgetLine> {
    const response = await fetch(`${this.baseURL}/budgets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(budget)
    });
    const data: AnalyticalAPIResponse<BudgetLine> = await response.json();
    return data.data;
  }

  async updateBudget(id: number, budget: Partial<BudgetLine>): Promise<BudgetLine> {
    const response = await fetch(`${this.baseURL}/budgets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(budget)
    });
    const data: AnalyticalAPIResponse<BudgetLine> = await response.json();
    return data.data;
  }

  // Rapports OLAP
  async getPnLReport(filter: AnalyticalFilter): Promise<AnalyticalReport> {
    const params = new URLSearchParams();
    Object.entries(filter).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.append(key, String(value));
        }
      }
    });

    const response = await fetch(`${this.baseURL}/reports/pnl?${params}`);
    const data: AnalyticalAPIResponse<AnalyticalReport> = await response.json();
    return data.data;
  }

  async getHeatmapReport(filter: AnalyticalFilter): Promise<AnalyticalReport> {
    const params = new URLSearchParams();
    Object.entries(filter).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.append(key, String(value));
        }
      }
    });

    const response = await fetch(`${this.baseURL}/reports/heatmap?${params}`);
    const data: AnalyticalAPIResponse<AnalyticalReport> = await response.json();
    return data.data;
  }

  async getStats(period: string = 'month'): Promise<any> {
    const response = await fetch(`${this.baseURL}/stats?period=${period}`);
    const data: AnalyticalAPIResponse<any> = await response.json();
    return data.data;
  }

  // Import/Export
  async importAxesFromCSV(file: File): Promise<{ success: boolean; imported: number; errors: string[] }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseURL}/axes/import`, {
      method: 'POST',
      body: formData
    });
    return await response.json();
  }

  async exportReport(reportType: string, format: 'csv' | 'excel' | 'pdf', filter?: AnalyticalFilter): Promise<Blob> {
    const params = new URLSearchParams();
    params.append('format', format);
    
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.append(key, String(value));
          }
        }
      });
    }

    const response = await fetch(`${this.baseURL}/reports/${reportType}/export?${params}`);
    return await response.blob();
  }

  // Webhooks
  async subscribeToWebhook(event: string, url: string): Promise<{ success: boolean; webhookId: string }> {
    const response = await fetch(`${this.baseURL}/webhooks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, url })
    });
    return await response.json();
  }

  async unsubscribeFromWebhook(webhookId: string): Promise<{ success: boolean }> {
    const response = await fetch(`${this.baseURL}/webhooks/${webhookId}`, {
      method: 'DELETE'
    });
    return await response.json();
  }
}

export const analyticalService = new AnalyticalService();