import React, { useState } from 'react';
import { FileText, Search, Filter, Plus, Edit, Eye, Download, Copy, Trash2, Check, X, ArrowUp, ArrowDown, Star, Tag, Calendar } from 'lucide-react';
import TemplateCreator from './TemplateCreator';

interface TemplateField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'signature';
  required: boolean;
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
}

interface Template {
  id: number;
  name: string;
  category: string;
  description: string;
  fields: TemplateField[];
  content: string;
  lastModified: string;
  usageCount: number;
  isActive: boolean;
  isFavorite?: boolean;
  tags?: string[];
}

const TemplateLibrary: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: 1,
      name: 'Contrat de Prestation de Services',
      category: 'Prestation',
      description: 'Modèle standard pour les contrats de prestation de services',
      fields: [
        { id: 'client_name', name: 'Nom du Client', type: 'text', required: true },
        { id: 'service_description', name: 'Description du Service', type: 'textarea', required: true },
        { id: 'start_date', name: 'Date de Début', type: 'date', required: true },
        { id: 'end_date', name: 'Date de Fin', type: 'date', required: true },
        { id: 'amount', name: 'Montant', type: 'number', required: true },
        { id: 'payment_terms', name: 'Conditions de Paiement', type: 'select', required: true, options: ['30 jours', '45 jours', '60 jours'] }
      ],
      content: '<h1>CONTRAT DE PRESTATION DE SERVICES</h1><p>Entre les soussignés :</p><p><strong>dziljo SaaS</strong>, dont le siège social est situé au 123 Rue de la Tech, 75001 Paris, représentée par M. Jean Dupont, en qualité de Directeur,</p><p>Ci-après dénommée "le Prestataire",</p><p>Et</p><p><strong>{{client_name}}</strong>, </p><p>Ci-après dénommé "le Client",</p><p>Il a été convenu ce qui suit :</p><h2>Article 1 - Objet du contrat</h2><p>Le Prestataire s\'engage à fournir au Client les services suivants :</p><p>{{service_description}}</p><h2>Article 2 - Durée</h2><p>Le présent contrat est conclu pour une durée déterminée. Il prendra effet le {{start_date}} et se terminera le {{end_date}}.</p><h2>Article 3 - Prix et modalités de paiement</h2><p>En contrepartie des prestations fournies, le Client s\'engage à payer au Prestataire la somme de {{amount}} euros.</p><p>Le paiement sera effectué selon les modalités suivantes : {{payment_terms}} à compter de la date de facturation.</p>',
      lastModified: '2024-01-20',
      usageCount: 15,
      isActive: true,
      isFavorite: true,
      tags: ['Standard', 'Services', 'B2B']
    },
    {
      id: 2,
      name: 'Accord de Partenariat',
      category: 'Partenariat',
      description: 'Modèle pour les accords de partenariat commercial',
      fields: [
        { id: 'partner_name', name: 'Nom du Partenaire', type: 'text', required: true },
        { id: 'partnership_type', name: 'Type de Partenariat', type: 'select', required: true, options: ['Commercial', 'Technique', 'Stratégique'] },
        { id: 'duration', name: 'Durée', type: 'text', required: true },
        { id: 'revenue_share', name: 'Partage des Revenus', type: 'text', required: false }
      ],
      content: '<h1>ACCORD DE PARTENARIAT</h1><p>Entre dziljo SaaS et {{partner_name}}</p><p>Type de partenariat: {{partnership_type}}</p><p>Durée: {{duration}}</p><p>Partage des revenus: {{revenue_share}}</p>',
      lastModified: '2024-01-18',
      usageCount: 8,
      isActive: true,
      tags: ['Partenariat', 'Commercial']
    },
    {
      id: 3,
      name: 'Contrat de Maintenance',
      category: 'Maintenance',
      description: 'Contrat de maintenance et support technique',
      fields: [
        { id: 'client_name', name: 'Nom du Client', type: 'text', required: true },
        { id: 'system_description', name: 'Description du Système', type: 'textarea', required: true },
        { id: 'sla_level', name: 'Niveau de SLA', type: 'select', required: true, options: ['Bronze', 'Silver', 'Gold', 'Platinum'] },
        { id: 'monthly_fee', name: 'Tarif Mensuel', type: 'number', required: true }
      ],
      content: '<h1>CONTRAT DE MAINTENANCE</h1><p>Client: {{client_name}}</p><p>Système concerné: {{system_description}}</p><p>Niveau de SLA: {{sla_level}}</p><p>Tarif mensuel: {{monthly_fee}} €</p>',
      lastModified: '2024-01-15',
      usageCount: 12,
      isActive: true,
      tags: ['Maintenance', 'Support', 'Technique']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'lastModified' | 'usageCount'>('lastModified');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const categories = ['Prestation', 'Partenariat', 'Maintenance', 'Vente', 'Confidentialité', 'Emploi', 'Autre'];

  const handleCreateTemplate = (templateData: any) => {
    setTemplates(prev => [...prev, templateData]);
  };

  const handleUpdateTemplate = (templateData: any) => {
    setTemplates(prev => prev.map(template => 
      template.id === templateData.id ? templateData : template
    ));
  };

  const handleDeleteTemplate = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce modèle ?')) {
      setTemplates(prev => prev.filter(template => template.id !== id));
    }
  };

  const handleDuplicateTemplate = (template: Template) => {
    const newTemplate = {
      ...template,
      id: Date.now(),
      name: `${template.name} (Copie)`,
      usageCount: 0,
      lastModified: new Date().toISOString().split('T')[0]
    };
    setTemplates(prev => [...prev, newTemplate]);
  };

  const toggleFavorite = (id: number) => {
    setTemplates(prev => prev.map(template => 
      template.id === id ? { ...template, isFavorite: !template.isFavorite } : template
    ));
  };

  const toggleActive = (id: number) => {
    setTemplates(prev => prev.map(template => 
      template.id === id ? { ...template, isActive: !template.isActive } : template
    ));
  };

  const handleSort = (key: 'name' | 'lastModified' | 'usageCount') => {
    if (sortBy === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDirection('asc');
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (template.tags && template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesCategory = !filterCategory || template.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (sortBy === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'lastModified') {
      return sortDirection === 'asc'
        ? new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime()
        : new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
    } else {
      return sortDirection === 'asc'
        ? a.usageCount - b.usageCount
        : b.usageCount - a.usageCount;
    }
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Bibliothèque de Modèles</h2>
          <p className="text-slate-600">Gérez vos modèles de documents pour contrats, propositions et plus</p>
        </div>
        <button 
          onClick={() => {
            setIsEditing(false);
            setSelectedTemplate(null);
            setShowCreateModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Modèle
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Modèles</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{templates.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Modèles Actifs</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{templates.filter(t => t.isActive).length}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Check className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Utilisations</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{templates.reduce((sum, t) => sum + t.usageCount, 0)}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Copy className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Catégories</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{new Set(templates.map(t => t.category)).size}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <Tag className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher modèles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex border border-slate-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-slate-600">{sortedTemplates.length} modèles trouvés</p>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">Trier par:</span>
            <button
              onClick={() => handleSort('name')}
              className={`px-3 py-1 text-sm rounded-lg flex items-center ${
                sortBy === 'name' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Nom
              {sortBy === 'name' && (
                sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 ml-1" /> : <ArrowDown className="w-3 h-3 ml-1" />
              )}
            </button>
            <button
              onClick={() => handleSort('lastModified')}
              className={`px-3 py-1 text-sm rounded-lg flex items-center ${
                sortBy === 'lastModified' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Date
              {sortBy === 'lastModified' && (
                sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 ml-1" /> : <ArrowDown className="w-3 h-3 ml-1" />
              )}
            </button>
            <button
              onClick={() => handleSort('usageCount')}
              className={`px-3 py-1 text-sm rounded-lg flex items-center ${
                sortBy === 'usageCount' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Utilisation
              {sortBy === 'usageCount' && (
                sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 ml-1" /> : <ArrowDown className="w-3 h-3 ml-1" />
              )}
            </button>
          </div>
        </div>

        {/* Templates Grid/List View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTemplates.map((template) => (
              <div 
                key={template.id} 
                className={`bg-white border rounded-lg hover:shadow-md transition-shadow ${
                  template.isActive ? 'border-slate-200' : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-slate-900 line-clamp-1">{template.name}</h3>
                        {template.isFavorite && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded inline-block mt-1">
                        {template.category}
                      </span>
                    </div>
                    <div className="flex">
                      <button
                        onClick={() => toggleFavorite(template.id)}
                        className={`p-1 rounded hover:bg-slate-100 ${
                          template.isFavorite ? 'text-yellow-500' : 'text-slate-400'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${template.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => toggleActive(template.id)}
                        className={`p-1 rounded hover:bg-slate-100 ${
                          template.isActive ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {template.isActive ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">{template.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.tags && template.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {template.lastModified}
                    </div>
                    <div>
                      Utilisé {template.usageCount} fois
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-slate-200 p-3 bg-slate-50 rounded-b-lg">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => {
                        setSelectedTemplate(template);
                        setIsEditing(false);
                      }}
                      className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded text-xs transition-colors"
                    >
                      <Eye className="w-3 h-3 inline mr-1" />
                      Voir
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTemplate(template);
                        setIsEditing(true);
                        setShowCreateModal(true);
                      }}
                      className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded text-xs transition-colors"
                    >
                      <Edit className="w-3 h-3 inline mr-1" />
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDuplicateTemplate(template)}
                      className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-700 px-2 py-1 rounded text-xs transition-colors"
                    >
                      <Copy className="w-3 h-3 inline mr-1" />
                      Dupliquer
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded text-xs transition-colors"
                    >
                      <Trash2 className="w-3 h-3 inline mr-1" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Nom</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Catégorie</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Dernière Modification</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Utilisations</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Statut</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedTemplates.map((template) => (
                  <tr key={template.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="mr-2">
                          {template.isFavorite && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{template.name}</p>
                          <p className="text-xs text-slate-500 mt-1">{template.description.substring(0, 60)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {template.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{template.lastModified}</td>
                    <td className="py-3 px-4 text-slate-700">{template.usageCount}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        template.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {template.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedTemplate(template);
                            setIsEditing(false);
                          }}
                          className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTemplate(template);
                            setIsEditing(true);
                            setShowCreateModal(true);
                          }}
                          className="p-1 text-slate-400 hover:text-green-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicateTemplate(template)}
                          className="p-1 text-slate-400 hover:text-purple-600 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {sortedTemplates.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Aucun modèle trouvé</h3>
            <p className="text-slate-600 mb-6">Aucun modèle ne correspond à vos critères de recherche.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('');
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* Template Creator Modal */}
      <TemplateCreator
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={isEditing ? handleUpdateTemplate : handleCreateTemplate}
        initialData={isEditing ? selectedTemplate : undefined}
        isEditing={isEditing}
      />

      {/* Template Preview Modal */}
      {selectedTemplate && !isEditing && !showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{selectedTemplate.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-600">{selectedTemplate.category}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span className="text-sm text-slate-600">Modifié le {selectedTemplate.lastModified}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedTemplate(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h4 className="font-medium text-slate-900 mb-3">Description</h4>
                <p className="text-slate-700">{selectedTemplate.description}</p>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-3">Champs Dynamiques</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedTemplate.fields.map((field) => (
                    <div key={field.id} className="bg-white border border-slate-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-medium text-slate-900">{field.name}</h5>
                        {field.required && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Requis</span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded mr-2">
                          {field.type}
                        </span>
                        {field.placeholder && (
                          <span className="text-xs text-slate-500 truncate">{field.placeholder}</span>
                        )}
                      </div>
                      {field.type === 'select' && field.options && field.options.length > 0 && (
                        <div className="mt-2 text-xs text-slate-500">
                          <span className="font-medium">Options:</span> {field.options.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-3">Aperçu du Contenu</h4>
                <div className="bg-white border border-slate-200 rounded-lg p-6 prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: selectedTemplate.content }} />
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowCreateModal(true);
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </button>
                <button
                  onClick={() => handleDuplicateTemplate(selectedTemplate)}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Dupliquer
                </button>
                <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateLibrary;