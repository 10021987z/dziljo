import React, { useState } from 'react';
import { BarChart3, Download, Calendar, Filter, TrendingUp, Users, DollarSign, Target, FileText, Eye, Plus, Settings } from 'lucide-react';
import { useFirebaseCollection } from '../../hooks/useFirebase';

interface Report {
  id: number;
  name: string;
  type: 'hr' | 'commercial' | 'financial' | 'operational';
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'on-demand';
  lastGenerated: string;
  nextScheduled?: string;
  status: 'active' | 'inactive' | 'generating';
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv';
  parameters: {
    dateRange: string;
    departments?: string[];
    metrics?: string[];
  };
}

const ReportsManagement: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([
    {
      id: 1,
      name: 'Rapport RH Mensuel',
      type: 'hr',
      description: 'Rapport complet des activités RH du mois',
      frequency: 'monthly',
      lastGenerated: '2024-01-01',
      nextScheduled: '2024-02-01',
      status: 'active',
      recipients: ['hr@dziljo.com', 'direction@dziljo.com'],
      format: 'pdf',
      parameters: {
        dateRange: 'last-month',
        departments: ['all'],
        metrics: ['headcount', 'turnover', 'recruitment', 'performance']
      }
    },
    {
      id: 2,
      name: 'Performance Commerciale',
      type: 'commercial',
      description: 'Analyse des performances commerciales hebdomadaires',
      frequency: 'weekly',
      lastGenerated: '2024-01-22',
      nextScheduled: '2024-01-29',
      status: 'active',
      recipients: ['commercial@dziljo.com'],
      format: 'excel',
      parameters: {
        dateRange: 'last-week',
        metrics: ['revenue', 'deals', 'pipeline', 'conversion']
      }
    },
    {
      id: 3,
      name: 'Tableau de Bord Financier',
      type: 'financial',
      description: 'Vue d\'ensemble financière quotidienne',
      frequency: 'daily',
      lastGenerated: '2024-01-26',
      nextScheduled: '2024-01-27',
      status: 'active',
      recipients: ['finance@dziljo.com', 'direction@dziljo.com'],
      format: 'pdf',
      parameters: {
        dateRange: 'yesterday',
        metrics: ['revenue', 'expenses', 'profit', 'cash-flow']
      }
    }
  ]);

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const { create: createReport, update: updateReport } = useFirebaseCollection('reports');

  const [newReport, setNewReport] = useState({
    name: '',
    type: 'hr' as Report['type'],
    description: '',
    frequency: 'monthly' as Report['frequency'],
    recipients: [''],
    format: 'pdf' as Report['format'],
    departments: [''],
    metrics: ['']
  });

  const reportTypes = [
    { id: 'hr', name: 'Ressources Humaines', icon: Users, color: 'bg-purple-500' },
    { id: 'commercial', name: 'Commercial', icon: TrendingUp, color: 'bg-blue-500' },
    { id: 'financial', name: 'Financier', icon: DollarSign, color: 'bg-green-500' },
    { id: 'operational', name: 'Opérationnel', icon: Target, color: 'bg-orange-500' }
  ];

  const frequencies = [
    { id: 'daily', name: 'Quotidien' },
    { id: 'weekly', name: 'Hebdomadaire' },
    { id: 'monthly', name: 'Mensuel' },
    { id: 'quarterly', name: 'Trimestriel' },
    { id: 'yearly', name: 'Annuel' },
    { id: 'on-demand', name: 'À la demande' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'generating': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      case 'generating': return 'En génération';
      default: return status;
    }
  };

  const getTypeColor = (type: string) => {
    const reportType = reportTypes.find(t => t.id === type);
    return reportType ? reportType.color : 'bg-gray-500';
  };

  const getTypeName = (type: string) => {
    const reportType = reportTypes.find(t => t.id === type);
    return reportType ? reportType.name : type;
  };

  const filteredReports = reports.filter(report => {
    const matchesType = !filterType || report.type === filterType;
    const matchesStatus = !filterStatus || report.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const handleGenerateReport = async (reportId: number) => {
    try {
      // Update status to generating
      setReports(prev => prev.map(report => 
        report.id === reportId ? { ...report, status: 'generating' } : report
      ));

      // Simulate report generation
      setTimeout(async () => {
        const updatedReport = {
          lastGenerated: new Date().toISOString().split('T')[0],
          status: 'active'
        };

        await updateReport(reportId.toString(), updatedReport);
        
        setReports(prev => prev.map(report => 
          report.id === reportId 
            ? { ...report, ...updatedReport } 
            : report
        ));

        // Show success message
        const successElement = document.createElement('div');
        successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
        successElement.textContent = '✅ Rapport généré avec succès !';
        document.body.appendChild(successElement);
        setTimeout(() => document.body.removeChild(successElement), 3000);
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
    }
  };

  const handleCreateReport = async () => {
    try {
      const reportData = {
        ...newReport,
        id: Date.now(),
        lastGenerated: '',
        status: 'active',
        recipients: newReport.recipients.filter(r => r.trim() !== ''),
        parameters: {
          dateRange: 'last-month',
          departments: newReport.departments.filter(d => d.trim() !== ''),
          metrics: newReport.metrics.filter(m => m.trim() !== '')
        }
      };

      await createReport(reportData);
      setReports(prev => [reportData as Report, ...prev]);
      setShowCreateModal(false);
      
      // Reset form
      setNewReport({
        name: '',
        type: 'hr',
        description: '',
        frequency: 'monthly',
        recipients: [''],
        format: 'pdf',
        departments: [''],
        metrics: ['']
      });
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    }
  };

  const addRecipient = () => {
    setNewReport(prev => ({
      ...prev,
      recipients: [...prev.recipients, '']
    }));
  };

  const updateRecipient = (index: number, value: string) => {
    const updatedRecipients = [...newReport.recipients];
    updatedRecipients[index] = value;
    setNewReport(prev => ({ ...prev, recipients: updatedRecipients }));
  };

  const removeRecipient = (index: number) => {
    const updatedRecipients = newReport.recipients.filter((_, i) => i !== index);
    setNewReport(prev => ({ ...prev, recipients: updatedRecipients.length ? updatedRecipients : [''] }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestion des Rapports</h2>
          <p className="text-slate-600">Créez et planifiez vos rapports automatiques</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Rapport
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {reportTypes.map((type) => (
          <div key={type.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{type.name}</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">
                  {reports.filter(r => r.type === type.id).length}
                </p>
              </div>
              <div className={`${type.color} p-3 rounded-lg`}>
                <type.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Reports List */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les types</option>
              {reportTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="generating">En génération</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div key={report.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${getTypeColor(report.type)}`}></div>
                    <h4 className="font-medium text-slate-900">{report.name}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(report.status)}`}>
                      {getStatusText(report.status)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-3">{report.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-slate-600">
                    <div>
                      <span className="font-medium">Type:</span> {getTypeName(report.type)}
                    </div>
                    <div>
                      <span className="font-medium">Fréquence:</span> {frequencies.find(f => f.id === report.frequency)?.name}
                    </div>
                    <div>
                      <span className="font-medium">Dernière génération:</span> {report.lastGenerated || 'Jamais'}
                    </div>
                    <div>
                      <span className="font-medium">Format:</span> {report.format.toUpperCase()}
                    </div>
                  </div>

                  {report.nextScheduled && (
                    <div className="mt-2 text-sm text-slate-600">
                      <span className="font-medium">Prochaine génération:</span> {report.nextScheduled}
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 ml-4">
                  <button 
                    onClick={() => setSelectedReport(report)}
                    className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                    title="Voir les détails"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleGenerateReport(report.id)}
                    disabled={report.status === 'generating'}
                    className="p-2 text-slate-400 hover:text-green-600 transition-colors disabled:opacity-50"
                    title="Générer maintenant"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                  <button 
                    className="p-2 text-slate-400 hover:text-purple-600 transition-colors"
                    title="Télécharger le dernier"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button 
                    className="p-2 text-slate-400 hover:text-orange-600 transition-colors"
                    title="Paramètres"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Aucun rapport trouvé</h3>
            <p className="text-slate-500 mb-6">Créez votre premier rapport ou modifiez vos filtres</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Créer un rapport
            </button>
          </div>
        )}
      </div>

      {/* Create Report Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Nouveau Rapport</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nom du rapport</label>
                <input
                  type="text"
                  value={newReport.name}
                  onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Rapport RH Mensuel"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                  <select
                    value={newReport.type}
                    onChange={(e) => setNewReport({ ...newReport, type: e.target.value as Report['type'] })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {reportTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Fréquence</label>
                  <select
                    value={newReport.frequency}
                    onChange={(e) => setNewReport({ ...newReport, frequency: e.target.value as Report['frequency'] })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {frequencies.map(freq => (
                      <option key={freq.id} value={freq.id}>{freq.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  value={newReport.description}
                  onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Description du rapport..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Format</label>
                <select
                  value={newReport.format}
                  onChange={(e) => setNewReport({ ...newReport, format: e.target.value as Report['format'] })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Destinataires</label>
                {newReport.recipients.map((recipient, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="email"
                      value={recipient}
                      onChange={(e) => updateRecipient(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="email@exemple.com"
                    />
                    <button
                      onClick={() => removeRecipient(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={addRecipient}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Ajouter un destinataire
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-200">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateReport}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Créer le Rapport
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{selectedReport.name}</h3>
                  <p className="text-slate-600">{getTypeName(selectedReport.type)}</p>
                </div>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Configuration</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Fréquence:</span>
                      <span className="text-slate-900">{frequencies.find(f => f.id === selectedReport.frequency)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Format:</span>
                      <span className="text-slate-900">{selectedReport.format.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Statut:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(selectedReport.status)}`}>
                        {getStatusText(selectedReport.status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Planification</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Dernière génération:</span>
                      <span className="text-slate-900">{selectedReport.lastGenerated || 'Jamais'}</span>
                    </div>
                    {selectedReport.nextScheduled && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Prochaine génération:</span>
                        <span className="text-slate-900">{selectedReport.nextScheduled}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-3">Description</h4>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-lg">{selectedReport.description}</p>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-3">Destinataires</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedReport.recipients.map((recipient, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {recipient}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-slate-200">
                <button 
                  onClick={() => handleGenerateReport(selectedReport.id)}
                  disabled={selectedReport.status === 'generating'}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  {selectedReport.status === 'generating' ? 'Génération...' : 'Générer Maintenant'}
                </button>
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurer
                </button>
                <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsManagement;