// Utilitaires pour le module Comptabilité Analytique

import { AnalyticAxis, AnalyticEntry, PnLData } from '../types/analytical';

/**
 * Formate un montant en devise
 */
export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Formate un pourcentage
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Calcule la variance entre deux valeurs
 */
export const calculateVariance = (actual: number, budget: number): { amount: number; percent: number } => {
  const amount = actual - budget;
  const percent = budget !== 0 ? (amount / budget) * 100 : 0;
  return { amount, percent };
};

/**
 * Détermine le statut d'un budget basé sur la consommation
 */
export const getBudgetStatus = (actual: number, budget: number, threshold: number = 90): 
  'on-track' | 'warning' | 'overrun' | 'under-budget' => {
  const consumption = (actual / budget) * 100;
  
  if (consumption > 100) return 'overrun';
  if (consumption > threshold) return 'warning';
  if (consumption < 50) return 'under-budget';
  return 'on-track';
};

/**
 * Génère un hash pour une combinaison d'axes
 */
export const generateAxisComboHash = (values: Record<string, string>): string => {
  const sortedKeys = Object.keys(values).sort();
  const combo = sortedKeys.map(key => `${key}:${values[key]}`).join('|');
  return btoa(combo).replace(/[^a-zA-Z0-9]/g, '');
};

/**
 * Valide une formule d'allocation
 */
export const validateAllocationFormula = (formula: string): { isValid: boolean; error?: string } => {
  try {
    // Variables autorisées
    const allowedVariables = [
      'amount', 'timesheet.hours', 'total_hours', 
      'client.revenue', 'total_revenue', 'employee.cost'
    ];
    
    // Opérateurs autorisés
    const allowedOperators = ['+', '-', '*', '/', '(', ')', '.'];
    
    // Vérification basique de la syntaxe
    const tokens = formula.match(/[a-zA-Z_][a-zA-Z0-9_.]*|\d+\.?\d*|[+\-*/()]/g) || [];
    
    for (const token of tokens) {
      if (!/^\d+\.?\d*$/.test(token) && // Pas un nombre
          !allowedOperators.includes(token) && // Pas un opérateur
          !allowedVariables.some(v => token.startsWith(v.split('.')[0]))) { // Pas une variable autorisée
        return {
          isValid: false,
          error: `Variable ou opérateur non autorisé: ${token}`
        };
      }
    }
    
    // Vérification des parenthèses équilibrées
    let parenthesesCount = 0;
    for (const char of formula) {
      if (char === '(') parenthesesCount++;
      if (char === ')') parenthesesCount--;
      if (parenthesesCount < 0) {
        return {
          isValid: false,
          error: 'Parenthèses non équilibrées'
        };
      }
    }
    
    if (parenthesesCount !== 0) {
      return {
        isValid: false,
        error: 'Parenthèses non équilibrées'
      };
    }
    
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: 'Erreur de syntaxe dans la formule'
    };
  }
};

/**
 * Calcule les métriques P&L à partir des données
 */
export const calculatePnLMetrics = (entries: AnalyticEntry[]): {
  totalRevenue: number;
  totalCosts: number;
  totalMargin: number;
  marginPercent: number;
} => {
  const revenue = entries
    .filter(e => e.amount > 0)
    .reduce((sum, e) => sum + e.amount, 0);
    
  const costs = entries
    .filter(e => e.amount < 0)
    .reduce((sum, e) => sum + Math.abs(e.amount), 0);
    
  const margin = revenue - costs;
  const marginPercent = revenue > 0 ? (margin / revenue) * 100 : 0;
  
  return {
    totalRevenue: revenue,
    totalCosts: costs,
    totalMargin: margin,
    marginPercent
  };
};

/**
 * Groupe les écritures par dimension
 */
export const groupEntriesByDimension = (
  entries: AnalyticEntry[], 
  dimension: string
): Record<string, AnalyticEntry[]> => {
  return entries.reduce((groups, entry) => {
    let key = 'Non défini';
    
    switch (dimension) {
      case 'PROJECT':
        key = entry.axis1Value || 'Non défini';
        break;
      case 'CLIENT':
        key = entry.axis2Value || 'Non défini';
        break;
      case 'PRODUCT':
        key = entry.axis3Value || 'Non défini';
        break;
      case 'COST_CENTER':
        key = entry.axis4Value || 'Non défini';
        break;
    }
    
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(entry);
    
    return groups;
  }, {} as Record<string, AnalyticEntry[]>);
};

/**
 * Génère des données P&L par dimension
 */
export const generatePnLByDimension = (
  entries: AnalyticEntry[], 
  dimension: string
): PnLData[] => {
  const grouped = groupEntriesByDimension(entries, dimension);
  
  return Object.entries(grouped).map(([dimensionValue, dimensionEntries]) => {
    const metrics = calculatePnLMetrics(dimensionEntries);
    
    return {
      dimension: dimensionValue,
      revenue: metrics.totalRevenue,
      costs: metrics.totalCosts,
      margin: metrics.totalMargin,
      marginPercent: metrics.marginPercent
    };
  }).sort((a, b) => b.margin - a.margin); // Tri par marge décroissante
};

/**
 * Calcule les prévisions basées sur les tendances
 */
export const calculateForecast = (
  historicalData: { period: string; amount: number }[],
  periodsToForecast: number = 3
): { period: string; forecast: number; confidence: number }[] => {
  if (historicalData.length < 2) {
    return [];
  }
  
  // Calcul de la tendance linéaire simple
  const amounts = historicalData.map(d => d.amount);
  const n = amounts.length;
  const sumX = (n * (n - 1)) / 2;
  const sumY = amounts.reduce((sum, amount) => sum + amount, 0);
  const sumXY = amounts.reduce((sum, amount, index) => sum + (index * amount), 0);
  const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Calcul de la confiance basée sur la variance
  const predictions = amounts.map((_, index) => slope * index + intercept);
  const variance = amounts.reduce((sum, amount, index) => {
    return sum + Math.pow(amount - predictions[index], 2);
  }, 0) / n;
  
  const confidence = Math.max(0, Math.min(100, 100 - (Math.sqrt(variance) / (sumY / n)) * 100));
  
  // Génération des prévisions
  const forecasts = [];
  for (let i = 1; i <= periodsToForecast; i++) {
    const forecastValue = slope * (n + i - 1) + intercept;
    const periodDate = new Date();
    periodDate.setMonth(periodDate.getMonth() + i);
    
    forecasts.push({
      period: periodDate.toISOString().slice(0, 7), // YYYY-MM
      forecast: Math.max(0, forecastValue),
      confidence: Math.max(0, confidence - (i * 5)) // Confiance décroissante
    });
  }
  
  return forecasts;
};

/**
 * Génère des couleurs pour les heatmaps
 */
export const generateHeatmapColor = (value: number, min: number, max: number): string => {
  if (max === min) return 'bg-slate-200';
  
  const normalized = (value - min) / (max - min);
  
  if (normalized >= 0.8) return 'bg-green-600';
  if (normalized >= 0.6) return 'bg-green-500';
  if (normalized >= 0.4) return 'bg-yellow-500';
  if (normalized >= 0.2) return 'bg-orange-500';
  return 'bg-red-500';
};

/**
 * Valide la configuration des axes
 */
export const validateAxesConfiguration = (axes: AnalyticAxis[]): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (axes.length === 0) {
    errors.push('Au moins un axe analytique est requis');
  }
  
  if (axes.length > 4) {
    errors.push('Maximum 4 axes analytiques autorisés');
  }
  
  const codes = axes.map(axis => axis.code);
  const duplicateCodes = codes.filter((code, index) => codes.indexOf(code) !== index);
  if (duplicateCodes.length > 0) {
    errors.push(`Codes d'axes dupliqués: ${duplicateCodes.join(', ')}`);
  }
  
  const orders = axes.map(axis => axis.order);
  const duplicateOrders = orders.filter((order, index) => orders.indexOf(order) !== index);
  if (duplicateOrders.length > 0) {
    errors.push(`Ordres d'axes dupliqués: ${duplicateOrders.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Génère un rapport d'analyse des écarts
 */
export const generateVarianceAnalysis = (
  actual: PnLData[],
  budget: PnLData[]
): Array<PnLData & { budgetMargin?: number; variance?: number; variancePercent?: number }> => {
  return actual.map(actualItem => {
    const budgetItem = budget.find(b => b.dimension === actualItem.dimension);
    
    if (!budgetItem) {
      return actualItem;
    }
    
    const variance = actualItem.margin - budgetItem.margin;
    const variancePercent = budgetItem.margin !== 0 ? (variance / budgetItem.margin) * 100 : 0;
    
    return {
      ...actualItem,
      budgetMargin: budgetItem.margin,
      variance,
      variancePercent
    };
  });
};