import React, { useState } from 'react';
import { Plus, Upload, Download, Phone, Mail, Calendar, Edit, Eye, Filter, Search, Users, TrendingUp, Target, Clock, Star, MessageSquare, FileText, Tag, MoreHorizontal } from 'lucide-react';
import CSVImporter from './CSVImporter';

interface Prospect {
  id: number;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  position: string;
  industry: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  temperature: 'hot' | 'warm' | 'cold';
  estimatedValue: number;
  probability: number;
  nextAction: string;
  nextActionDate: string;
  assignedTo: string;
  createdDate: string;
  lastContact: string;
  tags: string[];
  notes: string;
  interactions: Interaction[];
  website?: string;
  address?: string;
  city?: string;
  country?: string;
}

interface Interaction {
  id: number;
  type: 'call' | 'email' | 'meeting' | 'note';
  date: string;
  duration?: number;
  subject: string;
  content: string;
  outcome: string;
  nextAction?: string;
}

const ProspectManagement: React.FC = () => {
  const [prospects, setProspects] = useState<Prospect[]>([
    {
      id: 1,
      company: 'TechCorp Solutions',
      contactName: 'Jean Dupont',
      email: 'j.dupont@techcorp.com',
      phone: '+33 1 23 45 67 89',
      position: 'Directeur IT',
      industry: 'Technologie',
      source: 'LinkedIn',
      status: 'qualified',
      temperature: 'hot',
      estimatedValue: 25000,
      probability: 75,
      nextAction: 'Envoyer proposition commerciale',
      nextActionDate: '2024-01-28',
      assignedTo: 'Sophie Martin',
      createdDate: '2024-01-15',
      lastContact: '2024-01-25',
      tags: ['Enterprise', 'Priorité'],
      notes: 'Très intéressé par nos solutions. Budget confirmé.',
      interactions: [
        {
          id: 1,
          type: 'call',
          date: '2024-01-25',
          duration: 45,
          subject: 'Appel de qualification',
          content: 'Discussion sur les besoins et le budget',
          outcome: 'Qualifié - Budget confirmé 25k€',
          nextAction: 'Envoyer proposition'
        }
      ]
    },
    {
      id: 2,
      company: 'Digital Innovations',
      contactName: 'Marie Rousseau',
      email: 'm.rousseau@digital-innov.com',
      phone: '+33 1 98 76 54 32',
      position: 'CEO',
      industry: 'Marketing Digital',
      source: 'Site Web',
      status: 'contacted',
      temperature: 'warm',
      estimatedValue: 15000,
      probability: 40,
      nextAction: 'Planifier démonstration',
      nextActionDate: '2024-01-30',
      assignedTo: 'Thomas Dubois',
      createdDate: '2024-01-20',
      lastContact: '2024-01-24',
      tags: ['PME', 'Marketing'],
      notes: 'Intéressée mais doit convaincre son associé.',
      interactions: [
        {
          id: 2,
          type: 'email',
          date: '2024-01-24',
          subject: 'Suivi première prise de contact',
          content: 'Email de suivi avec documentation',
          outcome: 'Réponse positive - demande démo'
        }
      ]
    },
    {
      id: 3,
      company: 'StartupXYZ',
      contactName: 'Pierre Martin',
      email: 'p.martin@startupxyz.fr',
      phone: '+33 1 11 22 33 44',
      position: 'Fondateur',
      industry: 'Fintech',
      source: 'Référence',
      status: 'new',
      temperature: 'cold',
      estimatedValue: 8000,
      probability: 20,
      nextAction: 'Premier contact téléphonique',
      nextActionDate: '2024-01-29',
      assignedTo: 'Sophie Martin',
      createdDate: '2024-01-26',
      lastContact: '',
      tags: ['Startup', 'Fintech'],
      notes: 'Référé par un client existant.',
      interactions: []
    }
  ]);

  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTemperature, setFilterTemperature] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  const [newProspect, setNewProspect] = useState({
    company: '',
    contactName: '',
    email: '',
    phone: '',
    position: '',
    industry: '',
    source: 'Manual',
    estimatedValue: 0,
    assignedTo: 'Sophie Martin',
    notes: '',
    tags: []
  });

  const [newInteraction, setNewInteraction] = useState({
    type: 'call' as Interaction['type'],
    subject: '',
    content: '',
    outcome: '',
    nextAction: '',
    duration: 30
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-purple-100 text-purple-800';
      case 'proposal': return 'bg-orange-100 text-orange-800';
      case 'negotiation': return 'bg-indigo-100 text-indigo-800';
      case 'won': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTemperatureColor = (temperature: string) => {
    switch (temperature) {
      case 'hot': return 'bg-red-100 text-red-800';
      case 'warm': return 'bg-orange-100 text-orange-800';
      case 'cold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Nouveau';
      case 'contacted': return 'Contacté';
      case 'qualified': return 'Qualifié';
      case 'proposal': return 'Proposition';
      case 'negotiation': return 'Négociation';
      case 'won': return 'Gagné';
      case 'lost': return 'Perdu';
      default: return status;
    }
  };

  const getTemperatureText = (temperature: string) => {
    switch (temperature) {
      case 'hot': return 'Chaud';
      case 'warm': return 'Tiède';
      case 'cold': return 'Froid';
      default: return temperature;
    }
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      case 'note': return <FileText className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const filteredProspects = prospects.filter(prospect => {
    const matchesSearch = prospect.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prospect.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prospect.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || prospect.status === filterStatus;
    const matchesTemperature = !filterTemperature || prospect.temperature === filterTemperature;
    const matchesAssignee = !filterAssignee || prospect.assignedTo === filterAssignee;
    
    return matchesSearch && matchesStatus && matchesTemperature && matchesAssignee;
  });

  const handleAddInteraction = () => {
    if (selectedProspect) {
      const interaction: Interaction = {
        id: Date.now(),
        ...newInteraction,
        date: new Date().toISOString().split('T')[0]
      };

      setProspects(prev => prev.map(p => 
        p.id === selectedProspect.id 
          ? { ...p, interactions: [...p.interactions, interaction], lastContact: interaction.date }
          : p
      ));

      setSelectedProspect(prev => prev ? {
        ...prev,
        interactions: [...prev.interactions, interaction],
        lastContact: interaction.date
      } : null);

      setNewInteraction({
        type: 'call',
        subject: '',
        content: '',
        outcome: '',
        nextAction: '',
        duration: 30
      });
      setShowInteractionModal(false);
      
      // Show success message
      const successElement = document.createElement('div');
      successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
      successElement.textContent = '✅ Interaction ajoutée avec succès !';
      document.body.appendChild(successElement);
      setTimeout(() => document.body.removeChild(successElement), 3000);
    }
  };

  const handleImportProspects = (importedData: any[]) => {
    // Process imported data
    const newProspects = importedData.map((data, index) => {
      // Generate a unique ID for each new prospect
      const id = Date.now() + index;
      
      // Set default values for fields not in the import
      return {
        id,
        company: data.company || '',
        contactName: data.contactName || '',
        email: data.email || '',
        phone: data.phone || '',
        position: data.position || '',
        industry: data.industry || '',
        source: data.source || 'Import CSV',
        status: 'new' as const,
        temperature: 'cold' as const,
        estimatedValue: parseFloat(data.estimatedValue) || 0,
        probability: 20,
        nextAction: data.nextAction || 'Contacter',
        nextActionDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        assignedTo: data.assignedTo || 'Sophie Martin',
        createdDate: new Date().toISOString().split('T')[0],
        lastContact: '',
        tags: data.tags ? data.tags.split(',').map((tag: string) => tag.trim()) : [],
        notes: data.notes || '',
        interactions: [],
        website: data.website || '',
        address: data.address || '',
        city: data.city || '',
        country: data.country || ''
      };
    });
    
    // Add new prospects to the existing list
    setProspects(prev => [...prev, ...newProspects]);
    
    // Close the import modal
    setShowImportModal(false);
    
    // Show success message
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = `✅ ${newProspects.length} prospects importés avec succès !`;
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const prospectStats = {
    total: prospects.length,
    hot: prospects.filter(p => p.temperature === 'hot').length,
    qualified: prospects.filter(p => p.status === 'qualified').length,
    totalValue: prospects.reduce((sum, p) => sum + p.estimatedValue, 0)
  };

  const statusColumns = [
    { id: 'new', title: 'Nouveaux', color: 'bg-blue-500' },
    { id: 'contacted', title: 'Contactés', color: 'bg-yellow-500' },
    { id: 'qualified', title: 'Qualifiés', color: 'bg-purple-500' },
    { id: 'proposal', title: 'Proposition', color: 'bg-orange-500' },
    { id: 'negotiation', title: 'Négociation', color: 'bg-indigo-500' },
    { id: 'won', title: 'Gagnés', color: 'bg-green-500' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestion de la Prospection</h2>
          <p className="text-slate-600">Gérez vos prospects et optimisez votre pipeline commercial</p>
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
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Prospect
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Prospects</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{prospectStats.total}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Prospects Chauds</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{prospectStats.hot}</p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Qualifiés</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{prospectStats.qualified}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Valeur Pipeline</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">€{prospectStats.totalValue.toLocaleString()}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
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
                placeholder="Rechercher prospects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="new">Nouveau</option>
              <option value="contacted">Contacté</option>
              <option value="qualified">Qualifié</option>
              <option value="proposal">Proposition</option>
              <option value="negotiation">Négociation</option>
            </select>

            <select
              value={filterTemperature}
              onChange={(e) => setFilterTemperature(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Toutes les températures</option>
              <option value="hot">Chaud</option>
              <option value="warm">Tiède</option>
              <option value="cold">Froid</option>
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

        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Prospect</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Statut</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Température</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Valeur</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Prochaine Action</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Assigné à</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProspects.map((prospect) => (
                  <tr key={prospect.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-slate-900">{prospect.company}</p>
                        <p className="text-sm text-slate-600">{prospect.industry}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-slate-900">{prospect.contactName}</p>
                        <p className="text-sm text-slate-600">{prospect.position}</p>
                        <p className="text-sm text-slate-500">{prospect.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(prospect.status)}`}>
                        {getStatusText(prospect.status)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getTemperatureColor(prospect.temperature)}`}>
                        {getTemperatureText(prospect.temperature)}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-900">
                      €{prospect.estimatedValue.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm text-slate-900">{prospect.nextAction}</p>
                        <p className="text-xs text-slate-500">{prospect.nextActionDate}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-700">{prospect.assignedTo}</td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setSelectedProspect(prospect)}
                          className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-green-600 transition-colors">
                          <Phone className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-orange-600 transition-colors">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-purple-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
            {statusColumns.map((column) => (
              <div key={column.id} className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900 flex items-center">
                    <div className={`w-3 h-3 rounded-full ${column.color} mr-2`}></div>
                    {column.title}
                  </h3>
                  <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-slate-600">
                    {filteredProspects.filter(p => p.status === column.id).length}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {filteredProspects
                    .filter(prospect => prospect.status === column.id)
                    .map((prospect) => (
                      <div
                        key={prospect.id}
                        onClick={() => setSelectedProspect(prospect)}
                        className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-slate-900 text-sm">{prospect.company}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getTemperatureColor(prospect.temperature)}`}>
                            {getTemperatureText(prospect.temperature)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{prospect.contactName}</p>
                        <p className="text-sm font-medium text-slate-900 mb-2">€{prospect.estimatedValue.toLocaleString()}</p>
                        <div className="flex items-center text-xs text-slate-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {prospect.nextActionDate}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prospect Details Modal */}
      {selectedProspect && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{selectedProspect.company}</h3>
                  <p className="text-slate-600">{selectedProspect.contactName} - {selectedProspect.position}</p>
                </div>
                <button 
                  onClick={() => setSelectedProspect(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Contact Information */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-3">Informations de Contact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600">Email:</span>
                        <p className="text-slate-900">{selectedProspect.email}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Téléphone:</span>
                        <p className="text-slate-900">{selectedProspect.phone}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Secteur:</span>
                        <p className="text-slate-900">{selectedProspect.industry}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Source:</span>
                        <p className="text-slate-900">{selectedProspect.source}</p>
                      </div>
                      {selectedProspect.website && (
                        <div>
                          <span className="text-slate-600">Site Web:</span>
                          <p className="text-slate-900">{selectedProspect.website}</p>
                        </div>
                      )}
                      {selectedProspect.address && (
                        <div className="md:col-span-2">
                          <span className="text-slate-600">Adresse:</span>
                          <p className="text-slate-900">
                            {selectedProspect.address}
                            {selectedProspect.city && `, ${selectedProspect.city}`}
                            {selectedProspect.country && `, ${selectedProspect.country}`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Interactions History */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-slate-900">Historique des Interactions</h4>
                      <button 
                        onClick={() => setShowInteractionModal(true)}
                        className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                      >
                        Ajouter Interaction
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {selectedProspect.interactions.length === 0 ? (
                        <div className="text-center py-6 bg-slate-50 rounded-lg">
                          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                          <p className="text-slate-500">Aucune interaction enregistrée</p>
                          <button 
                            onClick={() => setShowInteractionModal(true)}
                            className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Ajouter la première interaction
                          </button>
                        </div>
                      ) : (
                        selectedProspect.interactions.map((interaction) => (
                          <div key={interaction.id} className="border border-slate-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                {getInteractionIcon(interaction.type)}
                                <span className="ml-2 font-medium text-slate-900">{interaction.subject}</span>
                              </div>
                              <span className="text-sm text-slate-500">{interaction.date}</span>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{interaction.content}</p>
                            {interaction.outcome && (
                              <div className="bg-green-50 border border-green-200 rounded p-2">
                                <p className="text-sm text-green-800">
                                  <strong>Résultat:</strong> {interaction.outcome}
                                </p>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-3">Informations Clés</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Statut:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(selectedProspect.status)}`}>
                          {getStatusText(selectedProspect.status)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Température:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getTemperatureColor(selectedProspect.temperature)}`}>
                          {getTemperatureText(selectedProspect.temperature)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Valeur estimée:</span>
                        <span className="font-medium text-slate-900">€{selectedProspect.estimatedValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Probabilité:</span>
                        <span className="font-medium text-slate-900">{selectedProspect.probability}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Assigné à:</span>
                        <span className="text-slate-900">{selectedProspect.assignedTo}</span>
                      </div>
                    </div>
                  </div>

                  {/* Next Action */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Prochaine Action</h4>
                    <p className="text-sm text-blue-800 mb-2">{selectedProspect.nextAction}</p>
                    <p className="text-xs text-blue-600">Échéance: {selectedProspect.nextActionDate}</p>
                  </div>

                  {/* Tags */}
                  {selectedProspect.tags.length > 0 && (
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProspect.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {selectedProspect.notes && (
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Notes</h4>
                      <div className="bg-slate-50 rounded p-3">
                        <p className="text-sm text-slate-700">{selectedProspect.notes}</p>
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
                      <Calendar className="w-4 h-4 mr-2" />
                      Planifier RDV
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Interaction Modal */}
      {showInteractionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Nouvelle Interaction</h3>
              <button 
                onClick={() => setShowInteractionModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                <select
                  value={newInteraction.type}
                  onChange={(e) => setNewInteraction({ ...newInteraction, type: e.target.value as Interaction['type'] })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="call">Appel</option>
                  <option value="email">Email</option>
                  <option value="meeting">Réunion</option>
                  <option value="note">Note</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Sujet</label>
                <input
                  type="text"
                  value={newInteraction.subject}
                  onChange={(e) => setNewInteraction({ ...newInteraction, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Sujet de l'interaction"
                />
              </div>

              {newInteraction.type === 'call' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Durée (minutes)</label>
                  <input
                    type="number"
                    value={newInteraction.duration}
                    onChange={(e) => setNewInteraction({ ...newInteraction, duration: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Contenu</label>
                <textarea
                  value={newInteraction.content}
                  onChange={(e) => setNewInteraction({ ...newInteraction, content: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Détails de l'interaction..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Résultat</label>
                <textarea
                  value={newInteraction.outcome}
                  onChange={(e) => setNewInteraction({ ...newInteraction, outcome: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Résultat de l'interaction..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Prochaine Action</label>
                <input
                  type="text"
                  value={newInteraction.nextAction}
                  onChange={(e) => setNewInteraction({ ...newInteraction, nextAction: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Prochaine action à effectuer..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowInteractionModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAddInteraction}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSV Importer Modal */}
      <CSVImporter
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportProspects}
        entityType="prospect"
      />
    </div>
  );
};

export default ProspectManagement;