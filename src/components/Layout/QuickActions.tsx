import React, { useState, useEffect, useRef } from 'react';
import { Zap, UserPlus, FileText, DollarSign, Calendar, MessageCircle, Target, TrendingUp, Mail, Phone, Video, Plus, X, Search, Users, Briefcase, Award, Clock, CheckCircle, Star, Heart, Coffee, Building2, Edit, Download, Upload, Settings, Shield, Database, BarChart3, PieChart, Activity, Workflow, Link, Key, Bell, Eye, Trash2, Copy, Archive, Send, Filter, Tag, Bookmark, Flag, Globe, Smartphone, Wifi, Monitor, Volume2, VolumeX, Sun, Moon, Palette, Type, Hash, List, AlignLeft, Image, Paperclip, Mic, Camera, Map, Navigation, Compass, Layers, Grid, Layout, Maximize, Minimize, RotateCcw, RefreshCw, Save, Share2, ExternalLink, Printer, Scan as Scanner, Headphones, Speaker, Battery, Cpu, HardDrive, MemoryStick as Memory, Network, Server, Cloud, CloudOff, Wifi as WifiIcon, Bluetooth, Usb, Power, Zap as Lightning, Flame, Droplets, Wind, Thermometer, Gauge, Timer, Watch as Stopwatch, AlarmPlus as Alarm, Watch, Calendar as CalendarIcon } from 'lucide-react';
import NewEventModal from '../Commercial/NewEventModal';
import NewEmployeeForm from '../HR/NewEmployeeForm';
import QuoteWizard from '../Quotes/QuoteWizard';
import { useFirebaseCollection } from '../../hooks/useFirebase';

interface QuickActionsProps {
  isOpen: boolean;
  onClose: () => void;
  activeModule?: string;
}

interface QuickAction {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: string;
  module?: string;
  action: () => void;
  color: string;
  shortcut?: string;
  premium?: boolean;
  new?: boolean;
}

const QuickActions: React.FC<QuickActionsProps> = ({ isOpen, onClose, activeModule }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [recentActions, setRecentActions] = useState<QuickAction[]>([]);
  const [favoriteActions, setFavoriteActions] = useState<string[]>([]);
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [showNewEmployee, setShowNewEmployee] = useState(false);
  const [showNewQuote, setShowNewQuote] = useState(false);
  const [showNewProspect, setShowNewProspect] = useState(false);
  const [showNewContract, setShowNewContract] = useState(false);
  const [showNewReport, setShowNewReport] = useState(false);
  const [showNewWorkflow, setShowNewWorkflow] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { create: createProspect } = useFirebaseCollection('prospects');
  const { create: createContract } = useFirebaseCollection('contracts');
  const { create: createReport } = useFirebaseCollection('reports');
  const { create: createWorkflow } = useFirebaseCollection('workflows');

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dziljo-favorite-actions');
    if (saved) {
      setFavoriteActions(JSON.parse(saved));
    }
  }, []);

  // Save favorites to localStorage
  const toggleFavorite = (actionId: string) => {
    const newFavorites = favoriteActions.includes(actionId)
      ? favoriteActions.filter(id => id !== actionId)
      : [...favoriteActions, actionId];
    
    setFavoriteActions(newFavorites);
    localStorage.setItem('dziljo-favorite-actions', JSON.stringify(newFavorites));
  };

  // Add to recent actions
  const addToRecent = (action: QuickAction) => {
    const newRecent = [action, ...recentActions.filter(a => a.id !== action.id)].slice(0, 5);
    setRecentActions(newRecent);
    localStorage.setItem('dziljo-recent-actions', JSON.stringify(newRecent));
  };

  // Load recent actions
  useEffect(() => {
    const saved = localStorage.getItem('dziljo-recent-actions');
    if (saved) {
      setRecentActions(JSON.parse(saved));
    }
  }, []);

  const allActions: QuickAction[] = [
    // RH Actions
    {
      id: 'add-employee',
      name: 'Ajouter un Employé',
      description: 'Créer un nouveau dossier employé complet',
      icon: UserPlus,
      category: 'hr',
      module: 'hr',
      action: () => setShowNewEmployee(true),
      color: 'bg-purple-500',
      shortcut: 'Ctrl+Shift+E',
      new: true
    },
    {
      id: 'calculate-payroll',
      name: 'Calculer une Paie',
      description: 'Lancer le calculateur de paie',
      icon: DollarSign,
      category: 'hr',
      module: 'hr',
      action: () => {
        // Navigate to payroll calculator
        console.log('Opening payroll calculator');
      },
      color: 'bg-green-500',
      shortcut: 'Ctrl+Shift+P'
    },
    {
      id: 'request-leave',
      name: 'Demander un Congé',
      description: 'Soumettre une demande de congé',
      icon: Calendar,
      category: 'hr',
      module: 'hr',
      action: () => {
        console.log('Opening leave request form');
      },
      color: 'bg-blue-500'
    },
    {
      id: 'schedule-interview',
      name: 'Planifier un Entretien',
      description: 'Organiser un entretien de recrutement',
      icon: Users,
      category: 'hr',
      module: 'hr',
      action: () => {
        console.log('Opening interview scheduler');
      },
      color: 'bg-indigo-500'
    },
    {
      id: 'performance-review',
      name: 'Évaluation de Performance',
      description: 'Démarrer une évaluation employé',
      icon: Award,
      category: 'hr',
      module: 'hr',
      action: () => {
        console.log('Opening performance review form');
      },
      color: 'bg-yellow-500'
    },
    {
      id: 'generate-contract',
      name: 'Générer un Contrat',
      description: 'Créer un contrat de travail',
      icon: FileText,
      category: 'hr',
      module: 'hr',
      action: () => {
        console.log('Opening contract generator');
      },
      color: 'bg-orange-500'
    },

    // Commercial Actions
    {
      id: 'add-prospect',
      name: 'Ajouter un Prospect',
      description: 'Créer un nouveau prospect dans le pipeline',
      icon: Building2,
      category: 'commercial',
      module: 'commercial',
      action: () => setShowNewProspect(true),
      color: 'bg-blue-500',
      shortcut: 'Ctrl+Shift+L'
    },
    {
      id: 'create-opportunity',
      name: 'Nouvelle Opportunité',
      description: 'Créer une opportunité de vente',
      icon: Target,
      category: 'commercial',
      module: 'commercial',
      action: () => {
        console.log('Opening opportunity form');
      },
      color: 'bg-green-500',
      shortcut: 'Ctrl+Shift+O'
    },
    {
      id: 'schedule-meeting',
      name: 'Planifier un RDV',
      description: 'Ajouter un rendez-vous commercial',
      icon: Calendar,
      category: 'commercial',
      module: 'commercial',
      action: () => setShowNewEvent(true),
      color: 'bg-purple-500',
      shortcut: 'Ctrl+Shift+M'
    },
    {
      id: 'create-quote',
      name: 'Créer un Devis',
      description: 'Générer un devis personnalisé',
      icon: FileText,
      category: 'commercial',
      module: 'commercial',
      action: () => setShowNewQuote(true),
      color: 'bg-orange-500',
      shortcut: 'Ctrl+Shift+Q'
    },
    {
      id: 'follow-up-client',
      name: 'Suivi Client',
      description: 'Enregistrer un suivi client',
      icon: Phone,
      category: 'commercial',
      module: 'commercial',
      action: () => {
        console.log('Opening client follow-up form');
      },
      color: 'bg-teal-500'
    },
    {
      id: 'send-proposal',
      name: 'Envoyer une Proposition',
      description: 'Créer et envoyer une proposition',
      icon: Send,
      category: 'commercial',
      module: 'commercial',
      action: () => {
        console.log('Opening proposal form');
      },
      color: 'bg-indigo-500'
    },

    // Administration Actions
    {
      id: 'create-contract-admin',
      name: 'Créer un Contrat',
      description: 'Générer un nouveau contrat client',
      icon: FileText,
      category: 'admin',
      module: 'admin',
      action: () => setShowNewContract(true),
      color: 'bg-green-500',
      shortcut: 'Ctrl+Shift+C'
    },
    {
      id: 'generate-invoice',
      name: 'Créer une Facture',
      description: 'Émettre une nouvelle facture',
      icon: DollarSign,
      category: 'admin',
      module: 'admin',
      action: () => {
        console.log('Opening invoice generator');
      },
      color: 'bg-blue-500',
      shortcut: 'Ctrl+Shift+I'
    },
    {
      id: 'create-report',
      name: 'Générer un Rapport',
      description: 'Créer un rapport personnalisé',
      icon: BarChart3,
      category: 'admin',
      module: 'admin',
      action: () => setShowNewReport(true),
      color: 'bg-purple-500',
      shortcut: 'Ctrl+Shift+R'
    },
    {
      id: 'add-admin-user',
      name: 'Ajouter un Utilisateur',
      description: 'Créer un compte utilisateur admin',
      icon: UserPlus,
      category: 'admin',
      module: 'admin',
      action: () => {
        console.log('Opening admin user form');
      },
      color: 'bg-red-500'
    },
    {
      id: 'create-workflow',
      name: 'Créer un Workflow',
      description: 'Concevoir un processus automatisé',
      icon: Workflow,
      category: 'admin',
      module: 'admin',
      action: () => setShowNewWorkflow(true),
      color: 'bg-indigo-500'
    },
    {
      id: 'system-backup',
      name: 'Sauvegarde Système',
      description: 'Lancer une sauvegarde manuelle',
      icon: Database,
      category: 'admin',
      module: 'admin',
      action: () => {
        console.log('Starting system backup');
      },
      color: 'bg-gray-500',
      premium: true
    },

    // Communication Actions
    {
      id: 'send-email',
      name: 'Envoyer un Email',
      description: 'Composer un nouvel email',
      icon: Mail,
      category: 'communication',
      action: () => {
        console.log('Opening email composer');
      },
      color: 'bg-blue-500',
      shortcut: 'Ctrl+Shift+@'
    },
    {
      id: 'make-call',
      name: 'Passer un Appel',
      description: 'Enregistrer un appel téléphonique',
      icon: Phone,
      category: 'communication',
      action: () => {
        console.log('Opening call logger');
      },
      color: 'bg-green-500'
    },
    {
      id: 'video-meeting',
      name: 'Réunion Vidéo',
      description: 'Démarrer une visioconférence',
      icon: Video,
      category: 'communication',
      action: () => {
        console.log('Starting video meeting');
      },
      color: 'bg-purple-500'
    },
    {
      id: 'team-message',
      name: 'Message Équipe',
      description: 'Envoyer un message à l\'équipe',
      icon: MessageCircle,
      category: 'communication',
      action: () => {
        console.log('Opening team chat');
      },
      color: 'bg-orange-500'
    },
    {
      id: 'create-announcement',
      name: 'Créer une Annonce',
      description: 'Publier une annonce d\'entreprise',
      icon: Briefcase,
      category: 'communication',
      action: () => {
        console.log('Opening announcement form');
      },
      color: 'bg-teal-500'
    },

    // Analytics Actions
    {
      id: 'view-dashboard',
      name: 'Tableau de Bord',
      description: 'Accéder au tableau de bord principal',
      icon: BarChart3,
      category: 'analytics',
      action: () => {
        console.log('Opening main dashboard');
      },
      color: 'bg-blue-500'
    },
    {
      id: 'export-data',
      name: 'Exporter des Données',
      description: 'Exporter des données en CSV/Excel',
      icon: Download,
      category: 'analytics',
      action: () => {
        console.log('Opening export wizard');
      },
      color: 'bg-green-500'
    },
    {
      id: 'import-data',
      name: 'Importer des Données',
      description: 'Importer des données depuis un fichier',
      icon: Upload,
      category: 'analytics',
      action: () => {
        console.log('Opening import wizard');
      },
      color: 'bg-purple-500'
    },
    {
      id: 'create-chart',
      name: 'Créer un Graphique',
      description: 'Générer un graphique personnalisé',
      icon: PieChart,
      category: 'analytics',
      action: () => {
        console.log('Opening chart builder');
      },
      color: 'bg-orange-500'
    },

    // System Actions
    {
      id: 'system-settings',
      name: 'Paramètres Système',
      description: 'Configurer les paramètres globaux',
      icon: Settings,
      category: 'system',
      action: () => setShowSettings(true),
      color: 'bg-gray-500',
      premium: true
    },
    {
      id: 'user-profile',
      name: 'Mon Profil',
      description: 'Modifier mon profil utilisateur',
      icon: Users,
      category: 'system',
      action: () => {
        console.log('Opening user profile');
      },
      color: 'bg-blue-500'
    },
    {
      id: 'security-settings',
      name: 'Sécurité',
      description: 'Gérer la sécurité du compte',
      icon: Shield,
      category: 'system',
      action: () => {
        console.log('Opening security settings');
      },
      color: 'bg-red-500'
    },
    {
      id: 'notifications',
      name: 'Notifications',
      description: 'Configurer les notifications',
      icon: Bell,
      category: 'system',
      action: () => {
        console.log('Opening notification settings');
      },
      color: 'bg-yellow-500'
    },
    {
      id: 'help-support',
      name: 'Aide & Support',
      description: 'Accéder à l\'aide et au support',
      icon: Heart,
      category: 'system',
      action: () => {
        console.log('Opening help center');
      },
      color: 'bg-pink-500'
    },

    // Quick Tools
    {
      id: 'calculator',
      name: 'Calculatrice',
      description: 'Ouvrir la calculatrice intégrée',
      icon: Hash,
      category: 'tools',
      action: () => {
        console.log('Opening calculator');
      },
      color: 'bg-gray-500'
    },
    {
      id: 'calendar-view',
      name: 'Calendrier',
      description: 'Voir le calendrier complet',
      icon: CalendarIcon,
      category: 'tools',
      action: () => {
        console.log('Opening calendar view');
      },
      color: 'bg-blue-500'
    },
    {
      id: 'timer',
      name: 'Minuteur',
      description: 'Démarrer un minuteur de travail',
      icon: Timer,
      category: 'tools',
      action: () => {
        console.log('Starting timer');
      },
      color: 'bg-orange-500'
    },
    {
      id: 'notes',
      name: 'Notes Rapides',
      description: 'Prendre des notes rapidement',
      icon: Edit,
      category: 'tools',
      action: () => {
        console.log('Opening quick notes');
      },
      color: 'bg-yellow-500'
    },
    {
      id: 'search-global',
      name: 'Recherche Globale',
      description: 'Rechercher dans toute l\'application',
      icon: Search,
      category: 'tools',
      action: () => {
        console.log('Opening global search');
      },
      color: 'bg-purple-500',
      shortcut: 'Ctrl+K'
    }
  ];

  const categories = [
    { id: 'all', name: 'Toutes', icon: Zap, color: 'text-blue-600' },
    { id: 'hr', name: 'RH', icon: Users, color: 'text-purple-600' },
    { id: 'commercial', name: 'Commercial', icon: TrendingUp, color: 'text-green-600' },
    { id: 'admin', name: 'Administration', icon: Settings, color: 'text-orange-600' },
    { id: 'communication', name: 'Communication', icon: MessageCircle, color: 'text-blue-600' },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, color: 'text-indigo-600' },
    { id: 'system', name: 'Système', icon: Shield, color: 'text-red-600' },
    { id: 'tools', name: 'Outils', icon: Coffee, color: 'text-gray-600' }
  ];

  // Filter actions based on search, category, and active module
  const filteredActions = allActions.filter(action => {
    const matchesSearch = action.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         action.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || action.category === selectedCategory;
    
    // If we're in a specific module, prioritize related actions
    const isRelevantToModule = 
      selectedCategory !== 'all' || 
      !activeModule ||
      activeModule === 'dashboard' ||
      (activeModule?.includes('rh') && action.category === 'hr') ||
      (activeModule?.includes('commercial') && action.category === 'commercial') ||
      (activeModule?.includes('admin') && action.category === 'admin');
    
    return matchesSearch && matchesCategory && isRelevantToModule;
  });

  // Get suggested actions based on current module
  const getSuggestedActions = () => {
    if (activeModule?.includes('rh')) {
      return allActions.filter(a => a.category === 'hr').slice(0, 4);
    } else if (activeModule?.includes('commercial')) {
      return allActions.filter(a => a.category === 'commercial').slice(0, 4);
    } else if (activeModule?.includes('admin')) {
      return allActions.filter(a => a.category === 'admin').slice(0, 4);
    }
    return allActions.slice(0, 4); // Default suggestions
  };

  const handleActionClick = (action: QuickAction) => {
    console.log('Action clicked:', action);
    addToRecent(action);
    action.action();
    
    // Close modal after action unless it opens another modal
    if (!['add-employee', 'schedule-meeting', 'create-quote', 'add-prospect', 'create-contract-admin', 'create-report', 'create-workflow'].includes(action.id)) {
      onClose();
    }
  };

  const handleCreateEvent = (eventData: any) => {
    console.log('Event created from quick actions:', eventData);
    
    // Add event to localStorage for persistence (simulation)
    const existingEvents = JSON.parse(localStorage.getItem('dziljo-events') || '[]');
    const newEvent = {
      ...eventData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    existingEvents.push(newEvent);
    localStorage.setItem('dziljo-events', JSON.stringify(existingEvents));
    
    // Show success notification
    showSuccessNotification('✅ Événement créé avec succès !');
    setShowNewEvent(false);
  };

  const handleCreateEmployee = async (employeeData: any) => {
    try {
      console.log('Employee created from quick actions:', employeeData);
      showSuccessNotification('✅ Employé ajouté avec succès !');
      setShowNewEmployee(false);
    } catch (error) {
      console.error('Error creating employee:', error);
    }
  };

  const handleCreateQuote = (quoteData: any) => {
    console.log('Quote created from quick actions:', quoteData);
    showSuccessNotification('✅ Devis créé avec succès !');
    setShowNewQuote(false);
  };

  const showSuccessNotification = (message: string) => {
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = message;
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 animate-gradient-x opacity-80"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Actions Rapides</h1>
                    <p className="text-white/80">Accédez rapidement à toutes les fonctionnalités</p>
                  </div>
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
                  placeholder="Rechercher une action... (Ctrl+K)"
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
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <category.icon className={`w-4 h-4 mr-2 ${category.color}`} />
                  {category.name}
                </button>
              ))}
            </div>

            {/* Favorites */}
            {favoriteActions.length > 0 && searchTerm === '' && (
              <div className="mb-6">
                <h2 className="text-sm font-medium text-slate-500 mb-3 flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  Actions Favorites
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {allActions
                    .filter(action => favoriteActions.includes(action.id))
                    .slice(0, 8)
                    .map((action) => (
                      <button
                        key={action.id}
                        onClick={() => handleActionClick(action)}
                        className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors border border-yellow-200 hover:border-yellow-300 group relative"
                      >
                        <div className={`w-10 h-10 ${action.color} rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                          <action.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-medium text-slate-900 text-center">{action.name}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(action.id);
                          }}
                          className="absolute top-1 right-1 p-1 text-yellow-500 hover:text-yellow-600"
                        >
                          <Star className="w-3 h-3 fill-current" />
                        </button>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Recent Actions */}
            {recentActions.length > 0 && searchTerm === '' && (
              <div className="mb-6">
                <h2 className="text-sm font-medium text-slate-500 mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Actions Récentes
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {recentActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleActionClick(action)}
                      className="flex flex-col items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200 hover:border-slate-300 group relative"
                    >
                      <div className={`w-10 h-10 ${action.color} rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-slate-900 text-center">{action.name}</span>
                      {action.shortcut && (
                        <span className="text-xs text-slate-500 mt-1">{action.shortcut}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested for current module */}
            {activeModule && searchTerm === '' && selectedCategory === 'all' && (
              <div className="mb-6">
                <h2 className="text-sm font-medium text-slate-500 mb-3 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Suggestions pour {activeModule.includes('rh') ? 'RH' : 
                                  activeModule.includes('commercial') ? 'Commercial' : 
                                  activeModule.includes('admin') ? 'Administration' : 'ce Module'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {getSuggestedActions().map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleActionClick(action)}
                      className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200 group relative"
                    >
                      <div className={`w-8 h-8 ${action.color} rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="text-sm font-medium text-slate-900 flex items-center">
                          {action.name}
                          {action.new && <span className="ml-2 px-1 py-0.5 bg-green-100 text-green-800 text-xs rounded">Nouveau</span>}
                          {action.premium && <span className="ml-2 px-1 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">Pro</span>}
                        </div>
                        <div className="text-xs text-slate-500">{action.description}</div>
                        {action.shortcut && (
                          <div className="text-xs text-blue-600 mt-1">{action.shortcut}</div>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(action.id);
                        }}
                        className={`p-1 transition-colors ${
                          favoriteActions.includes(action.id) 
                            ? 'text-yellow-500 hover:text-yellow-600' 
                            : 'text-slate-300 hover:text-yellow-500'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${favoriteActions.includes(action.id) ? 'fill-current' : ''}`} />
                      </button>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                  {filteredActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleActionClick(action)}
                      className="flex items-center p-3 bg-white rounded-lg hover:bg-slate-50 transition-colors border border-slate-200 hover:border-slate-300 group relative"
                    >
                      <div className={`w-10 h-10 ${action.color} rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="text-sm font-medium text-slate-900 flex items-center">
                          {action.name}
                          {action.new && <span className="ml-2 px-1 py-0.5 bg-green-100 text-green-800 text-xs rounded">Nouveau</span>}
                          {action.premium && <span className="ml-2 px-1 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">Pro</span>}
                        </div>
                        <div className="text-xs text-slate-500">{action.description}</div>
                        {action.shortcut && (
                          <div className="text-xs text-blue-600 mt-1">{action.shortcut}</div>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(action.id);
                        }}
                        className={`p-1 transition-colors ${
                          favoriteActions.includes(action.id) 
                            ? 'text-yellow-500 hover:text-yellow-600' 
                            : 'text-slate-300 hover:text-yellow-500'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${favoriteActions.includes(action.id) ? 'fill-current' : ''}`} />
                      </button>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 border-t border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-slate-600">
                <div className="flex items-center">
                  <Heart className="w-4 h-4 text-pink-500 mr-1" />
                  <span>Raccourcis clavier disponibles</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span>{favoriteActions.length} favoris</span>
                </div>
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

      {/* Modals */}
      <NewEventModal
        isOpen={showNewEvent}
        onClose={() => setShowNewEvent(false)}
        onSave={handleCreateEvent}
      />

      <NewEmployeeForm
        isOpen={showNewEmployee}
        onClose={() => setShowNewEmployee(false)}
        onSave={handleCreateEmployee}
      />

      <QuoteWizard
        isOpen={showNewQuote}
        onClose={() => setShowNewQuote(false)}
        onSave={handleCreateQuote}
      />

      {/* Prospect Modal */}
      {showNewProspect && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Nouveau Prospect</h3>
              <button onClick={() => setShowNewProspect(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nom de l'entreprise"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Nom du contact"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Téléphone"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewProspect(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  showSuccessNotification('✅ Prospect créé avec succès !');
                  setShowNewProspect(false);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contract Modal */}
      {showNewContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Nouveau Contrat</h3>
              <button onClick={() => setShowNewContract(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Titre du contrat"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Nom du client"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Type de contrat</option>
                <option>Prestation</option>
                <option>Maintenance</option>
                <option>Partenariat</option>
              </select>
              <input
                type="number"
                placeholder="Valeur (€)"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewContract(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  showSuccessNotification('✅ Contrat créé avec succès !');
                  setShowNewContract(false);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showNewReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Nouveau Rapport</h3>
              <button onClick={() => setShowNewReport(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nom du rapport"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Type de rapport</option>
                <option>RH</option>
                <option>Commercial</option>
                <option>Financier</option>
                <option>Opérationnel</option>
              </select>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Fréquence</option>
                <option>Quotidien</option>
                <option>Hebdomadaire</option>
                <option>Mensuel</option>
                <option>À la demande</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewReport(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  showSuccessNotification('✅ Rapport créé avec succès !');
                  setShowNewReport(false);
                }}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Workflow Modal */}
      {showNewWorkflow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Nouveau Workflow</h3>
              <button onClick={() => setShowNewWorkflow(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nom du workflow"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <textarea
                placeholder="Description"
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Catégorie</option>
                <option>RH</option>
                <option>Commercial</option>
                <option>Administration</option>
                <option>Finance</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewWorkflow(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  showSuccessNotification('✅ Workflow créé avec succès !');
                  setShowNewWorkflow(false);
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickActions;