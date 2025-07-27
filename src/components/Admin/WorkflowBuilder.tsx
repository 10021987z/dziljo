import React, { useState } from 'react';
import { X, Plus, Save, Workflow, ArrowRight, Settings, Trash2, Edit, Copy } from 'lucide-react';
import { useFirebaseCollection } from '../../hooks/useFirebase';

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

interface WorkflowDefinition {
  id?: number;
  name: string;
  description: string;
  category: 'hr' | 'commercial' | 'admin' | 'finance' | 'other';
  status: 'active' | 'draft' | 'paused' | 'archived';
  steps: WorkflowStep[];
  triggers: WorkflowTrigger[];
}

interface WorkflowBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workflowData: WorkflowDefinition) => void;
  initialData?: WorkflowDefinition;
  isEditing?: boolean;
}

const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isEditing = false
}) => {
  const [workflow, setWorkflow] = useState<WorkflowDefinition>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    category: initialData?.category || 'admin',
    status: initialData?.status || 'draft',
    steps: initialData?.steps || [],
    triggers: initialData?.triggers || []
  });

  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
  const [showStepModal, setShowStepModal] = useState(false);
  const [showTriggerModal, setShowTriggerModal] = useState(false);

  const { create: saveWorkflow } = useFirebaseCollection('workflows');

  const stepTypes = [
    { id: 'task', name: 'Tâche', description: 'Assigner une tâche à un utilisateur' },
    { id: 'approval', name: 'Approbation', description: 'Demander une approbation' },
    { id: 'notification', name: 'Notification', description: 'Envoyer une notification' },
    { id: 'condition', name: 'Condition', description: 'Branchement conditionnel' },
    { id: 'delay', name: 'Délai', description: 'Attendre un délai' },
    { id: 'integration', name: 'Intégration', description: 'Appeler un service externe' },
    { id: 'document', name: 'Document', description: 'Générer un document' }
  ];

  const triggerTypes = [
    { id: 'manual', name: 'Manuel', description: 'Déclenchement manuel' },
    { id: 'scheduled', name: 'Planifié', description: 'Déclenchement programmé' },
    { id: 'event', name: 'Événement', description: 'Déclenchement par événement' },
    { id: 'form', name: 'Formulaire', description: 'Soumission de formulaire' },
    { id: 'api', name: 'API', description: 'Appel API externe' }
  ];

  const handleAddStep = (stepType: string) => {
    const newStep: WorkflowStep = {
      id: `step_${Date.now()}`,
      name: `Nouvelle ${stepTypes.find(t => t.id === stepType)?.name}`,
      type: stepType as any,
      config: {},
      position: { x: 100 + workflow.steps.length * 200, y: 100 },
      nextSteps: []
    };

    setWorkflow(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
  };

  const handleAddTrigger = (triggerType: string) => {
    const newTrigger: WorkflowTrigger = {
      id: `trigger_${Date.now()}`,
      type: triggerType as any,
      config: {}
    };

    setWorkflow(prev => ({
      ...prev,
      triggers: [...prev.triggers, newTrigger]
    }));
    setShowTriggerModal(false);
  };

  const handleSave = async () => {
    try {
      const workflowData = {
        ...workflow,
        id: initialData?.id,
        createdAt: initialData?.id ? undefined : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (isEditing) {
        // Update existing workflow
        onSave(workflowData);
      } else {
        // Create new workflow
        await saveWorkflow(workflowData);
        onSave(workflowData);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Workflow className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {isEditing ? 'Modifier le Workflow' : 'Créateur de Workflow'}
                </h1>
                <p className="text-white/80">Concevez votre processus métier</p>
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
        <div className="flex h-[70vh]">
          {/* Left Panel - Configuration */}
          <div className="w-1/3 border-r border-slate-200 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="font-medium text-slate-900 mb-4">Informations de Base</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nom du workflow</label>
                    <input
                      type="text"
                      value={workflow.name}
                      onChange={(e) => setWorkflow(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nom du workflow"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                    <textarea
                      value={workflow.description}
                      onChange={(e) => setWorkflow(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Description du workflow"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie</label>
                    <select
                      value={workflow.category}
                      onChange={(e) => setWorkflow(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="hr">RH</option>
                      <option value="commercial">Commercial</option>
                      <option value="admin">Administration</option>
                      <option value="finance">Finance</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Triggers */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-slate-900">Déclencheurs</h3>
                  <button
                    onClick={() => setShowTriggerModal(true)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4 inline mr-1" />
                    Ajouter
                  </button>
                </div>

                <div className="space-y-2">
                  {workflow.triggers.map((trigger) => (
                    <div key={trigger.id} className="p-3 bg-slate-50 rounded-lg border">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-900 capitalize">
                          {triggerTypes.find(t => t.id === trigger.type)?.name}
                        </span>
                        <button
                          onClick={() => setWorkflow(prev => ({
                            ...prev,
                            triggers: prev.triggers.filter(t => t.id !== trigger.id)
                          }))}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Types */}
              <div>
                <h3 className="font-medium text-slate-900 mb-4">Types d'Étapes</h3>
                <div className="space-y-2">
                  {stepTypes.map((stepType) => (
                    <button
                      key={stepType.id}
                      onClick={() => handleAddStep(stepType.id)}
                      className="w-full p-3 text-left bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                    >
                      <div className="font-medium text-slate-900">{stepType.name}</div>
                      <div className="text-sm text-slate-600">{stepType.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Visual Builder */}
          <div className="flex-1 p-6 bg-slate-50">
            <div className="h-full bg-white rounded-lg border border-slate-200 p-4 relative overflow-auto">
              <h3 className="font-medium text-slate-900 mb-4">Diagramme du Workflow</h3>
              
              {workflow.steps.length === 0 ? (
                <div className="flex items-center justify-center h-full text-slate-500">
                  <div className="text-center">
                    <Workflow className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                    <p>Ajoutez des étapes pour commencer à construire votre workflow</p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {workflow.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="absolute bg-white border-2 border-blue-200 rounded-lg p-4 cursor-pointer hover:border-blue-400 transition-colors"
                      style={{
                        left: step.position.x,
                        top: step.position.y,
                        width: '180px'
                      }}
                      onClick={() => setSelectedStep(step)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-slate-900 text-sm">{step.name}</h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setWorkflow(prev => ({
                              ...prev,
                              steps: prev.steps.filter(s => s.id !== step.id)
                            }));
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-xs text-slate-600 capitalize">{step.type}</div>
                      
                      {/* Connection points */}
                      {index < workflow.steps.length - 1 && (
                        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                          <ArrowRight className="w-4 h-4 text-blue-500" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4">
          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={!workflow.name || !workflow.description}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? 'Mettre à jour' : 'Créer le Workflow'}
            </button>
          </div>
        </div>

        {/* Trigger Modal */}
        {showTriggerModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Ajouter un Déclencheur</h3>
                <button
                  onClick={() => setShowTriggerModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {triggerTypes.map((trigger) => (
                  <button
                    key={trigger.id}
                    onClick={() => handleAddTrigger(trigger.id)}
                    className="w-full p-3 text-left bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                  >
                    <div className="font-medium text-slate-900">{trigger.name}</div>
                    <div className="text-sm text-slate-600">{trigger.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowBuilder;