import React, { useState, useRef, useEffect } from 'react';
import { 
  Workflow, Save, X, Plus, Trash2, Settings, ArrowRight, 
  Check, AlertTriangle, Play, Pause, Copy, FileText, Users, 
  Calendar, Mail, CheckCircle, Clock, Database, Layers, Zap,
  ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Edit
} from 'lucide-react';
import { useDrag, useDrop } from 'react-dnd';

interface WorkflowBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workflowData: any) => void;
  initialData?: any;
  isEditing?: boolean;
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

interface Connection {
  source: string;
  target: string;
}

const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isEditing = false
}) => {
  const [activeTab, setActiveTab] = useState('design');
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [workflowCategory, setWorkflowCategory] = useState('');
  const [workflowStatus, setWorkflowStatus] = useState('draft');
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [triggers, setTriggers] = useState<WorkflowTrigger[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  
  // Initialize with initial data if provided
  useEffect(() => {
    if (initialData) {
      setWorkflowName(initialData.name || '');
      setWorkflowDescription(initialData.description || '');
      setWorkflowCategory(initialData.category || '');
      setWorkflowStatus(initialData.status || 'draft');
      setSteps(initialData.steps || []);
      setTriggers(initialData.triggers || []);
      
      // Create connections from steps
      const newConnections: Connection[] = [];
      initialData.steps.forEach((step: WorkflowStep) => {
        step.nextSteps.forEach((nextStepId: string) => {
          newConnections.push({
            source: step.id,
            target: nextStepId
          });
        });
      });
      setConnections(newConnections);
    } else {
      // Default trigger for new workflow
      setTriggers([
        {
          id: `trigger_${Date.now()}`,
          type: 'manual',
          config: {
            roles: ['admin']
          }
        }
      ]);
    }
  }, [initialData]);
  
  // Handle canvas panning
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 1 || (e.button === 0 && e.altKey)) { // Middle mouse button or Alt+Left click
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        setCanvasOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)));
      }
    };
    
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [isDragging, dragStart]);
  
  const addStep = (type: WorkflowStep['type']) => {
    const newStep: WorkflowStep = {
      id: `step_${Date.now()}`,
      name: `Nouvelle étape ${steps.length + 1}`,
      type,
      config: getDefaultConfig(type),
      position: { x: 200, y: 200 },
      nextSteps: []
    };
    
    setSteps([...steps, newStep]);
    setSelectedStep(newStep.id);
  };
  
  const getDefaultConfig = (type: WorkflowStep['type']) => {
    switch (type) {
      case 'approval':
        return {
          approvers: [],
          timeoutDays: 3
        };
      case 'notification':
        return {
          channel: 'email',
          template: '',
          recipients: []
        };
      case 'task':
        return {
          assignee: '',
          dueDate: '3 jours',
          description: ''
        };
      case 'condition':
        return {
          condition: '',
          trueStep: '',
          falseStep: ''
        };
      case 'delay':
        return {
          duration: 1,
          unit: 'days'
        };
      case 'integration':
        return {
          service: '',
          action: '',
          parameters: {}
        };
      case 'document':
        return {
          template: '',
          outputFormat: 'pdf'
        };
      default:
        return {};
    }
  };
  
  const updateStep = (id: string, updates: Partial<WorkflowStep>) => {
    setSteps(prev => prev.map(step => 
      step.id === id ? { ...step, ...updates } : step
    ));
  };
  
  const removeStep = (id: string) => {
    setSteps(prev => prev.filter(step => step.id !== id));
    setConnections(prev => prev.filter(conn => conn.source !== id && conn.target !== id));
    if (selectedStep === id) {
      setSelectedStep(null);
    }
  };
  
  const updateTrigger = (id: string, updates: Partial<WorkflowTrigger>) => {
    setTriggers(prev => prev.map(trigger => 
      trigger.id === id ? { ...trigger, ...updates } : trigger
    ));
  };
  
  const addConnection = (source: string, target: string) => {
    // Check if connection already exists
    if (connections.some(conn => conn.source === source && conn.target === target)) {
      return;
    }
    
    setConnections([...connections, { source, target }]);
    
    // Update the source step's nextSteps array
    setSteps(prev => prev.map(step => 
      step.id === source 
        ? { ...step, nextSteps: [...step.nextSteps, target] } 
        : step
    ));
  };
  
  const removeConnection = (source: string, target: string) => {
    setConnections(prev => prev.filter(conn => !(conn.source === source && conn.target === target)));
    
    // Update the source step's nextSteps array
    setSteps(prev => prev.map(step => 
      step.id === source 
        ? { ...step, nextSteps: step.nextSteps.filter(id => id !== target) } 
        : step
    ));
  };
  
  const validateWorkflow = () => {
    const errors: string[] = [];
    
    if (!workflowName) {
      errors.push('Le nom du workflow est requis');
    }
    
    if (!workflowCategory) {
      errors.push('La catégorie du workflow est requise');
    }
    
    if (steps.length === 0) {
      errors.push('Le workflow doit contenir au moins une étape');
    }
    
    if (triggers.length === 0) {
      errors.push('Le workflow doit avoir au moins un déclencheur');
    }
    
    // Check for orphaned steps (no incoming connections except for the first step)
    const connectedStepIds = new Set<string>();
    connections.forEach(conn => {
      connectedStepIds.add(conn.target);
    });
    
    const orphanedSteps = steps.filter(step => 
      !connectedStepIds.has(step.id) && steps.indexOf(step) !== 0
    );
    
    if (orphanedSteps.length > 0 && steps.length > 1) {
      errors.push(`Il y a ${orphanedSteps.length} étape(s) non connectée(s)`);
    }
    
    setErrors(errors);
    return errors.length === 0;
  };
  
  const handleSave = () => {
    if (!validateWorkflow()) return;
    
    setIsSubmitting(true);
    
    // Prepare workflow data
    const workflowData = {
      id: initialData?.id || Date.now(),
      name: workflowName,
      description: workflowDescription,
      category: workflowCategory,
      status: workflowStatus,
      steps,
      triggers,
      createdBy: initialData?.createdBy || 'Current User',
      createdDate: initialData?.createdDate || new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      executionCount: initialData?.executionCount || 0,
      averageExecutionTime: initialData?.averageExecutionTime || 0,
      successRate: initialData?.successRate || 0
    };
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessMessage(true);
      
      setTimeout(() => {
        onSave(workflowData);
        setShowSuccessMessage(false);
      }, 1500);
    }, 1000);
  };
  
  const getStepIcon = (type: string) => {
    switch (type) {
      case 'approval': return <CheckCircle className="w-5 h-5" />;
      case 'notification': return <Mail className="w-5 h-5" />;
      case 'task': return <FileText className="w-5 h-5" />;
      case 'condition': return <ArrowRight className="w-5 h-5" />;
      case 'delay': return <Clock className="w-5 h-5" />;
      case 'integration': return <Zap className="w-5 h-5" />;
      case 'document': return <FileText className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
    }
  };
  
  const getStepColor = (type: string) => {
    switch (type) {
      case 'approval': return 'bg-green-100 text-green-600 border-green-200';
      case 'notification': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'task': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'condition': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'delay': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'integration': return 'bg-indigo-100 text-indigo-600 border-indigo-200';
      case 'document': return 'bg-pink-100 text-pink-600 border-pink-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };
  
  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'manual': return <Play className="w-5 h-5" />;
      case 'scheduled': return <Clock className="w-5 h-5" />;
      case 'event': return <Zap className="w-5 h-5" />;
      case 'form': return <FileText className="w-5 h-5" />;
      case 'api': return <Database className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
    }
  };
  
  const getTriggerColor = (type: string) => {
    switch (type) {
      case 'manual': return 'bg-green-100 text-green-600 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'event': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'form': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'api': return 'bg-indigo-100 text-indigo-600 border-indigo-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };
  
  // This is a simplified placeholder for the actual workflow builder
  // In a real implementation, you would have a canvas with draggable nodes and connections
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 animate-gradient-x"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Workflow className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{isEditing ? 'Modifier le Workflow' : 'Créer un Workflow'}</h1>
                <p className="text-white/80">Concevez et automatisez vos processus métier</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mt-6 relative z-10">
            {[
              { id: 'design', name: 'Conception' },
              { id: 'settings', name: 'Paramètres' },
              { id: 'preview', name: 'Aperçu' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-700'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-0 overflow-hidden max-h-[calc(90vh-150px)]">
          {errors.length > 0 && (
            <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <h4 className="font-medium text-red-900">Erreurs</h4>
              </div>
              <ul className="list-disc list-inside text-sm text-red-700">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {showSuccessMessage ? (
            <div className="flex items-center justify-center h-[calc(90vh-150px)]">
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {isEditing ? 'Workflow Mis à Jour !' : 'Workflow Créé avec Succès !'}
                </h2>
                <p className="text-slate-600 mb-6">
                  {isEditing 
                    ? 'Les modifications ont été enregistrées.' 
                    : 'Votre nouveau workflow est maintenant disponible.'}
                </p>
              </div>
            </div>
          ) : isSubmitting ? (
            <div className="flex items-center justify-center h-[calc(90vh-150px)]">
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-6"></div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  {isEditing ? 'Mise à jour en cours...' : 'Création en cours...'}
                </h2>
                <p className="text-slate-600">Nous enregistrons votre workflow</p>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'design' && (
                <div className="flex h-[calc(90vh-150px)]">
                  {/* Toolbox */}
                  <div className="w-64 bg-slate-50 border-r border-slate-200 p-4 overflow-y-auto">
                    <h3 className="font-medium text-slate-900 mb-3">Éléments</h3>
                    
                    <div className="space-y-2 mb-6">
                      <div className="font-medium text-sm text-slate-700 mb-1">Déclencheurs</div>
                      {['manual', 'scheduled', 'event', 'form', 'api'].map((type) => (
                        <div 
                          key={type}
                          className={`flex items-center p-2 rounded-lg border ${getTriggerColor(type)} cursor-pointer hover:shadow-md transition-shadow`}
                          onClick={() => {
                            if (triggers.length === 0) {
                              setTriggers([{
                                id: `trigger_${Date.now()}`,
                                type: type as WorkflowTrigger['type'],
                                config: {}
                              }]);
                            }
                          }}
                        >
                          <div className="mr-2">
                            {getTriggerIcon(type)}
                          </div>
                          <span className="capitalize">{type}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="font-medium text-sm text-slate-700 mb-1">Étapes</div>
                      {['approval', 'notification', 'task', 'condition', 'delay', 'integration', 'document'].map((type) => (
                        <div 
                          key={type}
                          className={`flex items-center p-2 rounded-lg border ${getStepColor(type)} cursor-pointer hover:shadow-md transition-shadow`}
                          onClick={() => addStep(type as WorkflowStep['type'])}
                        >
                          <div className="mr-2">
                            {getStepIcon(type)}
                          </div>
                          <span className="capitalize">{type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Canvas */}
                  <div className="flex-1 relative overflow-hidden bg-slate-100" ref={canvasRef}>
                    <div 
                      className="absolute inset-0 grid grid-cols-[repeat(50,20px)] grid-rows-[repeat(50,20px)] opacity-30"
                      style={{
                        transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoom})`,
                        transformOrigin: '0 0'
                      }}
                    >
                      {Array.from({ length: 50 }).map((_, rowIndex) => (
                        Array.from({ length: 50 }).map((_, colIndex) => (
                          <div 
                            key={`${rowIndex}-${colIndex}`}
                            className="w-full h-full border-r border-b border-slate-200"
                          />
                        ))
                      ))}
                    </div>
                    
                    <div 
                      className="absolute inset-0"
                      style={{
                        transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoom})`,
                        transformOrigin: '0 0'
                      }}
                    >
                      {/* Render triggers */}
                      {triggers.map((trigger) => (
                        <div
                          key={trigger.id}
                          className={`absolute p-3 rounded-lg border-2 ${
                            selectedTrigger === trigger.id ? 'ring-2 ring-blue-500' : ''
                          } ${getTriggerColor(trigger.type)} cursor-pointer`}
                          style={{ left: '100px', top: '100px', width: '200px' }}
                          onClick={() => {
                            setSelectedTrigger(trigger.id);
                            setSelectedStep(null);
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              {getTriggerIcon(trigger.type)}
                              <span className="ml-2 font-medium capitalize">{trigger.type}</span>
                            </div>
                            <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Déclencheur
                            </div>
                          </div>
                          <div className="text-sm">
                            {trigger.type === 'manual' && 'Démarrage manuel'}
                            {trigger.type === 'scheduled' && 'Planifié'}
                            {trigger.type === 'event' && 'Sur événement'}
                            {trigger.type === 'form' && 'Soumission de formulaire'}
                            {trigger.type === 'api' && 'Appel API'}
                          </div>
                        </div>
                      ))}
                      
                      {/* Render steps */}
                      {steps.map((step) => (
                        <div
                          key={step.id}
                          className={`absolute p-3 rounded-lg border-2 ${
                            selectedStep === step.id ? 'ring-2 ring-blue-500' : ''
                          } ${getStepColor(step.type)} cursor-move`}
                          style={{ 
                            left: `${step.position.x}px`, 
                            top: `${step.position.y}px`,
                            width: '200px'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStep(step.id);
                            setSelectedTrigger(null);
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              {getStepIcon(step.type)}
                              <span className="ml-2 font-medium">{step.name}</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeStep(step.id);
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded mb-2 capitalize">
                            {step.type}
                          </div>
                          <div className="text-sm">
                            {step.type === 'approval' && `Approbateurs: ${step.config.approvers?.join(', ') || 'Non défini'}`}
                            {step.type === 'notification' && `Canal: ${step.config.channel || 'Non défini'}`}
                            {step.type === 'task' && `Assigné à: ${step.config.assignee || 'Non défini'}`}
                            {step.type === 'condition' && `Condition: ${step.config.condition || 'Non définie'}`}
                            {step.type === 'delay' && `Délai: ${step.config.duration || '0'} ${step.config.unit || 'jours'}`}
                            {step.type === 'integration' && `Service: ${step.config.service || 'Non défini'}`}
                            {step.type === 'document' && `Template: ${step.config.template || 'Non défini'}`}
                          </div>
                        </div>
                      ))}
                      
                      {/* Render connections */}
                      {connections.map((connection, index) => {
                        const sourceStep = steps.find(step => step.id === connection.source);
                        const targetStep = steps.find(step => step.id === connection.target);
                        
                        if (!sourceStep || !targetStep) return null;
                        
                        const sourceX = sourceStep.position.x + 200; // Right side of source
                        const sourceY = sourceStep.position.y + 50; // Middle of source
                        const targetX = targetStep.position.x; // Left side of target
                        const targetY = targetStep.position.y + 50; // Middle of target
                        
                        // Simple straight line for now
                        return (
                          <svg
                            key={index}
                            className="absolute top-0 left-0 w-full h-full pointer-events-none"
                            style={{ zIndex: -1 }}
                          >
                            <line
                              x1={sourceX}
                              y1={sourceY}
                              x2={targetX}
                              y2={targetY}
                              stroke="#94a3b8"
                              strokeWidth="2"
                              markerEnd="url(#arrowhead)"
                            />
                            <defs>
                              <marker
                                id="arrowhead"
                                markerWidth="10"
                                markerHeight="7"
                                refX="0"
                                refY="3.5"
                                orient="auto"
                              >
                                <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                              </marker>
                            </defs>
                          </svg>
                        );
                      })}
                    </div>
                    
                    {/* Canvas controls */}
                    <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-2 flex space-x-2">
                      <button
                        onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
                        className="p-1 text-slate-600 hover:text-slate-900"
                      >
                        -
                      </button>
                      <span className="text-sm text-slate-600">{Math.round(zoom * 100)}%</span>
                      <button
                        onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
                        className="p-1 text-slate-600 hover:text-slate-900"
                      >
                        +
                      </button>
                      <button
                        onClick={() => {
                          setCanvasOffset({ x: 0, y: 0 });
                          setZoom(1);
                        }}
                        className="p-1 text-slate-600 hover:text-slate-900 text-xs"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                  
                  {/* Properties Panel */}
                  <div className="w-80 bg-slate-50 border-l border-slate-200 p-4 overflow-y-auto">
                    {selectedStep && (
                      <div className="space-y-4">
                        <h3 className="font-medium text-slate-900">Propriétés de l'Étape</h3>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Nom
                          </label>
                          <input
                            type="text"
                            value={steps.find(s => s.id === selectedStep)?.name || ''}
                            onChange={(e) => updateStep(selectedStep, { name: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Type
                          </label>
                          <div className="text-sm bg-slate-200 text-slate-800 px-3 py-2 rounded-lg capitalize">
                            {steps.find(s => s.id === selectedStep)?.type}
                          </div>
                        </div>
                        
                        {/* Render different config fields based on step type */}
                        {(() => {
                          const step = steps.find(s => s.id === selectedStep);
                          if (!step) return null;
                          
                          switch (step.type) {
                            case 'approval':
                              return (
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Approbateurs
                                  </label>
                                  <input
                                    type="text"
                                    value={step.config.approvers?.join(', ') || ''}
                                    onChange={(e) => updateStep(selectedStep, { 
                                      config: { 
                                        ...step.config, 
                                        approvers: e.target.value.split(',').map(s => s.trim()) 
                                      } 
                                    })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Séparés par des virgules"
                                  />
                                  
                                  <label className="block text-sm font-medium text-slate-700 mt-4 mb-2">
                                    Délai (jours)
                                  </label>
                                  <input
                                    type="number"
                                    value={step.config.timeoutDays || 3}
                                    onChange={(e) => updateStep(selectedStep, { 
                                      config: { 
                                        ...step.config, 
                                        timeoutDays: parseInt(e.target.value) 
                                      } 
                                    })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>
                              );
                            
                            case 'notification':
                              return (
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Canal
                                  </label>
                                  <select
                                    value={step.config.channel || 'email'}
                                    onChange={(e) => updateStep(selectedStep, { 
                                      config: { 
                                        ...step.config, 
                                        channel: e.target.value 
                                      } 
                                    })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  >
                                    <option value="email">Email</option>
                                    <option value="sms">SMS</option>
                                    <option value="push">Notification Push</option>
                                    <option value="slack">Slack</option>
                                  </select>
                                  
                                  <label className="block text-sm font-medium text-slate-700 mt-4 mb-2">
                                    Template
                                  </label>
                                  <input
                                    type="text"
                                    value={step.config.template || ''}
                                    onChange={(e) => updateStep(selectedStep, { 
                                      config: { 
                                        ...step.config, 
                                        template: e.target.value 
                                      } 
                                    })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                  
                                  <label className="block text-sm font-medium text-slate-700 mt-4 mb-2">
                                    Destinataires
                                  </label>
                                  <input
                                    type="text"
                                    value={step.config.recipients?.join(', ') || ''}
                                    onChange={(e) => updateStep(selectedStep, { 
                                      config: { 
                                        ...step.config, 
                                        recipients: e.target.value.split(',').map(s => s.trim()) 
                                      } 
                                    })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Séparés par des virgules"
                                  />
                                </div>
                              );
                            
                            case 'task':
                              return (
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Assigné à
                                  </label>
                                  <input
                                    type="text"
                                    value={step.config.assignee || ''}
                                    onChange={(e) => updateStep(selectedStep, { 
                                      config: { 
                                        ...step.config, 
                                        assignee: e.target.value 
                                      } 
                                    })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                  
                                  <label className="block text-sm font-medium text-slate-700 mt-4 mb-2">
                                    Échéance
                                  </label>
                                  <input
                                    type="text"
                                    value={step.config.dueDate || ''}
                                    onChange={(e) => updateStep(selectedStep, { 
                                      config: { 
                                        ...step.config, 
                                        dueDate: e.target.value 
                                      } 
                                    })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ex: 3 jours, 1 semaine"
                                  />
                                  
                                  <label className="block text-sm font-medium text-slate-700 mt-4 mb-2">
                                    Description
                                  </label>
                                  <textarea
                                    value={step.config.description || ''}
                                    onChange={(e) => updateStep(selectedStep, { 
                                      config: { 
                                        ...step.config, 
                                        description: e.target.value 
                                      } 
                                    })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>
                              );
                            
                            // Add more cases for other step types
                            
                            default:
                              return (
                                <div className="text-sm text-slate-600">
                                  Configuration non disponible pour ce type d'étape.
                                </div>
                              );
                          }
                        })()}
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Position
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs text-slate-500 mb-1">X</label>
                              <input
                                type="number"
                                value={steps.find(s => s.id === selectedStep)?.position.x || 0}
                                onChange={(e) => {
                                  const step = steps.find(s => s.id === selectedStep);
                                  if (step) {
                                    updateStep(selectedStep, { 
                                      position: { 
                                        ...step.position, 
                                        x: parseInt(e.target.value) 
                                      } 
                                    });
                                  }
                                }}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-slate-500 mb-1">Y</label>
                              <input
                                type="number"
                                value={steps.find(s => s.id === selectedStep)?.position.y || 0}
                                onChange={(e) => {
                                  const step = steps.find(s => s.id === selectedStep);
                                  if (step) {
                                    updateStep(selectedStep, { 
                                      position: { 
                                        ...step.position, 
                                        y: parseInt(e.target.value) 
                                      } 
                                    });
                                  }
                                }}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Étapes Suivantes
                          </label>
                          <div className="space-y-2">
                            {steps.find(s => s.id === selectedStep)?.nextSteps.map((nextStepId, index) => {
                              const nextStep = steps.find(s => s.id === nextStepId);
                              return (
                                <div key={index} className="flex items-center justify-between bg-slate-100 p-2 rounded">
                                  <span className="text-sm">{nextStep?.name || nextStepId}</span>
                                  <button
                                    onClick={() => removeConnection(selectedStep, nextStepId)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              );
                            })}
                            
                            <div>
                              <select
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onChange={(e) => {
                                  if (e.target.value) {
                                    addConnection(selectedStep, e.target.value);
                                    e.target.value = '';
                                  }
                                }}
                                value=""
                              >
                                <option value="">Ajouter une étape suivante</option>
                                {steps
                                  .filter(s => s.id !== selectedStep && !steps.find(step => step.id === selectedStep)?.nextSteps.includes(s.id))
                                  .map(step => (
                                    <option key={step.id} value={step.id}>{step.name}</option>
                                  ))
                                }
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {selectedTrigger && (
                      <div className="space-y-4">
                        <h3 className="font-medium text-slate-900">Propriétés du Déclencheur</h3>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Type
                          </label>
                          <select
                            value={triggers.find(t => t.id === selectedTrigger)?.type || 'manual'}
                            onChange={(e) => updateTrigger(selectedTrigger, { type: e.target.value as WorkflowTrigger['type'] })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="manual">Manuel</option>
                            <option value="scheduled">Planifié</option>
                            <option value="event">Événement</option>
                            <option value="form">Formulaire</option>
                            <option value="api">API</option>
                          </select>
                        </div>
                        
                        {/* Render different config fields based on trigger type */}
                        {(() => {
                          const trigger = triggers.find(t => t.id === selectedTrigger);
                          if (!trigger) return null;
                          
                          switch (trigger.type) {
                            case 'manual':
                              return (
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Rôles Autorisés
                                  </label>
                                  <input
                                    type="text"
                                    value={trigger.config.roles?.join(', ') || ''}
                                    onChange={(e) => updateTrigger(selectedTrigger, { 
                                      config: { 
                                        ...trigger.config, 
                                        roles: e.target.value.split(',').map(s => s.trim()) 
                                      } 
                                    })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Séparés par des virgules"
                                  />
                                </div>
                              );
                            
                            case 'scheduled':
                              return (
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Planification (Cron)
                                  </label>
                                  <input
                                    type="text"
                                    value={trigger.config.schedule || ''}
                                    onChange={(e) => updateTrigger(selectedTrigger, { 
                                      config: { 
                                        ...trigger.config, 
                                        schedule: e.target.value 
                                      } 
                                    })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ex: 0 9 * * 1-5"
                                  />
                                  <p className="mt-1 text-xs text-slate-500">
                                    Format: minute heure jour mois jour_semaine
                                  </p>
                                </div>
                              );
                            
                            case 'event':
                              return (
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Événement
                                  </label>
                                  <input
                                    type="text"
                                    value={trigger.config.event || ''}
                                    onChange={(e) => updateTrigger(selectedTrigger, { 
                                      config: { 
                                        ...trigger.config, 
                                        event: e.target.value 
                                      } 
                                    })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ex: invoice.created"
                                  />
                                </div>
                              );
                            
                            // Add more cases for other trigger types
                            
                            default:
                              return (
                                <div className="text-sm text-slate-600">
                                  Configuration non disponible pour ce type de déclencheur.
                                </div>
                              );
                          }
                        })()}
                      </div>
                    )}
                    
                    {!selectedStep && !selectedTrigger && (
                      <div className="text-center py-8">
                        <Workflow className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">Sélectionnez un élément pour voir ses propriétés</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="p-6 overflow-y-auto h-[calc(90vh-150px)]">
                  <div className="max-w-3xl mx-auto space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Nom du Workflow <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={workflowName}
                          onChange={(e) => setWorkflowName(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ex: Processus d'Onboarding"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Catégorie <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={workflowCategory}
                          onChange={(e) => setWorkflowCategory(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Sélectionner une catégorie</option>
                          <option value="hr">RH</option>
                          <option value="commercial">Commercial</option>
                          <option value="admin">Administration</option>
                          <option value="finance">Finance</option>
                          <option value="other">Autre</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={workflowDescription}
                        onChange={(e) => setWorkflowDescription(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Description du workflow et de son objectif..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Statut
                      </label>
                      <select
                        value={workflowStatus}
                        onChange={(e) => setWorkflowStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="draft">Brouillon</option>
                        <option value="active">Actif</option>
                        <option value="paused">En pause</option>
                        <option value="archived">Archivé</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preview' && (
                <div className="p-6 overflow-y-auto h-[calc(90vh-150px)]">
                  <div className="max-w-3xl mx-auto">
                    <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">{workflowName || 'Workflow sans nom'}</h3>
                      
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center text-sm">
                          <span className="font-medium text-slate-700 w-32">Catégorie:</span>
                          <span className="text-slate-900">{workflowCategory || 'Non définie'}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="font-medium text-slate-700 w-32">Statut:</span>
                          <span className="text-slate-900 capitalize">{workflowStatus}</span>
                        </div>
                        <div className="flex items-start text-sm">
                          <span className="font-medium text-slate-700 w-32">Description:</span>
                          <span className="text-slate-900">{workflowDescription || 'Aucune description'}</span>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-medium text-slate-900 mb-3">Déclencheurs</h4>
                        <div className="space-y-3">
                          {triggers.map((trigger) => (
                            <div key={trigger.id} className={`p-3 rounded-lg border ${getTriggerColor(trigger.type)}`}>
                              <div className="flex items-center mb-2">
                                {getTriggerIcon(trigger.type)}
                                <span className="ml-2 font-medium capitalize">{trigger.type}</span>
                              </div>
                              <div className="text-sm">
                                {trigger.type === 'manual' && (
                                  <div>Déclenchement manuel par: {trigger.config.roles?.join(', ') || 'Tous les utilisateurs'}</div>
                                )}
                                {trigger.type === 'scheduled' && (
                                  <div>Planification: {trigger.config.schedule || 'Non définie'}</div>
                                )}
                                {trigger.type === 'event' && (
                                  <div>Événement: {trigger.config.event || 'Non défini'}</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-slate-900 mb-3">Étapes</h4>
                        <div className="space-y-3">
                          {steps.map((step, index) => (
                            <div key={step.id} className={`p-3 rounded-lg border ${getStepColor(step.type)}`}>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  <div className="bg-slate-200 w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs font-medium">
                                    {index + 1}
                                  </div>
                                  <span className="font-medium">{step.name}</span>
                                </div>
                                <span className="text-xs bg-slate-200 text-slate-800 px-2 py-1 rounded capitalize">
                                  {step.type}
                                </span>
                              </div>
                              <div className="text-sm mb-2">
                                {step.type === 'approval' && (
                                  <div>
                                    <div>Approbateurs: {step.config.approvers?.join(', ') || 'Non défini'}</div>
                                    <div>Délai: {step.config.timeoutDays || 3} jours</div>
                                  </div>
                                )}
                                {step.type === 'notification' && (
                                  <div>
                                    <div>Canal: {step.config.channel || 'email'}</div>
                                    <div>Template: {step.config.template || 'Non défini'}</div>
                                    <div>Destinataires: {step.config.recipients?.join(', ') || 'Non défini'}</div>
                                  </div>
                                )}
                                {step.type === 'task' && (
                                  <div>
                                    <div>Assigné à: {step.config.assignee || 'Non défini'}</div>
                                    <div>Échéance: {step.config.dueDate || 'Non définie'}</div>
                                    <div>Description: {step.config.description || 'Non définie'}</div>
                                  </div>
                                )}
                                {/* Add more cases for other step types */}
                              </div>
                              {step.nextSteps.length > 0 && (
                                <div className="text-xs text-slate-500">
                                  Étape(s) suivante(s): {step.nextSteps.map(nextId => {
                                    const nextStep = steps.find(s => s.id === nextId);
                                    return nextStep ? nextStep.name : nextId;
                                  }).join(', ')}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!isSubmitting && !showSuccessMessage && (
          <div className="bg-slate-50 border-t border-slate-200 p-4">
            <div className="flex justify-between">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Annuler
              </button>

              <div className="flex space-x-2">
                {activeTab !== 'design' && (
                  <button
                    onClick={() => {
                      const tabs = ['design', 'settings', 'preview'];
                      const currentIndex = tabs.indexOf(activeTab);
                      setActiveTab(tabs[currentIndex - 1]);
                    }}
                    className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors flex items-center"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Précédent
                  </button>
                )}

                {activeTab !== 'preview' ? (
                  <button
                    onClick={() => {
                      const tabs = ['design', 'settings', 'preview'];
                      const currentIndex = tabs.indexOf(activeTab);
                      setActiveTab(tabs[currentIndex + 1]);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    Suivant
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? 'Mettre à Jour' : 'Créer le Workflow'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowBuilder;