import React, { useState, useEffect } from 'react';
import { 
  Workflow, ArrowRight, Plus, Edit, Trash2, Eye, Search, Filter, 
  Save, X, Check, AlertTriangle, Play, Pause, Copy, Settings, 
  FileText, Users, Calendar, Mail, CheckCircle, Clock, MoreHorizontal,
  ChevronDown, ChevronUp, ArrowUpRight, Zap, Database, Layers, Archive
} from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import WorkflowBuilder from './WorkflowBuilder';
import WorkflowTemplateLibrary from './WorkflowTemplateLibrary';

interface WorkflowDefinition {
  id: number;
  name: string;
  description: string;
  category: 'hr' | 'commercial' | 'admin' | 'finance' | 'other';
  status: 'active' | 'draft' | 'paused' | 'archived';
  createdBy: string;
  createdDate: string;
  lastModified: string;
  steps: WorkflowStep[];
  triggers: WorkflowTrigger[];
  executionCount: number;
  averageExecutionTime: number;
  successRate: number;
  isTemplate?: boolean;
}

interface WorkflowStep {
  id: string;
  name: string;
  type: 'approval' | 'notification' | 'task' | 'condition' | 'delay' | 'integration' | 'document';
  config: any;
  position: { x: number; y: number };
  nextSteps: string[];
}

interface WorkflowTrigger {
  id: string;
  type: 'manual' | 'scheduled' | 'event' | 'form' | 'api';
  config: any;
}

const WorkflowManagement: React.FC = () => {
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>([
    {
      id: 1,
      name: "Processus d'Onboarding",
      description: "Workflow d'intégration des nouveaux employés",
      category: "hr",
      status: "active",
      createdBy: "Sophie Martin",
      createdDate: "2024-01-15",
      lastModified: "2024-01-20",
      steps: [
        {
          id: "step1",
          name: "Création du compte",
          type: "task",
          config: {
            assignee: "RH",
            dueDate: "1 jour",
            description: "Créer les accès système pour le nouvel employé"
          },
          position: { x: 100, y: 100 },
          nextSteps: ["step2"]
        },
        {
          id: "step2",
          name: "Email de bienvenue",
          type: "notification",
          config: {
            channel: "email",
            template: "welcome_email",
            recipients: ["{{employee.email}}"]
          },
          position: { x: 300, y: 100 },
          nextSteps: ["step3"]
        },
        {
          id: "step3",
          name: "Approbation du manager",
          type: "approval",
          config: {
            approvers: ["{{employee.manager}}"],
            timeoutDays: 3
          },
          position: { x: 500, y: 100 },
          nextSteps: []
        }
      ],
      triggers: [
        {
          id: "trigger1",
          type: "event",
          config: {
            event: "employee.created",
            conditions: []
          }
        }
      ],
      executionCount: 24,
      averageExecutionTime: 2.5,
      successRate: 95
    },
    {
      id: 2,
      name: "Validation des Contrats",
      description: "Processus de validation des contrats clients",
      category: "admin",
      status: "active",
      createdBy: "Thomas Dubois",
      createdDate: "2024-01-10",
      lastModified: "2024-01-18",
      steps: [
        {
          id: "step1",
          name: "Vérification juridique",
          type: "task",
          config: {
            assignee: "Juridique",
            dueDate: "2 jours",
            description: "Vérifier les clauses du contrat"
          },
          position: { x: 100, y: 100 },
          nextSteps: ["step2"]
        },
        {
          id: "step2",
          name: "Approbation Direction",
          type: "approval",
          config: {
            approvers: ["Directeur Commercial", "Directeur Général"],
            timeoutDays: 5
          },
          position: { x: 300, y: 100 },
          nextSteps: ["step3"]
        },
        {
          id: "step3",
          name: "Génération du contrat final",
          type: "document",
          config: {
            template: "contract_template",
            outputFormat: "pdf"
          },
          position: { x: 500, y: 100 },
          nextSteps: ["step4"]
        },
        {
          id: "step4",
          name: "Notification client",
          type: "notification",
          config: {
            channel: "email",
            template: "contract_ready",
            recipients: ["{{contract.client.email}}"]
          },
          position: { x: 700, y: 100 },
          nextSteps: []
        }
      ],
      triggers: [
        {
          id: "trigger1",
          type: "manual",
          config: {
            roles: ["commercial", "admin"]
          }
        }
      ],
      executionCount: 18,
      averageExecutionTime: 4.2,
      successRate: 88
    },
    {
      id: 3,
      name: "Suivi des Leads",
      description: "Automatisation du suivi des prospects",
      category: "commercial",
      status: "draft",
      createdBy: "Sophie Martin",
      createdDate: "2024-01-22",
      lastModified: "2024-01-22",
      steps: [
        {
          id: "step1",
          name: "Qualification initiale",
          type: "task",
          config: {
            assignee: "Commercial",
            dueDate: "1 jour",
            description: "Qualifier le lead et déterminer le niveau d'intérêt"
          },
          position: { x: 100, y: 100 },
          nextSteps: ["step2"]
        },
        {
          id: "step2",
          name: "Évaluation du potentiel",
          type: "condition",
          config: {
            condition: "{{lead.score}} >= 50",
            trueStep: "step3",
            falseStep: "step4"
          },
          position: { x: 300, y: 100 },
          nextSteps: ["step3", "step4"]
        },
        {
          id: "step3",
          name: "Planification démo",
          type: "task",
          config: {
            assignee: "Commercial",
            dueDate: "3 jours",
            description: "Organiser une démonstration du produit"
          },
          position: { x: 500, y: 50 },
          nextSteps: []
        },
        {
          id: "step4",
          name: "Email de nurturing",
          type: "notification",
          config: {
            channel: "email",
            template: "lead_nurturing",
            recipients: ["{{lead.email}}"]
          },
          position: { x: 500, y: 150 },
          nextSteps: []
        }
      ],
      triggers: [
        {
          id: "trigger1",
          type: "event",
          config: {
            event: "lead.created",
            conditions: []
          }
        }
      ],
      executionCount: 0,
      averageExecutionTime: 0,
      successRate: 0
    }
  ]);

  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowDefinition | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState<number | null>(null);

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || workflow.category === filterCategory;
    const matchesStatus = !filterStatus || workflow.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'hr': return 'bg-purple-100 text-purple-800';
      case 'commercial': return 'bg-blue-100 text-blue-800';
      case 'admin': return 'bg-green-100 text-green-800';
      case 'finance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'hr': return 'RH';
      case 'commercial': return 'Commercial';
      case 'admin': return 'Administration';
      case 'finance': return 'Finance';
      default: return 'Autre';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'paused': return 'bg-orange-100 text-orange-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'draft': return 'Brouillon';
      case 'paused': return 'En pause';
      case 'archived': return 'Archivé';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="w-4 h-4" />;
      case 'draft': return <Edit className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      case 'archived': return <Archive className="w-4 h-4" />;
      default: return <Workflow className="w-4 h-4" />;
    }
  };

  const handleCreateWorkflow = (workflowData: any) => {
    const newWorkflow: WorkflowDefinition = {
      ...workflowData,
      id: Date.now(),
      createdBy: "Sophie Martin", // In a real app, this would be the current user
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      executionCount: 0,
      averageExecutionTime: 0,
      successRate: 0
    };
    
    setWorkflows([...workflows, newWorkflow]);
    setShowCreateModal(false);
    
    // Show success message
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Workflow créé avec succès !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const handleUpdateWorkflow = (workflowData: any) => {
    setWorkflows(prev => 
      prev.map(workflow => 
        workflow.id === workflowData.id 
          ? { ...workflowData, lastModified: new Date().toISOString().split('T')[0] } 
          : workflow
      )
    );
    setSelectedWorkflow(null);
    setIsEditing(false);
    
    // Show success message
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Workflow mis à jour avec succès !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const handleDeleteWorkflow = (id: number) => {
    setWorkflowToDelete(id);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteWorkflow = () => {
    if (workflowToDelete) {
      setWorkflows(prev => prev.filter(workflow => workflow.id !== workflowToDelete));
      setShowDeleteConfirmation(false);
      setWorkflowToDelete(null);
      
      // Show success message
      const successElement = document.createElement('div');
      successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
      successElement.textContent = '✅ Workflow supprimé avec succès !';
      document.body.appendChild(successElement);
      setTimeout(() => document.body.removeChild(successElement), 3000);
    }
  };

  const handleDuplicateWorkflow = (workflow: WorkflowDefinition) => {
    const newWorkflow: WorkflowDefinition = {
      ...workflow,
      id: Date.now(),
      name: `${workflow.name} (copie)`,
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      status: 'draft',
      executionCount: 0,
      averageExecutionTime: 0,
      successRate: 0
    };
    
    setWorkflows([...workflows, newWorkflow]);
    
    // Show success message
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Workflow dupliqué avec succès !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const handleChangeWorkflowStatus = (id: number, newStatus: 'active' | 'draft' | 'paused' | 'archived') => {
    setWorkflows(prev => 
      prev.map(workflow => 
        workflow.id === id 
          ? { ...workflow, status: newStatus, lastModified: new Date().toISOString().split('T')[0] } 
          : workflow
      )
    );
    
    // Show success message
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = `✅ Statut du workflow mis à jour : ${getStatusText(newStatus)}`;
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const handleSelectTemplate = (template: WorkflowDefinition) => {
    // Create a new workflow based on the template
    const newWorkflow: WorkflowDefinition = {
      ...template,
      id: Date.now(),
      name: `${template.name} (nouveau)`,
      isTemplate: false,
      status: 'draft',
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      executionCount: 0,
      averageExecutionTime: 0,
      successRate: 0
    };
    
    setWorkflows([...workflows, newWorkflow]);
    setShowTemplateLibrary(false);
    
    // Show success message
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Workflow créé à partir du modèle !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestion des Workflows</h2>
          <p className="text-slate-600">Créez et gérez des processus automatisés pour votre entreprise</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowTemplateLibrary(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-purple-700 transition-colors"
          >
            <FileText className="w-4 h-4 mr-2" />
            Modèles
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Workflow
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Workflows</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{workflows.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Workflow className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Workflows Actifs</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{workflows.filter(w => w.status === 'active').length}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Play className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Exécutions Totales</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{workflows.reduce((sum, w) => sum + w.executionCount, 0)}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Taux de Succès</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {Math.round(
                  workflows.filter(w => w.executionCount > 0).reduce((sum, w) => sum + w.successRate, 0) / 
                  Math.max(workflows.filter(w => w.executionCount > 0).length, 1)
                )}%
              </p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher workflows..."
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
              <option value="hr">RH</option>
              <option value="commercial">Commercial</option>
              <option value="admin">Administration</option>
              <option value="finance">Finance</option>
              <option value="other">Autre</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="draft">Brouillon</option>
              <option value="paused">En pause</option>
              <option value="archived">Archivé</option>
            </select>
          </div>
        </div>

        {/* Workflows List */}
        <div className="space-y-4">
          {filteredWorkflows.length === 0 ? (
            <div className="text-center py-12">
              <Workflow className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Aucun workflow trouvé</h3>
              <p className="text-slate-500 mb-6">Créez votre premier workflow ou modifiez vos filtres</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Créer un workflow
              </button>
            </div>
          ) : (
            filteredWorkflows.map((workflow) => (
              <div key={workflow.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-slate-900">{workflow.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(workflow.category)}`}>
                        {getCategoryText(workflow.category)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded flex items-center ${getStatusColor(workflow.status)}`}>
                        {getStatusIcon(workflow.status)}
                        <span className="ml-1">{getStatusText(workflow.status)}</span>
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-3">{workflow.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-slate-600">
                      <div>
                        <span className="font-medium">Étapes:</span> {workflow.steps.length}
                      </div>
                      <div>
                        <span className="font-medium">Exécutions:</span> {workflow.executionCount}
                      </div>
                      <div>
                        <span className="font-medium">Temps moyen:</span> {workflow.averageExecutionTime}min
                      </div>
                      <div>
                        <span className="font-medium">Taux de succès:</span> {workflow.successRate}%
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-slate-500 mt-3">
                      <div>
                        <span className="font-medium">Créé par:</span> {workflow.createdBy}
                      </div>
                      <div>
                        <span className="font-medium">Dernière modification:</span> {workflow.lastModified}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button 
                      onClick={() => {
                        setSelectedWorkflow(workflow);
                        setIsEditing(false);
                      }}
                      className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                      title="Voir les détails"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedWorkflow(workflow);
                        setIsEditing(true);
                      }}
                      className="p-2 text-slate-400 hover:text-green-600 transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDuplicateWorkflow(workflow)}
                      className="p-2 text-slate-400 hover:text-purple-600 transition-colors"
                      title="Dupliquer"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <div className="relative group">
                      <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
                        <div className="py-1">
                          {workflow.status !== 'active' && (
                            <button
                              onClick={() => handleChangeWorkflowStatus(workflow.id, 'active')}
                              className="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-100"
                            >
                              <Play className="w-4 h-4 inline mr-2" />
                              Activer
                            </button>
                          )}
                          {workflow.status === 'active' && (
                            <button
                              onClick={() => handleChangeWorkflowStatus(workflow.id, 'paused')}
                              className="block w-full text-left px-4 py-2 text-sm text-orange-700 hover:bg-orange-100"
                            >
                              <Pause className="w-4 h-4 inline mr-2" />
                              Mettre en pause
                            </button>
                          )}
                          {workflow.status !== 'archived' && (
                            <button
                              onClick={() => handleChangeWorkflowStatus(workflow.id, 'archived')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Archive className="w-4 h-4 inline mr-2" />
                              Archiver
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteWorkflow(workflow.id)}
                            className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-100"
                          >
                            <Trash2 className="w-4 h-4 inline mr-2" />
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Workflow Details Modal */}
      {selectedWorkflow && !isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Workflow className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{selectedWorkflow.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(selectedWorkflow.category)}`}>
                        {getCategoryText(selectedWorkflow.category)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded flex items-center ${getStatusColor(selectedWorkflow.status)}`}>
                        {getStatusIcon(selectedWorkflow.status)}
                        <span className="ml-1">{getStatusText(selectedWorkflow.status)}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm flex items-center hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </button>
                  <button 
                    onClick={() => setSelectedWorkflow(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-2">Description</h4>
                <p className="text-slate-700">{selectedWorkflow.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Informations</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Créé par:</span>
                      <span className="text-slate-900">{selectedWorkflow.createdBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Date de création:</span>
                      <span className="text-slate-900">{selectedWorkflow.createdDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Dernière modification:</span>
                      <span className="text-slate-900">{selectedWorkflow.lastModified}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Statistiques</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Exécutions totales:</span>
                      <span className="text-slate-900">{selectedWorkflow.executionCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Temps moyen d'exécution:</span>
                      <span className="text-slate-900">{selectedWorkflow.averageExecutionTime} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Taux de succès:</span>
                      <span className="text-slate-900">{selectedWorkflow.successRate}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-3">Déclencheurs</h4>
                <div className="space-y-3">
                  {selectedWorkflow.triggers.map((trigger) => (
                    <div key={trigger.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-1 rounded mr-2">
                            {trigger.type === 'manual' && <Play className="w-4 h-4 text-blue-600" />}
                            {trigger.type === 'scheduled' && <Clock className="w-4 h-4 text-blue-600" />}
                            {trigger.type === 'event' && <Zap className="w-4 h-4 text-blue-600" />}
                            {trigger.type === 'form' && <FileText className="w-4 h-4 text-blue-600" />}
                            {trigger.type === 'api' && <ArrowUpRight className="w-4 h-4 text-blue-600" />}
                          </div>
                          <span className="font-medium text-slate-900 capitalize">{trigger.type}</span>
                        </div>
                      </div>
                      <div className="text-sm text-slate-600">
                        {trigger.type === 'manual' && (
                          <div>Déclenchement manuel par les rôles: {trigger.config.roles.join(', ')}</div>
                        )}
                        {trigger.type === 'event' && (
                          <div>Déclenché par l'événement: {trigger.config.event}</div>
                        )}
                        {trigger.type === 'scheduled' && (
                          <div>Planifié: {trigger.config.schedule}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-3">Étapes du Workflow</h4>
                <div className="space-y-3">
                  {selectedWorkflow.steps.map((step, index) => (
                    <div key={step.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-1 rounded mr-2">
                            <span className="text-blue-600 font-bold">{index + 1}</span>
                          </div>
                          <span className="font-medium text-slate-900">{step.name}</span>
                        </div>
                        <span className="text-xs font-medium bg-slate-200 text-slate-700 px-2 py-1 rounded capitalize">
                          {step.type}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600 mb-2">
                        {step.type === 'task' && (
                          <div>
                            <div>Assigné à: {step.config.assignee}</div>
                            <div>Échéance: {step.config.dueDate}</div>
                            <div>Description: {step.config.description}</div>
                          </div>
                        )}
                        {step.type === 'approval' && (
                          <div>
                            <div>Approbateurs: {step.config.approvers.join(', ')}</div>
                            <div>Délai: {step.config.timeoutDays} jours</div>
                          </div>
                        )}
                        {step.type === 'notification' && (
                          <div>
                            <div>Canal: {step.config.channel}</div>
                            <div>Template: {step.config.template}</div>
                            <div>Destinataires: {step.config.recipients.join(', ')}</div>
                          </div>
                        )}
                        {step.type === 'condition' && (
                          <div>
                            <div>Condition: {step.config.condition}</div>
                          </div>
                        )}
                      </div>
                      {step.nextSteps.length > 0 && (
                        <div className="flex items-center text-xs text-slate-500">
                          <ArrowRight className="w-3 h-3 mr-1" />
                          Étape(s) suivante(s): {step.nextSteps.map(nextId => {
                            const nextStep = selectedWorkflow.steps.find(s => s.id === nextId);
                            return nextStep ? nextStep.name : nextId;
                          }).join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-slate-200">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </button>
                <button 
                  onClick={() => handleDuplicateWorkflow(selectedWorkflow)}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Dupliquer
                </button>
                {selectedWorkflow.status === 'active' ? (
                  <button 
                    onClick={() => handleChangeWorkflowStatus(selectedWorkflow.id, 'paused')}
                    className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Mettre en pause
                  </button>
                ) : (
                  <button 
                    onClick={() => handleChangeWorkflowStatus(selectedWorkflow.id, 'active')}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Activer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Workflow Builder Modal */}
      {(showCreateModal || (selectedWorkflow && isEditing)) && (
        <DndProvider backend={HTML5Backend}>
          <WorkflowBuilder
            isOpen={true}
            onClose={() => {
              setShowCreateModal(false);
              setSelectedWorkflow(null);
              setIsEditing(false);
            }}
            onSave={isEditing ? handleUpdateWorkflow : handleCreateWorkflow}
            initialData={isEditing ? selectedWorkflow : undefined}
            isEditing={isEditing}
          />
        </DndProvider>
      )}

      {/* Template Library Modal */}
      {showTemplateLibrary && (
        <WorkflowTemplateLibrary
          isOpen={showTemplateLibrary}
          onClose={() => setShowTemplateLibrary(false)}
          onSelectTemplate={handleSelectTemplate}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="bg-red-100 p-3 rounded-full inline-flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Confirmer la suppression</h3>
              <p className="text-slate-600">
                Êtes-vous sûr de vouloir supprimer ce workflow ? Cette action est irréversible.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="flex-1 bg-slate-100 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDeleteWorkflow}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowManagement;