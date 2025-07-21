import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Settings, Layers, Target, Users, Building2, Package, AlertTriangle, CheckCircle, Code, Database } from 'lucide-react';

interface AnalyticAxis {
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

interface AnalyticValue {
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

const AnalyticalAxes: React.FC = () => {
  const [axes, setAxes] = useState<AnalyticAxis[]>([
    {
      id: 1,
      label: 'Projets',
      code: 'PROJECT',
      order: 1,
      required: true,
      isActive: true,
      valueCount: 8,
      description: 'Suivi de rentabilité par projet',
      createdDate: '2024-01-01',
      lastModified: '2024-01-15'
    },
    {
      id: 2,
      label: 'Clients',
      code: 'CLIENT',
      order: 2,
      required: true,
      isActive: true,
      valueCount: 12,
      description: 'Analyse par client',
      createdDate: '2024-01-01',
      lastModified: '2024-01-20'
    },
    {
      id: 3,
      label: 'Produits',
      code: 'PRODUCT',
      order: 3,
      required: false,
      isActive: true,
      valueCount: 5,
      description: 'Performance par produit/service',
      createdDate: '2024-01-01',
      lastModified: '2024-01-10'
    },
    {
      id: 4,
      label: 'Centres de Coût',
      code: 'COST_CENTER',
      order: 4,
      required: false,
      isActive: true,
      valueCount: 6,
      description: 'Répartition par département',
      createdDate: '2024-01-01',
      lastModified: '2024-01-12'
    }
  ]);

  const [values, setValues] = useState<AnalyticValue[]>([
    // Project values
    { id: 1, axisId: 1, code: 'PROJ_ALPHA', label: 'Projet Alpha', isActive: true, level: 1, usageCount: 45 },
    { id: 2, axisId: 1, code: 'PROJ_BETA', label: 'Projet Beta', isActive: true, level: 1, usageCount: 32 },
    { id: 3, axisId: 1, code: 'PROJ_GAMMA', label: 'Projet Gamma', isActive: true, level: 1, usageCount: 28 },
    
    // Client values
    { id: 4, axisId: 2, code: 'CLI_TECHCORP', label: 'TechCorp Solutions', isActive: true, level: 1, usageCount: 67 },
    { id: 5, axisId: 2, code: 'CLI_DIGITAL', label: 'Digital Innovations', isActive: true, level: 1, usageCount: 43 },
    { id: 6, axisId: 2, code: 'CLI_STARTUP', label: 'StartupXYZ', isActive: true, level: 1, usageCount: 21 },
    
    // Product values
    { id: 7, axisId: 3, code: 'PROD_CRM', label: 'CRM Enterprise', isActive: true, level: 1, usageCount: 89 },
    { id: 8, axisId: 3, code: 'PROD_MARKETING', label: 'Marketing Automation', isActive: true, level: 1, usageCount: 56 },
    { id: 9, axisId: 3, code: 'PROD_CONSULTING', label: 'Consulting', isActive: true, level: 1, usageCount: 34 },
    
    // Cost Center values
    { id: 10, axisId: 4, code: 'CC_DEV', label: 'Développement', isActive: true, level: 1, usageCount: 78 },
    { id: 11, axisId: 4, code: 'CC_COMMERCIAL', label: 'Commercial', isActive: true, level: 1, usageCount: 45 },
    { id: 12, axisId: 4, code: 'CC_ADMIN', label: 'Administration', isActive: true, level: 1, usageCount: 23 }
  ]);

  const [selectedAxis, setSelectedAxis] = useState<AnalyticAxis | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showValueModal, setShowValueModal] = useState(false);
  const [activeTab, setActiveTab] = useState('axes');

  const [newAxis, setNewAxis] = useState({
    label: '',
    code: '',
    description: '',
    required: false
  });

  const [newValue, setNewValue] = useState({
    code: '',
    label: '',
    description: ''
  });

  const getAxisIcon = (code: string) => {
    switch (code) {
      case 'PROJECT': return <Layers className="w-5 h-5" />;
      case 'CLIENT': return <Users className="w-5 h-5" />;
      case 'PRODUCT': return <Package className="w-5 h-5" />;
      case 'COST_CENTER': return <Building2 className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const getAxisColor = (code: string) => {
    switch (code) {
      case 'PROJECT': return 'bg-blue-100 text-blue-800';
      case 'CLIENT': return 'bg-green-100 text-green-800';
      case 'PRODUCT': return 'bg-purple-100 text-purple-800';
      case 'COST_CENTER': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateAxis = () => {
    const axis: AnalyticAxis = {
      id: Date.now(),
      ...newAxis,
      order: axes.length + 1,
      isActive: true,
      valueCount: 0,
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0]
    };
    
    setAxes([...axes, axis]);
    setNewAxis({ label: '', code: '', description: '', required: false });
    setShowCreateModal(false);
    
    // Show success message
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Axe analytique créé avec succès !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const handleCreateValue = () => {
    if (!selectedAxis) return;
    
    const value: AnalyticValue = {
      id: Date.now(),
      axisId: selectedAxis.id,
      ...newValue,
      isActive: true,
      level: 1,
      usageCount: 0
    };
    
    setValues([...values, value]);
    
    // Update axis value count
    setAxes(prev => prev.map(axis => 
      axis.id === selectedAxis.id 
        ? { ...axis, valueCount: axis.valueCount + 1 }
        : axis
    ));
    
    setNewValue({ code: '', label: '', description: '' });
    setShowValueModal(false);
    
    // Show success message
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Valeur analytique créée avec succès !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const getValuesForAxis = (axisId: number) => {
    return values.filter(value => value.axisId === axisId);
  };

  const axisStats = {
    total: axes.length,
    active: axes.filter(a => a.isActive).length,
    totalValues: values.length,
    totalUsage: values.reduce((sum, v) => sum + v.usageCount, 0)
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Axes Analytiques</h2>
          <p className="text-slate-600">Configuration des dimensions d'analyse (maximum 4 axes)</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          disabled={axes.length >= 4}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvel Axe
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Axes Configurés</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{axisStats.total}/4</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Layers className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Axes Actifs</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{axisStats.active}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Valeurs Totales</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{axisStats.totalValues}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Utilisations</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{axisStats.totalUsage}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'axes', name: 'Axes Analytiques', icon: Layers },
            { id: 'values', name: 'Valeurs', icon: Database }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </div>

        {activeTab === 'axes' && (
          <div className="space-y-4">
            {axes.length >= 4 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-orange-900">Limite d'axes atteinte</h3>
                    <p className="text-sm text-orange-700 mt-1">
                      Vous avez configuré le maximum de 4 axes analytiques. 
                      Supprimez un axe existant pour en créer un nouveau.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {axes.map((axis) => (
              <div key={axis.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-lg ${getAxisColor(axis.code)}`}>
                        {getAxisIcon(axis.code)}
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">{axis.label}</h4>
                        <p className="text-sm text-slate-600">{axis.code}</p>
                      </div>
                      {axis.required && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                          Obligatoire
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs rounded ${
                        axis.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {axis.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-3">{axis.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-slate-600">
                      <div>
                        <span className="font-medium">Ordre:</span> {axis.order}
                      </div>
                      <div>
                        <span className="font-medium">Valeurs:</span> {axis.valueCount}
                      </div>
                      <div>
                        <span className="font-medium">Créé le:</span> {axis.createdDate}
                      </div>
                      <div>
                        <span className="font-medium">Modifié le:</span> {axis.lastModified}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button 
                      onClick={() => {
                        setSelectedAxis(axis);
                        setActiveTab('values');
                      }}
                      className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-green-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-orange-600 transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                    {!axis.required && (
                      <button className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'values' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900">
                Valeurs Analytiques
                {selectedAxis && ` - ${selectedAxis.label}`}
              </h3>
              <button 
                onClick={() => setShowValueModal(true)}
                disabled={!selectedAxis}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Valeur
              </button>
            </div>

            {!selectedAxis ? (
              <div className="text-center py-8 bg-slate-50 rounded-lg">
                <Database className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Sélectionnez un axe pour voir ses valeurs</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getValuesForAxis(selectedAxis.id).map((value) => (
                  <div key={value.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-900">{value.label}</h4>
                      <span className={`px-2 py-1 text-xs rounded ${
                        value.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {value.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{value.code}</p>
                    {value.description && (
                      <p className="text-sm text-slate-500 mb-2">{value.description}</p>
                    )}
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>Utilisations: {value.usageCount}</span>
                      <div className="flex space-x-1">
                        <button className="p-1 text-slate-400 hover:text-green-600 transition-colors">
                          <Edit className="w-3 h-3" />
                        </button>
                        <button className="p-1 text-slate-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Axis Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Nouvel Axe Analytique</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Libellé <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newAxis.label}
                  onChange={(e) => setNewAxis({ ...newAxis, label: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Projets"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newAxis.code}
                  onChange={(e) => setNewAxis({ ...newAxis, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: PROJECT"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newAxis.description}
                  onChange={(e) => setNewAxis({ ...newAxis, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Description de l'axe analytique..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="required"
                  checked={newAxis.required}
                  onChange={(e) => setNewAxis({ ...newAxis, required: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="required" className="ml-2 text-sm text-slate-700">
                  Axe obligatoire
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateAxis}
                disabled={!newAxis.label || !newAxis.code}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Créer l'Axe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Value Modal */}
      {showValueModal && selectedAxis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Nouvelle Valeur - {selectedAxis.label}</h3>
              <button 
                onClick={() => setShowValueModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newValue.code}
                  onChange={(e) => setNewValue({ ...newValue, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: PROJ_ALPHA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Libellé <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newValue.label}
                  onChange={(e) => setNewValue({ ...newValue, label: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Projet Alpha"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newValue.description}
                  onChange={(e) => setNewValue({ ...newValue, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Description de la valeur..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowValueModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateValue}
                disabled={!newValue.code || !newValue.label}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Créer la Valeur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticalAxes;