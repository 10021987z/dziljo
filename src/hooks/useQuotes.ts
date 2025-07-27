import { useState, useEffect } from 'react';
import FirebaseService from '../services/firebaseService';

export interface Quote {
  id: number;
  number: string;
  title: string;
  client: {
    name: string;
    email: string;
    address?: string;
  };
  contact: {
    name: string;
    email: string;
    phone?: string;
  };
  status: 'draft' | 'pending-approval' | 'approved' | 'sent' | 'viewed' | 'signed' | 'expired' | 'rejected';
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  total: number;
  marginPercent: number;
  validUntil: string;
  createdDate: string;
  assignedTo: string;
  notes?: string;
  terms?: string;
}

export interface QuoteItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export const useQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      const data = await FirebaseService.getAll('quotes');
      setQuotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const createQuote = async (quoteData: Partial<Quote>) => {
    try {
      const newQuote = await FirebaseService.create('quotes', {
        ...quoteData,
        number: `QUO-${Date.now()}`,
        createdDate: new Date().toISOString().split('T')[0],
        status: 'draft'
      });
      setQuotes(prev => [newQuote, ...prev]);
      return newQuote;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      throw err;
    }
  };

  const updateQuote = async (id: number, updates: Partial<Quote>) => {
    try {
      const updatedQuote = await FirebaseService.update('quotes', id.toString(), updates);
      setQuotes(prev => prev.map(quote => quote.id === id ? updatedQuote : quote));
      return updatedQuote;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    }
  };

  const sendQuote = async (id: number) => {
    try {
      const updatedQuote = await FirebaseService.update('quotes', id.toString(), { 
        status: 'sent',
        sentDate: new Date().toISOString()
      });
      setQuotes(prev => prev.map(quote => quote.id === id ? updatedQuote : quote));
      return updatedQuote;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi');
      throw err;
    }
  };

  return {
    quotes,
    loading,
    error,
    createQuote,
    updateQuote,
    sendQuote,
    refetch: loadQuotes
  };
};

export const useQuoteStats = () => {
  const [stats, setStats] = useState({
    totalQuotes: 0,
    totalValue: 0,
    acceptanceRate: 0,
    averageTimeToSign: 0
  });

  const { quotes } = useQuotes();

  useEffect(() => {
    if (quotes.length > 0) {
      const totalValue = quotes.reduce((sum, quote) => sum + quote.total, 0);
      const signedQuotes = quotes.filter(q => q.status === 'signed');
      const acceptanceRate = (signedQuotes.length / quotes.length) * 100;

      setStats({
        totalQuotes: quotes.length,
        totalValue,
        acceptanceRate,
        averageTimeToSign: 7 // Simulation
      });
    }
  }, [quotes]);

  return { stats };
};