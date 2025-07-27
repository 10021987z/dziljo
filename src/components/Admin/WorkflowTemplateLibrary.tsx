import React, { useState } from 'react';
import { X, Workflow, Play, Copy, Eye, Filter } from 'lucide-react';

interface WorkflowTemplate {
  id: number;
  name: string;
  description: string;
  category: 'hr' | 'commercial' | 'admin' | 'finance';
  steps: number;
  estimatedTime: string;
  complexity: 'simple' | 'medium' | 'complex';
  usageCount: number;
  tags: string[];
}

interface WorkflowTemplateLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: any) => void;
}

const WorkflowTemplateLibrary: React.FC<WorkflowTemplateLibraryProps> = ({
  isOpen,
  onClose,
  onSelectTemplate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedComplexity, setSelectedComplexity] = useState<string>('');

  const templates: WorkflowTemplate[] = [
    {
      id: 1,
      name: "Processus d'Onboarding Employé",
      description: "Workflow complet d'intégration des nouveaux employés",
      category: 'hr',
      steps: 8,
      estimatedTime: '3-5 jours',
      complexity: 'medium',
      usageCount: 45,
      tags: ['RH', 'Onboarding', 'Automatique']
    },
    {
      id: 2,
      name: "Validation de Contrat Client",
      description: "Processus de validation et signature des contrats",
      category: 'admin',
      steps: 6,
      estimatedTime: '2-3 jours',
      complexity: 'simple',
      usageCount: 32,
      tags: ['Contrats', 'Validation', 'Juridique']
    },
    {
      id: 3,
      name: "Pipeline Commercial Lead to Customer",
      description: "Suivi automatisé des prospects jusqu'à la signature",
      category: 'commercial',
      steps: 12,
      estimatedTime: '1-4 semaines',
      complexity: 'complex',
      usageCount: 28,
      tags: ['Commercial', 'CRM', 'Automatisation']
    },
    {
      id: 4,
      name: "Processus de Demande de Congés",
      description: "Workflow de demande et validation des congés",
      category: 'hr',
      steps: 4,
      estimatedTime: '1-2 jours',
      complexity: 'simple',
      usageCount: 67,
      tags: ['RH', 'Congés', 'Approbation']
    },
    {
      id: 5,
      name: "Facturation Automatisée",
      description: "Génération et envoi automatique des factures",
      category: 'finance',
      steps: 5,
      estimatedTime: '1 jour',
      complexity: 'medium',
      usageCount: 23,
      tags: ['Finance', 'Facturation', 'Automatique']
    },
    {
      id: 6,
      name: "Gestion des Réclamations Client",
      description: "Traitement structuré des réclamations clients",
      category: 'commercial',
      steps: 7,
      estimatedTime: '2-5 jours',
      complexity: 'medium',
      usageCount: 19,
      tags: ['Support', 'Client', 'Réclamation']
    }
  ];

  const categories = [
    { id: 'hr', name: 'RH', color: 'bg-purple-100 text-purple-800' },
    { id: 'commercial', name: 'Commercial', color: 'bg-blue-100 text-blue-800' },
    { id: 'admin', name: 'Administration', color: 'bg-green-100 text-green-800' },
    { id: 'finance', name: 'Finance', color: 'bg-orange-100 text-orange-800' }
  ];

  const complexities = [
    { id: 'simple', name: 'Simple', color: 'bg-green-100 text-green-800' },
    { id: 'medium', name: 'Moyen', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'complex', name: 'Complexe', color: 'bg-red-100 text-red-800' }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    const matchesComplexity = !selectedComplexity || template.complexity === selectedComplexity;
    return matchesCategory && matchesComplexity;
  });

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.color : 'bg-gray-100 text-gray-800';
  };

  const getComplexityColor = (complexity: string) => {
    const comp = complexities.find(c => c.id === complexity);
    return comp ? comp.color : 'bg-gray-100 text-gray-800';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Workflow className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Bibliothèque de Workflows</h1>
                <p className="text-white/80">Choisissez un modèle de workflow prêt à l'emploi</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Filtres:</span>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  !selectedCategory ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Toutes catégories
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id ? category.color : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedComplexity('')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  !selectedComplexity ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Toute complexité
              </button>
              {complexities.map(complexity => (
                <button
                  key={complexity.id}
                  onClick={() => setSelectedComplexity(complexity.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedComplexity === complexity.id ? complexity.color : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {complexity.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <div key={template.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900 mb-2">{template.name}</h3>
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">{template.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(template.category)}`}>
                        {categories.find(c => c.id === template.category)?.name}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getComplexityColor(template.complexity)}`}>
                        {complexities.find(c => c.id === template.complexity)?.name}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Étapes:</span>
                    <span className="font-medium">{template.steps}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Durée estimée:</span>
                    <span className="font-medium">{template.estimatedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Utilisé:</span>
                    <span className="font-medium">{template.usageCount} fois</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {template.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => onSelectTemplate(template)}
                    className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded-lg hover:bg-indigo-700 transition-colors text-sm flex items-center justify-center"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Utiliser
                  </button>
                  <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-green-600 transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <Workflow className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Aucun modèle trouvé</h3>
              <p className="text-slate-500">Aucun workflow ne correspond aux filtres sélectionnés</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkflowTemplateLibrary;