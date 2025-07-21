// Hooks personnalisés pour le module Devis

import { useState, useEffect, useCallback } from 'react';
import { quoteService } from '../services/quoteService';
import { 
  Quote, 
  QuoteTemplate, 
  QuoteStats,
  QuoteFilters 
} from '../types/quotes';

export const useQuotes = (filters?: QuoteFilters) => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await quoteService.getQuotes(filters);
      setQuotes(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des devis');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createQuote = useCallback(async (quoteData: Partial<Quote>) => {
    try {
      const newQuote = await quoteService.createQuote(quoteData);
      setQuotes(prev => [newQuote, ...prev]);
      return newQuote;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du devis');
      throw err;
    }
  }, []);

  const updateQuote = useCallback(async (id: number, quoteData: Partial<Quote>) => {
    try {
      const updatedQuote = await quoteService.updateQuote(id, quoteData);
      setQuotes(prev => prev.map(quote => quote.id === id ? updatedQuote : quote));
      return updatedQuote;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du devis');
      throw err;
    }
  }, []);

  const deleteQuote = useCallback(async (id: number) => {
    try {
      await quoteService.deleteQuote(id);
      setQuotes(prev => prev.filter(quote => quote.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression du devis');
      throw err;
    }
  }, []);

  const sendQuote = useCallback(async (id: number) => {
    try {
      const updatedQuote = await quoteService.sendQuote(id);
      setQuotes(prev => prev.map(quote => quote.id === id ? updatedQuote : quote));
      return updatedQuote;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi du devis');
      throw err;
    }
  }, []);

  const requestApproval = useCallback(async (id: number, reason?: string) => {
    try {
      const updatedQuote = await quoteService.requestApproval(id, reason);
      setQuotes(prev => prev.map(quote => quote.id === id ? updatedQuote : quote));
      return updatedQuote;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la demande d\'approbation');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  return {
    quotes,
    loading,
    error,
    refetch: fetchQuotes,
    createQuote,
    updateQuote,
    deleteQuote,
    sendQuote,
    requestApproval
  };
};

export const useQuoteTemplates = (filters?: { industry?: string; language?: string; minWinRate?: number }) => {
  const [templates, setTemplates] = useState<QuoteTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      const data = await quoteService.getTemplates(filters);
      setTemplates(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des modèles');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createTemplate = useCallback(async (templateData: Partial<QuoteTemplate>) => {
    try {
      const newTemplate = await quoteService.createTemplate(templateData);
      setTemplates(prev => [newTemplate, ...prev]);
      return newTemplate;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du modèle');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return {
    templates,
    loading,
    error,
    refetch: fetchTemplates,
    createTemplate
  };
};

export const useQuoteStats = (period?: string) => {
  const [stats, setStats] = useState<QuoteStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await quoteService.getStats(period);
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};

export const useQuoteInsights = (quoteId: number) => {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);
      const data = await quoteService.getQuoteInsights(quoteId);
      setInsights(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des insights');
    } finally {
      setLoading(false);
    }
  }, [quoteId]);

  useEffect(() => {
    if (quoteId) {
      fetchInsights();
    }
  }, [fetchInsights, quoteId]);

  return {
    insights,
    loading,
    error,
    refetch: fetchInsights
  };
};