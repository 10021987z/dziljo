import React, { useState } from 'react';
import { FileText, Download, Plus, Edit, Eye, Search, Filter, Calendar, User, Building2 } from 'lucide-react';
import { useFirebaseCollection } from '../../hooks/useFirebase';
import { PDFGenerator } from '../../utils/pdfGenerator';

interface Document {
  id: number;
  title: string;
  type: 'contract' | 'certificate' | 'report' | 'letter' | 'form';
  employeeId?: number;
  employeeName?: string;
  createdDate: string;
  createdBy: string;
  status: 'draft' | 'final' | 'sent';
  content: string;
  metadata: {
    department?: string;
    category?: string;
    tags?: string[];
  };
}

const DocumentGeneration: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 1,
      title: 'Contrat de Travail - Sophie Martin',
      type: 'contract',
      employeeId: 1,
      employeeName: 'Sophie Martin',
      createdDate: '2024-01-26',
      createdBy: 'Admin User',
      status: 'final',
      content: 'Contenu du contrat...',
      metadata: {
        department: 'Technique',
        category: 'CDI',
        tags: ['Contrat', 'Technique']
      }
    },
    {
      id: 2,
      title: 'Certificat de Travail - Thomas Dubois',
      type: 'certificate',
      employeeId: 2,
      employeeName: 'Thomas Dubois',
      createdDate: '2024-01-25',
      createdBy: 'HR Manager',
      status: 'draft',
      content: 'Contenu du certificat...',
      metadata: {
        department: 'Design',
        category: 'Certificat',
        tags: ['Certificat', 'Design']
      }
    }
  ]);

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { create: createDocument, update: updateDocument } = useFirebaseCollection('documents');

  const [newDocument, setNewDocument] = useState({
    title: '',
    type: 'contract' as Document['type'],
    employeeName: '',
    content: '',
    category: '',
    tags: ['']
  });

  const documentTypes = [
    { id: 'contract', name: 'Contrat', icon: '📄' },
    { id: 'certificate', name: 'Certificat', icon: '🏆' },
    { id: 'report', name: 'Rapport', icon: '📊' },
    { id: 'letter', name: 'Lettre', icon: '✉️' },
    { id: 'form', name: 'Formulaire', icon: '📝' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'final': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'final': return 'Final';
      case 'sent': return 'Envoyé';
      default: return status;
    }
  };

  const getTypeIcon = (type: string) => {
    const docType = documentTypes.find(t => t.id === type);
    return docType ? docType.icon : '📄';
  };

  const getTypeName = (type: string) => {
    const docType = documentTypes.find(t => t.id === type);
    return docType ? docType.name : type;
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.employeeName && doc.employeeName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = !filterType || doc.type === filterType;
    const matchesStatus = !filterStatus || doc.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCreateDocument = async () => {
    try {
      const documentData = {
        ...newDocument,
        id: Date.now(),
        createdDate: new Date().toISOString().split('T')[0],
        createdBy: 'Current User',
        status: 'draft',
        metadata: {
          category: newDocument.category,
          tags: newDocument.tags.filter(tag => tag.trim() !== '')
        }
      };

      await createDocument(documentData);
      setDocuments(prev => [documentData as Document, ...prev]);
      setShowCreateModal(false);
      
      // Reset form
      setNewDocument({
        title: '',
        type: 'contract',
        employeeName: '',
        content: '',
        category: '',
        tags: ['']
      });
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    }
  };

  const handleDownloadPDF = (document: Document) => {
    // Simulate PDF generation based on document type
    if (document.type === 'contract') {
      const contractData = {
        title: document.title,
        client: {
          name: document.employeeName || 'Employé',
          email: 'employee@company.com',
          address: '123 Rue Example'
        },
        contract: {
          type: 'Contrat de Travail',
          value: 45000,
          startDate: new Date().toISOString().split('T')[0],
          endDate: '',
          description: document.content,
          terms: ['Période d\'essai de 3 mois', 'Horaires: 35h/semaine', 'Congés payés selon la convention collective']
        },
        company: {
          name: 'dziljo SaaS',
          address: '123 Rue de la Tech, 75001 Paris',
          siret: '12345678901234'
        }
      };
      
      PDFGenerator.generateContractPDF(contractData);
    } else {
      // For other document types, show a message
      alert(`Téléchargement du document "${document.title}" en cours...`);
    }
  };

  const addTag = () => {
    setNewDocument(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }));
  };

  const updateTag = (index: number, value: string) => {
    const updatedTags = [...newDocument.tags];
    updatedTags[index] = value;
    setNewDocument(prev => ({ ...prev, tags: updatedTags }));
  };

  const removeTag = (index: number) => {
    const updatedTags = newDocument.tags.filter((_, i) => i !== index);
    setNewDocument(prev => ({ ...prev, tags: updatedTags.length ? updatedTags : [''] }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Génération de Documents</h2>
          <p className="text-slate-600">Créez et gérez les documents RH</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Document
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Documents</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{documents.length}</p>
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
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {documents.filter(d => d.status === 'draft').length}
              </p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg">
              <Edit className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Finalisés</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {documents.filter(d => d.status === 'final').length}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Ce Mois</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {documents.filter(d => d.createdDate.startsWith('2024-01')).length}
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les types</option>
              {documentTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="draft">Brouillon</option>
              <option value="final">Final</option>
              <option value="sent">Envoyé</option>
            </select>
          </div>
        </div>

        {/* Documents List */}
        <div className="space-y-4">
          {filteredDocuments.map((document) => (
            <div key={document.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{getTypeIcon(document.type)}</span>
                    <div>
                      <h4 className="font-medium text-slate-900">{document.title}</h4>
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <span>{getTypeName(document.type)}</span>
                        {document.employeeName && (
                          <>
                            <span>•</span>
                            <span>{document.employeeName}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>Créé le {document.createdDate}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(document.status)}`}>
                      {getStatusText(document.status)}
                    </span>
                  </div>

                  {document.metadata.tags && document.metadata.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {document.metadata.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 ml-4">
                  <button 
                    onClick={() => setSelectedDocument(document)}
                    className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                    title="Voir"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    className="p-2 text-slate-400 hover:text-green-600 transition-colors"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDownloadPDF(document)}
                    className="p-2 text-slate-400 hover:text-purple-600 transition-colors"
                    title="Télécharger PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Aucun document trouvé</h3>
            <p className="text-slate-500 mb-6">Créez votre premier document ou modifiez vos filtres</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Créer un document
            </button>
          </div>
        )}
      </div>

      {/* Create Document Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Nouveau Document</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Titre du document</label>
                <input
                  type="text"
                  value={newDocument.title}
                  onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Contrat de travail - Jean Dupont"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Type de document</label>
                  <select
                    value={newDocument.type}
                    onChange={(e) => setNewDocument({ ...newDocument, type: e.target.value as Document['type'] })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {documentTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Employé concerné</label>
                  <input
                    type="text"
                    value={newDocument.employeeName}
                    onChange={(e) => setNewDocument({ ...newDocument, employeeName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nom de l'employé"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Contenu du document</label>
                <textarea
                  value={newDocument.content}
                  onChange={(e) => setNewDocument({ ...newDocument, content: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Contenu du document..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie</label>
                <input
                  type="text"
                  value={newDocument.category}
                  onChange={(e) => setNewDocument({ ...newDocument, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: CDI, Certificat, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
                {newDocument.tags.map((tag, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => updateTag(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tag"
                    />
                    <button
                      onClick={() => removeTag(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
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
                onClick={handleCreateDocument}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Créer le Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Details Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{getTypeIcon(selectedDocument.type)}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{selectedDocument.title}</h3>
                    <p className="text-slate-600">{getTypeName(selectedDocument.type)}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedDocument(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Informations</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Type:</span>
                      <span className="text-slate-900">{getTypeName(selectedDocument.type)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Statut:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(selectedDocument.status)}`}>
                        {getStatusText(selectedDocument.status)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Créé le:</span>
                      <span className="text-slate-900">{selectedDocument.createdDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Créé par:</span>
                      <span className="text-slate-900">{selectedDocument.createdBy}</span>
                    </div>
                    {selectedDocument.employeeName && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Employé:</span>
                        <span className="text-slate-900">{selectedDocument.employeeName}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Métadonnées</h4>
                  <div className="space-y-2 text-sm">
                    {selectedDocument.metadata.department && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Département:</span>
                        <span className="text-slate-900">{selectedDocument.metadata.department}</span>
                      </div>
                    )}
                    {selectedDocument.metadata.category && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Catégorie:</span>
                        <span className="text-slate-900">{selectedDocument.metadata.category}</span>
                      </div>
                    )}
                    {selectedDocument.metadata.tags && selectedDocument.metadata.tags.length > 0 && (
                      <div>
                        <span className="text-slate-600">Tags:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedDocument.metadata.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-3">Contenu</h4>
                <div className="bg-slate-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                  <pre className="text-sm text-slate-700 whitespace-pre-wrap">{selectedDocument.content}</pre>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-slate-200">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </button>
                <button 
                  onClick={() => handleDownloadPDF(selectedDocument)}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentGeneration;