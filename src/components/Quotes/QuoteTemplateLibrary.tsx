import React, { useState } from 'react';
import { X, Search, Filter, Star, TrendingUp, Eye, Copy, Plus } from 'lucide-react';
import { useQuoteTemplates } from '../../hooks/useQuotes';

interface QuoteTemplateLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: any) => void;
}

const QuoteTemplateLibrary: React.FC<QuoteTemplateLibraryProps> = ({ 
  isOpen, 
  onClose, 
  onSelectTemplate 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');
  const [minWinRate, setMinWinRate] = useState(70);

  const { templates, loading } = useQuoteTemplates({ 
    industry: filterIndustry || undefined,
    language: filterLanguage || undefined,
    minWinRate 
  });

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 80) return 'text-green-600';
    if (winRate >= 70) return 'text-blue-600';
    if (winRate >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getMarginColor = (margin: number) => {
    if (margin >= 35) return 'text-green-600';
    if (margin >= 25) return 'text-blue-600';
    if (margin >= 20) return 'text-orange-600';
    return 'text-red-600';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Bibliothèque de Modèles</h1>
              <p className="text-white/80">Modèles optimisés avec les meilleurs taux de signature</p>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
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
                value={filterIndustry}
                onChange={(e) => setFilterIndustry(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tous les secteurs</option>
                <option value="Technologie">Technologie</option>
                <option value="Finance">Finance</option>
                <option value="Santé">Santé</option>
                <option value="Commerce">Commerce</option>
                <option value="Industrie">Industrie</option>
              </select>

              <select
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Toutes les langues</option>
                <option value="fr">Français</option>
                <option value="en">Anglais</option>
                <option value="es">Espagnol</option>
                <option value="de">Allemand</option>
              </select>

              <div className="flex items-center space-x-2">
                <label className="text-sm text-slate-700">Win rate min:</label>
                <select
                  value={minWinRate}
                  onChange={(e) => setMinWinRate(parseInt(e.target.value))}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={50}>50%</option>
                  <option value={60}>60%</option>
                  <option value={70}>70%</option>
                  <option value={80}>80%</option>
                  <option value={90}>90%</option>
                </select>
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">Chargement des modèles...</p>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Aucun modèle trouvé</h3>
              <p className="text-slate-500 mb-6">Essayez de modifier vos critères de recherche</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterIndustry('');
                  setFilterLanguage('');
                  setMinWinRate(70);
                }}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div 
                  key={template.id} 
                  className="bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-slate-900">{template.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-slate-700">{template.winRate}%</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">{template.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {template.industry}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                        {template.language.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-slate-600">Win Rate:</span>
                        <p className={`font-medium ${getWinRateColor(template.winRate)}`}>
                          {template.winRate}%
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-600">Marge Moy:</span>
                        <p className={`font-medium ${getMarginColor(template.averageMargin)}`}>
                          {template.averageMargin}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                      <span>Utilisé {template.usageCount} fois</span>
                      <span>Modifié le {template.lastModified}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-slate-200 p-3 bg-slate-50 rounded-b-lg">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onSelectTemplate(template)}
                        className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4 mr-2" />
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteTemplateLibrary;