// Hook personnalisé pour le module Comptabilité Analytique

import { useState, useEffect, useCallback } from 'react';
import { analyticalService } from '../services/analyticalService';
import { 
  AnalyticAxis, 
  AnalyticValue, 
  AnalyticEntry, 
  AllocationRule, 
  BudgetLine,
  AnalyticalFilter 
} from '../types/analytical';

export const useAnalyticalAxes = () => {
  const [axes, setAxes] = useState<AnalyticAxis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAxes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await analyticalService.getAxes();
      setAxes(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des axes');
    } finally {
      setLoading(false);
    }
  }, []);

  const createAxis = useCallback(async (axis: Partial<AnalyticAxis>) => {
    try {
      const newAxis = await analyticalService.createAxis(axis);
      setAxes(prev => [...prev, newAxis]);
      return newAxis;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de l\'axe');
      throw err;
    }
  }, []);

  const updateAxis = useCallback(async (id: number, axis: Partial<AnalyticAxis>) => {
    try {
      const updatedAxis = await analyticalService.updateAxis(id, axis);
      setAxes(prev => prev.map(a => a.id === id ? updatedAxis : a));
      return updatedAxis;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de l\'axe');
      throw err;
    }
  }, []);

  const deleteAxis = useCallback(async (id: number) => {
    try {
      await analyticalService.deleteAxis(id);
      setAxes(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression de l\'axe');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchAxes();
  }, [fetchAxes]);

  return {
    axes,
    loading,
    error,
    refetch: fetchAxes,
    createAxis,
    updateAxis,
    deleteAxis
  };
};

export const useAnalyticalValues = (axisId?: number) => {
  const [values, setValues] = useState<AnalyticValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchValues = useCallback(async () => {
    try {
      setLoading(true);
      const data = await analyticalService.getValues(axisId);
      setValues(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des valeurs');
    } finally {
      setLoading(false);
    }
  }, [axisId]);

  const createValue = useCallback(async (value: Partial<AnalyticValue>) => {
    try {
      const newValue = await analyticalService.createValue(value);
      setValues(prev => [...prev, newValue]);
      return newValue;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de la valeur');
      throw err;
    }
  }, []);

  const updateValue = useCallback(async (id: number, value: Partial<AnalyticValue>) => {
    try {
      const updatedValue = await analyticalService.updateValue(id, value);
      setValues(prev => prev.map(v => v.id === id ? updatedValue : v));
      return updatedValue;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la valeur');
      throw err;
    }
  }, []);

  const deleteValue = useCallback(async (id: number) => {
    try {
      await analyticalService.deleteValue(id);
      setValues(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression de la valeur');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchValues();
  }, [fetchValues]);

  return {
    values,
    loading,
    error,
    refetch: fetchValues,
    createValue,
    updateValue,
    deleteValue
  };
};

export const useAnalyticalEntries = (filter?: AnalyticalFilter) => {
  const [entries, setEntries] = useState<AnalyticEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true);
      const data = await analyticalService.getEntries(filter);
      setEntries(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des écritures');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const createEntry = useCallback(async (entry: Partial<AnalyticEntry>) => {
    try {
      const newEntry = await analyticalService.createEntry(entry);
      setEntries(prev => [...prev, newEntry]);
      return newEntry;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de l\'écriture');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return {
    entries,
    loading,
    error,
    refetch: fetchEntries,
    createEntry
  };
};

export const useAnalyticalBudgets = () => {
  const [budgets, setBudgets] = useState<BudgetLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await analyticalService.getBudgets();
      setBudgets(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des budgets');
    } finally {
      setLoading(false);
    }
  }, []);

  const createBudget = useCallback(async (budget: Partial<BudgetLine>) => {
    try {
      const newBudget = await analyticalService.createBudget(budget);
      setBudgets(prev => [...prev, newBudget]);
      return newBudget;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du budget');
      throw err;
    }
  }, []);

  const updateBudget = useCallback(async (id: number, budget: Partial<BudgetLine>) => {
    try {
      const updatedBudget = await analyticalService.updateBudget(id, budget);
      setBudgets(prev => prev.map(b => b.id === id ? updatedBudget : b));
      return updatedBudget;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du budget');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  return {
    budgets,
    loading,
    error,
    refetch: fetchBudgets,
    createBudget,
    updateBudget
  };
};

export const useAnalyticalReports = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePnLReport = useCallback(async (filter: AnalyticalFilter) => {
    try {
      setLoading(true);
      const report = await analyticalService.getPnLReport(filter);
      setError(null);
      return report;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la génération du rapport P&L');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateHeatmapReport = useCallback(async (filter: AnalyticalFilter) => {
    try {
      setLoading(true);
      const report = await analyticalService.getHeatmapReport(filter);
      setError(null);
      return report;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la génération de la heatmap');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const exportReport = useCallback(async (reportType: string, format: 'csv' | 'excel' | 'pdf', filter?: AnalyticalFilter) => {
    try {
      setLoading(true);
      const blob = await analyticalService.exportReport(reportType, format, filter);
      
      // Télécharger le fichier
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rapport_${reportType}_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'export du rapport');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    generatePnLReport,
    generateHeatmapReport,
    exportReport
  };
};

export const useAnalyticalStats = (period: string = 'month') => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await analyticalService.getStats(period);
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