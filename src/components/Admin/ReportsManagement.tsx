import React, { useState } from 'react';
import { Plus, Edit, Eye, Search, Filter, Calendar, Users, FileText, Download, Share2, Archive, Clock, CheckCircle, AlertCircle, Copy, Trash2, Tag, MessageSquare, Star } from 'lucide-react';

interface Report {
  id: number;
  title: string;
  type: 'meeting' | 'project' | 'weekly' | 'monthly' | 'custom';
  status: 'draft' | 'in-progress' | 'completed' | 'archived';
  createdBy: string;
  createdDate: string;
  lastModified: string;
  lastModifiedBy: string;
  participants: string[];
  tags: string[];
  content: {
    agenda?: string[];
    decisions?: Decision[];
    actions?: Action[];
    notes?: string;
    attachments?: Attachment[];
  };
  meetingInfo?: {
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    organizer: string;
  };
  collaborators: Collaborator[];
  isTemplate: boolean;
  templateCategory?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

interface Decision {
  id: number;
  description: string;
  responsible: string;
  impact: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected';
}

interface Action {
  id: number;
  description: string;
  assignee: string;
  dueDate: string;
  status: 'todo' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
}

interface Attachment {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  uploadedBy: string;
}

interface Collaborator {
  id: number;
  name: string;
  role: 'editor' | 'viewer' | 'commenter';
  lastActive: string;
  isOnline: boolean;
}

interface Template {
  id: number;
  name: string;
  category: string;
  description: string;
  structure: any;
  usageCount: number;
  isDefault: boolean;
}

const ReportsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const [reports, setReports] = useState<Report[]>([
    {
      id: 1,
      title: 'Réunion Équipe Commerciale - Semaine 4',
      type: 'meeting',
      status: 'completed',
      createdBy: 'Sophie Martin',
      createdDate: '2024-01-25',
      lastModified: '2024-01-25',
      lastModifiedBy: 'Thomas Dubois',
      participants: ['Sophie Martin', 'Thomas Dubois', 'Marie Rousseau', 'Pierre Martin'],
      tags: ['Commercial', 'Hebdomadaire', 'Q1-2024'],
      content: {
        agenda: [
          'Bilan des ventes de la semaine',
          'Nouveaux prospects identifiés',
          'Stratégie pour le mois de février',
          'Formation équipe sur nouveau CRM'
        ],
        decisions: [
          {
            id: 1,
            description: 'Mise en place d\'un nouveau processus de qualification des leads',
            responsible: 'Thomas Dubois',
            impact: 'high',
            status: 'approved'
          },
          {
            id: 2,
            description: 'Budget formation CRM approuvé pour 5000€',
            responsible: 'Sophie Martin',
            impact: 'medium',
            status: 'approved'
          }
        ],
        actions: [
          {
            id: 1,
            description: 'Organiser formation CRM pour l\'équipe',
            assignee: 'Marie Rousseau',
            dueDate: '2024-02-15',
            status: 'todo',
            priority: 'high'
          },
          {
            id: 2,
            description: 'Mettre à jour le processus de qualification dans le CRM',
            assignee: 'Thomas Dubois',
            dueDate: '2024-02-10',
            status: 'in-progress',
            priority: 'medium'
          }
        ],
        notes: 'Excellente dynamique d\'équipe. Les objectifs du mois de janvier ont été dépassés de 15%. L\'équipe est motivée pour février.'
      },
      meetingInfo: {
        date: '2024-01-25',
        startTime: '09:00',
        endTime: '10:30',
        location: 'Salle de réunion A',
        organizer: 'Sophie Martin'
      },
      collaborators: [
        { id: 1, name: 'Sophie Martin', role: 'editor', lastActive: '2024-01-25 10:30', isOnline: false },
        { id: 2, name: 'Thomas Dubois', role: 'editor', lastActive: '2024-01-25 11:15', isOnline: true },
        { id: 3, name: 'Marie Rousseau', role: 'viewer', lastActive: '2024-01-25 09:45', isOnline: false }
      ],
      isTemplate: false,
      priority: 'medium'
    },
    {
      id: 2,
      title: 'Compte Rendu Projet Digital Transformation',
      type: 'project',
      status: 'in-progress',
      createdBy: 'Pierre Martin',
      createdDate: '2024-01-24',
      lastModified: '2024-01-26',
      lastModifiedBy: 'Pierre Martin',
      participants: ['Pierre Martin', 'Sophie Martin', 'Jean Dupont'],
      tags: ['Projet', 'Transformation', 'IT'],
      content: {
        decisions: [
          {
            id: 3,
            description: 'Choix de la stack technique React + Node.js',
            responsible: 'Sophie Martin',
            impact: 'high',
            status: 'approved'
          }
        ],
        actions: [
          {
            id: 3,
            description: 'Finaliser l\'architecture technique',
            assignee: 'Sophie Martin',
            dueDate: '2024-02-05',
            status: 'in-progress',
            priority: 'high'
          },
          {
            id: 4,
            description: 'Préparer le plan de migration des données',
            assignee: 'Jean Dupont',
            dueDate: '2024-02-12',
            status: 'todo',
            priority: 'medium'
          }
        ],
        notes: 'Le projet avance bien. Quelques défis techniques à résoudre mais l\'équipe est confiante.'
      },
      collaborators: [
        { id: 4, name: 'Pierre Martin', role: 'editor', lastActive: '2024-01-26 14:20', isOnline: true },
        { id: 1, name: 'Sophie Martin', role: 'editor', lastActive: '2024-01-26 13:45', isOnline: false }
      ],
      isTemplate: false,
      priority: 'high',
      dueDate: '2024-02-28'
    },
    {
      id: 3,
      title: 'Rapport Mensuel RH - Janvier 2024',
      type: 'monthly',
      status: 'draft',
      createdBy: 'Marie Rousseau',
      createdDate: '2024-01-26',
      lastModified: '2024-01-26',
      lastModifiedBy: 'Marie Rousseau',
      participants: ['Marie Rousseau', 'Sophie Martin'],
      tags: ['RH', 'Mensuel', 'Janvier'],
      content: {
        notes: 'Rapport en cours de rédaction. Données de recrutement et formation à finaliser.'
      },
      collaborators: [
        { id: 3, name: 'Marie Rousseau', role: 'editor', lastActive: '2024-01-26 16:00', isOnline: true }
      ],
      isTemplate: false,
      priority: 'medium',
      dueDate: '2024-01-31'
    }
  ]);

  const [templates, setTemplates] = useState<Template[]>([
    {
      id: 1,
      name: 'Réunion Équipe Standard',
      category: 'Réunions',
      description: 'Modèle pour les réunions d\'équipe hebdomadaires',
      structure: {
        agenda: ['Tour de table', 'Points d\'avancement', 'Difficultés rencontrées', 'Prochaines étapes'],
        sections: ['Participants', 'Ordre du jour', 'Décisions', 'Actions', 'Notes']
      },
      usageCount: 15,
      isDefault: true
    },
    {
      id: 2,
      name: 'Suivi de Projet',
      category: 'Projets',
      description: 'Modèle pour le suivi régulier des projets',
      structure: {
        sections: ['État d\'avancement', 'Risques identifiés', 'Décisions prises', 'Prochaines étapes', 'Budget']
      },
      usageCount: 8,
      isDefault: false
    },
    {
      id: 3,
      name: 'Rapport Mensuel',
      category: 'Rapports',
      description: 'Modèle pour les rapports mensuels départementaux',
      structure: {
        sections: ['Résumé exécutif', 'Indicateurs clés', 'Réalisations', 'Défis', 'Objectifs du mois suivant']
      },
      usageCount: 12,
      isDefault: false
    }
  ]);

  const [newReport, setNewReport] = useState({
    title: '',
    type: 'meeting' as Report['type'],
    participants: [''],
    tags: [''],
    templateId: 0,
    meetingDate: '',
    startTime: '',
    endTime: '',
    location: '',
    priority: 'medium' as Report['priority']
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-slate-100 text-slate-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'in-progress': return 'En cours';
      case 'completed': return 'Terminé';
      case 'archived': return 'Archivé';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'archived': return <Archive className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'project': return 'bg-purple-100 text-purple-800';
      case 'weekly': return 'bg-green-100 text-green-800';
      case 'monthly': return 'bg-orange-100 text-orange-800';
      case 'custom': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'meeting': return 'Réunion';
      case 'project': return 'Projet';
      case 'weekly': return 'Hebdomadaire';
      case 'monthly': return 'Mensuel';
      case 'custom': return 'Personnalisé';
      default: return type;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getActionStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDecisionStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         report.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !filterStatus || report.status === filterStatus;
    const matchesType = !filterType || report.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const reportStats = {
    total: reports.length,
    draft: reports.filter(r => r.status === 'draft').length,
    inProgress: reports.filter(r => r.status === 'in-progress').length,
    completed: reports.filter(r => r.status === 'completed').length,
    overdue: reports.filter(r => r.dueDate && new Date(r.dueDate) < new Date() && r.status !== 'completed').length
  };

  const addParticipant = () => {
    setNewReport({
      ...newReport,
      participants: [...newReport.participants, '']
    });
  };

  const updateParticipant = (index: number, value: string) => {
    const updated = [...newReport.participants];
    updated[index] = value;
    setNewReport({ ...newReport, participants: updated });
  };

  const removeParticipant = (index: number) => {
    const updated = newReport.participants.filter((_, i) => i !== index);
    setNewReport({ ...newReport, participants: updated });
  };

  const addTag = () => {
    setNewReport({
      ...newReport,
      tags: [...newReport.tags, '']
    });
  };

  const updateTag = (index: number, value: string) => {
    const updated = [...newReport.tags];
    updated[index] = value;
    setNewReport({ ...newReport, tags: updated });
  };

  const removeTag = (index: number) => {
    const updated = newReport.tags.filter((_, i) => i !== index);
    setNewReport({ ...newReport, tags: updated });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Comptes Rendus</h2>
          <p className="text-slate-600">Créez, collaborez et gérez vos comptes rendus de réunions et projets</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowTemplateModal(true)}
            className="bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-slate-700 transition-colors"
          >
            <FileText className="w-4 h-4 mr-2" />
            Modèles
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau CR
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total CR</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{reportStats.total}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Brouillons</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{reportStats.draft}</p>
            </div>
            <div className="bg-gray-500 p-3 rounded-lg">
              <Edit className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">En Cours</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{reportStats.inProgress}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Terminés</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{reportStats.completed}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">En Retard</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{reportStats.overdue}</p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'reports', name: 'Comptes Rendus', icon: FileText },
            { id: 'templates', name: 'Modèles', icon: Copy },
            { id: 'collaboration', name: 'Collaboration', icon: Users },
            { id: 'archive', name: 'Archives', icon: Archive }
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

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher CR..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {activeTab === 'reports' && (
              <>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tous les statuts</option>
                  <option value="draft">Brouillon</option>
                  <option value="in-progress">En cours</option>
                  <option value="completed">Terminé</option>
                  <option value="archived">Archivé</option>
                </select>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tous les types</option>
                  <option value="meeting">Réunion</option>
                  <option value="project">Projet</option>
                  <option value="weekly">Hebdomadaire</option>
                  <option value="monthly">Mensuel</option>
                </select>
              </>
            )}
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
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Grille
            </button>
          </div>
        </div>

        {activeTab === 'reports' && (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
            {filteredReports.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className={`p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors ${
                  viewMode === 'grid' ? 'h-full' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-slate-900">{report.title}</h4>
                      {report.priority === 'high' && (
                        <span className="text-red-500">
                          <Star className="w-4 h-4 fill-current" />
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeColor(report.type)}`}>
                        {getTypeText(report.type)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded flex items-center ${getStatusColor(report.status)}`}>
                        {getStatusIcon(report.status)}
                        <span className="ml-1">{getStatusText(report.status)}</span>
                      </span>
                    </div>

                    <div className="text-sm text-slate-600 mb-2">
                      <div className="flex items-center mb-1">
                        <Users className="w-3 h-3 mr-1" />
                        {report.participants.slice(0, 2).join(', ')}
                        {report.participants.length > 2 && ` +${report.participants.length - 2}`}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {report.lastModified} par {report.lastModifiedBy}
                      </div>
                    </div>

                    {report.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {report.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                        {report.tags.length > 3 && (
                          <span className="text-xs text-slate-500">+{report.tags.length - 3}</span>
                        )}
                      </div>
                    )}

                    {report.dueDate && (
                      <div className={`text-xs flex items-center ${
                        new Date(report.dueDate) < new Date() && report.status !== 'completed' 
                          ? 'text-red-600' : 'text-slate-500'
                      }`}>
                        <Clock className="w-3 h-3 mr-1" />
                        Échéance: {report.dueDate}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-1 ml-2">
                    {report.collaborators.filter(c => c.isOnline).length > 0 && (
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-slate-500 ml-1">
                          {report.collaborators.filter(c => c.isOnline).length}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {viewMode === 'list' && (
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      {report.content.decisions && (
                        <span>{report.content.decisions.length} décisions</span>
                      )}
                      {report.content.actions && (
                        <span>{report.content.actions.length} actions</span>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors">
                        <Eye className="w-3 h-3" />
                      </button>
                      <button className="p-1 text-slate-400 hover:text-green-600 transition-colors">
                        <Edit className="w-3 h-3" />
                      </button>
                      <button className="p-1 text-slate-400 hover:text-purple-600 transition-colors">
                        <Share2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div key={template.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900 mb-1">{template.name}</h4>
                    <p className="text-sm text-slate-600 mb-2">{template.description}</p>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {template.category}
                    </span>
                  </div>
                  {template.isDefault && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      Par défaut
                    </span>
                  )}
                </div>

                <div className="text-sm text-slate-600 mb-4">
                  <div>Utilisé {template.usageCount} fois</div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Utiliser
                  </button>
                  <button className="p-2 text-slate-400 hover:text-green-600 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'collaboration' && (
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Activité Récente</h3>
              <div className="space-y-3">
                {[
                  { user: 'Thomas Dubois', action: 'a modifié', document: 'Réunion Équipe Commerciale', time: '2 min' },
                  { user: 'Sophie Martin', action: 'a commenté', document: 'Projet Digital Transformation', time: '15 min' },
                  { user: 'Marie Rousseau', action: 'a créé', document: 'Rapport Mensuel RH', time: '1h' },
                  { user: 'Pierre Martin', action: 'a partagé', document: 'Projet Digital Transformation', time: '2h' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded border border-slate-200">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-medium text-sm">
                          {activity.user.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span> {activity.action} 
                          <span className="font-medium"> {activity.document}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">Il y a {activity.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">Collaborateurs Actifs</h4>
                <div className="space-y-2">
                  {reports.flatMap(r => r.collaborators)
                    .filter(c => c.isOnline)
                    .slice(0, 5)
                    .map((collaborator, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm text-slate-700">{collaborator.name}</span>
                      </div>
                      <span className="text-xs text-green-600">En ligne</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">Documents Partagés</h4>
                <div className="space-y-2">
                  {reports.filter(r => r.collaborators.length > 1).slice(0, 5).map(report => (
                    <div key={report.id} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <span className="text-sm text-slate-700">{report.title}</span>
                      <span className="text-xs text-blue-600">{report.collaborators.length} collaborateurs</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'archive' && (
          <div className="text-center py-8">
            <Archive className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Archives des comptes rendus - À implémenter</p>
          </div>
        )}
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{selectedReport.title}</h3>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeColor(selectedReport.type)}`}>
                      {getTypeText(selectedReport.type)}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(selectedReport.status)}`}>
                      {getStatusText(selectedReport.status)}
                    </span>
                    {selectedReport.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-6">
                  {/* Meeting Info */}
                  {selectedReport.meetingInfo && (
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-medium text-slate-900 mb-3">Informations de la Réunion</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">Date:</span>
                          <p className="text-slate-900">{selectedReport.meetingInfo.date}</p>
                        </div>
                        <div>
                          <span className="text-slate-600">Horaire:</span>
                          <p className="text-slate-900">{selectedReport.meetingInfo.startTime} - {selectedReport.meetingInfo.endTime}</p>
                        </div>
                        <div>
                          <span className="text-slate-600">Lieu:</span>
                          <p className="text-slate-900">{selectedReport.meetingInfo.location}</p>
                        </div>
                        <div>
                          <span className="text-slate-600">Organisateur:</span>
                          <p className="text-slate-900">{selectedReport.meetingInfo.organizer}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Agenda */}
                  {selectedReport.content.agenda && (
                    <div>
                      <h4 className="font-medium text-slate-900 mb-3">Ordre du Jour</h4>
                      <div className="space-y-2">
                        {selectedReport.content.agenda.map((item, index) => (
                          <div key={index} className="flex items-center p-2 bg-slate-50 rounded">
                            <span className="text-sm font-medium text-slate-600 mr-3">{index + 1}.</span>
                            <span className="text-sm text-slate-900">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Decisions */}
                  {selectedReport.content.decisions && selectedReport.content.decisions.length > 0 && (
                    <div>
                      <h4 className="font-medium text-slate-900 mb-3">Décisions Prises</h4>
                      <div className="space-y-3">
                        {selectedReport.content.decisions.map((decision) => (
                          <div key={decision.id} className="p-3 border border-slate-200 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded ${getDecisionStatusColor(decision.status)}`}>
                                {decision.status === 'pending' ? 'En attente' :
                                 decision.status === 'approved' ? 'Approuvée' : 'Rejetée'}
                              </span>
                              <span className={`text-xs font-medium ${
                                decision.impact === 'high' ? 'text-red-600' :
                                decision.impact === 'medium' ? 'text-yellow-600' : 'text-green-600'
                              }`}>
                                Impact {decision.impact === 'high' ? 'élevé' : decision.impact === 'medium' ? 'moyen' : 'faible'}
                              </span>
                            </div>
                            <p className="text-sm text-slate-900 mb-2">{decision.description}</p>
                            <p className="text-xs text-slate-600">Responsable: {decision.responsible}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {selectedReport.content.actions && selectedReport.content.actions.length > 0 && (
                    <div>
                      <h4 className="font-medium text-slate-900 mb-3">Actions à Suivre</h4>
                      <div className="space-y-3">
                        {selectedReport.content.actions.map((action) => (
                          <div key={action.id} className="p-3 border border-slate-200 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded ${getActionStatusColor(action.status)}`}>
                                {action.status === 'todo' ? 'À faire' :
                                 action.status === 'in-progress' ? 'En cours' :
                                 action.status === 'completed' ? 'Terminé' : 'En retard'}
                              </span>
                              <div className="flex items-center space-x-2">
                                <span className={`text-xs font-medium ${getPriorityColor(action.priority)}`}>
                                  {action.priority === 'high' ? 'Haute' : action.priority === 'medium' ? 'Moyenne' : 'Basse'}
                                </span>
                                <span className="text-xs text-slate-500">{action.dueDate}</span>
                              </div>
                            </div>
                            <p className="text-sm text-slate-900 mb-2">{action.description}</p>
                            <p className="text-xs text-slate-600">Assigné à: {action.assignee}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {selectedReport.content.notes && (
                    <div>
                      <h4 className="font-medium text-slate-900 mb-3">Notes</h4>
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-700">{selectedReport.content.notes}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Participants */}
                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Participants</h4>
                    <div className="space-y-2">
                      {selectedReport.participants.map((participant, index) => (
                        <div key={index} className="flex items-center p-2 bg-slate-50 rounded">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                            <span className="text-blue-600 font-medium text-xs">
                              {participant.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="text-sm text-slate-900">{participant}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Collaborators */}
                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Collaborateurs</h4>
                    <div className="space-y-2">
                      {selectedReport.collaborators.map((collaborator) => (
                        <div key={collaborator.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                              <span className="text-blue-600 font-medium text-xs">
                                {collaborator.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm text-slate-900">{collaborator.name}</p>
                              <p className="text-xs text-slate-600">{collaborator.role}</p>
                            </div>
                          </div>
                          {collaborator.isOnline && (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Informations</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-slate-600">Créé par:</span>
                        <p className="text-slate-900">{selectedReport.createdBy}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Créé le:</span>
                        <p className="text-slate-900">{selectedReport.createdDate}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Dernière modification:</span>
                        <p className="text-slate-900">{selectedReport.lastModified}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Par:</span>
                        <p className="text-slate-900">{selectedReport.lastModifiedBy}</p>
                      </div>
                      {selectedReport.dueDate && (
                        <div>
                          <span className="text-slate-600">Échéance:</span>
                          <p className={`${
                            new Date(selectedReport.dueDate) < new Date() && selectedReport.status !== 'completed' 
                              ? 'text-red-600' : 'text-slate-900'
                          }`}>
                            {selectedReport.dueDate}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </button>
                    <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                      <Share2 className="w-4 h-4 mr-2" />
                      Partager
                    </button>
                    <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                      <Download className="w-4 h-4 mr-2" />
                      Exporter PDF
                    </button>
                    <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center">
                      <Copy className="w-4 h-4 mr-2" />
                      Dupliquer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Report Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Nouveau Compte Rendu</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Titre *</label>
                  <input
                    type="text"
                    value={newReport.title}
                    onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Titre du compte rendu"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Type *</label>
                  <select
                    value={newReport.type}
                    onChange={(e) => setNewReport({ ...newReport, type: e.target.value as Report['type'] })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="meeting">Réunion</option>
                    <option value="project">Projet</option>
                    <option value="weekly">Hebdomadaire</option>
                    <option value="monthly">Mensuel</option>
                    <option value="custom">Personnalisé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Modèle</label>
                  <select
                    value={newReport.templateId}
                    onChange={(e) => setNewReport({ ...newReport, templateId: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={0}>Aucun modèle</option>
                    {templates.map(template => (
                      <option key={template.id} value={template.id}>{template.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Priorité</label>
                  <select
                    value={newReport.priority}
                    onChange={(e) => setNewReport({ ...newReport, priority: e.target.value as Report['priority'] })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Basse</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                  </select>
                </div>
              </div>

              {newReport.type === 'meeting' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={newReport.meetingDate}
                      onChange={(e) => setNewReport({ ...newReport, meetingDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Début</label>
                    <input
                      type="time"
                      value={newReport.startTime}
                      onChange={(e) => setNewReport({ ...newReport, startTime: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Fin</label>
                    <input
                      type="time"
                      value={newReport.endTime}
                      onChange={(e) => setNewReport({ ...newReport, endTime: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Lieu</label>
                    <input
                      type="text"
                      value={newReport.location}
                      onChange={(e) => setNewReport({ ...newReport, location: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Lieu de la réunion"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Participants</label>
                {newReport.participants.map((participant, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={participant}
                      onChange={(e) => updateParticipant(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nom du participant"
                    />
                    {newReport.participants.length > 1 && (
                      <button
                        onClick={() => removeParticipant(index)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addParticipant}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Ajouter un participant
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
                {newReport.tags.map((tag, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => updateTag(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tag"
                    />
                    {newReport.tags.length > 1 && (
                      <button
                        onClick={() => removeTag(index)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addTag}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Ajouter un tag
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-200">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  // Handle create report
                  setShowCreateModal(false);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Créer le CR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Templates Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Modèles de Comptes Rendus</h3>
              <button 
                onClick={() => setShowTemplateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div key={template.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900 mb-1">{template.name}</h4>
                      <p className="text-sm text-slate-600 mb-2">{template.description}</p>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {template.category}
                        </span>
                        {template.isDefault && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Par défaut
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-slate-600 mb-4">
                    <div>Utilisé {template.usageCount} fois</div>
                    <div className="mt-2">
                      <span className="font-medium">Sections:</span>
                      <ul className="list-disc list-inside text-xs mt-1">
                        {template.structure.sections?.map((section: string, index: number) => (
                          <li key={index}>{section}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Utiliser
                    </button>
                    <button className="p-2 text-slate-400 hover:text-green-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Créer un Nouveau Modèle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsManagement;