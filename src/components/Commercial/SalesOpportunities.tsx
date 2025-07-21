import React, { useState } from 'react';
import { Plus, Edit, Eye, Calendar, DollarSign, TrendingUp, Target, Clock, User, Building2, Phone, Mail, FileText, BarChart3, Filter, Search } from 'lucide-react';

interface Opportunity {
  id: number;
  title: string;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  stage: 'prospection' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  value: number;
  probability: number;
  expectedCloseDate: string;
  actualCloseDate?: string;
  source: string;
  assignedTo: string;
  createdDate: string;
  lastActivity: string;
  description: string;
  products: string[];
  competitors: string[];
  lossReason?: string;
  notes: string;
  activities: Activity[];
}

interface Activity {
  id: number;
  type: 'call' | 'email' | 'meeting' | 'proposal' | 'demo' | 'note';
  date: string;
  subject: string;
  description: string;
  outcome?: string;
  nextAction?: string;
}

const SalesOpportunities: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
      id: 1,
      title: 'Projet CRM Enterprise - TechCorp',
      company: 'TechCorp Solutions',
      contactName: 'Jean Dupont',
      email: 'j.dupont@techcorp.com',
      phone: '+33 1 23 45 67 89',
      stage: 'negotiation',
      value: 45000,
      probability: 80,
      expectedCloseDate: '2024-02-15',
      source: 'LinkedIn',
      assignedTo: 'Sophie Martin',
      createdDate: '2024-01-10',
      lastActivity: '2024-01-25',
      description: 'Implémentation d\'une solution CRM complète pour 200 utilisateurs',
      products: ['CRM Enterprise', 'Formation', 'Support Premium'],
      competitors: ['Salesforce', 'HubSpot'],
      notes: 'Client très intéressé, négociation sur les conditions de paiement',
      activities: [
        {
          id: 1,
          type: 'demo',
          date: '2024-01-25',
          subject: 'Démonstration produit',
          description: 'Présentation de la solution CRM avec focus sur les fonctionnalités enterprise',
          outcome: 'Très positif, demande de proposition commerciale',
          nextAction: 'Envoyer proposition dans 48h'
        }
      ]
    },
    {
      id: 2,
      title: 'Solution Marketing Automation - Digital Innov',
      company: 'Digital Innovations',
      contactName: 'Marie Rousseau',
      email: 'm.rousseau@digital-innov.com',
      phone: '+33 1 98 76 54 32',
      stage: 'proposal',
      value: 28000,
      probability: 60,
      expectedCloseDate: '2024-02-28',
      source: 'Site Web',
      assignedTo: 'Thomas Dubois',
      createdDate: '2024-01-15',
      lastActivity: '2024-01-24',
      description: 'Mise en place d\'une solution d\'automatisation marketing',
      products: ['Marketing Automation', 'Intégration', 'Formation'],
      competitors: ['Marketo', 'Pardot'],
      notes: 'En attente de validation du budget par le comité de direction',
      activities: [
        {
          id: 2,
          type: 'proposal',
          date: '2024-01-24',
          subject: 'Envoi proposition commerciale',
          description: 'Proposition détaillée avec ROI et planning d\'implémentation',
          outcome: 'Proposition reçue, en cours d\'évaluation',
          nextAction: 'Relance prévue le 30/01'
        }
      ]
    },
    {
      id: 3,
      title: 'Transformation Digitale - StartupXYZ',
      company: 'StartupXYZ',
      contactName: 'Pierre Martin',
      email: 'p.martin@startupxyz.fr',
      phone: '+33 1 11 22 33 44',
      stage: 'qualification',
      value: 15000,
      probability: 40,
      expectedCloseDate: '2024-03-15',
      source: 'Référence',
      assignedTo: 'Sophie Martin',
      createdDate: '2024-01-20',
      lastActivity: '2024-01-26',
      description: 'Accompagnement dans la transformation digitale de la startup',
      products: ['Consulting', 'Développement', 'Formation'],
      competitors: ['Accenture', 'Capgemini'],
      notes: 'Startup en croissance, budget limité mais potentiel à long terme',
      activities: [
        {
          id: 3,
          type: 'call',
          date: '2024-01-26',
          subject: 'Appel de qualification',
          description: 'Discussion sur les besoins et le budget disponible',
          outcome: 'Besoins confirmés, budget à valider',
          nextAction: 'Planifier réunion avec CTO'
        }
      ]
    }
  ]);

  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [filterStage, setFilterStage] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');

  const [newOpportunity, setNewOpportunity] = useState({
    title: '',
    company: '',
    contactName: '',
    email: '',
    phone: '',
    value: 0,
    expectedCloseDate: '',
    source: 'Manual',
    assignedTo: 'Sophie Martin',
    description: '',
    products: [''],
    notes: ''
  });

  const [newActivity, setNewActivity] = useState({
    type: 'call' as Activity['type'],
    subject: '',
    description: '',
    outcome: '',
    nextAction: ''
  });

  const stages = [
    { id: 'prospection', title: 'Prospection', color: 'bg-blue-500' },
    { id: 'qualification', title: 'Qualification', color: 'bg-yellow-500' },
    { id: 'proposal', title: 'Proposition', color: 'bg-orange-500' },
    { id: 'negotiation', title: 'Négociation', color: 'bg-purple-500' },
    { id: 'closed-won', title: 'Gagné', color: 'bg-green-500' },
    { id: 'closed-lost', title: 'Perdu', color: 'bg-red-500' }
  ];

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'prospection': return 'bg-blue-100 text-blue-800';
      case 'qualification': return 'bg-yellow-100 text-yellow-800';
      case 'proposal': return 'bg-orange-100 text-orange-800';
      case 'negotiation': return 'bg-purple-100 text-purple-800';
      case 'closed-won': return 'bg-green-100 text-green-800';
      case 'closed-lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageText = (stage: string) => {
    switch (stage) {
      case 'prospection': return 'Prospection';
      case 'qualification': return 'Qualification';
      case 'proposal': return 'Proposition';
      case 'negotiation': return 'Négociation';
      case 'closed-won': return 'Gagné';
      case 'closed-lost': return 'Perdu';
      default: return stage;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      case 'proposal': return <FileText className="w-4 h-4" />;
      case 'demo': return <BarChart3 className="w-4 h-4" />;
      case 'note': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.contactName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = !filterStage || opp.stage === filterStage;
    const matchesAssignee = !filterAssignee || opp.assignedTo === filterAssignee;
    
    return matchesSearch && matchesStage && matchesAssignee;
  });

  const handleAddActivity = () => {
    if (selectedOpportunity) {
      const activity: Activity = {
        id: Date.now(),
        ...newActivity,
        date: new Date().toISOString().split('T')[0]
      };

      setOpportunities(prev => prev.map(opp => 
        opp.id === selectedOpportunity.id 
          ? { ...opp, activities: [...opp.activities, activity], lastActivity: activity.date }
          : opp
      ));

      setSelectedOpportunity(prev => prev ? {
        ...prev,
        activities: [...prev.activities, activity],
        lastActivity: activity.date
      } : null);

      setNewActivity({
        type: 'call',
        subject: '',
        description: '',
        outcome: '',
        nextAction: ''
      });
      setShowActivityModal(false);
    }
  };

  const opportunityStats = {
    total: opportunities.length,
    totalValue: opportunities.reduce((sum, opp) => sum + opp.value, 0),
    weightedValue: opportunities.reduce((sum, opp) => sum + (opp.value * opp.probability / 100), 0),
    avgDealSize: opportunities.length > 0 ? opportunities.reduce((sum, opp) => sum + opp.value, 0) / opportunities.length : 0,
    winRate: opportunities.filter(opp => opp.stage === 'closed-won').length / Math.max(opportunities.filter(opp => opp.stage.startsWith('closed')).length, 1) * 100
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Opportunités de Vente</h2>
          <p className="text-slate-600">Gérez votre pipeline commercial et suivez vos opportunités</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Opportunité
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Opportunités</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{opportunityStats.total}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Valeur Pipeline</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">€{Math.round(opportunityStats.totalValue).toLocaleString()}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Valeur Pondérée</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">€{Math.round(opportunityStats.weightedValue).toLocaleString()}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Deal Moyen</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">€{Math.round(opportunityStats.avgDealSize).toLocaleString()}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Taux de Gain</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{Math.round(opportunityStats.winRate)}%</p>
            </div>
            <div className="bg-indigo-500 p-3 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher opportunités..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Toutes les étapes</option>
              <option value="prospection">Prospection</option>
              <option value="qualification">Qualification</option>
              <option value="proposal">Proposition</option>
              <option value="negotiation">Négociation</option>
              <option value="closed-won">Gagné</option>
              <option value="closed-lost">Perdu</option>
            </select>

            <select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les assignés</option>
              <option value="Sophie Martin">Sophie Martin</option>
              <option value="Thomas Dubois">Thomas Dubois</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Liste
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                viewMode === 'kanban' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Kanban
            </button>
          </div>
        </div>

        {viewMode === 'kanban' ? (
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
            {stages.map((stage) => (
              <div key={stage.id} className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900 flex items-center">
                    <div className={`w-3 h-3 rounded-full ${stage.color} mr-2`}></div>
                    {stage.title}
                  </h3>
                  <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-slate-600">
                    {filteredOpportunities.filter(opp => opp.stage === stage.id).length}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {filteredOpportunities
                    .filter(opportunity => opportunity.stage === stage.id)
                    .map((opportunity) => (
                      <div
                        key={opportunity.id}
                        onClick={() => setSelectedOpportunity(opportunity)}
                        className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <h4 className="font-medium text-slate-900 text-sm mb-2">{opportunity.title}</h4>
                        <p className="text-sm text-slate-600 mb-2">{opportunity.company}</p>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-slate-900">€{opportunity.value.toLocaleString()}</span>
                          <span className="text-xs text-slate-500">{opportunity.probability}%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{opportunity.assignedTo}</span>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {opportunity.expectedCloseDate}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Opportunité</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Étape</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Valeur</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Probabilité</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Clôture Prévue</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Assigné à</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOpportunities.map((opportunity) => (
                  <tr key={opportunity.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-slate-900">{opportunity.title}</p>
                        <p className="text-sm text-slate-600">{opportunity.company}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-slate-900">{opportunity.contactName}</p>
                        <p className="text-sm text-slate-500">{opportunity.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStageColor(opportunity.stage)}`}>
                        {getStageText(opportunity.stage)}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-900">
                      €{opportunity.value.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <span className="text-slate-700 mr-2">{opportunity.probability}%</span>
                        <div className="w-16 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${opportunity.probability}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-700">{opportunity.expectedCloseDate}</td>
                    <td className="py-4 px-4 text-slate-700">{opportunity.assignedTo}</td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setSelectedOpportunity(opportunity)}
                          className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-green-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Opportunity Details Modal */}
      {selectedOpportunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{selectedOpportunity.title}</h3>
                  <p className="text-slate-600">{selectedOpportunity.company} - {selectedOpportunity.contactName}</p>
                </div>
                <button 
                  onClick={() => setSelectedOpportunity(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Opportunity Details */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-3">Détails de l'Opportunité</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600">Valeur:</span>
                        <p className="text-slate-900 font-medium">€{selectedOpportunity.value.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Probabilité:</span>
                        <p className="text-slate-900">{selectedOpportunity.probability}%</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Clôture prévue:</span>
                        <p className="text-slate-900">{selectedOpportunity.expectedCloseDate}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Source:</span>
                        <p className="text-slate-900">{selectedOpportunity.source}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-slate-600">Description:</span>
                      <p className="text-slate-900 mt-1">{selectedOpportunity.description}</p>
                    </div>
                  </div>

                  {/* Products */}
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Produits/Services</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedOpportunity.products.map((product, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Competitors */}
                  {selectedOpportunity.competitors.length > 0 && (
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Concurrents</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedOpportunity.competitors.map((competitor, index) => (
                          <span key={index} className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                            {competitor}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Activities */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-slate-900">Activités</h4>
                      <button 
                        onClick={() => setShowActivityModal(true)}
                        className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                      >
                        Ajouter Activité
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {selectedOpportunity.activities.map((activity) => (
                        <div key={activity.id} className="border border-slate-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              {getActivityIcon(activity.type)}
                              <span className="ml-2 font-medium text-slate-900">{activity.subject}</span>
                            </div>
                            <span className="text-sm text-slate-500">{activity.date}</span>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{activity.description}</p>
                          {activity.outcome && (
                            <div className="bg-green-50 border border-green-200 rounded p-2">
                              <p className="text-sm text-green-800">
                                <strong>Résultat:</strong> {activity.outcome}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-3">Informations</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Étape:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStageColor(selectedOpportunity.stage)}`}>
                          {getStageText(selectedOpportunity.stage)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Assigné à:</span>
                        <span className="text-slate-900">{selectedOpportunity.assignedTo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Créé le:</span>
                        <span className="text-slate-900">{selectedOpportunity.createdDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Dernière activité:</span>
                        <span className="text-slate-900">{selectedOpportunity.lastActivity}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-3">Contact</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-slate-600">Nom:</span>
                        <p className="text-slate-900">{selectedOpportunity.contactName}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Email:</span>
                        <p className="text-slate-900">{selectedOpportunity.email}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Téléphone:</span>
                        <p className="text-slate-900">{selectedOpportunity.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedOpportunity.notes && (
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Notes</h4>
                      <div className="bg-slate-50 rounded p-3">
                        <p className="text-sm text-slate-700">{selectedOpportunity.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                      <Phone className="w-4 h-4 mr-2" />
                      Appeler
                    </button>
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Envoyer Email
                    </button>
                    <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Créer Proposition
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Activity Modal */}
      {showActivityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Nouvelle Activité</h3>
              <button 
                onClick={() => setShowActivityModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                <select
                  value={newActivity.type}
                  onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value as Activity['type'] })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="call">Appel</option>
                  <option value="email">Email</option>
                  <option value="meeting">Réunion</option>
                  <option value="proposal">Proposition</option>
                  <option value="demo">Démonstration</option>
                  <option value="note">Note</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Sujet</label>
                <input
                  type="text"
                  value={newActivity.subject}
                  onChange={(e) => setNewActivity({ ...newActivity, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Sujet de l'activité"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Description de l'activité..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Résultat</label>
                <textarea
                  value={newActivity.outcome}
                  onChange={(e) => setNewActivity({ ...newActivity, outcome: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Résultat de l'activité..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Prochaine Action</label>
                <input
                  type="text"
                  value={newActivity.nextAction}
                  onChange={(e) => setNewActivity({ ...newActivity, nextAction: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Prochaine action à effectuer..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowActivityModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAddActivity}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesOpportunities;