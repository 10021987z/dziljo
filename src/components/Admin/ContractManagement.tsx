import React, { useState } from 'react';
import { Plus, Edit, Eye, Download, Upload, Search, Filter, FileText, Clock, CheckCircle, AlertCircle, XCircle, Users, Calendar, FileSignature as Signature, Archive, Send, Copy } from 'lucide-react';
import TemplateLibrary from './TemplateLibrary';

interface ContractTemplate {
  id: number;
  name: string;
  category: string;
  description: string;
  fields: ContractField[];
  content: string;
  lastModified: string;
  usageCount: number;
  isActive: boolean;
}

interface ContractField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

interface Contract {
  id: number;
  title: string;
  templateId: number;
  templateName: string;
  clientName: string;
  clientEmail: string;
  contractType: string;
  status: 'draft' | 'pending-review' | 'pending-signature' | 'signed' | 'expired' | 'cancelled';
  value: number;
  currency: string;
  createdDate: string;
  startDate: string;
  endDate: string;
  signedDate?: string;
  expiryDate?: string;
  assignedTo: string;
  signatories: Signatory[];
  documents: ContractDocument[];
  workflow: WorkflowStep[];
  notes: string;
  tags: string[];
}

interface Signatory {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'pending' | 'signed' | 'declined';
  signedDate?: string;
  ipAddress?: string;
}

interface ContractDocument {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  version: string;
}

interface WorkflowStep {
  id: number;
  step: string;
  status: 'pending' | 'in-progress' | 'completed' | 'skipped';
  assignedTo: string;
  completedDate?: string;
  notes?: string;
}

const ContractManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('contracts');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [templates, setTemplates] = useState<ContractTemplate[]>([
    {
      id: 1,
      name: 'Contrat de Prestation de Services',
      category: 'Prestation',
      description: 'Modèle standard pour les contrats de prestation de services',
      fields: [
        { id: 'client_name', name: 'Nom du Client', type: 'text', required: true },
        { id: 'service_description', name: 'Description du Service', type: 'textarea', required: true },
        { id: 'start_date', name: 'Date de Début', type: 'date', required: true },
        { id: 'end_date', name: 'Date de Fin', type: 'date', required: true },
        { id: 'amount', name: 'Montant', type: 'number', required: true },
        { id: 'payment_terms', name: 'Conditions de Paiement', type: 'select', required: true, options: ['30 jours', '45 jours', '60 jours'] }
      ],
      content: 'Contenu du modèle de contrat...',
      lastModified: '2024-01-20',
      usageCount: 15,
      isActive: true
    },
    {
      id: 2,
      name: 'Accord de Partenariat',
      category: 'Partenariat',
      description: 'Modèle pour les accords de partenariat commercial',
      fields: [
        { id: 'partner_name', name: 'Nom du Partenaire', type: 'text', required: true },
        { id: 'partnership_type', name: 'Type de Partenariat', type: 'select', required: true, options: ['Commercial', 'Technique', 'Stratégique'] },
        { id: 'duration', name: 'Durée', type: 'text', required: true },
        { id: 'revenue_share', name: 'Partage des Revenus', type: 'text', required: false }
      ],
      content: 'Contenu du modèle d\'accord...',
      lastModified: '2024-01-18',
      usageCount: 8,
      isActive: true
    },
    {
      id: 3,
      name: 'Contrat de Maintenance',
      category: 'Maintenance',
      description: 'Contrat de maintenance et support technique',
      fields: [
        { id: 'client_name', name: 'Nom du Client', type: 'text', required: true },
        { id: 'system_description', name: 'Description du Système', type: 'textarea', required: true },
        { id: 'sla_level', name: 'Niveau de SLA', type: 'select', required: true, options: ['Bronze', 'Silver', 'Gold', 'Platinum'] },
        { id: 'monthly_fee', name: 'Tarif Mensuel', type: 'number', required: true }
      ],
      content: 'Contenu du modèle de maintenance...',
      lastModified: '2024-01-15',
      usageCount: 12,
      isActive: true
    }
  ]);

  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: 1,
      title: 'Contrat Prestation - TechCorp Solutions',
      templateId: 1,
      templateName: 'Contrat de Prestation de Services',
      clientName: 'TechCorp Solutions',
      clientEmail: 'contact@techcorp.com',
      contractType: 'Prestation',
      status: 'pending-signature',
      value: 25000,
      currency: 'EUR',
      createdDate: '2024-01-20',
      startDate: '2024-02-01',
      endDate: '2024-07-31',
      expiryDate: '2024-02-15',
      assignedTo: 'Sophie Martin',
      signatories: [
        { id: 1, name: 'Jean Dupont', email: 'j.dupont@techcorp.com', role: 'Directeur', status: 'pending' },
        { id: 2, name: 'Marie Rousseau', email: 'm.rousseau@dziljo.com', role: 'Directrice Commerciale', status: 'signed', signedDate: '2024-01-22' }
      ],
      documents: [
        { id: 1, name: 'Contrat_TechCorp_v2.pdf', type: 'PDF', size: '2.3 MB', uploadDate: '2024-01-20', version: '2.0' },
        { id: 2, name: 'Annexe_Technique.pdf', type: 'PDF', size: '1.8 MB', uploadDate: '2024-01-21', version: '1.0' }
      ],
      workflow: [
        { id: 1, step: 'Rédaction', status: 'completed', assignedTo: 'Sophie Martin', completedDate: '2024-01-20' },
        { id: 2, step: 'Révision Juridique', status: 'completed', assignedTo: 'Paul Avocat', completedDate: '2024-01-21' },
        { id: 3, step: 'Validation Client', status: 'in-progress', assignedTo: 'Jean Dupont' },
        { id: 4, step: 'Signature', status: 'pending', assignedTo: 'Jean Dupont' }
      ],
      notes: 'Contrat prioritaire - Client stratégique',
      tags: ['Priorité', 'Stratégique', 'Q1-2024']
    },
    {
      id: 2,
      title: 'Accord Partenariat - Digital Innovations',
      templateId: 2,
      templateName: 'Accord de Partenariat',
      clientName: 'Digital Innovations',
      clientEmail: 'partenariat@digital-innov.com',
      contractType: 'Partenariat',
      status: 'signed',
      value: 0,
      currency: 'EUR',
      createdDate: '2024-01-15',
      startDate: '2024-02-01',
      endDate: '2025-01-31',
      signedDate: '2024-01-25',
      assignedTo: 'Thomas Dubois',
      signatories: [
        { id: 3, name: 'Marie Rousseau', email: 'm.rousseau@digital-innov.com', role: 'CEO', status: 'signed', signedDate: '2024-01-24' },
        { id: 4, name: 'Pierre Martin', email: 'p.martin@dziljo.com', role: 'Directeur Général', status: 'signed', signedDate: '2024-01-25' }
      ],
      documents: [
        { id: 3, name: 'Accord_Partenariat_Digital.pdf', type: 'PDF', size: '3.1 MB', uploadDate: '2024-01-25', version: '1.0' }
      ],
      workflow: [
        { id: 5, step: 'Rédaction', status: 'completed', assignedTo: 'Thomas Dubois', completedDate: '2024-01-15' },
        { id: 6, step: 'Révision Juridique', status: 'completed', assignedTo: 'Paul Avocat', completedDate: '2024-01-18' },
        { id: 7, step: 'Validation Client', status: 'completed', assignedTo: 'Marie Rousseau', completedDate: '2024-01-23' },
        { id: 8, step: 'Signature', status: 'completed', assignedTo: 'Toutes parties', completedDate: '2024-01-25' }
      ],
      notes: 'Partenariat commercial réussi',
      tags: ['Partenariat', 'Commercial', 'Signé']
    },
    {
      id: 3,
      title: 'Contrat Maintenance - StartupXYZ',
      templateId: 3,
      templateName: 'Contrat de Maintenance',
      clientName: 'StartupXYZ',
      clientEmail: 'tech@startupxyz.fr',
      contractType: 'Maintenance',
      status: 'draft',
      value: 12000,
      currency: 'EUR',
      createdDate: '2024-01-25',
      startDate: '2024-03-01',
      endDate: '2025-02-28',
      assignedTo: 'Sophie Martin',
      signatories: [
        { id: 5, name: 'Pierre Martin', email: 'p.martin@startupxyz.fr', role: 'CTO', status: 'pending' }
      ],
      documents: [],
      workflow: [
        { id: 9, step: 'Rédaction', status: 'in-progress', assignedTo: 'Sophie Martin' },
        { id: 10, step: 'Révision Juridique', status: 'pending', assignedTo: 'Paul Avocat' },
        { id: 11, step: 'Validation Client', status: 'pending', assignedTo: 'Pierre Martin' },
        { id: 12, step: 'Signature', status: 'pending', assignedTo: 'Pierre Martin' }
      ],
      notes: 'En cours de rédaction - Attente spécifications techniques',
      tags: ['Maintenance', 'Startup', 'Brouillon']
    }
  ]);

  const [newContract, setNewContract] = useState({
    title: '',
    templateId: 0,
    clientName: '',
    clientEmail: '',
    value: 0,
    startDate: '',
    endDate: '',
    assignedTo: 'Sophie Martin',
    notes: '',
    tags: []
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending-review': return 'bg-yellow-100 text-yellow-800';
      case 'pending-signature': return 'bg-blue-100 text-blue-800';
      case 'signed': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'pending-review': return 'En révision';
      case 'pending-signature': return 'En attente de signature';
      case 'signed': return 'Signé';
      case 'expired': return 'Expiré';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="w-4 h-4" />;
      case 'pending-review': return <Clock className="w-4 h-4" />;
      case 'pending-signature': return <Signature className="w-4 h-4" />;
      case 'signed': return <CheckCircle className="w-4 h-4" />;
      case 'expired': return <AlertCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getWorkflowStepColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'skipped': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || contract.status === filterStatus;
    const matchesType = !filterType || contract.contractType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const contractStats = {
    total: contracts.length,
    draft: contracts.filter(c => c.status === 'draft').length,
    pendingSignature: contracts.filter(c => c.status === 'pending-signature').length,
    signed: contracts.filter(c => c.status === 'signed').length,
    totalValue: contracts.filter(c => c.status === 'signed').reduce((sum, c) => sum + c.value, 0),
    expiringThisMonth: contracts.filter(c => {
      if (!c.expiryDate) return false;
      const expiry = new Date(c.expiryDate);
      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return expiry <= nextMonth && expiry >= now;
    }).length
  };

  const handleSaveTemplate = (templateData: any) => {
    if (templateData.id) {
      // Update existing template
      setTemplates(prev => prev.map(t => t.id === templateData.id ? templateData : t));
    } else {
      // Add new template
      setTemplates(prev => [...prev, { ...templateData, id: Date.now() }]);
    }
    setShowTemplateModal(false);
  };

  // Function to send contract for signature
  const sendForSignature = (contractId: number) => {
    setContracts(prev => prev.map(contract => 
      contract.id === contractId 
        ? { ...contract, status: 'pending-signature' } 
        : contract
    ));
    
    // Show success message
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Contrat envoyé pour signature !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
    
    // Close modal
    setSelectedContract(null);
  };

  // Function to download contract as PDF
  const downloadPDF = (contractId: number) => {
    const contract = contracts.find(c => c.id === contractId);
    if (!contract) return;
    
    // Simulate PDF download
    alert(`Téléchargement du contrat "${contract.title}" en cours...`);
    
    // In a real application, this would trigger the actual PDF download
  };

  // Function to archive contract
  const archiveContract = (contractId: number) => {
    if (confirm('Êtes-vous sûr de vouloir archiver ce contrat ?')) {
      // In a real application, you might not delete but change status to archived
      setContracts(prev => prev.filter(contract => contract.id !== contractId));
      setSelectedContract(null);
      
      // Show success message
      const successElement = document.createElement('div');
      successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
      successElement.textContent = '✅ Contrat archivé avec succès !';
      document.body.appendChild(successElement);
      setTimeout(() => document.body.removeChild(successElement), 3000);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestion des Contrats</h2>
          <p className="text-slate-600">Gérez vos contrats, modèles et workflows de validation</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowTemplateLibrary(true)}
            className="bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-slate-700 transition-colors"
          >
            <FileText className="w-4 h-4 mr-2" />
            Bibliothèque de Modèles
          </button>
          <button 
            onClick={() => setShowTemplateModal(true)}
            className="bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Modèle
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Contrat
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Contrats</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{contractStats.total}</p>
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
              <p className="text-2xl font-bold text-slate-900 mt-2">{contractStats.draft}</p>
            </div>
            <div className="bg-gray-500 p-3 rounded-lg">
              <Edit className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">En Signature</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{contractStats.pendingSignature}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <Signature className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Signés</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{contractStats.signed}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Valeur Signée</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">€{contractStats.totalValue.toLocaleString()}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Expirent Bientôt</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{contractStats.expiringThisMonth}</p>
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
            { id: 'contracts', name: 'Contrats', icon: FileText },
            { id: 'templates', name: 'Modèles', icon: Copy },
            { id: 'workflow', name: 'Workflow', icon: Users },
            { id: 'signatures', name: 'Signatures', icon: Signature }
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

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher contrats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {activeTab === 'contracts' && (
              <>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tous les statuts</option>
                  <option value="draft">Brouillon</option>
                  <option value="pending-review">En révision</option>
                  <option value="pending-signature">En signature</option>
                  <option value="signed">Signé</option>
                  <option value="expired">Expiré</option>
                </select>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tous les types</option>
                  <option value="Prestation">Prestation</option>
                  <option value="Partenariat">Partenariat</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </>
            )}
          </div>
        </div>

        {activeTab === 'contracts' && (
          <div className="space-y-4">
            {filteredContracts.map((contract) => (
              <div
                key={contract.id}
                onClick={() => setSelectedContract(contract)}
                className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-slate-900">{contract.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded flex items-center ${getStatusColor(contract.status)}`}>
                        {getStatusIcon(contract.status)}
                        <span className="ml-1">{getStatusText(contract.status)}</span>
                      </span>
                      {contract.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-slate-600 mb-3">
                      <div>
                        <span className="font-medium">Client:</span> {contract.clientName}
                      </div>
                      <div>
                        <span className="font-medium">Type:</span> {contract.contractType}
                      </div>
                      <div>
                        <span className="font-medium">Valeur:</span> €{contract.value.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Assigné à:</span> {contract.assignedTo}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Créé le {contract.createdDate}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Période: {contract.startDate} - {contract.endDate}
                      </div>
                      {contract.expiryDate && (
                        <div className="flex items-center text-orange-600">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Expire le {contract.expiryDate}
                        </div>
                      )}
                    </div>

                    {/* Workflow Progress */}
                    <div className="mt-3">
                      <div className="flex items-center space-x-2">
                        {contract.workflow.map((step, index) => (
                          <div key={step.id} className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${
                              step.status === 'completed' ? 'bg-green-500' :
                              step.status === 'in-progress' ? 'bg-blue-500' :
                              'bg-gray-300'
                            }`}></div>
                            {index < contract.workflow.length - 1 && (
                              <div className={`w-8 h-0.5 ${
                                step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                              }`}></div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Étape actuelle: {contract.workflow.find(s => s.status === 'in-progress')?.step || 'Terminé'}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-green-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-purple-600 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-orange-600 transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
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
                </div>

                <div className="space-y-2 text-sm text-slate-600 mb-4">
                  <div>
                    <span className="font-medium">Champs:</span> {template.fields.length}
                  </div>
                  <div>
                    <span className="font-medium">Utilisé:</span> {template.usageCount} fois
                  </div>
                  <div>
                    <span className="font-medium">Modifié:</span> {template.lastModified}
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
        )}

        {activeTab === 'workflow' && (
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Workflow de Validation Standard</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {['Rédaction', 'Révision Juridique', 'Validation Client', 'Signature'].map((stage, index) => (
                  <div key={stage} className="text-center">
                    <div className={`h-3 rounded-full mb-2 ${
                      index === 0 ? 'bg-blue-400' :
                      index === 1 ? 'bg-yellow-400' :
                      index === 2 ? 'bg-orange-400' : 'bg-green-400'
                    }`}></div>
                    <p className="text-sm font-medium text-slate-700">{stage}</p>
                    <p className="text-lg font-bold text-slate-900 mt-1">
                      {contracts.filter(c => c.workflow.some(w => w.step.includes(stage.split(' ')[0]) && w.status === 'in-progress')).length}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">Contrats en Attente de Révision</h4>
                <div className="space-y-2">
                  {contracts.filter(c => c.status === 'pending-review').map(contract => (
                    <div key={contract.id} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                      <span className="text-sm text-slate-700">{contract.title}</span>
                      <span className="text-xs text-yellow-600">En attente</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">Contrats en Attente de Signature</h4>
                <div className="space-y-2">
                  {contracts.filter(c => c.status === 'pending-signature').map(contract => (
                    <div key={contract.id} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <span className="text-sm text-slate-700">{contract.title}</span>
                      <span className="text-xs text-blue-600">En signature</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'signatures' && (
          <div className="space-y-4">
            {contracts.filter(c => c.signatories.length > 0).map((contract) => (
              <div key={contract.id} className="p-4 border border-slate-200 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-3">{contract.title}</h4>
                <div className="space-y-2">
                  {contract.signatories.map((signatory) => (
                    <div key={signatory.id} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          signatory.status === 'signed' ? 'bg-green-500' :
                          signatory.status === 'declined' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{signatory.name}</p>
                          <p className="text-xs text-slate-600">{signatory.email} • {signatory.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          signatory.status === 'signed' ? 'bg-green-100 text-green-800' :
                          signatory.status === 'declined' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {signatory.status === 'signed' ? 'Signé' :
                           signatory.status === 'declined' ? 'Refusé' : 'En attente'}
                        </span>
                        {signatory.signedDate && (
                          <p className="text-xs text-slate-500 mt-1">Le {signatory.signedDate}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contract Details Modal */}
      {selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{selectedContract.title}</h3>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded flex items-center ${getStatusColor(selectedContract.status)}`}>
                      {getStatusIcon(selectedContract.status)}
                      <span className="ml-1">{getStatusText(selectedContract.status)}</span>
                    </span>
                    {selectedContract.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedContract(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Contract Details */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-3">Informations du Contrat</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600">Client:</span>
                        <p className="text-slate-900">{selectedContract.clientName}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Email:</span>
                        <p className="text-slate-900">{selectedContract.clientEmail}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Type:</span>
                        <p className="text-slate-900">{selectedContract.contractType}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Valeur:</span>
                        <p className="text-slate-900">€{selectedContract.value.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Début:</span>
                        <p className="text-slate-900">{selectedContract.startDate}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Fin:</span>
                        <p className="text-slate-900">{selectedContract.endDate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Workflow */}
                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Workflow de Validation</h4>
                    <div className="space-y-3">
                      {selectedContract.workflow.map((step) => (
                        <div key={step.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full ${
                              step.status === 'completed' ? 'bg-green-500' :
                              step.status === 'in-progress' ? 'bg-blue-500' :
                              'bg-gray-300'
                            }`}></div>
                            <div>
                              <p className="font-medium text-slate-900">{step.step}</p>
                              <p className="text-sm text-slate-600">Assigné à: {step.assignedTo}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${getWorkflowStepColor(step.status)}`}>
                              {step.status === 'completed' ? 'Terminé' :
                               step.status === 'in-progress' ? 'En cours' :
                               step.status === 'pending' ? 'En attente' : 'Ignoré'}
                            </span>
                            {step.completedDate && (
                              <p className="text-xs text-slate-500 mt-1">{step.completedDate}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Documents</h4>
                    <div className="space-y-2">
                      {selectedContract.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 text-slate-600 mr-3" />
                            <div>
                              <p className="font-medium text-slate-900">{doc.name}</p>
                              <p className="text-sm text-slate-600">{doc.type} • {doc.size} • v{doc.version}</p>
                            </div>
                          </div>
                          <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {selectedContract.documents.length === 0 && (
                        <p className="text-sm text-slate-500 text-center py-4">Aucun document attaché</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Signatories */}
                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Signataires</h4>
                    <div className="space-y-2">
                      {selectedContract.signatories.map((signatory) => (
                        <div key={signatory.id} className="p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-slate-900">{signatory.name}</p>
                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                              signatory.status === 'signed' ? 'bg-green-100 text-green-800' :
                              signatory.status === 'declined' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {signatory.status === 'signed' ? 'Signé' :
                               signatory.status === 'declined' ? 'Refusé' : 'En attente'}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">{signatory.email}</p>
                          <p className="text-sm text-slate-600">{signatory.role}</p>
                          {signatory.signedDate && (
                            <p className="text-xs text-slate-500 mt-1">Signé le {signatory.signedDate}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedContract.notes && (
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Notes</h4>
                      <div className="bg-slate-50 rounded p-3">
                        <p className="text-sm text-slate-700">{selectedContract.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </button>
                    <button 
                      onClick={() => sendForSignature(selectedContract.id)}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Envoyer pour Signature
                    </button>
                    <button 
                      onClick={() => downloadPDF(selectedContract.id)}
                      className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger PDF
                    </button>
                    <button 
                      onClick={() => archiveContract(selectedContract.id)}
                      className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      Archiver
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Creator Modal */}
      <TemplateCreator
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSave={handleSaveTemplate}
      />

      {/* Template Library Modal */}
      {showTemplateLibrary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-slate-900">Bibliothèque de Modèles</h3>
                <button 
                  onClick={() => setShowTemplateLibrary(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-0">
              <TemplateLibrary />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractManagement;