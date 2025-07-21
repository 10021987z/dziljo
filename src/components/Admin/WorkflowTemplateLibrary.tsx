import React, { useState } from 'react';
import { 
  FileText, Search, Filter, Plus, Edit, Eye, Download, Copy, 
  Trash2, Check, X, Star, Tag, Calendar, Workflow, Users, 
  ArrowRight, Zap, CheckCircle, Clock, Settings
} from 'lucide-react';

interface WorkflowTemplateLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: any) => void;
}

interface WorkflowTemplate {
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
  isTemplate: boolean;
  tags?: string[];
  complexity?: 'simple' | 'medium' | 'complex';
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

const WorkflowTemplateLibrary: React.FC<WorkflowTemplateLibraryProps> = ({
  isOpen,
  onClose,
  onSelectTemplate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterComplexity, setFilterComplexity] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);

  // Sample templates
  const templates: WorkflowTemplate[] = [
    {
      id: 101,
      name: "Onboarding Employé",
      description: "Processus complet d'intégration des nouveaux employés",
      category: "hr",
      status: "active",
      createdBy: "Système",
      createdDate: "2024-01-01",
      lastModified: "2024-01-01",
      steps: [
        {
          id: "step1",
          name: "Création des accès",
          type: "task",
          config: {
            assignee: "IT",
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
          name: "Préparation du matériel",
          type: "task",
          config: {
            assignee: "IT",
            dueDate: "2 jours",
            description: "Préparer l'ordinateur et les équipements"
          },
          position: { x: 500, y: 100 },
          nextSteps: ["step4"]
        },
        {
          id: "step4",
          name: "Réunion d'accueil",
          type: "task",
          config: {
            assignee: "RH",
            dueDate: "Premier jour",
            description: "Organiser une réunion d'accueil"
          },
          position: { x: 700, y: 100 },
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
      executionCount: 0,
      averageExecutionTime: 0,
      successRate: 0,
      isTemplate: true,
      tags: ["RH", "Onboarding", "Employé"],
      complexity: "medium"
    },
    {
      id: 102,
      name: "Validation des Contrats",
      description: "Processus de validation des contrats clients",
      category: "admin",
      status: "active",
      createdBy: "Système",
      createdDate: "2024-01-01",
      lastModified: "2024-01-01",
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
      executionCount: 0,
      averageExecutionTime: 0,
      successRate: 0,
      isTemplate: true,
      tags: ["Contrats", "Validation", "Juridique"],
      complexity: "complex"
    },
    {
      id: 103,
      name: "Suivi des Leads",
      description: "Automatisation du suivi des prospects",
      category: "commercial",
      status: "active",
      createdBy: "Système",
      createdDate: "2024-01-01",
      lastModified: "2024-01-01",
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
      successRate: 0,
      isTemplate: true,
      tags: ["Commercial", "Leads", "Automatisation"],
      complexity: "medium"
    },
    {
      id: 104,
      name: "Approbation des Dépenses",
      description: "Processus d'approbation des notes de frais",
      category: "finance",
      status: "active",
      createdBy: "Système",
      createdDate: "2024-01-01",
      lastModified: "2024-01-01",
      steps: [
        {
          id: "step1",
          name: "Vérification initiale",
          type: "task",
          config: {
            assignee: "Comptabilité",
            dueDate: "2 jours",
            description: "Vérifier les justificatifs et les montants"
          },
          position: { x: 100, y: 100 },
          nextSteps: ["step2"]
        },
        {
          id: "step2",
          name: "Montant élevé ?",
          type: "condition",
          config: {
            condition: "{{expense.amount}} > 1000",
            trueStep: "step3",
            falseStep: "step4"
          },
          position: { x: 300, y: 100 },
          nextSteps: ["step3", "step4"]
        },
        {
          id: "step3",
          name: "Approbation Direction",
          type: "approval",
          config: {
            approvers: ["Directeur Financier"],
            timeoutDays: 3
          },
          position: { x: 500, y: 50 },
          nextSteps: ["step5"]
        },
        {
          id: "step4",
          name: "Approbation Manager",
          type: "approval",
          config: {
            approvers: ["{{expense.employee.manager}}"],
            timeoutDays: 2
          },
          position: { x: 500, y: 150 },
          nextSteps: ["step5"]
        },
        {
          id: "step5",
          name: "Notification de décision",
          type: "notification",
          config: {
            channel: "email",
            template: "expense_decision",
            recipients: ["{{expense.employee.email}}"]
          },
          position: { x: 700, y: 100 },
          nextSteps: []
        }
      ],
      triggers: [
        {
          id: "trigger1",
          type: "event",
          config: {
            event: "expense.submitted",
            conditions: []
          }
        }
      ],
      executionCount: 0,
      averageExecutionTime: 0,
      successRate: 0,
      isTemplate: true,
      tags: ["Finance", "Dépenses", "Approbation"],
      complexity: "medium"
    },
    {
      id: 105,
      name: "Demande de Congés",
      description: "Processus de demande et d'approbation des congés",
      category: "hr",
      status: "active",
      createdBy: "Système",
      createdDate: "2024-01-01",
      lastModified: "2024-01-01",
      steps: [
        {
          id: "step1",
          name: "Vérification du solde",
          type: "condition",
          config: {
            condition: "{{employee.leaveBalance}} >= {{leave.days}}",
            trueStep: "step2",
            falseStep: "step5"
          },
          position: { x: 100, y: 100 },
          nextSteps: ["step2", "step5"]
        },
        {
          id: "step2",
          name: "Approbation Manager",
          type: "approval",
          config: {
            approvers: ["{{employee.manager}}"],
            timeoutDays: 3
          },
          position: { x: 300, y: 50 },
          nextSteps: ["step3"]
        },
        {
          id: "step3",
          name: "Mise à jour du calendrier",
          type: "task",
          config: {
            assignee: "RH",
            dueDate: "1 jour",
            description: "Mettre à jour le calendrier des absences"
          },
          position: { x: 500, y: 50 },
          nextSteps: ["step4"]
        },
        {
          id: "step4",
          name: "Notification d'approbation",
          type: "notification",
          config: {
            channel: "email",
            template: "leave_approved",
            recipients: ["{{employee.email}}"]
          },
          position: { x: 700, y: 50 },
          nextSteps: []
        },
        {
          id: "step5",
          name: "Notification de refus",
          type: "notification",
          config: {
            channel: "email",
            template: "leave_rejected",
            recipients: ["{{employee.email}}"]
          },
          position: { x: 300, y: 150 },
          nextSteps: []
        }
      ],
      triggers: [
        {
          id: "trigger1",
          type: "event",
          config: {
            event: "leave.requested",
            conditions: []
          }
        }
      ],
      executionCount: 0,
      averageExecutionTime: 0,
      successRate: 0,
      isTemplate: true,
      tags: ["RH", "Congés", "Approbation"],
      complexity: "simple"
    }
  ];

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

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'complex': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityText = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'Simple';
      case 'medium': return 'Intermédiaire';
      case 'complex': return 'Complexe';
      default: return complexity;
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !filterCategory || template.category === filterCategory;
    const matchesComplexity = !filterComplexity || template.complexity === filterComplexity;
    
    return matchesSearch && matchesCategory && matchesComplexity;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 animate-gradient-x"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Bibliothèque de Modèles</h1>
                <p className="text-white/80">Sélectionnez un modèle pour créer rapidement un workflow</p>
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

        <div className="p-6">
          {/* Search and Filters */}
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
                <option value="hr">RH</option>
                <option value="commercial">Commercial</option>
                <option value="admin">Administration</option>
                <option value="finance">Finance</option>
                <option value="other">Autre</option>
              </select>

              <select
                value={filterComplexity}
                onChange={(e) => setFilterComplexity(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tous les niveaux</option>
                <option value="simple">Simple</option>
                <option value="medium">Intermédiaire</option>
                <option value="complex">Complexe</option>
              </select>
            </div>
          </div>

          {/* Templates Grid */}
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Aucun modèle trouvé</h3>
              <p className="text-slate-500 mb-6">Essayez de modifier vos critères de recherche</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('');
                  setFilterComplexity('');
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div 
                  key={template.id} 
                  className="bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-slate-900">{template.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(template.category)}`}>
                        {getCategoryText(template.category)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">{template.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.tags?.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center">
                        <Workflow className="w-3 h-3 mr-1" />
                        {template.steps.length} étapes
                      </div>
                      <span className={`px-2 py-1 rounded ${getComplexityColor(template.complexity || '')}`}>
                        {getComplexityText(template.complexity || '')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t border-slate-200 p-3 bg-slate-50 rounded-b-lg">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTemplate(template);
                      }}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Utiliser ce modèle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Template Details Modal */}
        {selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Workflow className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">{selectedTemplate.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(selectedTemplate.category)}`}>
                          {getCategoryText(selectedTemplate.category)}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getComplexityColor(selectedTemplate.complexity || '')}`}>
                          {getComplexityText(selectedTemplate.complexity || '')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedTemplate(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-2">Description</h4>
                  <p className="text-slate-700">{selectedTemplate.description}</p>
                </div>

                <div>
                  <h4 className="font-medium text-slate-900 mb-3">Déclencheurs</h4>
                  <div className="space-y-3">
                    {selectedTemplate.triggers.map((trigger) => (
                      <div key={trigger.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="bg-blue-100 p-1 rounded mr-2">
                              {trigger.type === 'manual' && <Play className="w-4 h-4 text-blue-600" />}
                              {trigger.type === 'scheduled' && <Clock className="w-4 h-4 text-blue-600" />}
                              {trigger.type === 'event' && <Zap className="w-4 h-4 text-blue-600" />}
                              {trigger.type === 'form' && <FileText className="w-4 h-4 text-blue-600" />}
                              {trigger.type === 'api' && <Settings className="w-4 h-4 text-blue-600" />}
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
                    {selectedTemplate.steps.map((step, index) => (
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
                              const nextStep = selectedTemplate.steps.find(s => s.id === nextId);
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
                    onClick={() => setSelectedTemplate(null)}
                    className="flex-1 bg-slate-100 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={() => onSelectTemplate(selectedTemplate)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Utiliser ce modèle
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowTemplateLibrary;