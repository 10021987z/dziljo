import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, ArrowUp, ArrowDown, Layers, Building2, Users, Package, Target, Settings, Check, X, AlertCircle, Upload, Download } from 'lucide-react';

interface AnalyticalAxis {
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

interface AnalyticalValue {
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
  const [axes, setAxes] = useState<AnalyticalAxis[]>([
    {
      id: 1,
      label: 'Projets',
      code: 'PROJECT',
      order: 1,
      required: true,
      isActive: true,
      valueCount: 23,
      description: 'Suivi de rentabilité par projet client',
      createdDate: '2024-01-01',
      lastModified: '2024-01-20'
    },
    {
      id: 2,
      label: 'Clients',
      code: 'CLIENT',
      order: 2,
      required: true,
      isActive: true,
      valueCount: 45,
      description: 'Analyse de rentabilité par client',
      createdDate: '2024-01-01',
      lastModified: '2024-01-15'
    },
    {
      id: 3,
      label: 'Produits/Services',
      code: 'PRODUCT',
      order: 3,
      required: false,
      isActive: true,
      valueCount: 12,
      description: 'Performance par ligne de produit',
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
      valueCount: 8,
      description: 'Répartition par département/équipe',
      createdDate: '2024-01-01',
      lastModified: '2024-01-05'
    }
  ]);

  const [axisValues, setAxisValues] = useState<AnalyticalValue[]>([
    // Projets
    { id: 1, axisId: 1, code: 'PROJ_ALPHA', label: 'Projet Alpha - TechCorp', isActive: true, level: 1, usageCount: 156 },
    { id: 2, axisId: 1, code: 'PROJ_BETA', label: 'Projet Beta - Digital Innov', isActive: true, level: 1, usageCount: 89 },
    { id: 3, axisId: 1, code: 'PROJ_GAMMA', label: 'Migration Cloud - StartupXYZ', isActive: true, level: 1, usageCount: 67 },
    
    // Clients
    { id: 4, axisId: 2, code: 'CLI_TECHCORP', label: 'TechCorp Solutions', isActive: true, level: 1, usageCount: 234 },
    { id: 5, axisId: 2, code: 'CLI_DIGITAL', label: 'Digital Innovations', isActive: true, level: 1, usageCount: 156 },
    { id: 6, axisId: 2, code: 'CLI_STARTUP', label: 'StartupXYZ', isActive: true, level: 1, usageCount: 89 },
    
    // Produits
    { id: 7, axisId: 3, code: 'PROD_CRM', label: 'CRM Enterprise', isActive: true, level: 1, usageCount: 198 },
    { id: 8, axisId: 3, code: 'PROD_MARKETING', label: 'Marketing Automation', isActive: true, level: 1, usageCount: 145 },
    { id: 9, axisId: 3, code: 'PROD_CONSULTING', label: 'Consulting', isActive: true, level: 1, usageCount: 267 },
    
    // Centres de coût
    { id: 10, axisId: 4, code: 'CC_DEV', label: 'Développement', isActive: true, level: 1, usageCount: 345 },
    { id: 11, axisId: 4, code: 'CC_COMMERCIAL', label: 'Commercial', isActive: true, level: 1, usageCount: 123 },
    { id: 12, axisId: 4, code: 'CC_ADMIN', label: 'Administration', isActive: true, level: 1, usageCount: 78 }
  ]);

  const [selectedAxis, setSelectedAxis] = useState<AnalyticalAxis | null>(null);
  const [showCreateAxisModal, setShowCreateAxisModal] = useState(false);
  const [showCreateValueModal, setShowCreateValueModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [activeTab, setActiveTab] = useState('axes');

  const [newAxis, setNewAxis] = useState({
    label: '',
    code: '',
    description: '',
    required: false
  });

  const [newValue, setNewValue] = useState({
    axisId: 0,
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
    const axis: AnalyticalAxis = {
      id: Date.now(),
      ...newAxis,
      code: newAxis.code.toUpperCase(),
      order: axes.length + 1,
      isActive: true,
      valueCount: 0,
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0]
    };
    
    setAxes([...axes, axis]);
    setNewAxis({ label: '', code: '', description: '', required: false });
    setShowCreateAxisModal(false);
    
    // Show success message
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Axe analytique créé avec succès !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const handleCreateValue = () => {
    const value: AnalyticalValue = {
      id: Date.now(),
      ...newValue,
      code: newValue.code.toUpperCase(),
      isActive: true,
      level: 1,
      usageCount: 0
    };
    
    setAxisValues([...axisValues, value]);
    
    // Update axis value count
    setAxes(prev => prev.map(axis => 
      axis.id === newValue.axisId 
        ? { ...axis, valueCount: axis.valueCount + 1, lastModified: new Date().toISOString().split('T')[0] }
        : axis
    ));
    
    setNewValue({ axisId: 0, code: '', label: '', description: '' });
    setShowCreateValueModal(false);
    
    // Show success message
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Valeur analytique créée avec succès !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const handleMoveAxis = (id: number, direction: 'up' | 'down') => {
    const currentIndex = axes.findIndex(axis => axis.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === axes.length - 1)
    ) {
      return;
    }

    const newAxes = [...axes];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Swap orders
    const temp = newAxes[currentIndex].order;
    newAxes[currentIndex].order = newAxes[targetIndex].order;
    newAxes[targetIndex].order = temp;
    
    // Swap positions
    [newAxes[currentIndex], newAxes[targetIndex]] = [newAxes[targetIndex], newAxes[currentIndex]];
    
    setAxes(newAxes);
  };

  const toggleAxisStatus = (id: number) => {
    setAxes(prev => prev.map(axis => 
      axis.id === id 
        ? { ...axis, isActive: !axis.isActive, lastModified: new Date().toISOString().split('T')[0] }
        : axis
    ));
  };

  const getValuesForAxis = (axisId: number) => {
    return axisValues.filter(value => value.axisId === axisId);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Axes Analytiques</h2>
          <p className="text-slate-600">Configuration des dimensions d'analyse (max 4 axes par société)</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowImportModal(true)}
            className="bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-slate-700 transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Importer CSV
          </button>
          <button 
            onClick={() => setShowCreateAxisModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
            disabled={axes.length >= 4}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvel Axe
          </button>
        </div>
      </div>

      {/* Limitation Warning */}
      {axes.length >= 4 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-orange-900">Limite d'axes atteinte</h3>
              <p className="text-sm text-orange-700 mt-1">
                Vous avez atteint la limite de 4 axes analytiques par société. 
                Supprimez un axe existant pour en créer un nouveau.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'axes', name: 'Configuration des Axes', icon: Layers },
            { id: 'values', name: 'Valeurs Analytiques', icon: Target }
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
            {axes.map((axis, index) => (
              <div key={axis.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => handleMoveAxis(axis.id, 'up')}
                        disabled={index === 0}
                        className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleMoveAxis(axis.id, 'down')}
                        disabled={index === axes.length - 1}
                        className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <div className={`p-3 rounded-lg ${getAxisColor(axis.code)}`}>
                      {getAxisIcon(axis.code)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h4 className="font-medium text-slate-900">{axis.label}</h4>
                        <span className="text-sm font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded">
                          {axis.code}
                        </span>
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
                      <p className="text-sm text-slate-600 mb-2">{axis.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <span>{axis.valueCount} valeurs</span>
                        <span>Ordre: {axis.order}</span>
                        <span>Modifié: {axis.lastModified}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setSelectedAxis(axis)}
                      className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-green-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => toggleAxisStatus(axis.id)}
                      className="p-2 text-slate-400 hover:text-orange-600 transition-colors"
                    >
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
              <h3 className="text-lg font-semibold text-slate-900">Valeurs par Axe Analytique</h3>
              <button 
                onClick={() => setShowCreateValueModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Valeur
              </button>
            </div>

            {axes.map((axis) => (
              <div key={axis.id} className="border border-slate-200 rounded-lg">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded ${getAxisColor(axis.code)}`}>
                      {getAxisIcon(axis.code)}
                    </div>
                    <h4 className="font-medium text-slate-900">{axis.label}</h4>
                    <span className="text-sm text-slate-500">({getValuesForAxis(axis.id).length} valeurs)</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {getValuesForAxis(axis.id).map((value) => (
                      <div key={value.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-slate-900">{value.label}</h5>
                          <span className="text-xs font-mono bg-white text-slate-600 px-2 py-1 rounded">
                            {value.code}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">{value.usageCount} utilisations</span>
                          <div className="flex space-x-1">
                            <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors">
                              <Edit className="w-3 h-3" />
                            </button>
                            <button className="p-1 text-slate-400 hover:text-red-600 transition-colors">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {getValuesForAxis(axis.id).length === 0 && (
                      <div className="col-span-full text-center py-6 text-slate-500">
                        <Target className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p>Aucune valeur définie pour cet axe</p>
                        <button 
                          onClick={() => {
                            setNewValue({ ...newValue, axisId: axis.id });
                            setShowCreateValueModal(true);
                          }}
                          className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Ajouter la première valeur
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Axis Modal */}
      {showCreateAxisModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Nouvel Axe Analytique</h3>
              <button 
                onClick={() => setShowCreateAxisModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
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
                  placeholder="Ex: Projets, Clients, Produits..."
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
                  placeholder="Ex: PROJECT, CLIENT, PRODUCT..."
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
                  Axe obligatoire (requis pour toutes les écritures)
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateAxisModal(false)}
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
      {showCreateValueModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Nouvelle Valeur Analytique</h3>
              <button 
                onClick={() => setShowCreateValueModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Axe Analytique <span className="text-red-500">*</span>
                </label>
                <select
                  value={newValue.axisId}
                  onChange={(e) => setNewValue({ ...newValue, axisId: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0}>Sélectionner un axe</option>
                  {axes.filter(axis => axis.isActive).map(axis => (
                    <option key={axis.id} value={axis.id}>{axis.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newValue.code}
                  onChange={(e) => setNewValue({ ...newValue, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: PROJ_ALPHA, CLI_TECHCORP..."
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
                  placeholder="Ex: Projet Alpha - TechCorp"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newValue.description}
                  onChange={(e) => setNewValue({ ...newValue, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Description optionnelle..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateValueModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateValue}
                disabled={!newValue.axisId || !newValue.code || !newValue.label}
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