// Service pour les API du module Devis Intelligents

import { 
  Quote, 
  QuoteTemplate, 
  QuoteStats,
  QuoteFilters,
  QuoteAPIResponse 
} from '../types/quotes';

class QuoteService {
  private baseURL = '/api/quotes';

  // Templates
  async getTemplates(filters?: { industry?: string; language?: string; minWinRate?: number }): Promise<QuoteTemplate[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }
    
    const response = await fetch(`${this.baseURL}/templates?${params}`);
    const data: QuoteAPIResponse<QuoteTemplate[]> = await response.json();
    return data.data;
  }

  async createTemplate(template: Partial<QuoteTemplate>): Promise<QuoteTemplate> {
    const response = await fetch(`${this.baseURL}/templates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(template)
    });
    const data: QuoteAPIResponse<QuoteTemplate> = await response.json();
    return data.data;
  }

  // Quotes CRUD
  async getQuotes(filters?: QuoteFilters): Promise<Quote[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }
    
    const response = await fetch(`${this.baseURL}?${params}`);
    const data: QuoteAPIResponse<Quote[]> = await response.json();
    return data.data;
  }

  async getQuote(id: number): Promise<Quote> {
    const response = await fetch(`${this.baseURL}/${id}`);
    const data: QuoteAPIResponse<Quote> = await response.json();
    return data.data;
  }

  async createQuote(quote: Partial<Quote>): Promise<Quote> {
    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quote)
    });
    const data: QuoteAPIResponse<Quote> = await response.json();
    return data.data;
  }

  async updateQuote(id: number, quote: Partial<Quote>): Promise<Quote> {
    const response = await fetch(`${this.baseURL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quote)
    });
    const data: QuoteAPIResponse<Quote> = await response.json();
    return data.data;
  }

  async deleteQuote(id: number): Promise<void> {
    await fetch(`${this.baseURL}/${id}`, {
      method: 'DELETE'
    });
  }

  // Workflow Actions
  async sendQuote(id: number): Promise<Quote> {
    const response = await fetch(`${this.baseURL}/${id}/send`, {
      method: 'POST'
    });
    const data: QuoteAPIResponse<Quote> = await response.json();
    return data.data;
  }

  async requestApproval(id: number, reason?: string): Promise<Quote> {
    const response = await fetch(`${this.baseURL}/${id}/approval`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    const data: QuoteAPIResponse<Quote> = await response.json();
    return data.data;
  }

  async approveQuote(id: number, notes?: string): Promise<Quote> {
    const response = await fetch(`${this.baseURL}/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes })
    });
    const data: QuoteAPIResponse<Quote> = await response.json();
    return data.data;
  }

  async rejectQuote(id: number, reason: string): Promise<Quote> {
    const response = await fetch(`${this.baseURL}/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    const data: QuoteAPIResponse<Quote> = await response.json();
    return data.data;
  }

  // Signature
  async initializeSignature(id: number): Promise<{ signatureUrl: string }> {
    const response = await fetch(`${this.baseURL}/${id}/signature/init`, {
      method: 'POST'
    });
    return await response.json();
  }

  async getSignatureStatus(id: number): Promise<{ status: string; signedDate?: string }> {
    const response = await fetch(`${this.baseURL}/${id}/signature/status`);
    return await response.json();
  }

  // Analytics & Insights
  async getQuoteInsights(id: number): Promise<any> {
    const response = await fetch(`${this.baseURL}/${id}/insights`);
    return await response.json();
  }

  async getStats(period?: string): Promise<QuoteStats> {
    const params = period ? `?period=${period}` : '';
    const response = await fetch(`${this.baseURL}/stats${params}`);
    const data: QuoteAPIResponse<QuoteStats> = await response.json();
    return data.data;
  }

  // Export
  async exportQuotes(format: 'csv' | 'excel' | 'pdf', filters?: QuoteFilters): Promise<Blob> {
    const params = new URLSearchParams();
    params.append('format', format);
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }

    const response = await fetch(`${this.baseURL}/export?${params}`);
    return await response.blob();
  }

  // PDF Generation
  async generatePDF(id: number): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/${id}/pdf`);
    return await response.blob();
  }

  // Duplicate
  async duplicateQuote(id: number): Promise<Quote> {
    const response = await fetch(`${this.baseURL}/${id}/duplicate`, {
      method: 'POST'
    });
    const data: QuoteAPIResponse<Quote> = await response.json();
    return data.data;
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
}

export const quoteService = new QuoteService();