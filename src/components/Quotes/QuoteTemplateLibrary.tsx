import React, { useState } from 'react';
import { X, FileText, Plus, Eye, Copy } from 'lucide-react';

interface QuoteTemplate {
  id: number;
  name: string;
  description: string;
  category: string;
  items: Array<{
    description: string;
    unitPrice: number;
  }>;
  terms: string;
}

interface QuoteTemplateLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: QuoteTemplate) => void;
}

const QuoteTemplateLibrary: React.FC<QuoteTemplateLibraryProps> = ({
  isOpen,
  onClose,
  onSelectTemplate
}) => {
  const [templates] = useState<QuoteTemplate[]>([
    {
      id: 1,
      name: 'Solution CRM Standard',
      description: 'Package CRM complet pour PME',
      category: 'CRM',
      items: [
        { description: 'Licence CRM (12 mois)', unitPrice: 2000 },
        { description: 'Formation équipe (2 jours)', unitPrice: 1500 },
        { description: 'Support premium (12 mois)', unitPrice: 800 }
      ],
      terms: 'Paiement en 3 fois. Formation incluse. Support 24/7.'
    },
    {
      id: 2,
      name: 'Développement Web',
      description: 'Site web sur mesure',
      category: 'Développement',
      items: [
        { description: 'Conception et développement', unitPrice: 5000 },
        { description: 'Intégration CMS', unitPrice: 1500 },
        { description: 'Formation utilisateur', unitPrice: 500 }
      ],
      terms: 'Paiement 50% à la commande, 50% à la livraison.'
    },
    {
      id: 3,
      name: 'Consulting Digital',
      description: 'Accompagnement transformation digitale',
      category: 'Consulting',
      items: [
        { description: 'Audit digital (5 jours)', unitPrice: 3000 },
        { description: 'Plan de transformation', unitPrice: 2000 },
        { description: 'Accompagnement (3 mois)', unitPrice: 4500 }
      ],
      terms: 'Mission sur 4 mois. Rapports mensuels inclus.'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = ['CRM', 'Développement', 'Consulting', 'Marketing'];

  const filteredTemplates = templates.filter(template => 
    !selectedCategory || template.category === selectedCategory
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Bibliothèque de Modèles</h1>
                <p className="text-white/80">Choisissez un modèle pour démarrer rapidement</p>
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

        {/* Content */}
        <div className="p-6">
          {/* Category Filter */}
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                !selectedCategory ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tous
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map(template => (
              <div key={template.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-slate-900 mb-1">{template.name}</h3>
                    <p className="text-sm text-slate-600 mb-2">{template.description}</p>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                      {template.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <h4 className="text-sm font-medium text-slate-700">Articles inclus:</h4>
                  {template.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="text-xs text-slate-600 flex justify-between">
                      <span>{item.description}</span>
                      <span>€{item.unitPrice}</span>
                    </div>
                  ))}
                  {template.items.length > 3 && (
                    <div className="text-xs text-slate-500">
                      +{template.items.length - 3} autres articles
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => onSelectTemplate(template)}
                    className="flex-1 bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
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
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Aucun modèle trouvé</h3>
              <p className="text-slate-500">Aucun modèle ne correspond à cette catégorie</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteTemplateLibrary;