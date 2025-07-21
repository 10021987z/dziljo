import React, { useState } from 'react';
import { Plus, Edit, Eye, Share2, Users, Calendar, MapPin, Clock, DollarSign, Briefcase, X } from 'lucide-react';

interface JobPosting {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  status: 'active' | 'draft' | 'closed';
  applications: number;
  views: number;
  createdDate: string;
  closingDate: string;
  description: string;
  requirements: string[];
}

const JobPostings: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([
    {
      id: 1,
      title: 'Développeur Full Stack Senior',
      department: 'Technique',
      location: 'Paris, France',
      type: 'CDI',
      salary: '45-55k€',
      status: 'active',
      applications: 23,
      views: 156,
      createdDate: '2024-01-15',
      closingDate: '2024-02-15',
      description: 'Nous recherchons un développeur full stack expérimenté pour rejoindre notre équipe technique.',
      requirements: ['React/TypeScript', 'Node.js', '3+ ans d\'expérience', 'Anglais courant']
    },
    {
      id: 2,
      title: 'Designer UX/UI',
      department: 'Design',
      location: 'Lyon, France',
      type: 'CDI',
      salary: '38-45k€',
      status: 'active',
      applications: 18,
      views: 89,
      createdDate: '2024-01-20',
      closingDate: '2024-02-20',
      description: 'Rejoignez notre équipe design pour créer des expériences utilisateur exceptionnelles.',
      requirements: ['Figma/Sketch', 'Design System', '2+ ans d\'expérience', 'Portfolio requis']
    },
    {
      id: 3,
      title: 'Chef de Projet Digital',
      department: 'Management',
      location: 'Remote',
      type: 'CDI',
      salary: '50-60k€',
      status: 'draft',
      applications: 0,
      views: 0,
      createdDate: '2024-01-25',
      closingDate: '2024-03-01',
      description: 'Nous cherchons un chef de projet expérimenté pour piloter nos projets digitaux.',
      requirements: ['Gestion de projet', 'Agile/Scrum', '5+ ans d\'expérience', 'Leadership']
    }
  ]);

  const [newJob, setNewJob] = useState({
    title: '',
    department: '',
    location: '',
    type: 'CDI',
    salary: '',
    description: '',
    requirements: ['']
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'draft': return 'Brouillon';
      case 'closed': return 'Fermé';
      default: return status;
    }
  };

  const handleCreateJob = () => {
    const job: JobPosting = {
      id: Date.now(),
      ...newJob,
      status: 'draft',
      applications: 0,
      views: 0,
      createdDate: new Date().toISOString().split('T')[0],
      closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      requirements: newJob.requirements.filter(req => req.trim() !== '')
    };
    
    setJobPostings([...jobPostings, job]);
    setShowCreateModal(false);
    setNewJob({
      title: '',
      department: '',
      location: '',
      type: 'CDI',
      salary: '',
      description: '',
      requirements: ['']
    });
  };

  const addRequirement = () => {
    setNewJob({
      ...newJob,
      requirements: [...newJob.requirements, '']
    });
  };

  const updateRequirement = (index: number, value: string) => {
    const updated = [...newJob.requirements];
    updated[index] = value;
    setNewJob({ ...newJob, requirements: updated });
  };

  const removeRequirement = (index: number) => {
    const updated = newJob.requirements.filter((_, i) => i !== index);
    setNewJob({ ...newJob, requirements: updated });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Offres d'Emploi</h2>
          <p className="text-slate-600">Gérez vos offres d'emploi et suivez les candidatures</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Offre
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Offres Actives</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {jobPostings.filter(job => job.status === 'active').length}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Candidatures</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {jobPostings.reduce((sum, job) => sum + job.applications, 0)}
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Vues Totales</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {jobPostings.reduce((sum, job) => sum + job.views, 0)}
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Taux de Conversion</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">12.5%</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Job Postings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold">Toutes les Offres</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Poste</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Département</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Statut</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Candidatures</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Vues</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Date Limite</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobPostings.map((job) => (
                <tr key={job.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-slate-900">{job.title}</p>
                      <div className="flex items-center text-sm text-slate-500 mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {job.location}
                        <span className="mx-2">•</span>
                        <Clock className="w-3 h-3 mr-1" />
                        {job.type}
                        <span className="mx-2">•</span>
                        <DollarSign className="w-3 h-3 mr-1" />
                        {job.salary}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-700">{job.department}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(job.status)}`}>
                      {getStatusText(job.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-900">{job.applications}</td>
                  <td className="py-4 px-6 text-slate-700">{job.views}</td>
                  <td className="py-4 px-6 text-slate-700">{job.closingDate}</td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedJob(job)}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-green-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-purple-600 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Créer une Nouvelle Offre</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Titre du Poste *
                  </label>
                  <input
                    type="text"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Développeur Full Stack"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Département *
                  </label>
                  <select
                    value={newJob.department}
                    onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner un département</option>
                    <option value="Technique">Technique</option>
                    <option value="Design">Design</option>
                    <option value="Management">Management</option>
                    <option value="Commercial">Commercial</option>
                    <option value="RH">Ressources Humaines</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Localisation *
                  </label>
                  <input
                    type="text"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Paris, France"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Type de Contrat *
                  </label>
                  <select
                    value={newJob.type}
                    onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="Stage">Stage</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Salaire
                  </label>
                  <input
                    type="text"
                    value={newJob.salary}
                    onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 45-55k€"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description du Poste *
                </label>
                <textarea
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Décrivez le poste, les missions, l'environnement de travail..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Compétences Requises
                </label>
                {newJob.requirements.map((req, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => updateRequirement(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: React/TypeScript"
                    />
                    {newJob.requirements.length > 1 && (
                      <button
                        onClick={() => removeRequirement(index)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addRequirement}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Ajouter une compétence
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
                onClick={handleCreateJob}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Créer l'Offre
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">{selectedJob.title}</h3>
              <button 
                onClick={() => setSelectedJob(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Département</p>
                  <p className="text-slate-900">{selectedJob.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Localisation</p>
                  <p className="text-slate-900">{selectedJob.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Type de Contrat</p>
                  <p className="text-slate-900">{selectedJob.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Salaire</p>
                  <p className="text-slate-900">{selectedJob.salary}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Description</p>
                <p className="text-slate-900">{selectedJob.description}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Compétences Requises</p>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.requirements.map((req, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">{selectedJob.applications}</p>
                  <p className="text-sm text-slate-600">Candidatures</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">{selectedJob.views}</p>
                  <p className="text-sm text-slate-600">Vues</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">
                    {selectedJob.applications > 0 ? Math.round((selectedJob.applications / selectedJob.views) * 100) : 0}%
                  </p>
                  <p className="text-sm text-slate-600">Conversion</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPostings;