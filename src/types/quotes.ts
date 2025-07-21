// Types pour le module Devis Intelligents

export interface QuoteTemplate {
  id: number;
  name: string;
  description: string;
  category: string;
  industry: string;
  language: string;
  winRate: number;
  averageMargin: number;
  usageCount: number;
  isActive: boolean;
  content: string;
  fields: QuoteField[];
  createdDate: string;
  lastModified: string;
  createdBy: string;
}

export interface QuoteField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  required: boolean;
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
}

export interface Quote {
  id: number;
  number: string;
  title: string;
  templateId?: number;
  templateName?: string;
  status: 'draft' | 'pending-approval' | 'approved' | 'sent' | 'viewed' | 'signed' | 'expired' | 'rejected';
  client: QuoteClient;
  contact: QuoteContact;
  lines: QuoteLine[];
  subtotal: number;
  discountType: 'percentage' | 'amount';
  discountValue: number;
  discountAmount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  margin: number;
  marginPercent: number;
  conditions: QuoteConditions;
  validityDays: number;
  expiryDate: string;
  createdDate: string;
  sentDate?: string;
  signedDate?: string;
  viewedDate?: string;
  assignedTo: string;
  approvedBy?: string;
  approvalDate?: string;
  notes: string;
  internalNotes: string;
  attachments: QuoteAttachment[];
  signatureData?: SignatureData;
  insights: QuoteInsights;
  workflow: QuoteWorkflowStep[];
}

export interface QuoteClient {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  industry: string;
  siret?: string;
  vatNumber?: string;
}

export interface QuoteContact {
  name: string;
  email: string;
  phone: string;
  position: string;
}

export interface QuoteLine {
  id: string;
  productId?: number;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  margin: number;
  marginPercent: number;
  category: string;
  isOptional: boolean;
}

export interface QuoteConditions {
  paymentTerms: string;
  deliveryTerms: string;
  warranty: string;
  penalties: string;
  additionalTerms: string[];
}

export interface QuoteAttachment {
  id: number;
  name: string;
  type: string;
  size: string;
  url: string;
  uploadDate: string;
}

export interface SignatureData {
  signatureUrl: string;
  signedBy: string;
  signedDate: string;
  ipAddress: string;
  userAgent: string;
  documentHash: string;
}

export interface QuoteInsights {
  signatureProbability: number;
  marginAlert: boolean;
  discountAlert: boolean;
  competitorRisk: string;
  recommendations: string[];
  similarQuotes: number;
  averageTimeToSign: number;
}

export interface QuoteWorkflowStep {
  id: number;
  step: string;
  status: 'pending' | 'in-progress' | 'completed' | 'skipped';
  assignedTo: string;
  completedDate?: string;
  notes?: string;
}

export interface QuoteStats {
  totalQuotes: number;
  totalValue: number;
  averageValue: number;
  acceptanceRate: number;
  averageTimeToSign: number;
  averageMargin: number;
  pendingApproval: number;
  expiringSoon: number;
}

export interface QuoteFilters {
  status?: string;
  assignedTo?: string;
  client?: string;
  dateFrom?: string;
  dateTo?: string;
  minValue?: number;
  maxValue?: number;
  template?: string;
}

// API Response Types
export interface QuoteAPIResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
  success: boolean;
  message?: string;
}

// Webhook Types
export interface QuoteWebhook {
  event: 'quote.created' | 'quote.sent' | 'quote.viewed' | 'quote.signed' | 'quote.expired';
  data: Quote;
  timestamp: string;
  source: string;
}