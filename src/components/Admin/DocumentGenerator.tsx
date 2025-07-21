import React, { useState } from 'react';
import { FileText, Download, Edit, Eye, Check, X, Plus, Search, Filter, Calendar, User, Building, Mail, Phone, MapPin, DollarSign, Clock, Save } from 'lucide-react';
import { PDFGenerator } from '../../utils/pdfGenerator';

interface Template {
  id: number;
  name: string;
  category: string;
  description: string;
  fields: TemplateField[];
  content: string;
  lastModified: string;
  usageCount: number;
  isActive: boolean;
}

interface TemplateField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'signature';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

interface GeneratedDocument {
  id: number;
  title: string;
  templateId: number;
  templateName: string;
  createdDate: string;
  status: 'draft' | 'final';
  createdBy: string;
  fieldValues: Record<string, any>;
  pdfUrl?: string;
}

const DocumentGenerator: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([
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
      content: '<h1>CONTRAT DE PRESTATION DE SERVICES</h1><p>Entre les soussignés :</p><p><strong>dziljo SaaS</strong>, dont le siège social est situé au 123 Rue de la Tech, 75001 Paris, représentée par M. Jean Dupont, en qualité de Directeur,</p><p>Ci-après dénommée "le Prestataire",</p><p>Et</p><p><strong>{{client_name}}</strong>, </p><p>Ci-après dénommé "le Client",</p><p>Il a été convenu ce qui suit :</p><h2>Article 1 - Objet du contrat</h2><p>Le Prestataire s\'engage à fournir au Client les services suivants :</p><p>{{service_description}}</p><h2>Article 2 - Durée</h2><p>Le présent contrat est conclu pour une durée déterminée. Il prendra effet le {{start_date}} et se terminera le {{end_date}}.</p><h2>Article 3 - Prix et modalités de paiement</h2><p>En contrepartie des prestations fournies, le Client s\'engage à payer au Prestataire la somme de {{amount}} euros.</p><p>Le paiement sera effectué selon les modalités suivantes : {{payment_terms}} à compter de la date de facturation.</p>',
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
      content: '<h1>ACCORD DE PARTENARIAT</h1><p>Entre dziljo SaaS et {{partner_name}}</p><p>Type de partenariat: {{partnership_type}}</p><p>Durée: {{duration}}</p><p>Partage des revenus: {{revenue_share}}</p>',
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
      content: '<h1>CONTRAT DE MAINTENANCE</h1><p>Client: {{client_name}}</p><p>Système concerné: {{system_description}}</p><p>Niveau de SLA: {{sla_level}}</p><p>Tarif mensuel: {{monthly_fee}} €</p>',
      lastModified: '2024-01-15',
      usageCount: 12,
      isActive: true
    }
  ]);

  const [generatedDocuments, setGeneratedDocuments] = useState<GeneratedDocument[]>([
    {
      id: 1,
      title: 'Contrat de Prestation - TechCorp Solutions',
      templateId: 1,
      templateName: 'Contrat de Prestation de Services',
      createdDate: '2024-01-26',
      status: 'final',
      createdBy: 'Sophie Martin',
      fieldValues: {
        client_name: 'TechCorp Solutions',
        service_description: 'Développement d\'une application web sur mesure',
        start_date: '2024-02-01',
        end_date: '2024-07-31',
        amount: '25000',
        payment_terms: '30 jours'
      }
    },
    {
      id: 2,
      title: 'Partenariat - Digital Innovations',
      templateId: 2,
      templateName: 'Accord de Partenariat',
      createdDate: '2024-01-20',
      status: 'draft',
      createdBy: 'Thomas Dubois',
      fieldValues: {
        partner_name: 'Digital Innovations',
        partnership_type: 'Commercial',
        duration: '1 an',
        revenue_share: '70/30'
      }
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<GeneratedDocument | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [documentTitle, setDocumentTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const categories = ['Prestation', 'Partenariat', 'Maintenance', 'Vente', 'Confidentialité', 'Emploi', 'Autre'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || template.category === filterCategory;
    return matchesSearch && matchesCategory && template.isActive;
  });

  const filteredDocuments = generatedDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.templateName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || doc.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setShowGenerateModal(true);
    setFormValues({});
    setFormErrors({});
    setDocumentTitle(`${template.name} - Nouveau`);
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // Clear error when field is edited
    if (formErrors[fieldId]) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!documentTitle.trim()) {
      errors.title = 'Le titre du document est requis';
    }
    
    if (selectedTemplate) {
      selectedTemplate.fields.forEach(field => {
        if (field.required && (!formValues[field.id] || formValues[field.id].trim() === '')) {
          errors[field.id] = `Le champ ${field.name} est requis`;
        }
      });
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGenerateDocument = () => {
    if (!validateForm() || !selectedTemplate) return;
    
    setIsGenerating(true);
    
    // Simulate document generation
    setTimeout(() => {
      const newDocument: GeneratedDocument = {
        id: Date.now(),
        title: documentTitle,
        templateId: selectedTemplate.id,
        templateName: selectedTemplate.name,
        createdDate: new Date().toISOString().split('T')[0],
        status: 'draft',
        createdBy: 'Sophie Martin',
        fieldValues: {...formValues}
      };
      
      setGeneratedDocuments(prev => [newDocument, ...prev]);
      
      // Update template usage count
      setTemplates(prev => prev.map(t => 
        t.id === selectedTemplate.id 
          ? { ...t, usageCount: t.usageCount + 1 } 
          : t
      ));
      
      setIsGenerating(false);
      setShowSuccessMessage(true);
      
      setTimeout(() => {
        setShowSuccessMessage(false);
        setShowGenerateModal(false);
        setSelectedTemplate(null);
      }, 2000);
    }, 1500);
  };

  const handlePreviewDocument = (document: GeneratedDocument) => {
    setSelectedDocument(document);
    setShowPreviewModal(true);
  };

  const handleDownloadPDF = () => {
    if (!selectedDocument) return;
    
    // Get the template
    const template = templates.find(t => t.id === selectedDocument.templateId);
    if (!template) return;
    
    // Create contract data for PDF generation
    const contractData = {
      title: selectedDocument.title,
      client: {
        name: selectedDocument.fieldValues.client_name || selectedDocument.fieldValues.partner_name || 'Client',
        email: selectedDocument.fieldValues.client_email || 'client@example.com',
        address: selectedDocument.fieldValues.client_address || ''
      },
      contract: {
        type: template.category,
        value: parseFloat(selectedDocument.fieldValues.amount || selectedDocument.fieldValues.monthly_fee || '0'),
        startDate: selectedDocument.fieldValues.start_date || new Date().toISOString().split('T')[0],
        endDate: selectedDocument.fieldValues.end_date || '',
        description: selectedDocument.fieldValues.service_description || selectedDocument.fieldValues.system_description || '',
        terms: ['Le présent contrat est soumis au droit français.', 'Tout litige relatif à l\'interprétation ou à l\'exécution du présent contrat sera soumis aux tribunaux compétents.']
      },
      company: {
        name: 'dziljo SaaS',
        address: '123 Rue de la Tech, 75001 Paris',
        siret: '12345678901234'
      }
    };
    
    // Generate and download PDF
    PDFGenerator.generateContractPDF(contractData);
  };

  const handleFinalizeDocument = () => {
    if (!selectedDocument) return;
    
    setGeneratedDocuments(prev => prev.map(doc => 
      doc.id === selectedDocument.id 
        ? { ...doc, status: 'final' } 
        : doc
    ));
    
    setShowPreviewModal(false);
    setSelectedDocument(null);
    
    // Show success message
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Document finalisé avec succès !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const handleDeleteDocument = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      setGeneratedDocuments(prev => prev.filter(doc => doc.id !== id));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Générateur de Documents</h2>
          <p className="text-slate-600">Créez des documents à partir de modèles prédéfinis</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Modèles Disponibles</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{templates.filter(t => t.isActive).length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Documents Générés</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{generatedDocuments.length}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Check className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Documents Finalisés</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{generatedDocuments.filter(d => d.status === 'final').length}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Download className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Templates Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Modèles de Documents</h3>
          <div className="flex space-x-3">
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
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="p-4">
                <h4 className="font-medium text-slate-900 mb-2">{template.name}</h4>
                <p className="text-sm text-slate-600 mb-3 line-clamp-2">{template.description}</p>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded inline-block mb-3">
                  {template.category}
                </span>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Champs: {template.fields.length}</span>
                  <span>Utilisé: {template.usageCount} fois</span>
                </div>
              </div>
              <div className="border-t border-slate-200 p-3 bg-slate-50 rounded-b-lg">
                <button
                  onClick={() => handleSelectTemplate(template)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Générer Document
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generated Documents */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Documents Générés</h3>
          <div className="flex space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="draft">Brouillon</option>
              <option value="final">Final</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Titre</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Modèle</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Date de Création</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Créé par</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Statut</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((document) => (
                <tr key={document.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-slate-900">{document.title}</td>
                  <td className="py-3 px-4 text-slate-700">{document.templateName}</td>
                  <td className="py-3 px-4 text-slate-700">{document.createdDate}</td>
                  <td className="py-3 px-4 text-slate-700">{document.createdBy}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      document.status === 'final' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {document.status === 'final' ? 'Final' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePreviewDocument(document)}
                        className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                        title="Aperçu"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePreviewDocument(document)}
                        className="p-1 text-slate-400 hover:text-green-600 transition-colors"
                        title="Télécharger"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {document.status === 'draft' && (
                        <button
                          onClick={() => {
                            // Edit functionality
                          }}
                          className="p-1 text-slate-400 hover:text-orange-600 transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteDocument(document.id)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        title="Supprimer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Aucun document trouvé</p>
          </div>
        )}
      </div>

      {/* Generate Document Modal */}
      {showGenerateModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">Générer un Document</h3>
                  <p className="text-slate-600">Modèle: {selectedTemplate.name}</p>
                </div>
                <button 
                  onClick={() => {
                    setShowGenerateModal(false);
                    setSelectedTemplate(null);
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
            </div>

            {showSuccessMessage ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Document Généré avec Succès !</h2>
                <p className="text-slate-600 mb-6">
                  Votre document a été créé et est disponible dans la liste des documents générés.
                </p>
              </div>
            ) : isGenerating ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-6"></div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Génération en cours...</h2>
                <p className="text-slate-600">Nous préparons votre document</p>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Titre du Document <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={documentTitle}
                    onChange={(e) => setDocumentTitle(e.target.value)}
                    className={`w-full px-3 py-2 border ${formErrors.title ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Entrez un titre pour ce document"
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
                  )}
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-3">Informations du Document</h4>
                  
                  <div className="space-y-4">
                    {selectedTemplate.fields.map((field) => (
                      <div key={field.id}>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          {field.name} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        
                        {field.type === 'text' && (
                          <div className="relative">
                            {field.id.includes('name') && <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />}
                            {field.id.includes('company') && <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />}
                            {field.id.includes('email') && <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />}
                            {field.id.includes('phone') && <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />}
                            {field.id.includes('address') && <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />}
                            <input
                              type="text"
                              value={formValues[field.id] || ''}
                              onChange={(e) => handleInputChange(field.id, e.target.value)}
                              className={`w-full ${field.id.includes('name') || field.id.includes('company') || field.id.includes('email') || field.id.includes('phone') || field.id.includes('address') ? 'pl-10' : 'px-3'} py-2 border ${formErrors[field.id] ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                              placeholder={field.placeholder || `Entrez ${field.name.toLowerCase()}`}
                            />
                          </div>
                        )}
                        
                        {field.type === 'textarea' && (
                          <textarea
                            value={formValues[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            rows={4}
                            className={`w-full px-3 py-2 border ${formErrors[field.id] ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            placeholder={field.placeholder || `Entrez ${field.name.toLowerCase()}`}
                          />
                        )}
                        
                        {field.type === 'number' && (
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                              type="number"
                              value={formValues[field.id] || ''}
                              onChange={(e) => handleInputChange(field.id, e.target.value)}
                              className={`w-full pl-10 py-2 border ${formErrors[field.id] ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                              placeholder={field.placeholder || `Entrez ${field.name.toLowerCase()}`}
                            />
                          </div>
                        )}
                        
                        {field.type === 'date' && (
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                              type="date"
                              value={formValues[field.id] || ''}
                              onChange={(e) => handleInputChange(field.id, e.target.value)}
                              className={`w-full pl-10 py-2 border ${formErrors[field.id] ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            />
                          </div>
                        )}
                        
                        {field.type === 'select' && field.options && (
                          <select
                            value={formValues[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className={`w-full px-3 py-2 border ${formErrors[field.id] ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          >
                            <option value="">Sélectionner une option</option>
                            {field.options.map((option, index) => (
                              <option key={index} value={option}>{option}</option>
                            ))}
                          </select>
                        )}
                        
                        {field.type === 'signature' && (
                          <div className="h-20 border border-dashed border-slate-300 rounded-lg flex items-center justify-center bg-slate-50">
                            <p className="text-slate-500">La signature sera ajoutée lors de la finalisation</p>
                          </div>
                        )}
                        
                        {formErrors[field.id] && (
                          <p className="mt-1 text-sm text-red-500">{formErrors[field.id]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => {
                      setShowGenerateModal(false);
                      setSelectedTemplate(null);
                    }}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleGenerateDocument}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Générer Document
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {showPreviewModal && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{selectedDocument.title}</h3>
                  <div className="flex items-center space-x-3 text-sm text-slate-600">
                    <span>Modèle: {selectedDocument.templateName}</span>
                    <span>•</span>
                    <span>Créé le: {selectedDocument.createdDate}</span>
                    <span>•</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      selectedDocument.status === 'final' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedDocument.status === 'final' ? 'Final' : 'Brouillon'}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setShowPreviewModal(false);
                    setSelectedDocument(null);
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Document Preview */}
              <div className="bg-white border border-slate-300 rounded-lg p-8 shadow-sm">
                <div className="max-w-3xl mx-auto">
                  {/* Get the template */}
                  {(() => {
                    const template = templates.find(t => t.id === selectedDocument.templateId);
                    if (!template) return <p>Modèle non trouvé</p>;
                    
                    // Replace placeholders with values
                    let content = template.content;
                    Object.entries(selectedDocument.fieldValues).forEach(([key, value]) => {
                      content = content.replace(new RegExp(`{{${key}}}`, 'g'), value as string);
                    });
                    
                    return <div dangerouslySetInnerHTML={{ __html: content }} />;
                  })()}
                </div>
              </div>

              <div className="flex justify-between space-x-3 pt-4 border-t border-slate-200">
                <div>
                  {selectedDocument.status === 'draft' && (
                    <button
                      onClick={handleFinalizeDocument}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Finaliser Document
                    </button>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowPreviewModal(false);
                      setSelectedDocument(null);
                    }}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Fermer
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentGenerator;