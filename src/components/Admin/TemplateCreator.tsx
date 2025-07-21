import React, { useState, useRef } from 'react';
import { 
  FileText, Save, Copy, Download, Upload, Plus, Trash2, 
  Type, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, 
  List, ListOrdered, Image, Table, Link, Calendar, DollarSign, 
  User, Building, Mail, Phone, MapPin, FileSignature, Check, X
} from 'lucide-react';

interface TemplateCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (templateData: any) => void;
  initialData?: any;
  isEditing?: boolean;
}

interface TemplateField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'signature';
  required: boolean;
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
}

const TemplateCreator: React.FC<TemplateCreatorProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isEditing = false
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [templateContent, setTemplateContent] = useState(initialData?.content || '');
  const [templateName, setTemplateName] = useState(initialData?.name || '');
  const [templateCategory, setTemplateCategory] = useState(initialData?.category || 'Prestation');
  const [templateDescription, setTemplateDescription] = useState(initialData?.description || '');
  const [templateFields, setTemplateFields] = useState<TemplateField[]>(initialData?.fields || []);
  const [previewMode, setPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const editorRef = useRef<HTMLDivElement>(null);
  
  const categories = [
    'Prestation', 'Partenariat', 'Maintenance', 'Vente', 'Confidentialité', 'Emploi', 'Autre'
  ];
  
  const fieldTypes = [
    { value: 'text', label: 'Texte court', icon: Type },
    { value: 'textarea', label: 'Texte long', icon: AlignLeft },
    { value: 'number', label: 'Nombre', icon: DollarSign },
    { value: 'date', label: 'Date', icon: Calendar },
    { value: 'select', label: 'Liste déroulante', icon: List },
    { value: 'signature', label: 'Signature', icon: FileSignature }
  ];

  const handleAddField = () => {
    const newField: TemplateField = {
      id: `field_${Date.now()}`,
      name: '',
      type: 'text',
      required: false
    };
    setTemplateFields([...templateFields, newField]);
  };

  const handleUpdateField = (index: number, field: string, value: any) => {
    const updatedFields = [...templateFields];
    updatedFields[index] = { ...updatedFields[index], [field]: value };
    setTemplateFields(updatedFields);
  };

  const handleRemoveField = (index: number) => {
    setTemplateFields(templateFields.filter((_, i) => i !== index));
  };

  const handleAddOption = (fieldIndex: number) => {
    const updatedFields = [...templateFields];
    const currentOptions = updatedFields[fieldIndex].options || [];
    updatedFields[fieldIndex].options = [...currentOptions, ''];
    setTemplateFields(updatedFields);
  };

  const handleUpdateOption = (fieldIndex: number, optionIndex: number, value: string) => {
    const updatedFields = [...templateFields];
    if (!updatedFields[fieldIndex].options) {
      updatedFields[fieldIndex].options = [];
    }
    updatedFields[fieldIndex].options![optionIndex] = value;
    setTemplateFields(updatedFields);
  };

  const handleRemoveOption = (fieldIndex: number, optionIndex: number) => {
    const updatedFields = [...templateFields];
    updatedFields[fieldIndex].options = updatedFields[fieldIndex].options?.filter((_, i) => i !== optionIndex);
    setTemplateFields(updatedFields);
  };

  const handleFormatText = (format: string) => {
    document.execCommand(format, false);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleInsertField = (fieldId: string) => {
    const field = templateFields.find(f => f.id === fieldId);
    if (!field) return;
    
    const placeholder = `{{${field.name}}}`;
    document.execCommand('insertText', false, placeholder);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleSaveTemplate = () => {
    if (!templateName || !templateCategory || !templateContent) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);
    
    // Capture content from contentEditable div
    const content = editorRef.current?.innerHTML || templateContent;
    
    const templateData = {
      id: initialData?.id || Date.now(),
      name: templateName,
      category: templateCategory,
      description: templateDescription,
      fields: templateFields,
      content: content,
      lastModified: new Date().toISOString().split('T')[0],
      usageCount: initialData?.usageCount || 0,
      isActive: true
    };
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessMessage(true);
      
      setTimeout(() => {
        if (onSave) onSave(templateData);
        setShowSuccessMessage(false);
        onClose();
      }, 1500);
    }, 1000);
  };

  const renderFieldPlaceholders = () => {
    return templateFields.map(field => (
      <button
        key={field.id}
        onClick={() => handleInsertField(field.id)}
        className="flex items-center px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm text-blue-700 mb-2 transition-colors"
      >
        {field.type === 'text' && <Type className="w-4 h-4 mr-2" />}
        {field.type === 'textarea' && <AlignLeft className="w-4 h-4 mr-2" />}
        {field.type === 'number' && <DollarSign className="w-4 h-4 mr-2" />}
        {field.type === 'date' && <Calendar className="w-4 h-4 mr-2" />}
        {field.type === 'select' && <List className="w-4 h-4 mr-2" />}
        {field.type === 'signature' && <FileSignature className="w-4 h-4 mr-2" />}
        {field.name || 'Champ sans nom'}
      </button>
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 animate-gradient-x"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{isEditing ? 'Modifier le Modèle' : 'Créer un Nouveau Modèle'}</h1>
                <p className="text-white/80">Créez des modèles de documents personnalisés avec champs dynamiques</p>
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
              { id: 'basic', name: 'Informations de Base' },
              { id: 'fields', name: 'Champs Dynamiques' },
              { id: 'editor', name: 'Éditeur de Contenu' },
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

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {showSuccessMessage ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {isEditing ? 'Modèle Mis à Jour !' : 'Modèle Créé avec Succès !'}
              </h2>
              <p className="text-slate-600 mb-6">
                {isEditing 
                  ? 'Les modifications ont été enregistrées.' 
                  : 'Votre nouveau modèle est maintenant disponible.'}
              </p>
            </div>
          ) : isSubmitting ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                {isEditing ? 'Mise à jour en cours...' : 'Création en cours...'}
              </h2>
              <p className="text-slate-600">Nous enregistrons votre modèle</p>
            </div>
          ) : (
            <>
              {/* Basic Information */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nom du Modèle <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: Contrat de Prestation de Services"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Catégorie <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={templateCategory}
                        onChange={(e) => setTemplateCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Sélectionner une catégorie</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={templateDescription}
                      onChange={(e) => setTemplateDescription(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Description du modèle et son utilisation..."
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-blue-900">À propos des Modèles</h3>
                        <p className="text-sm text-blue-700 mt-1">
                          Les modèles vous permettent de créer des documents standardisés avec des champs dynamiques qui seront remplis lors de la génération du document final. Utilisez-les pour les contrats, propositions, et autres documents récurrents.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Fields Configuration */}
              {activeTab === 'fields' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-slate-900">Champs Dynamiques</h2>
                    <button
                      onClick={handleAddField}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter un Champ
                    </button>
                  </div>

                  <div className="space-y-4">
                    {templateFields.length === 0 ? (
                      <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200">
                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">Aucun champ ajouté. Créez des champs pour personnaliser votre modèle.</p>
                        <button
                          onClick={handleAddField}
                          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                        >
                          Ajouter un premier champ
                        </button>
                      </div>
                    ) : (
                      templateFields.map((field, index) => (
                        <div key={field.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="font-medium text-slate-900">Champ #{index + 1}</h3>
                            <button
                              onClick={() => handleRemoveField(index)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Nom du Champ <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={field.name}
                                onChange={(e) => handleUpdateField(index, 'name', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Ex: client_name"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Type de Champ
                              </label>
                              <select
                                value={field.type}
                                onChange={(e) => handleUpdateField(index, 'type', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                {fieldTypes.map(type => (
                                  <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Texte d'aide
                              </label>
                              <input
                                type="text"
                                value={field.placeholder || ''}
                                onChange={(e) => handleUpdateField(index, 'placeholder', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Ex: Nom complet du client"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Valeur par défaut
                              </label>
                              <input
                                type="text"
                                value={field.defaultValue || ''}
                                onChange={(e) => handleUpdateField(index, 'defaultValue', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Valeur par défaut (optionnel)"
                              />
                            </div>
                          </div>

                          <div className="flex items-center mb-4">
                            <input
                              type="checkbox"
                              id={`required-${field.id}`}
                              checked={field.required}
                              onChange={(e) => handleUpdateField(index, 'required', e.target.checked)}
                              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor={`required-${field.id}`} className="ml-2 text-sm text-slate-700">
                              Champ obligatoire
                            </label>
                          </div>

                          {field.type === 'select' && (
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-slate-700">
                                  Options
                                </label>
                                <button
                                  onClick={() => handleAddOption(index)}
                                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  Ajouter une option
                                </button>
                              </div>
                              
                              <div className="space-y-2">
                                {(field.options || []).map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex items-center space-x-2">
                                    <input
                                      type="text"
                                      value={option}
                                      onChange={(e) => handleUpdateOption(index, optionIndex, e.target.value)}
                                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      placeholder={`Option ${optionIndex + 1}`}
                                    />
                                    <button
                                      onClick={() => handleRemoveOption(index, optionIndex)}
                                      className="p-2 text-red-500 hover:text-red-700 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                                
                                {(!field.options || field.options.length === 0) && (
                                  <div className="text-center py-2 bg-slate-100 rounded-lg">
                                    <p className="text-sm text-slate-500">Aucune option ajoutée</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <div className="flex items-center text-sm text-slate-600">
                              <FileText className="w-4 h-4 mr-2 text-blue-500" />
                              <span>Utiliser ce champ dans le modèle avec: <code className="bg-slate-100 px-2 py-1 rounded text-blue-600">{'{{' + (field.name || 'nom_champ') + '}}'}</code></span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Content Editor */}
              {activeTab === 'editor' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-slate-900">Éditeur de Contenu</h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setPreviewMode(!previewMode)}
                        className="bg-slate-100 text-slate-700 px-3 py-2 rounded-lg text-sm hover:bg-slate-200 transition-colors flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        {previewMode ? 'Éditer' : 'Aperçu'}
                      </button>
                    </div>
                  </div>

                  {/* Formatting Toolbar */}
                  <div className="bg-slate-100 rounded-t-lg p-2 flex flex-wrap gap-1 border border-slate-300 border-b-0">
                    <button
                      onClick={() => handleFormatText('bold')}
                      className="p-2 hover:bg-slate-200 rounded transition-colors"
                      title="Gras"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleFormatText('italic')}
                      className="p-2 hover:bg-slate-200 rounded transition-colors"
                      title="Italique"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleFormatText('underline')}
                      className="p-2 hover:bg-slate-200 rounded transition-colors"
                      title="Souligné"
                    >
                      <Underline className="w-4 h-4" />
                    </button>
                    <div className="w-px h-6 bg-slate-300 mx-1"></div>
                    <button
                      onClick={() => handleFormatText('justifyLeft')}
                      className="p-2 hover:bg-slate-200 rounded transition-colors"
                      title="Aligner à gauche"
                    >
                      <AlignLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleFormatText('justifyCenter')}
                      className="p-2 hover:bg-slate-200 rounded transition-colors"
                      title="Centrer"
                    >
                      <AlignCenter className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleFormatText('justifyRight')}
                      className="p-2 hover:bg-slate-200 rounded transition-colors"
                      title="Aligner à droite"
                    >
                      <AlignRight className="w-4 h-4" />
                    </button>
                    <div className="w-px h-6 bg-slate-300 mx-1"></div>
                    <button
                      onClick={() => handleFormatText('insertUnorderedList')}
                      className="p-2 hover:bg-slate-200 rounded transition-colors"
                      title="Liste à puces"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleFormatText('insertOrderedList')}
                      className="p-2 hover:bg-slate-200 rounded transition-colors"
                      title="Liste numérotée"
                    >
                      <ListOrdered className="w-4 h-4" />
                    </button>
                    <div className="w-px h-6 bg-slate-300 mx-1"></div>
                    <button
                      onClick={() => {
                        const url = prompt('Entrez l\'URL du lien:');
                        if (url) document.execCommand('createLink', false, url);
                      }}
                      className="p-2 hover:bg-slate-200 rounded transition-colors"
                      title="Insérer un lien"
                    >
                      <Link className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        const url = prompt('Entrez l\'URL de l\'image:');
                        if (url) document.execCommand('insertImage', false, url);
                      }}
                      className="p-2 hover:bg-slate-200 rounded transition-colors"
                      title="Insérer une image"
                    >
                      <Image className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        // Simple table insertion
                        const rows = prompt('Nombre de lignes:', '3');
                        const cols = prompt('Nombre de colonnes:', '3');
                        if (rows && cols) {
                          let table = '<table style="width:100%; border-collapse: collapse;">';
                          for (let i = 0; i < parseInt(rows); i++) {
                            table += '<tr>';
                            for (let j = 0; j < parseInt(cols); j++) {
                              table += `<td style="border: 1px solid #ccc; padding: 8px;">${i === 0 ? 'En-tête' : 'Cellule'} ${j+1}</td>`;
                            }
                            table += '</tr>';
                          }
                          table += '</table>';
                          document.execCommand('insertHTML', false, table);
                        }
                      }}
                      className="p-2 hover:bg-slate-200 rounded transition-colors"
                      title="Insérer un tableau"
                    >
                      <Table className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Editor */}
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <div
                        ref={editorRef}
                        contentEditable={!previewMode}
                        className={`min-h-[400px] p-4 border border-slate-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          previewMode ? 'bg-slate-50' : 'bg-white'
                        }`}
                        dangerouslySetInnerHTML={{ __html: templateContent }}
                        onInput={(e) => setTemplateContent(e.currentTarget.innerHTML)}
                        suppressContentEditableWarning={true}
                      />
                    </div>
                    
                    <div className="w-64">
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <h3 className="font-medium text-slate-900 mb-3">Champs Disponibles</h3>
                        <div className="space-y-1">
                          {templateFields.length > 0 ? (
                            renderFieldPlaceholders()
                          ) : (
                            <p className="text-sm text-slate-500">Aucun champ défini. Ajoutez des champs dans l'onglet "Champs Dynamiques".</p>
                          )}
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mt-4">
                        <h3 className="font-medium text-blue-900 mb-3">Champs Communs</h3>
                        <div className="space-y-1">
                          <button
                            onClick={() => handleInsertField('company_name')}
                            className="flex items-center px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-sm text-blue-700 mb-2 transition-colors w-full"
                          >
                            <Building className="w-4 h-4 mr-2" />
                            Nom de l'entreprise
                          </button>
                          <button
                            onClick={() => handleInsertField('client_name')}
                            className="flex items-center px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-sm text-blue-700 mb-2 transition-colors w-full"
                          >
                            <User className="w-4 h-4 mr-2" />
                            Nom du client
                          </button>
                          <button
                            onClick={() => handleInsertField('current_date')}
                            className="flex items-center px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-sm text-blue-700 mb-2 transition-colors w-full"
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Date du jour
                          </button>
                          <button
                            onClick={() => handleInsertField('client_email')}
                            className="flex items-center px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-sm text-blue-700 mb-2 transition-colors w-full"
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Email du client
                          </button>
                          <button
                            onClick={() => handleInsertField('client_phone')}
                            className="flex items-center px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-sm text-blue-700 mb-2 transition-colors w-full"
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Téléphone du client
                          </button>
                          <button
                            onClick={() => handleInsertField('client_address')}
                            className="flex items-center px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-sm text-blue-700 mb-2 transition-colors w-full"
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            Adresse du client
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preview */}
              {activeTab === 'preview' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-slate-900">Aperçu du Modèle</h2>
                    <div className="flex space-x-2">
                      <button className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center">
                        <Download className="w-4 h-4 mr-1" />
                        Exporter PDF
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-slate-300 p-8 shadow-sm">
                    <div className="max-w-3xl mx-auto">
                      <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">{templateName || 'Titre du Modèle'}</h1>
                        <p className="text-slate-600">{templateCategory || 'Catégorie'}</p>
                      </div>

                      <div className="mb-8 pb-8 border-b border-slate-200">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-slate-900">Notre Entreprise</p>
                            <p>dziljo SaaS</p>
                            <p>123 Rue de la Tech</p>
                            <p>75001 Paris, France</p>
                            <p>contact@dziljo.com</p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">Client</p>
                            <p>{{client_name}}</p>
                            <p>{{client_address}}</p>
                            <p>{{client_email}}</p>
                            <p>{{client_phone}}</p>
                          </div>
                        </div>
                      </div>

                      <div className="prose max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: templateContent || '<p>Le contenu du modèle apparaîtra ici. Utilisez l\'onglet "Éditeur de Contenu" pour créer votre modèle.</p>' }} />
                      </div>

                      <div className="mt-8 pt-8 border-t border-slate-200">
                        <div className="grid grid-cols-2 gap-8">
                          <div>
                            <p className="font-medium text-slate-900 mb-2">Pour dziljo SaaS:</p>
                            <div className="h-20 border border-dashed border-slate-300 rounded-lg flex items-center justify-center">
                              <p className="text-slate-500">Signature</p>
                            </div>
                            <p className="mt-2 text-sm text-slate-600">Nom: ____________________</p>
                            <p className="text-sm text-slate-600">Date: ____________________</p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 mb-2">Pour le Client:</p>
                            <div className="h-20 border border-dashed border-slate-300 rounded-lg flex items-center justify-center">
                              <p className="text-slate-500">{{signature}}</p>
                            </div>
                            <p className="mt-2 text-sm text-slate-600">Nom: ____________________</p>
                            <p className="text-sm text-slate-600">Date: ____________________</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-yellow-100 p-2 rounded-full">
                        <FileText className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-yellow-900">Aperçu du Modèle</h3>
                        <p className="text-sm text-yellow-700 mt-1">
                          Ceci est un aperçu de votre modèle. Les champs dynamiques seront remplacés par les valeurs réelles lors de la génération du document final.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer with Actions */}
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
                {activeTab !== 'basic' && (
                  <button
                    onClick={() => {
                      const tabs = ['basic', 'fields', 'editor', 'preview'];
                      const currentIndex = tabs.indexOf(activeTab);
                      setActiveTab(tabs[currentIndex - 1]);
                    }}
                    className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Précédent
                  </button>
                )}

                {activeTab !== 'preview' ? (
                  <button
                    onClick={() => {
                      const tabs = ['basic', 'fields', 'editor', 'preview'];
                      const currentIndex = tabs.indexOf(activeTab);
                      setActiveTab(tabs[currentIndex + 1]);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Suivant
                  </button>
                ) : (
                  <button
                    onClick={handleSaveTemplate}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? 'Mettre à Jour' : 'Créer le Modèle'}
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

export default TemplateCreator;