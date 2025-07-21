import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { User, Mail, Phone, Calendar, FileText, MessageSquare, Star, Clock, Eye, Edit } from 'lucide-react';

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  stage: 'nouveau' | 'en-cours' | 'entretien' | 'decision' | 'embauche' | 'refuse';
  rating: number;
  appliedDate: string;
  lastContact: string;
  cv: string;
  notes: string;
  avatar?: string;
}

interface StageColumnProps {
  stage: string;
  title: string;
  candidates: Candidate[];
  onDropCandidate: (candidateId: number, newStage: string) => void;
  onCandidateClick: (candidate: Candidate) => void;
  color: string;
}

interface CandidateCardProps {
  candidate: Candidate;
  onClick: (candidate: Candidate) => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onClick }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'candidate',
    item: { id: candidate.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'nouveau': return 'border-l-green-500';
      case 'en-cours': return 'border-l-blue-500';
      case 'entretien': return 'border-l-orange-500';
      case 'decision': return 'border-l-purple-500';
      case 'embauche': return 'border-l-emerald-500';
      case 'refuse': return 'border-l-red-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <div
      ref={drag}
      onClick={() => onClick(candidate)}
      className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${getStageColor(candidate.stage)} cursor-pointer hover:shadow-md transition-all duration-200 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-blue-600 font-medium text-sm">
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h4 className="font-medium text-slate-900">{candidate.name}</h4>
            <p className="text-sm text-slate-600">{candidate.position}</p>
          </div>
        </div>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < candidate.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2 text-sm text-slate-600">
        <div className="flex items-center">
          <Mail className="w-3 h-3 mr-2" />
          <span className="truncate">{candidate.email}</span>
        </div>
        <div className="flex items-center">
          <Phone className="w-3 h-3 mr-2" />
          <span>{candidate.phone}</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-3 h-3 mr-2" />
          <span>Candidature: {candidate.appliedDate}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
        <span className="text-xs text-slate-500">
          Dernier contact: {candidate.lastContact}
        </span>
        <div className="flex space-x-1">
          <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors">
            <Eye className="w-3 h-3" />
          </button>
          <button className="p-1 text-slate-400 hover:text-green-600 transition-colors">
            <MessageSquare className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

const StageColumn: React.FC<StageColumnProps> = ({ 
  stage, 
  title, 
  candidates, 
  onDropCandidate, 
  onCandidateClick,
  color 
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'candidate',
    drop: (item: { id: number }) => {
      onDropCandidate(item.id, stage);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`bg-slate-50 rounded-lg p-4 min-h-[600px] ${
        isOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 flex items-center">
          <div className={`w-3 h-3 rounded-full ${color} mr-2`}></div>
          {title}
        </h3>
        <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-slate-600">
          {candidates.length}
        </span>
      </div>

      <div className="space-y-3">
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            onClick={onCandidateClick}
          />
        ))}
      </div>
    </div>
  );
};

const CandidatePipeline: React.FC = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: 1,
      name: 'Sophie Martin',
      email: 's.martin@email.com',
      phone: '+33 1 23 45 67 89',
      position: 'Développeur Full Stack',
      stage: 'nouveau',
      rating: 4,
      appliedDate: '2024-01-20',
      lastContact: '2024-01-20',
      cv: 'CV_Sophie_Martin.pdf',
      notes: 'Profil très intéressant, expérience solide en React et Node.js'
    },
    {
      id: 2,
      name: 'Thomas Dubois',
      email: 't.dubois@email.com',
      phone: '+33 1 98 76 54 32',
      position: 'Designer UX/UI',
      stage: 'en-cours',
      rating: 5,
      appliedDate: '2024-01-18',
      lastContact: '2024-01-22',
      cv: 'CV_Thomas_Dubois.pdf',
      notes: 'Excellent portfolio, très créatif. Entretien téléphonique prévu.'
    },
    {
      id: 3,
      name: 'Marie Leblanc',
      email: 'm.leblanc@email.com',
      phone: '+33 1 11 22 33 44',
      position: 'Chef de Projet',
      stage: 'entretien',
      rating: 4,
      appliedDate: '2024-01-15',
      lastContact: '2024-01-23',
      cv: 'CV_Marie_Leblanc.pdf',
      notes: 'Entretien RH passé avec succès. Entretien technique prévu demain.'
    },
    {
      id: 4,
      name: 'Pierre Rousseau',
      email: 'p.rousseau@email.com',
      phone: '+33 1 55 66 77 88',
      position: 'Développeur Full Stack',
      stage: 'decision',
      rating: 3,
      appliedDate: '2024-01-12',
      lastContact: '2024-01-24',
      cv: 'CV_Pierre_Rousseau.pdf',
      notes: 'Bon niveau technique mais manque d\'expérience en leadership.'
    },
    {
      id: 5,
      name: 'Julie Moreau',
      email: 'j.moreau@email.com',
      phone: '+33 1 44 55 66 77',
      position: 'Designer UX/UI',
      stage: 'embauche',
      rating: 5,
      appliedDate: '2024-01-10',
      lastContact: '2024-01-25',
      cv: 'CV_Julie_Moreau.pdf',
      notes: 'Candidat retenu ! Préparation du contrat en cours.'
    }
  ]);

  const stages = [
    { id: 'nouveau', title: 'Nouveau', color: 'bg-green-500' },
    { id: 'en-cours', title: 'En Cours', color: 'bg-blue-500' },
    { id: 'entretien', title: 'Entretien', color: 'bg-orange-500' },
    { id: 'decision', title: 'Décision', color: 'bg-purple-500' },
    { id: 'embauche', title: 'Embauché', color: 'bg-emerald-500' },
    { id: 'refuse', title: 'Refusé', color: 'bg-red-500' }
  ];

  const handleDropCandidate = (candidateId: number, newStage: string) => {
    setCandidates(prev => 
      prev.map(candidate => 
        candidate.id === candidateId 
          ? { ...candidate, stage: newStage as Candidate['stage'] }
          : candidate
      )
    );
  };

  const getCandidatesByStage = (stage: string) => {
    return candidates.filter(candidate => candidate.stage === stage);
  };

  const getStageStats = () => {
    return stages.map(stage => ({
      ...stage,
      count: getCandidatesByStage(stage.id).length
    }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Pipeline de Recrutement</h2>
            <p className="text-slate-600">Suivez vos candidats à travers le processus de recrutement</p>
          </div>
        </div>

        {/* Pipeline Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {getStageStats().map((stage) => (
            <div key={stage.id} className="bg-white rounded-lg p-4 text-center shadow-sm border border-slate-200">
              <div className={`w-4 h-4 rounded-full ${stage.color} mx-auto mb-2`}></div>
              <p className="text-2xl font-bold text-slate-900">{stage.count}</p>
              <p className="text-sm text-slate-600">{stage.title}</p>
            </div>
          ))}
        </div>

        {/* Pipeline Board */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 overflow-x-auto">
          {stages.map((stage) => (
            <StageColumn
              key={stage.id}
              stage={stage.id}
              title={stage.title}
              candidates={getCandidatesByStage(stage.id)}
              onDropCandidate={handleDropCandidate}
              onCandidateClick={setSelectedCandidate}
              color={stage.color}
            />
          ))}
        </div>

        {/* Candidate Detail Modal */}
        {selectedCandidate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">{selectedCandidate.name}</h3>
                <button 
                  onClick={() => setSelectedCandidate(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-xl">
                      {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-slate-900">{selectedCandidate.name}</h4>
                    <p className="text-slate-600">{selectedCandidate.position}</p>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < selectedCandidate.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Email</p>
                    <p className="text-slate-900">{selectedCandidate.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Téléphone</p>
                    <p className="text-slate-900">{selectedCandidate.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Date de candidature</p>
                    <p className="text-slate-900">{selectedCandidate.appliedDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Dernier contact</p>
                    <p className="text-slate-900">{selectedCandidate.lastContact}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">CV</p>
                  <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                    <FileText className="w-5 h-5 text-slate-600 mr-3" />
                    <span className="text-slate-900">{selectedCandidate.cv}</span>
                    <button className="ml-auto text-blue-600 hover:text-blue-700">
                      Télécharger
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Notes</p>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-slate-900">{selectedCandidate.notes}</p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Planifier Entretien
                  </button>
                  <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Envoyer Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default CandidatePipeline;