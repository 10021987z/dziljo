import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, UserPlus, FileText, DollarSign, Calendar, MessageCircle, 
  Target, TrendingUp, Mail, Phone, Video, Plus, X, Search,
  Users, Briefcase, Award, Clock, CheckCircle, Star, Heart
} from 'lucide-react';
import NewEventModal from '../Commercial/NewEventModal';

interface QuickActionsProps {
  isOpen: boolean;
  onClose: () => void;
  activeModule?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ isOpen, onClose, activeModule }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [recentActions, setRecentActions] = useState<any[]>([]);
  const [showNewEvent, setShowNewEvent] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Simulated recent actions
  useEffect(() => {
    setRecentActions([
      { id: 1, name: 'Ajouter un prospect', icon: UserPlus, category: 'commercial', color: 'bg-blue-500' },
      { id: 2, name: 'Planifier un entretien', icon: Calendar, category: 'hr', color: 'bg-purple-500' },
      { id: 3, name: 'Créer une facture', icon: DollarSign, category: 'admin', color: 'bg-green-500' },
      { id: 4, name: 'Envoyer un email', icon: Mail, category: 'communication', color: 'bg-orange-500' },
    ]);
  }, []);

  const allActions = [
    // RH
    { id: 101, name: 'Ajouter un employé', icon: UserPlus, category: 'hr', color: 'bg-purple-500', description: 'Créer un nouveau dossier employé' },
    { id: 102, name: 'Planifier un entretien', icon: Calendar, category: 'hr', color: 'bg-purple-500', description: 'Organiser un entretien de recrutement' },
    { id: 103, name: 'Demander un congé', icon: Calendar, category: 'hr', color: 'bg-purple-500', description: 'Soumettre une demande de congé' },
    { id: 104, name: 'Créer une offre d\'emploi', icon: FileText, category: 'hr', color: 'bg-purple-500', description: 'Publier une nouvelle offre d\'emploi' },
    { id: 105, name: 'Évaluation de performance', icon: Award, category: 'hr', color: 'bg-purple-500', description: 'Démarrer une évaluation' },
    
    // Commercial
    { id: 201, name: 'Ajouter un prospect', icon: UserPlus, category: 'commercial', color: 'bg-blue-500', description: 'Créer un nouveau prospect' },
    { id: 202, name: 'Nouvelle opportunité', icon: Target, category: 'commercial', color: 'bg-blue-500', description: 'Créer une opportunité de vente' },
    { id: 203, name: 'Planifier un RDV', icon: Calendar, category: 'commercial', color: 'bg-blue-500', description: 'Ajouter un rendez-vous commercial', action: () => setShowNewEvent(true) },
    { id: 204, name: 'Envoyer une proposition', icon: FileText, category: 'commercial', color: 'bg-blue-500', description: 'Créer et envoyer une proposition' },
    { id: 205, name: 'Suivi client', icon: Phone, category: 'commercial', color: 'bg-blue-500', description: 'Enregistrer un suivi client' },
    
    // Admin
    { id: 301, name: 'Créer un contrat', icon: FileText, category: 'admin', color: 'bg-green-500', description: 'Générer un nouveau contrat' },
    { id: 302, name: 'Créer une facture', icon: DollarSign, category: 'admin', color: 'bg-green-500', description: 'Émettre une nouvelle facture' },
    { id: 303, name: 'Générer un rapport', icon: TrendingUp, category: 'admin', color: 'bg-green-500', description: 'Créer un rapport personnalisé' },
    { id: 304, name: 'Ajouter un utilisateur', icon: UserPlus, category: 'admin', color: 'bg-green-500', description: 'Créer un compte utilisateur' },
    { id: 305, name: 'Configurer intégration', icon: Zap, category: 'admin', color: 'bg-green-500', description: 'Configurer une nouvelle intégration' },
    
    // Communication
    { id: 401, name: 'Envoyer un email', icon: Mail, category: 'communication', color: 'bg-orange-500', description: 'Composer un nouvel email' },
    { id: 402, name: 'Appel téléphonique', icon: Phone, category: 'communication', color: 'bg-orange-500', description: 'Enregistrer un appel' },
    { id: 403, name: 'Réunion vidéo', icon: Video, category: 'communication', color: 'bg-orange-500', description: 'Démarrer une visioconférence' },
    { id: 404, name: 'Message interne', icon: MessageCircle, category: 'communication', color: 'bg-orange-500', description: 'Envoyer un message à l\'équipe' },
    { id: 405, name: 'Créer une annonce', icon: Briefcase, category: 'communication', color: 'bg-orange-500', description: 'Publier une annonce d\'entreprise' },
  ];

  // Filter actions based on search and category
  const filteredActions = allActions.filter(action => {
    const matchesSearch = action.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         action.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || action.category === selectedCategory;
    
    // If we're in a specific module, prioritize related actions
    const isRelevantToModule = 
      (activeModule === 'dashboard') ||
      (activeModule?.includes('rh') && action.category === 'hr') ||
      (activeModule?.includes('commercial') && action.category === 'commercial') ||
      (activeModule?.includes('admin') && action.category === 'admin');
    
    return matchesSearch && matchesCategory && (selectedCategory !== 'all' || isRelevantToModule);
  });

  // Get suggested actions based on current module
  const getSuggestedActions = () => {
    if (activeModule?.includes('rh')) {
      return allActions.filter(a => a.category === 'hr').slice(0, 3);
    } else if (activeModule?.includes('commercial')) {
      return allActions.filter(a => a.category === 'commercial').slice(0, 3);
    } else if (activeModule?.includes('admin')) {
      return allActions.filter(a => a.category === 'admin').slice(0, 3);
    }
    return allActions.slice(0, 3); // Default suggestions
  };

  const handleActionClick = (action: any) => {
    console.log('Action clicked:', action);
    // Add to recent actions if not already there
    if (!recentActions.some(a => a.id === action.id)) {
      setRecentActions(prev => [action, ...prev.slice(0, 3)]);
    }
    
    // Execute action if it has a function
    if (action.action && typeof action.action === 'function') {
      action.action();
      onClose();
      return;
    }
    
    // Here you would implement the actual action functionality
    alert(`Action "${action.name}" déclenchée !`);
    onClose();
  };

  const handleCreateEvent = (eventData: any) => {
    console.log('Event created from quick actions:', eventData);
    // In a real app, you would dispatch this to your state management
    // or make an API call to save the event
    
    // Show success notification
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Événement créé avec succès !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
    
    setShowNewEvent(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 animate-gradient-x opacity-80"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h1 className="text-2xl font-bold">Actions Rapides</h1>
                </div>
                <button
                  onClick={onClose}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Rechercher une action..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 text-white placeholder-white/60 rounded-lg border border-white/20 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { id: 'all', name: 'Toutes', icon: Zap },
                { id: 'hr', name: 'RH', icon: Users },
                { id: 'commercial', name: 'Commercial', icon: TrendingUp },
                { id: 'admin', name: 'Admin', icon: Briefcase },
                { id: 'communication', name: 'Communication', icon: MessageCircle }
              ].map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <category.icon className="w-4 h-4 mr-2" />
                  {category.name}
                </button>
              ))}
            </div>

            {/* Recent Actions */}
            {recentActions.length > 0 && searchTerm === '' && (
              <div className="mb-6">
                <h2 className="text-sm font-medium text-slate-500 mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Actions Récentes
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {recentActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleActionClick(action)}
                      className="flex flex-col items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200 hover:border-slate-300 group"
                    >
                      <div className={`w-10 h-10 ${action.color} rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-slate-900 text-center">{action.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested for current module */}
            {activeModule && searchTerm === '' && selectedCategory === 'all' && (
              <div className="mb-6">
                <h2 className="text-sm font-medium text-slate-500 mb-3 flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  Suggestions pour {activeModule.includes('rh') ? 'RH' : 
                                  activeModule.includes('commercial') ? 'Commercial' : 
                                  activeModule.includes('admin') ? 'Administration' : 'Tableau de Bord'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {getSuggestedActions().map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleActionClick(action)}
                      className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200 group"
                    >
                      <div className={`w-8 h-8 ${action.color} rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium text-slate-900">{action.name}</div>
                        <div className="text-xs text-slate-500">{action.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* All Actions / Search Results */}
            <div>
              <h2 className="text-sm font-medium text-slate-500 mb-3 flex items-center">
                {searchTerm ? (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Résultats ({filteredActions.length})
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Toutes les Actions
                  </>
                )}
              </h2>
              
              {filteredActions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500">Aucune action trouvée pour "{searchTerm}"</p>
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Effacer la recherche
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleActionClick(action)}
                      className="flex items-center p-3 bg-white rounded-lg hover:bg-slate-50 transition-colors border border-slate-200 hover:border-slate-300 group"
                    >
                      <div className={`w-10 h-10 ${action.color} rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium text-slate-900">{action.name}</div>
                        <div className="text-xs text-slate-500">{action.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 border-t border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Heart className="w-4 h-4 text-pink-500" />
                <span>Raccourci clavier: <kbd className="px-2 py-1 bg-white border border-slate-300 rounded text-xs">Alt</kbd> + <kbd className="px-2 py-1 bg-white border border-slate-300 rounded text-xs">A</kbd></span>
              </div>
              <div className="text-sm text-slate-500">
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  {filteredActions.length} actions disponibles
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Event Modal */}
      <NewEventModal
        isOpen={showNewEvent}
        onClose={() => setShowNewEvent(false)}
        onSave={handleCreateEvent}
      />
    </>
  );
};

export default QuickActions;