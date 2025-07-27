import React, { useState } from 'react';
import { X, Plus, Trash2, Save, FileText, Type, Hash, Calendar, List, AlignLeft } from 'lucide-react';

interface TemplateField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  required: boolean;
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
}

interface Template {
  id?: number;
  name: string;
  category: string;
  description: string;
  fields: TemplateField[];
  content: string;
  lastModified: string;
  usageCount: number;
  isActive: boolean;
}

interface TemplateCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: Template) => void;
  initialData?: Template;
  isEditing?: boolean;
}

const TemplateCreator: React.FC<TemplateCreatorProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isEditing = false
}) => {
  const [template, setTemplate] = useState<Template>({
    name: initialData?.name || '',
    category: initialData?.category || 'Prestation',
    description: initialData?.description || '',
    fields: initialData?.fields || [],
    content: initialData?.content || '',
    lastModified: new Date().toISOString().split('T')[0],
    usageCount: initialData?.usageCount || 0,
    isActive: initialData?.isActive ?? true
  });

  const [newField, setNewField] = useState<TemplateField>({
    id: '',
    name: '',
    type: 'text',
    required: false,
    placeholder: '',
    options: []
  });

  const [showFieldModal, setShowFieldModal] = useState(false);
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);

  const categories = ['Prestation', 'Partenariat', 'Maintenance', 'Vente', 'Confidentialité', 'Emploi', 'Autre'];

  const fieldTypes = [
    { value: 'text', label: 'Texte', icon: Type },
    { value: 'number', label: 'Nombre', icon: Hash },
    { value: 'date', label: 'Date', icon: Calendar },
    { value: 'select', label: 'Liste déroulante', icon: List },
    { value: 'textarea', label: 'Texte long', icon: AlignLeft }
  ];

  const handleAddField = () => {
    if (!newField.name) return;

    const field: TemplateField = {
      ...newField,
      id: newField.name.toLowerCase().replace(/\s+/g, '_'),
      options: newField.type === 'select' ? newField.options : undefined
    };

    if (editingFieldIndex !== null) {
      const updatedFields = [...template.fields];
      updatedFields[editingFieldIndex] = field;
      setTemplate(prev => ({ ...prev, fields: updatedFields }));
      setEditingFieldIndex(null);
    } else {
      setTemplate(prev => ({ ...prev, fields: [...prev.fields, field] }));
    }

    setNewField({
      id: '',
      name: '',
      type: 'text',
      required: false,
      placeholder: '',
      options: []
    });
    setShowFieldModal(false);
  };

  const handleEditField = (index: number) => {
    const field = template.fields[index];
    setNewField({ ...field });
    setEditingFieldIndex(index);
    setShowFieldModal(true);
  };

  const handleDeleteField = (index: number) => {
    setTemplate(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    if (!template.name || !template.description) return;

    const templateData: Template = {
      ...template,
      id: initialData?.id,
      lastModified: new Date().toISOString().split('T')[0]
    };

    onSave(templateData);
  };

  const insertFieldPlaceholder = (fieldId: string) => {
    const placeholder = `{{${fieldId}}}`;
    setTemplate(prev => ({
      ...prev,
      content: prev.content + placeholder
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {isEditing ? 'Modifier le Modèle' : 'Nouveau Modèle'}
                </h1>
                <p className="text-white/80">Créez un modèle de document personnalisé</p>
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
          {/* Left Panel - Template Info & Fields */}
          <div className="w-1/3 border-r border-slate-200 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="font-medium text-slate-900 mb-4">Informations du Modèle</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nom *</label>
                    <input
                      type="text"
                      value={template.name}
                      onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nom du modèle"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie *</label>
                    <select
                      value={template.category}
                      onChange={(e) => setTemplate(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
                    <textarea
                      value={template.description}
                      onChange={(e) => setTemplate(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Description du modèle"
                    />
                  </div>
                </div>
              </div>

              {/* Fields */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-slate-900">Champs Dynamiques</h3>
                  <button
                    onClick={() => setShowFieldModal(true)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Ajouter
                  </button>
                </div>

                <div className="space-y-2">
                  {template.fields.map((field, index) => (
                    <div key={field.id} className="flex items-center justify-between p-2 bg-slate-50 rounded border">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-slate-900">{field.name}</span>
                          {field.required && <span className="text-red-500 text-xs">*</span>}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-slate-500">
                          <span className="capitalize">{field.type}</span>
                          <button
                            onClick={() => insertFieldPlaceholder(field.id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            Insérer
                          </button>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEditField(index)}
                          className="p-1 text-slate-400 hover:text-blue-600"
                        >
                          <FileText className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteField(index)}
                          className="p-1 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Content Editor */}
          <div className="flex-1 p-6">
            <div className="h-full flex flex-col">
              <h3 className="font-medium text-slate-900 mb-4">Contenu du Modèle</h3>
              <textarea
                value={template.content}
                onChange={(e) => setTemplate(prev => ({ ...prev, content: e.target.value }))}
                className="flex-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="Tapez le contenu de votre modèle ici. Utilisez {{nom_du_champ}} pour insérer des champs dynamiques."
              />
              <div className="mt-4 text-sm text-slate-600">
                <p><strong>Astuce:</strong> Utilisez les boutons "Insérer" à côté des champs pour ajouter des placeholders.</p>
                <p>Exemple: {{client_name}} sera remplacé par le nom du client lors de la génération.</p>
              </div>
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
              disabled={!template.name || !template.description}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? 'Mettre à jour' : 'Créer le Modèle'}
            </button>
          </div>
        </div>
      </div>

      {/* Field Modal */}
      {showFieldModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">
                {editingFieldIndex !== null ? 'Modifier le Champ' : 'Nouveau Champ'}
              </h3>
              <button
                onClick={() => {
                  setShowFieldModal(false);
                  setEditingFieldIndex(null);
                  setNewField({
                    id: '',
                    name: '',
                    type: 'text',
                    required: false,
                    placeholder: '',
                    options: []
                  });
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nom du champ *</label>
                <input
                  type="text"
                  value={newField.name}
                  onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Nom du client"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Type de champ</label>
                <select
                  value={newField.type}
                  onChange={(e) => setNewField(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {fieldTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Placeholder</label>
                <input
                  type="text"
                  value={newField.placeholder || ''}
                  onChange={(e) => setNewField(prev => ({ ...prev, placeholder: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Texte d'aide"
                />
              </div>

              {newField.type === 'select' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Options (une par ligne)</label>
                  <textarea
                    value={newField.options?.join('\n') || ''}
                    onChange={(e) => setNewField(prev => ({ 
                      ...prev, 
                      options: e.target.value.split('\n').filter(opt => opt.trim()) 
                    }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                  />
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="required"
                  checked={newField.required}
                  onChange={(e) => setNewField(prev => ({ ...prev, required: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="required" className="ml-2 text-sm text-slate-700">
                  Champ obligatoire
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowFieldModal(false);
                  setEditingFieldIndex(null);
                }}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAddField}
                disabled={!newField.name}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {editingFieldIndex !== null ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateCreator;