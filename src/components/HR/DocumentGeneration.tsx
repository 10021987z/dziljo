import React, { useState } from 'react';
import { FileText, Plus, Download, Edit, Eye, Search, Filter, Upload, Check, Clock, X, PenTool, Copy, Settings, Zap, Users, Calendar, AlertCircle } from 'lucide-react';

interface DocumentTemplate {
  id: number;
  name: string;
  category: string;
  description: string;
  fields: DocumentField[];
  content: string;
  lastModified: string;
  usageCount: number;
  isActive: boolean;
  version: string;
  createdBy: string;
  tags: string[];
}

interface DocumentField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean' | 'currency';
  required: boolean;
  defaultValue?: string;
  options?: string[];
  validation?: string;
  placeholder?: string;
}

interface GeneratedDocument {
  id: number;
  templateId: number;
  templateName: string;
  employeeId: number;
  employeeName: string;
  fileName: string;
  generatedDate: string;
  status: 'draft' | 'generated' | 'pending-signature' | 'signed' | 'archived' | 'rejected';
  signedBy?: string[];
  signedDate?: string;
  downloadUrl?: string;
  fieldValues: Record<string, any>;
  signatories: Signatory[];
  comments?: string;
  expiryDate?: string;
}

interface Signatory {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'pending' | 'signed' | 'declined';
  signedDate?: string;
  ipAddress?: string;
  order: number;
}

interface SignatureWorkflow {
  id: number;
  name: string;
  steps: SignatureStep[];
  isDefault: boolean;
}

interface SignatureStep {
  order: number;
  role: string;
  required: boolean;
  autoReminder: boolean;
  reminderDays: number;
}

const DocumentGeneration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('templates');
  
  const [templates, setTemplates] = useState<DocumentTemplate[]>([
    {
      id: 1,
      name: 'Contrat de Travail CDI',
      category: 'Contrats',
      description: 'Modèle standard de contrat à durée indéterminée conforme au code du travail',
      fields: [
        { id: 'nom', name: 'Nom', type: 'text', required: true, placeholder: 'Nom de famille' },
        { id: 'prenom', name: 'Prénom', type: 'text', required: true, placeholder: 'Prénom' },
        { id: 'poste', name: 'Poste', type: 'text', required: true, placeholder: 'Intitulé du poste' },
        { id: 'salaire', name: 'Salaire', type: 'currency', required: true, placeholder: 'Salaire brut annuel' },
        { id: 'date_debut', name: 'Date de début', type: 'date', required: true },
        { id: 'lieu_travail', name: 'Lieu de travail', type: 'text', required: true },
        { id: 'duree_essai', name: 'Durée d\'essai', type: 'select', required: true, options: ['1 mois', '2 mois', '3 mois', '4 mois'] },
        { id: 'horaires', name: 'Horaires', type: 'text', required: false, defaultValue: '35h/semaine' }
      ],
      content: `CONTRAT DE TRAVAIL À DURÉE INDÉTERMINÉE

Entre les soussignés :
La société DZILJO, SARL au capital de [CAPITAL] euros, immatriculée au RCS de [VILLE] sous le numéro [SIRET], dont le siège social est situé [ADRESSE_ENTREPRISE], représentée par [REPRESENTANT_LEGAL], en qualité de [FONCTION_REPRESENTANT],

Ci-après dénommée « l'Employeur »,

D'une part,

Et :
[CIVILITE] [PRENOM] [NOM], né(e) le [DATE_NAISSANCE] à [LIEU_NAISSANCE], de nationalité [NATIONALITE], demeurant [ADRESSE_EMPLOYE],

Ci-après dénommé(e) « le Salarié »,

D'autre part,

IL A ÉTÉ CONVENU CE QUI SUIT :

ARTICLE 1 - ENGAGEMENT
L'Employeur engage le Salarié en qualité de [POSTE], à compter du [DATE_DEBUT].

ARTICLE 2 - LIEU DE TRAVAIL
Le Salarié exercera ses fonctions au [LIEU_TRAVAIL].

ARTICLE 3 - RÉMUNÉRATION
La rémunération brute annuelle du Salarié est fixée à [SALAIRE] euros, payable mensuellement.

ARTICLE 4 - DURÉE DU TRAVAIL
La durée du travail est fixée à [HORAIRES].

ARTICLE 5 - PÉRIODE D'ESSAI
Le présent contrat est conclu sous réserve d'une période d'essai de [DUREE_ESSAI].

Fait à [LIEU], le [DATE_SIGNATURE]
En deux exemplaires originaux.

L'Employeur                    Le Salarié
[SIGNATURE_EMPLOYEUR]          [SIGNATURE_EMPLOYE]`,
      lastModified: '2024-01-15',
      usageCount: 12,
      isActive: true,
      version: '2.1',
      createdBy: 'Admin RH',
      tags: ['CDI', 'Contrat', 'Standard']
    },
    {
      id: 2,
      name: 'Attestation de Travail',
      category: 'Attestations',
      description: 'Attestation standard pour justifier l\'emploi d\'un salarié',
      fields: [
        { id: 'nom', name: 'Nom', type: 'text', required: true },
        { id: 'prenom', name: 'Prénom', type: 'text', required: true },
        { id: 'poste', name: 'Poste', type: 'text', required: true },
        { id: 'date_debut', name: 'Date de début', type: 'date', required: true },
        { id: 'salaire_actuel', name: 'Salaire actuel', type: 'currency', required: true },
        { id: 'motif', name: 'Motif de l\'attestation', type: 'select', required: true, options: ['Demande de crédit', 'Démarches administratives', 'Autre'] }
      ],
      content: `ATTESTATION DE TRAVAIL

Je soussigné(e), [REPRESENTANT_LEGAL], [FONCTION_REPRESENTANT] de la société DZILJO, atteste que :

[CIVILITE] [PRENOM] [NOM]
Né(e) le [DATE_NAISSANCE]
Demeurant [ADRESSE_EMPLOYE]

Est employé(e) dans notre entreprise depuis le [DATE_DEBUT] en qualité de [POSTE].

Son salaire brut mensuel actuel est de [SALAIRE_MENSUEL] euros.

Cette attestation est délivrée pour servir et valoir ce que de droit dans le cadre de [MOTIF].

Fait à [LIEU], le [DATE_EMISSION]

[SIGNATURE_EMPLOYEUR]
[NOM_REPRESENTANT]
[FONCTION_REPRESENTANT]`,
      lastModified: '2024-01-10',
      usageCount: 8,
      isActive: true,
      version: '1.3',
      createdBy: 'Admin RH',
      tags: ['Attestation', 'Justificatif']
    },
    {
      id: 3,
      name: 'Convention de Stage',
      category: 'Stages',
      description: 'Convention tripartite pour l\'accueil de stagiaires',
      fields: [
        { id: 'nom', name: 'Nom', type: 'text', required: true },
        { id: 'prenom', name: 'Prénom', type: 'text', required: true },
        { id: 'ecole', name: 'École/Université', type: 'text', required: true },
        { id: 'formation', name: 'Formation suivie', type: 'text', required: true },
        { id: 'tuteur_entreprise', name: 'Tuteur entreprise', type: 'text', required: true },
        { id: 'tuteur_ecole', name: 'Tuteur école', type: 'text', required: true },
        { id: 'date_debut', name: 'Date de début', type: 'date', required: true },
        { id: 'date_fin', name: 'Date de fin', type: 'date', required: true },
        { id: 'duree_hebdo', name: 'Durée hebdomadaire', type: 'number', required: true, defaultValue: '35' },
        { id: 'gratification', name: 'Gratification mensuelle', type: 'currency', required: false },
        { id: 'missions', name: 'Missions du stage', type: 'text', required: true }
      ],
      content: `CONVENTION DE STAGE

ENTRE :
L'entreprise DZILJO, représentée par [REPRESENTANT_LEGAL]
Adresse : [ADRESSE_ENTREPRISE]

ET :
L'établissement d'enseignement [ECOLE]
Représenté par [TUTEUR_ECOLE]

ET :
L'étudiant(e) [PRENOM] [NOM]
Formation : [FORMATION]

ARTICLE 1 - OBJET
La présente convention a pour objet l'organisation d'un stage d'une durée de [DUREE_STAGE] semaines, du [DATE_DEBUT] au [DATE_FIN].

ARTICLE 2 - MISSIONS
Les missions confiées au stagiaire sont les suivantes :
[MISSIONS]

ARTICLE 3 - ENCADREMENT
Tuteur entreprise : [TUTEUR_ENTREPRISE]
Tuteur pédagogique : [TUTEUR_ECOLE]

ARTICLE 4 - DURÉE ET HORAIRES
Durée hebdomadaire : [DUREE_HEBDO] heures

ARTICLE 5 - GRATIFICATION
Gratification mensuelle : [GRATIFICATION] euros (si applicable)

Fait en trois exemplaires à [LIEU], le [DATE_SIGNATURE]

L'entreprise          L'établissement          Le stagiaire
[SIGNATURE_ENTREPRISE] [SIGNATURE_ECOLE]       [SIGNATURE_STAGIAIRE]`,
      lastModified: '2024-01-20',
      usageCount: 5,
      isActive: true,
      version: '1.5',
      createdBy: 'Admin RH',
      tags: ['Stage', 'Convention', 'Étudiant']
    },
    {
      id: 4,
      name: 'Avenant au Contrat',
      category: 'Avenants',
      description: 'Modification des conditions contractuelles existantes',
      fields: [
        { id: 'nom', name: 'Nom', type: 'text', required: true },
        { id: 'prenom', name: 'Prénom', type: 'text', required: true },
        { id: 'date_contrat_initial', name: 'Date contrat initial', type: 'date', required: true },
        { id: 'type_modification', name: 'Type de modification', type: 'select', required: true, options: ['Augmentation salariale', 'Changement de poste', 'Modification horaires', 'Changement lieu travail', 'Autre'] },
        { id: 'ancien_salaire', name: 'Ancien salaire', type: 'currency', required: false },
        { id: 'nouveau_salaire', name: 'Nouveau salaire', type: 'currency', required: false },
        { id: 'nouveau_poste', name: 'Nouveau poste', type: 'text', required: false },
        { id: 'date_effet', name: 'Date d\'effet', type: 'date', required: true },
        { id: 'motif', name: 'Motif de la modification', type: 'text', required: true }
      ],
      content: `AVENANT AU CONTRAT DE TRAVAIL N°[NUMERO_AVENANT]

ENTRE :
La société DZILJO, représentée par [REPRESENTANT_LEGAL]

ET :
[CIVILITE] [PRENOM] [NOM], salarié(e) de l'entreprise

PRÉAMBULE :
Par contrat de travail en date du [DATE_CONTRAT_INITIAL], [PRENOM] [NOM] a été engagé(e) en qualité de [POSTE_INITIAL].

Les parties conviennent de modifier les conditions de ce contrat comme suit :

ARTICLE 1 - OBJET DE LA MODIFICATION
Type de modification : [TYPE_MODIFICATION]
Motif : [MOTIF]

ARTICLE 2 - NOUVELLES CONDITIONS
[CONDITIONS_MODIFIEES]

ARTICLE 3 - DATE D'EFFET
Les présentes modifications prendront effet le [DATE_EFFET].

ARTICLE 4 - AUTRES CLAUSES
Toutes les autres clauses du contrat initial demeurent inchangées.

Fait à [LIEU], le [DATE_SIGNATURE]
En deux exemplaires originaux.

L'Employeur                    Le Salarié
[SIGNATURE_EMPLOYEUR]          [SIGNATURE_EMPLOYE]`,
      lastModified: '2024-01-12',
      usageCount: 3,
      isActive: true,
      version: '1.2',
      createdBy: 'Admin RH',
      tags: ['Avenant', 'Modification', 'Contrat']
    },
    {
      id: 5,
      name: 'Certificat de Travail',
      category: 'Certificats',
      description: 'Certificat de fin de contrat obligatoire',
      fields: [
        { id: 'nom', name: 'Nom', type: 'text', required: true },
        { id: 'prenom', name: 'Prénom', type: 'text', required: true },
        { id: 'poste', name: 'Poste occupé', type: 'text', required: true },
        { id: 'date_debut', name: 'Date de début', type: 'date', required: true },
        { id: 'date_fin', name: 'Date de fin', type: 'date', required: true },
        { id: 'motif_depart', name: 'Motif du départ', type: 'select', required: true, options: ['Démission', 'Licenciement', 'Fin de CDD', 'Rupture conventionnelle', 'Retraite'] },
        { id: 'preavis_effectue', name: 'Préavis effectué', type: 'boolean', required: true },
        { id: 'observations', name: 'Observations', type: 'text', required: false }
      ],
      content: `CERTIFICAT DE TRAVAIL

Je soussigné(e), [REPRESENTANT_LEGAL], [FONCTION_REPRESENTANT] de la société DZILJO, certifie que :

[CIVILITE] [PRENOM] [NOM]
Né(e) le [DATE_NAISSANCE]
Demeurant [ADRESSE_EMPLOYE]

A été employé(e) dans notre entreprise du [DATE_DEBUT] au [DATE_FIN] en qualité de [POSTE].

Le contrat de travail a pris fin par [MOTIF_DEPART].

[MENTION_PREAVIS]

[OBSERVATIONS_COMPLEMENTAIRES]

Ce certificat est remis à l'intéressé(e) pour servir et valoir ce que de droit.

Fait à [LIEU], le [DATE_EMISSION]

[SIGNATURE_EMPLOYEUR]
[NOM_REPRESENTANT]
[FONCTION_REPRESENTANT]

Cachet de l'entreprise`,
      lastModified: '2024-01-08',
      usageCount: 2,
      isActive: true,
      version: '1.1',
      createdBy: 'Admin RH',
      tags: ['Certificat', 'Fin contrat', 'Obligatoire']
    }
  ]);

  const [generatedDocuments, setGeneratedDocuments] = useState<GeneratedDocument[]>([
    {
      id: 1,
      templateId: 1,
      templateName: 'Contrat de Travail CDI',
      employeeId: 1,
      employeeName: 'Sophie Martin',
      fileName: 'Contrat_Sophie_Martin_2024.pdf',
      generatedDate: '2024-01-20',
      status: 'signed',
      signedBy: ['Sophie Martin', 'Jean Dupont'],
      signedDate: '2024-01-22',
      fieldValues: {
        nom: 'Martin',
        prenom: 'Sophie',
        poste: 'Développeur Full Stack Senior',
        salaire: '55000',
        date_debut: '2024-02-01',
        lieu_travail: 'Paris'
      },
      signatories: [
        { id: 1, name: 'Jean Dupont', email: 'j.dupont@dziljo.com', role: 'Directeur RH', status: 'signed', order: 1, signedDate: '2024-01-21' },
        { id: 2, name: 'Sophie Martin', email: 's.martin@email.com', role: 'Employé', status: 'signed', order: 2, signedDate: '2024-01-22' }
      ]
    },
    {
      id: 2,
      templateId: 2,
      templateName: 'Attestation de Travail',
      employeeId: 2,
      employeeName: 'Thomas Dubois',
      fileName: 'Attestation_Thomas_Dubois_2024.pdf',
      generatedDate: '2024-01-18',
      status: 'pending-signature',
      fieldValues: {
        nom: 'Dubois',
        prenom: 'Thomas',
        poste: 'Designer UX/UI',
        date_debut: '2023-06-01',
        salaire_actuel: '45000',
        motif: 'Demande de crédit'
      },
      signatories: [
        { id: 3, name: 'Marie Rousseau', email: 'm.rousseau@dziljo.com', role: 'Manager', status: 'pending', order: 1 }
      ]
    },
    {
      id: 3,
      templateId: 4,
      templateName: 'Avenant au Contrat',
      employeeId: 1,
      employeeName: 'Sophie Martin',
      fileName: 'Avenant_Sophie_Martin_Promotion.pdf',
      generatedDate: '2024-01-15',
      status: 'draft',
      fieldValues: {
        nom: 'Martin',
        prenom: 'Sophie',
        type_modification: 'Augmentation salariale',
        ancien_salaire: '45000',
        nouveau_salaire: '55000',
        date_effet: '2024-02-01',
        motif: 'Promotion et reconnaissance des performances'
      },
      signatories: []
    }
  ]);

  const [signatureWorkflows, setSignatureWorkflows] = useState<SignatureWorkflow[]>([
    {
      id: 1,
      name: 'Workflow Standard',
      isDefault: true,
      steps: [
        { order: 1, role: 'Manager', required: true, autoReminder: true, reminderDays: 3 },
        { order: 2, role: 'RH', required: true, autoReminder: true, reminderDays: 2 },
        { order: 3, role: 'Employé', required: true, autoReminder: true, reminderDays: 7 }
      ]
    },
    {
      id: 2,
      name: 'Workflow Direction',
      isDefault: false,
      steps: [
        { order: 1, role: 'RH', required: true, autoReminder: true, reminderDays: 2 },
        { order: 2, role: 'Direction', required: true, autoReminder: true, reminderDays: 1 },
        { order: 3, role: 'Employé', required: true, autoReminder: true, reminderDays: 7 }
      ]
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<GeneratedDocument | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: 'Contrats',
    description: '',
    fields: [{ id: '', name: '', type: 'text' as DocumentField['type'], required: true }],
    content: '',
    tags: ['']
  });

  const [generateForm, setGenerateForm] = useState({
    templateId: 0,
    employeeId: 1,
    fieldValues: {} as Record<string, any>,
    workflowId: 1,
    signatories: [] as Signatory[]
  });

  const categories = ['Contrats', 'Attestations', 'Stages', 'Avenants', 'Certificats', 'Formations', 'Disciplinaire'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'generated': return 'bg-blue-100 text-blue-800';
      case 'pending-signature': return 'bg-orange-100 text-orange-800';
      case 'signed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'generated': return 'Généré';
      case 'pending-signature': return 'En attente signature';
      case 'signed': return 'Signé';
      case 'rejected': return 'Refusé';
      case 'archived': return 'Archivé';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="w-4 h-4" />;
      case 'generated': return <FileText className="w-4 h-4" />;
      case 'pending-signature': return <PenTool className="w-4 h-4" />;
      case 'signed': return <Check className="w-4 h-4" />;
      case 'rejected': return <X className="w-4 h-4" />;
      case 'archived': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Contrats': return 'bg-blue-100 text-blue-800';
      case 'Attestations': return 'bg-green-100 text-green-800';
      case 'Stages': return 'bg-purple-100 text-purple-800';
      case 'Avenants': return 'bg-orange-100 text-orange-800';
      case 'Certificats': return 'bg-pink-100 text-pink-800';
      case 'Formations': return 'bg-indigo-100 text-indigo-800';
      case 'Disciplinaire': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !filterCategory || template.category === filterCategory;
    return matchesSearch && matchesCategory && template.isActive;
  });

  const filteredDocuments = generatedDocuments.filter(doc => {
    const matchesSearch = doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.templateName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || doc.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const addField = () => {
    setNewTemplate({
      ...newTemplate,
      fields: [...newTemplate.fields, { id: '', name: '', type: 'text', required: true }]
    });
  };

  const updateField = (index: number, field: Partial<DocumentField>) => {
    const updated = [...newTemplate.fields];
    updated[index] = { ...updated[index], ...field };
    setNewTemplate({ ...newTemplate, fields: updated });
  };

  const removeField = (index: number) => {
    const updated = newTemplate.fields.filter((_, i) => i !== index);
    setNewTemplate({ ...newTemplate, fields: updated });
  };

  const addTag = () => {
    setNewTemplate({
      ...newTemplate,
      tags: [...newTemplate.tags, '']
    });
  };

  const updateTag = (index: number, value: string) => {
    const updated = [...newTemplate.tags];
    updated[index] = value;
    setNewTemplate({ ...newTemplate, tags: updated });
  };

  const removeTag = (index: number) => {
    const updated = newTemplate.tags.filter((_, i) => i !== index);
    setNewTemplate({ ...newTemplate, tags: updated });
  };

  const handleGenerateDocument = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setGenerateForm({
      templateId: template.id,
      employeeId: 1,
      fieldValues: {},
      workflowId: 1,
      signatories: []
    });
    setShowGenerateModal(true);
  };

  const handleEditTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setNewTemplate({
      name: template.name,
      category: template.category,
      description: template.description,
      fields: template.fields,
      content: template.content,
      tags: template.tags
    });
    setShowTemplateEditor(true);
  };

  const handleDuplicateTemplate = (template: DocumentTemplate) => {
    const duplicated = {
      ...template,
      id: Date.now(),
      name: `${template.name} (Copie)`,
      usageCount: 0,
      version: '1.0',
      lastModified: new Date().toISOString().split('T')[0]
    };
    setTemplates([...templates, duplicated]);
  };

  const handleSignDocument = (document: GeneratedDocument) => {
    setSelectedDocument(document);
    setShowSignatureModal(true);
  };

  const getSignatureProgress = (document: GeneratedDocument) => {
    const signed = document.signatories.filter(s => s.status === 'signed').length;
    const total = document.signatories.length;
    return total > 0 ? (signed / total) * 100 : 0;
  };

  const totalTemplates = templates.filter(t => t.isActive).length;
  const totalDocuments = generatedDocuments.length;
  const signedDocuments = generatedDocuments.filter(doc => doc.status === 'signed').length;
  const pendingSignatures = generatedDocuments.filter(doc => doc.status === 'pending-signature').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Génération de Documents RH</h2>
          <p className="text-slate-600">Créez, gérez et signez vos documents RH avec des modèles personnalisables et signature électronique</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Modèle
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition-colors">
            <Zap className="w-4 h-4 mr-2" />
            Génération Rapide
          </button>
        </div>
      </div>

      {/* Enhanced Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Modèles Actifs</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{totalTemplates}</p>
              <p className="text-xs text-slate-500 mt-1">+2 ce mois</p>
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
              <p className="text-2xl font-bold text-slate-900 mt-2">{totalDocuments}</p>
              <p className="text-xs text-slate-500 mt-1">Ce mois</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Download className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">En Attente Signature</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{pendingSignatures}</p>
              <p className="text-xs text-slate-500 mt-1">Nécessite action</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <PenTool className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Taux de Signature</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {totalDocuments > 0 ? Math.round((signedDocuments / totalDocuments) * 100) : 0}%
              </p>
              <p className="text-xs text-slate-500 mt-1">Moyenne mensuelle</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Check className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'templates', name: 'Modèles de Documents', icon: FileText },
            { id: 'documents', name: 'Documents Générés', icon: Download },
            { id: 'signatures', name: 'Signatures Électroniques', icon: PenTool },
            { id: 'workflows', name: 'Workflows', icon: Settings }
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

        {/* Enhanced Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher par nom, description, tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {activeTab === 'templates' && (
            <>
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
              <button className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filtres avancés
              </button>
            </>
          )}

          {activeTab === 'documents' && (
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="draft">Brouillon</option>
              <option value="generated">Généré</option>
              <option value="pending-signature">En attente signature</option>
              <option value="signed">Signé</option>
              <option value="rejected">Refusé</option>
              <option value="archived">Archivé</option>
            </select>
          )}
        </div>

        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors group">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-slate-900">{template.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(template.category)}`}>
                        {template.category}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{template.description}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-slate-600 mb-4">
                  <div className="flex justify-between">
                    <span>Champs:</span>
                    <span className="font-medium">{template.fields.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Utilisé:</span>
                    <span className="font-medium">{template.usageCount} fois</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Version:</span>
                    <span className="font-medium">v{template.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Modifié:</span>
                    <span className="font-medium">{template.lastModified}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleGenerateDocument(template)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Générer
                  </button>
                  <button 
                    onClick={() => handleEditTemplate(template)}
                    className="p-2 text-slate-400 hover:text-green-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDuplicateTemplate(template)}
                    className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-purple-600 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-4">
            {filteredDocuments.map((document) => (
              <div key={document.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-slate-900">{document.fileName}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded flex items-center ${getStatusColor(document.status)}`}>
                        {getStatusIcon(document.status)}
                        <span className="ml-1">{getStatusText(document.status)}</span>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600 mb-3">
                      <div>
                        <span className="font-medium">Modèle:</span> {document.templateName}
                      </div>
                      <div>
                        <span className="font-medium">Employé:</span> {document.employeeName}
                      </div>
                      <div>
                        <span className="font-medium">Généré le:</span> {document.generatedDate}
                      </div>
                    </div>

                    {/* Signature Progress */}
                    {document.signatories.length > 0 && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-slate-600 mb-1">
                          <span>Progression des signatures</span>
                          <span>{document.signatories.filter(s => s.status === 'signed').length}/{document.signatories.length}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getSignatureProgress(document)}%` }}
                          ></div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {document.signatories.map((signatory) => (
                            <div key={signatory.id} className="flex items-center text-xs">
                              <div className={`w-2 h-2 rounded-full mr-1 ${
                                signatory.status === 'signed' ? 'bg-green-500' :
                                signatory.status === 'declined' ? 'bg-red-500' : 'bg-yellow-500'
                              }`}></div>
                              <span className="text-slate-600">{signatory.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {document.signedBy && document.signedDate && (
                      <div className="text-sm text-green-600">
                        Signé par {document.signedBy.join(', ')} le {document.signedDate}
                      </div>
                    )}

                    {document.comments && (
                      <div className="mt-2 p-2 bg-slate-100 rounded text-sm text-slate-700">
                        <span className="font-medium">Commentaire:</span> {document.comments}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-green-600 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    {document.status === 'pending-signature' && (
                      <button 
                        onClick={() => handleSignDocument(document)}
                        className="p-2 text-slate-400 hover:text-purple-600 transition-colors"
                      >
                        <PenTool className="w-4 h-4" />
                      </button>
                    )}
                    {document.status === 'draft' && (
                      <button className="p-2 text-slate-400 hover:text-orange-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'signatures' && (
          <div className="space-y-6">
            {/* Signature Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <PenTool className="w-8 h-8" />
                  <span className="text-2xl font-bold">{pendingSignatures}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">En Attente</h3>
                <p className="text-blue-100 text-sm">Documents nécessitant une signature</p>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Check className="w-8 h-8" />
                  <span className="text-2xl font-bold">{signedDocuments}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Signés</h3>
                <p className="text-green-100 text-sm">Documents complètement signés</p>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Clock className="w-8 h-8" />
                  <span className="text-2xl font-bold">2.3j</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Temps Moyen</h3>
                <p className="text-purple-100 text-sm">Délai moyen de signature</p>
              </div>
            </div>

            {/* Recent Signature Activity */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Activité Récente des Signatures</h3>
              <div className="space-y-4">
                {generatedDocuments
                  .filter(doc => doc.status === 'pending-signature' || doc.status === 'signed')
                  .slice(0, 5)
                  .map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          doc.status === 'signed' ? 'bg-green-500' : 'bg-orange-500'
                        }`}></div>
                        <div>
                          <p className="font-medium text-slate-900">{doc.fileName}</p>
                          <p className="text-sm text-slate-600">{doc.employeeName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">
                          {doc.signatories.filter(s => s.status === 'signed').length}/{doc.signatories.length} signatures
                        </p>
                        <p className="text-xs text-slate-500">{doc.generatedDate}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'workflows' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Workflows de Signature</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Workflow
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {signatureWorkflows.map((workflow) => (
                <div key={workflow.id} className="border border-slate-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium text-slate-900">{workflow.name}</h4>
                      {workflow.isDefault && (
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded mt-1">
                          Par défaut
                        </span>
                      )}
                    </div>
                    <button className="text-slate-400 hover:text-slate-600">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {workflow.steps.map((step, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium mr-3">
                            {step.order}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{step.role}</p>
                            <p className="text-xs text-slate-600">
                              {step.required ? 'Obligatoire' : 'Optionnel'}
                              {step.autoReminder && ` • Rappel ${step.reminderDays}j`}
                            </p>
                          </div>
                        </div>
                        {step.required && (
                          <AlertCircle className="w-4 h-4 text-orange-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Nouveau Modèle de Document</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Template Info */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nom du Modèle *
                    </label>
                    <input
                      type="text"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Contrat de Travail CDI"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Catégorie *
                    </label>
                    <select
                      value={newTemplate.category}
                      onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Description détaillée du modèle de document..."
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tags
                  </label>
                  {newTemplate.tags.map((tag, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => updateTag(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: CDI, Standard, Obligatoire..."
                      />
                      {newTemplate.tags.length > 1 && (
                        <button
                          onClick={() => removeTag(index)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
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

                {/* Fields Configuration */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Champs Variables
                  </label>
                  {newTemplate.fields.map((field, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-3 mb-3">
                      <div className="grid grid-cols-2 gap-3 mb-2">
                        <input
                          type="text"
                          value={field.name}
                          onChange={(e) => updateField(index, { name: e.target.value, id: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                          className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Nom du champ"
                        />
                        <select
                          value={field.type}
                          onChange={(e) => updateField(index, { type: e.target.value as DocumentField['type'] })}
                          className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="text">Texte</option>
                          <option value="number">Nombre</option>
                          <option value="date">Date</option>
                          <option value="select">Liste déroulante</option>
                          <option value="boolean">Oui/Non</option>
                          <option value="currency">Monétaire</option>
                        </select>
                      </div>
                      <div className="flex items-center space-x-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => updateField(index, { required: e.target.checked })}
                            className="mr-2"
                          />
                          <span className="text-sm text-slate-700">Obligatoire</span>
                        </label>
                        {newTemplate.fields.length > 1 && (
                          <button
                            onClick={() => removeField(index)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Supprimer
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addField}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Ajouter un champ
                  </button>
                </div>
              </div>

              {/* Right Column - Content Editor */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Contenu du Document *
                </label>
                <textarea
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                  rows={20}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="Saisissez le contenu du document. Utilisez [NOM_CHAMP] pour les variables..."
                />
                <div className="mt-2 text-xs text-slate-500">
                  <p>Utilisez les variables entre crochets : [NOM_CHAMP]</p>
                  <p>Variables système disponibles : [DATE_SIGNATURE], [LIEU], [REPRESENTANT_LEGAL], etc.</p>
                </div>
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
                  // Handle create template
                  setShowCreateModal(false);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Créer le Modèle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Generate Document Modal */}
      {showGenerateModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Générer: {selectedTemplate.name}</h3>
              <button 
                onClick={() => setShowGenerateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Employee Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Employé *
                  </label>
                  <select
                    value={generateForm.employeeId}
                    onChange={(e) => setGenerateForm({ ...generateForm, employeeId: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={1}>Sophie Martin - Développeur Full Stack Senior</option>
                    <option value={2}>Thomas Dubois - Designer UX/UI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Workflow de Signature
                  </label>
                  <select
                    value={generateForm.workflowId}
                    onChange={(e) => setGenerateForm({ ...generateForm, workflowId: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {signatureWorkflows.map(workflow => (
                      <option key={workflow.id} value={workflow.id}>
                        {workflow.name} {workflow.isDefault && '(Par défaut)'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dynamic Fields */}
              <div>
                <h4 className="font-medium text-slate-900 mb-4">Remplir les champs du document:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTemplate.fields.map((field, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        {field.name} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      {field.type === 'select' ? (
                        <select
                          value={generateForm.fieldValues[field.id] || ''}
                          onChange={(e) => setGenerateForm({
                            ...generateForm,
                            fieldValues: { ...generateForm.fieldValues, [field.id]: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Sélectionner...</option>
                          {field.options?.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : field.type === 'boolean' ? (
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={field.id}
                              value="true"
                              checked={generateForm.fieldValues[field.id] === 'true'}
                              onChange={(e) => setGenerateForm({
                                ...generateForm,
                                fieldValues: { ...generateForm.fieldValues, [field.id]: e.target.value }
                              })}
                              className="mr-2"
                            />
                            Oui
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={field.id}
                              value="false"
                              checked={generateForm.fieldValues[field.id] === 'false'}
                              onChange={(e) => setGenerateForm({
                                ...generateForm,
                                fieldValues: { ...generateForm.fieldValues, [field.id]: e.target.value }
                              })}
                              className="mr-2"
                            />
                            Non
                          </label>
                        </div>
                      ) : (
                        <input
                          type={field.type === 'currency' || field.type === 'number' ? 'number' : field.type}
                          value={generateForm.fieldValues[field.id] || field.defaultValue || ''}
                          onChange={(e) => setGenerateForm({
                            ...generateForm,
                            fieldValues: { ...generateForm.fieldValues, [field.id]: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={field.placeholder || `Saisir ${field.name.toLowerCase()}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Signature Preview */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">Ordre de signature:</h4>
                <div className="space-y-2">
                  {signatureWorkflows
                    .find(w => w.id === generateForm.workflowId)
                    ?.steps.map((step, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium mr-3">
                            {step.order}
                          </div>
                          <span className="text-sm font-medium">{step.role}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {step.required && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Obligatoire</span>
                          )}
                          {step.autoReminder && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              Rappel {step.reminderDays}j
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-200">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  // Handle generate document
                  setShowGenerateModal(false);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <FileText className="w-4 h-4 mr-2" />
                Générer le Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signature Modal */}
      {showSignatureModal && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Signature Électronique</h3>
              <button 
                onClick={() => setShowSignatureModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-2">{selectedDocument.fileName}</h4>
                <p className="text-sm text-slate-600">Employé: {selectedDocument.employeeName}</p>
                <p className="text-sm text-slate-600">Généré le: {selectedDocument.generatedDate}</p>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-3">Progression des signatures:</h4>
                <div className="space-y-3">
                  {selectedDocument.signatories.map((signatory) => (
                    <div key={signatory.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          signatory.status === 'signed' ? 'bg-green-500' :
                          signatory.status === 'declined' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>
                        <div>
                          <p className="font-medium text-slate-900">{signatory.name}</p>
                          <p className="text-sm text-slate-600">{signatory.role}</p>
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
                          <p className="text-xs text-slate-500 mt-1">{signatory.signedDate}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signature Canvas Placeholder */}
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                <PenTool className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 mb-4">Zone de signature électronique</p>
                <p className="text-sm text-slate-500">
                  La signature sera capturée ici avec horodatage et adresse IP
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-200">
              <button
                onClick={() => setShowSignatureModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Annuler
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                Refuser
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                <PenTool className="w-4 h-4 mr-2" />
                Signer le Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentGeneration;