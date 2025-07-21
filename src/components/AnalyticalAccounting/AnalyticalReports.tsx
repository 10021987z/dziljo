import React, { useState } from 'react';
import { BarChart3, TrendingUp, Download, Filter, Calendar, Eye, Settings, PieChart, Activity, Layers, Target, DollarSign, Users, Building2, Package } from 'lucide-react';

interface ReportFilter {
  axes: string[];
  period: string;
  startDate: string;
  endDate: string;
  groupBy: string;
  metrics: string[];
}

interface PnLData {
  dimension: string;
  revenue: number;
  costs: number;
  margin: number;
  marginPercent: number;
  budget?: number;
  variance?: number;
}

interface HeatmapData {
  x: string;
  y: string;
  value: number;
  color: string;
}

const AnalyticalReports: React.FC = () => {
  const [activeReport, setActiveReport] = useState('pnl');
  const [filters, setFilters] = useState<ReportFilter>({
    axes: ['PROJECT', 'CLIENT'],
    period: 'month',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    groupBy: 'PROJECT',
    metrics: ['revenue', 'margin', 'costs']
  });

  const [isGenerating, setIsGenerating] = useState(false);

  // Sample P&L data
  const pnlData: PnLData[] = [
    {
      dimension: 'Projet Alpha',
      revenue: 85000,
      costs: 52000,
      margin: 33000,
      marginPercent: 38.8,
      budget: 30000,
      variance: 3000
    },
    {
      dimension: 'Projet Beta',
      revenue: 125000,
      costs: 78000,
      margin: 47000,
      marginPercent: 37.6,
      budget: 45000,
      variance: 2000
    },
    {
      dimension: 'Migration Cloud',
      revenue: 95000,
      costs: 61000,
      margin: 34000,
      marginPercent: 35.8,
      budget: 32000,
      variance: 2000
    },
    {
      dimension: 'Consulting',
      revenue: 67000,
      costs: 43000,
      margin: 24000,
      marginPercent: 35.8,
      budget: 25000,
      variance: -1000
    }
  ];

  // Sample heatmap data
  const heatmapData: HeatmapData[] = [
    { x: 'TechCorp', y: 'CRM', value: 45.2, color: 'bg-green-500' },
    { x: 'TechCorp', y: 'Consulting', value: 38.7, color: 'bg-green-400' },
    { x: 'Digital Innov', y: 'Marketing', value: 42.1, color: 'bg-green-500' },
    { x: 'Digital Innov', y: 'CRM', value: 35.6, color: 'bg-yellow-500' },
    { x: 'StartupXYZ', y: 'Consulting', value: 48.3, color: 'bg-green-600' },
    { x: 'StartupXYZ', y: 'Infrastructure', value: 28.9, color: 'bg-orange-500' }
  ];

  const availableAxes = [
    { code: 'PROJECT', label: 'Projets', icon: Layers },
    { code: 'CLIENT', label: 'Clients', icon: Users },
    { code: 'PRODUCT', label: 'Produits', icon: Package },
    { code: 'COST_CENTER', label: 'Centres de Coût', icon: Building2 }
  ];

  const availableMetrics = [
    { code: 'revenue', label: 'Chiffre d\'Affaires', icon: DollarSign },
    { code: 'costs', label: 'Coûts', icon: TrendingUp },
    { code: 'margin', label: 'Marge', icon: Target },
    { code: 'marginPercent', label: 'Taux de Marge', icon: Activity }
  ];

  const reportTypes = [
    { id: 'pnl', name: 'P&L Multidimensionnel', icon: BarChart3, description: 'Compte de résultat par axes analytiques' },
    { id: 'heatmap', name: 'Heatmap Marges', icon: PieChart, description: 'Visualisation des marges par croisement d\'axes' },
    { id: 'trends', name: 'Tendances', icon: TrendingUp, description: 'Évolution des KPIs dans le temps' },
    { id: 'variance', name: 'Analyse d\'Écarts', icon: Target, description: 'Comparaison budget vs réalisé' }
  ];

  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      
      // Show success message
      const successElement = document.createElement('div');
      successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
      successElement.textContent = '✅ Rapport généré avec succès !';
      document.body.appendChild(successElement);
      setTimeout(() => document.body.removeChild(successElement), 3000);
    }, 2000);
  };

  const handleExportReport = (format: 'pdf' | 'excel' | 'csv') => {
    // Simulate export
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = `📄 Export ${format.toUpperCase()} en cours...`;
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getMarginColor = (marginPercent: number) => {
    if (marginPercent >= 40) return 'text-green-600';
    if (marginPercent >= 30) return 'text-blue-600';
    if (marginPercent >= 20) return 'text-orange-600';
    return 'text-red-600';
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-green-600';
    if (variance < 0) return 'text-red-600';
    return 'text-slate-600';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Rapports OLAP</h2>
          <p className="text-slate-600">Reporting multidimensionnel et analyse de performance</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => handleExportReport('excel')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Excel
          </button>
          <button 
            onClick={() => handleExportReport('pdf')}
            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-red-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            PDF
          </button>
          <button 
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <BarChart3 className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Génération...' : 'Générer'}
          </button>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Type de Rapport</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveReport(type.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                activeReport === type.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <type.icon className={`w-8 h-8 mx-auto mb-2 ${
                activeReport === type.id ? 'text-blue-600' : 'text-slate-600'
              }`} />
              <h4 className="font-medium text-slate-900 mb-1">{type.name}</h4>
              <p className="text-sm text-slate-600">{type.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filtres et Paramètres
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Axes d'analyse</label>
            <div className="space-y-2">
              {availableAxes.map((axis) => (
                <label key={axis.code} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.axes.includes(axis.code)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters({ ...filters, axes: [...filters.axes, axis.code] });
                      } else {
                        setFilters({ ...filters, axes: filters.axes.filter(a => a !== axis.code) });
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <axis.icon className="w-4 h-4 ml-2 mr-1 text-slate-500" />
                  <span className="text-sm text-slate-700">{axis.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Période</label>
            <select
              value={filters.period}
              onChange={(e) => setFilters({ ...filters, period: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
            >
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
              <option value="custom">Période personnalisée</option>
            </select>

            {filters.period === 'custom' && (
              <div className="space-y-2">
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Métriques</label>
            <div className="space-y-2">
              {availableMetrics.map((metric) => (
                <label key={metric.code} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.metrics.includes(metric.code)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters({ ...filters, metrics: [...filters.metrics, metric.code] });
                      } else {
                        setFilters({ ...filters, metrics: filters.metrics.filter(m => m !== metric.code) });
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <metric.icon className="w-4 h-4 ml-2 mr-1 text-slate-500" />
                  <span className="text-sm text-slate-700">{metric.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200">
          <label className="block text-sm font-medium text-slate-700 mb-2">Grouper par</label>
          <select
            value={filters.groupBy}
            onChange={(e) => setFilters({ ...filters, groupBy: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {availableAxes.map((axis) => (
              <option key={axis.code} value={axis.code}>{axis.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        {activeReport === 'pnl' && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">P&L Multidimensionnel</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Dimension</th>
                    <th className="text-right py-3 px-4 font-medium text-slate-700">Chiffre d'Affaires</th>
                    <th className="text-right py-3 px-4 font-medium text-slate-700">Coûts</th>
                    <th className="text-right py-3 px-4 font-medium text-slate-700">Marge</th>
                    <th className="text-right py-3 px-4 font-medium text-slate-700">Taux de Marge</th>
                    <th className="text-right py-3 px-4 font-medium text-slate-700">Budget</th>
                    <th className="text-right py-3 px-4 font-medium text-slate-700">Écart</th>
                  </tr>
                </thead>
                <tbody>
                  {pnlData.map((row, index) => (
                    <tr key={index} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium text-slate-900">{row.dimension}</td>
                      <td className="py-3 px-4 text-right text-slate-900">{formatCurrency(row.revenue)}</td>
                      <td className="py-3 px-4 text-right text-red-600">{formatCurrency(row.costs)}</td>
                      <td className="py-3 px-4 text-right font-medium text-green-600">{formatCurrency(row.margin)}</td>
                      <td className={`py-3 px-4 text-right font-medium ${getMarginColor(row.marginPercent)}`}>
                        {formatPercentage(row.marginPercent)}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-700">
                        {row.budget ? formatCurrency(row.budget) : '-'}
                      </td>
                      <td className={`py-3 px-4 text-right font-medium ${
                        row.variance ? getVarianceColor(row.variance) : 'text-slate-600'
                      }`}>
                        {row.variance ? (row.variance > 0 ? '+' : '') + formatCurrency(row.variance) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 font-medium">
                  <tr>
                    <td className="py-3 px-4 text-slate-900">TOTAL</td>
                    <td className="py-3 px-4 text-right text-slate-900">
                      {formatCurrency(pnlData.reduce((sum, row) => sum + row.revenue, 0))}
                    </td>
                    <td className="py-3 px-4 text-right text-red-600">
                      {formatCurrency(pnlData.reduce((sum, row) => sum + row.costs, 0))}
                    </td>
                    <td className="py-3 px-4 text-right text-green-600">
                      {formatCurrency(pnlData.reduce((sum, row) => sum + row.margin, 0))}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-900">
                      {formatPercentage(
                        (pnlData.reduce((sum, row) => sum + row.margin, 0) / 
                         pnlData.reduce((sum, row) => sum + row.revenue, 0)) * 100
                      )}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-700">
                      {formatCurrency(pnlData.reduce((sum, row) => sum + (row.budget || 0), 0))}
                    </td>
                    <td className="py-3 px-4 text-right text-green-600">
                      {formatCurrency(pnlData.reduce((sum, row) => sum + (row.variance || 0), 0))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {activeReport === 'heatmap' && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Heatmap des Marges</h3>
            
            <div className="grid grid-cols-3 gap-2 max-w-2xl">
              <div></div>
              <div className="text-center font-medium text-slate-700">CRM</div>
              <div className="text-center font-medium text-slate-700">Marketing</div>
              <div className="text-center font-medium text-slate-700">Consulting</div>
              
              {['TechCorp', 'Digital Innov', 'StartupXYZ'].map((client) => (
                <React.Fragment key={client}>
                  <div className="font-medium text-slate-700 py-2">{client}</div>
                  {['CRM', 'Marketing', 'Consulting'].map((product) => {
                    const data = heatmapData.find(d => d.x === client && d.y === product);
                    return (
                      <div
                        key={`${client}-${product}`}
                        className={`h-16 rounded-lg flex items-center justify-center text-white font-medium ${
                          data ? data.color : 'bg-slate-200'
                        }`}
                      >
                        {data ? formatPercentage(data.value) : '-'}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>

            <div className="mt-6 flex items-center space-x-4">
              <span className="text-sm text-slate-600">Légende:</span>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-600 rounded"></div>
                <span className="text-sm text-slate-700">&gt; 40%</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-400 rounded"></div>
                <span className="text-sm text-slate-700">30-40%</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm text-slate-700">20-30%</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span className="text-sm text-slate-700">&lt; 20%</span>
              </div>
            </div>
          </div>
        )}

        {activeReport === 'trends' && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Analyse des Tendances</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">Évolution Marge par Mois</h4>
                <div className="space-y-3">
                  {[
                    { month: 'Oct 2023', margin: 32.1, trend: 'up' },
                    { month: 'Nov 2023', margin: 33.5, trend: 'up' },
                    { month: 'Déc 2023', margin: 31.8, trend: 'down' },
                    { month: 'Jan 2024', margin: 34.2, trend: 'up' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">{item.month}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-slate-900">{formatPercentage(item.margin)}</span>
                        {item.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">Top Performers</h4>
                <div className="space-y-3">
                  {[
                    { name: 'Projet Beta', performance: 95 },
                    { name: 'TechCorp Solutions', performance: 88 },
                    { name: 'CRM Enterprise', performance: 82 },
                    { name: 'Développement', performance: 78 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">{item.name}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${item.performance}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-slate-900 w-8">{item.performance}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeReport === 'variance' && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Analyse d'Écarts Budget vs Réalisé</h3>
            
            <div className="space-y-4">
              {pnlData.map((row, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-slate-900">{row.dimension}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      (row.variance || 0) > 0 ? 'bg-green-100 text-green-800' : 
                      (row.variance || 0) < 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {row.variance ? (row.variance > 0 ? 'Favorable' : 'Défavorable') : 'Neutre'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Budget:</span>
                      <p className="font-medium text-slate-900">{formatCurrency(row.budget || 0)}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Réalisé:</span>
                      <p className="font-medium text-slate-900">{formatCurrency(row.margin)}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Écart:</span>
                      <p className={`font-medium ${getVarianceColor(row.variance || 0)}`}>
                        {row.variance ? (row.variance > 0 ? '+' : '') + formatCurrency(row.variance) : '-'}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-600">Écart %:</span>
                      <p className={`font-medium ${getVarianceColor(row.variance || 0)}`}>
                        {row.variance && row.budget ? 
                          formatPercentage((row.variance / row.budget) * 100) : '-'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div className="relative h-3 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-600 h-3 rounded-full"
                          style={{ width: `${Math.min((row.margin / (row.budget || row.margin)) * 100, 100)}%` }}
                        ></div>
                        {row.budget && row.margin > row.budget && (
                          <div 
                            className="absolute top-0 bg-green-500 h-3"
                            style={{ 
                              left: '100%',
                              width: `${Math.min(((row.margin - row.budget) / row.budget) * 100, 50)}%`
                            }}
                          ></div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>0</span>
                      <span>Budget: {formatCurrency(row.budget || 0)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticalReports;