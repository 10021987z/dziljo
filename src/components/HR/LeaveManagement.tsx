import React, { useState } from 'react';
import { Calendar, Clock, Check, X, Plus, Filter, User, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface LeaveRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  department: string;
  type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity';
  startDate: string;
  endDate: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  submittedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  comments?: string;
}

interface LeaveBalance {
  employeeId: number;
  employeeName: string;
  vacation: { total: number; used: number; remaining: number };
  sick: { total: number; used: number; remaining: number };
  personal: { total: number; used: number; remaining: number };
}

const LeaveManagement: React.FC = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: 1,
      employeeId: 1,
      employeeName: 'Sophie Martin',
      department: 'Technique',
      type: 'vacation',
      startDate: '2024-02-15',
      endDate: '2024-02-25',
      days: 8,
      status: 'pending',
      reason: 'Vacances d\'hiver en famille',
      submittedDate: '2024-01-20'
    },
    {
      id: 2,
      employeeId: 2,
      employeeName: 'Thomas Dubois',
      department: 'Design',
      type: 'sick',
      startDate: '2024-01-28',
      endDate: '2024-01-30',
      days: 3,
      status: 'approved',
      reason: 'Grippe',
      submittedDate: '2024-01-28',
      approvedBy: 'Marie Rousseau',
      approvedDate: '2024-01-28'
    },
    {
      id: 3,
      employeeId: 1,
      employeeName: 'Sophie Martin',
      department: 'Technique',
      type: 'personal',
      startDate: '2024-02-05',
      endDate: '2024-02-05',
      days: 1,
      status: 'rejected',
      reason: 'Rendez-vous médical',
      submittedDate: '2024-01-25',
      approvedBy: 'Jean Dupont',
      approvedDate: '2024-01-26',
      comments: 'Période de forte charge, reporter si possible'
    }
  ]);

  const [leaveBalances] = useState<LeaveBalance[]>([
    {
      employeeId: 1,
      employeeName: 'Sophie Martin',
      vacation: { total: 25, used: 12, remaining: 13 },
      sick: { total: 10, used: 2, remaining: 8 },
      personal: { total: 5, used: 1, remaining: 4 }
    },
    {
      employeeId: 2,
      employeeName: 'Thomas Dubois',
      vacation: { total: 25, used: 8, remaining: 17 },
      sick: { total: 10, used: 3, remaining: 7 },
      personal: { total: 5, used: 0, remaining: 5 }
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [activeTab, setActiveTab] = useState('requests');

  const [newRequest, setNewRequest] = useState({
    employeeId: 1,
    type: 'vacation' as LeaveRequest['type'],
    startDate: '',
    endDate: '',
    reason: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Refusé';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'vacation': return 'Congés payés';
      case 'sick': return 'Arrêt maladie';
      case 'personal': return 'Congé personnel';
      case 'maternity': return 'Congé maternité';
      case 'paternity': return 'Congé paternité';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vacation': return 'bg-blue-100 text-blue-800';
      case 'sick': return 'bg-red-100 text-red-800';
      case 'personal': return 'bg-purple-100 text-purple-800';
      case 'maternity': return 'bg-pink-100 text-pink-800';
      case 'paternity': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleApproveRequest = (requestId: number) => {
    setLeaveRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: 'approved', approvedBy: 'Admin User', approvedDate: new Date().toISOString().split('T')[0] }
          : request
      )
    );
  };

  const handleRejectRequest = (requestId: number) => {
    setLeaveRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: 'rejected', approvedBy: 'Admin User', approvedDate: new Date().toISOString().split('T')[0] }
          : request
      )
    );
  };

  const filteredRequests = leaveRequests.filter(request => {
    const matchesStatus = !filterStatus || request.status === filterStatus;
    const matchesType = !filterType || request.type === filterType;
    return matchesStatus && matchesType;
  });

  const pendingRequests = leaveRequests.filter(req => req.status === 'pending').length;
  const approvedThisMonth = leaveRequests.filter(req => 
    req.status === 'approved' && 
    new Date(req.startDate).getMonth() === new Date().getMonth()
  ).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestion des Congés</h2>
          <p className="text-slate-600">Gérez les demandes de congés et les soldes de vos employés</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Demande
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Demandes en Attente</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{pendingRequests}</p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Approuvés ce Mois</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{approvedThisMonth}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Check className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Jours Totaux</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {leaveRequests.filter(req => req.status === 'approved').reduce((sum, req) => sum + req.days, 0)}
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Taux d'Approbation</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {Math.round((leaveRequests.filter(req => req.status === 'approved').length / leaveRequests.length) * 100)}%
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'requests', name: 'Demandes de Congés' },
            { id: 'balances', name: 'Soldes de Congés' },
            { id: 'calendar', name: 'Calendrier' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {activeTab === 'requests' && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="approved">Approuvé</option>
                <option value="rejected">Refusé</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tous les types</option>
                <option value="vacation">Congés payés</option>
                <option value="sick">Arrêt maladie</option>
                <option value="personal">Congé personnel</option>
              </select>
            </div>

            {/* Requests List */}
            <div className="space-y-3">
              {filteredRequests.map((request) => (
                <div key={request.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-slate-900">{request.employeeName}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeColor(request.type)}`}>
                          {getTypeText(request.type)}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded flex items-center ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1">{getStatusText(request.status)}</span>
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
                        <div>
                          <span className="font-medium">Période:</span> {request.startDate} au {request.endDate}
                        </div>
                        <div>
                          <span className="font-medium">Durée:</span> {request.days} jour(s)
                        </div>
                        <div>
                          <span className="font-medium">Demandé le:</span> {request.submittedDate}
                        </div>
                      </div>
                      
                      <div className="mt-2 text-sm text-slate-700">
                        <span className="font-medium">Motif:</span> {request.reason}
                      </div>

                      {request.comments && (
                        <div className="mt-2 p-2 bg-slate-100 rounded text-sm text-slate-700">
                          <span className="font-medium">Commentaire:</span> {request.comments}
                        </div>
                      )}
                    </div>

                    {request.status === 'pending' && (
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleApproveRequest(request.id)}
                          className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approuver
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
                          className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Refuser
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'balances' && (
          <div className="space-y-4">
            {leaveBalances.map((balance) => (
              <div key={balance.employeeId} className="p-4 border border-slate-200 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-4">{balance.employeeName}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">Congés Payés</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-medium">{balance.vacation.total} jours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Utilisés:</span>
                        <span className="font-medium">{balance.vacation.used} jours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Restants:</span>
                        <span className="font-medium text-blue-700">{balance.vacation.remaining} jours</span>
                      </div>
                    </div>
                    <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(balance.vacation.used / balance.vacation.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                    <h5 className="font-medium text-red-900 mb-2">Arrêts Maladie</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-medium">{balance.sick.total} jours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Utilisés:</span>
                        <span className="font-medium">{balance.sick.used} jours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Restants:</span>
                        <span className="font-medium text-red-700">{balance.sick.remaining} jours</span>
                      </div>
                    </div>
                    <div className="mt-2 w-full bg-red-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full"
                        style={{ width: `${(balance.sick.used / balance.sick.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-medium text-purple-900 mb-2">Congés Personnels</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-medium">{balance.personal.total} jours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Utilisés:</span>
                        <span className="font-medium">{balance.personal.used} jours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Restants:</span>
                        <span className="font-medium text-purple-700">{balance.personal.remaining} jours</span>
                      </div>
                    </div>
                    <div className="mt-2 w-full bg-purple-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${(balance.personal.used / balance.personal.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="text-center py-8">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Vue calendrier des congés - À implémenter</p>
          </div>
        )}
      </div>

      {/* Create Request Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Nouvelle Demande de Congé</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Employé
                </label>
                <select
                  value={newRequest.employeeId}
                  onChange={(e) => setNewRequest({ ...newRequest, employeeId: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={1}>Sophie Martin</option>
                  <option value={2}>Thomas Dubois</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Type de Congé
                </label>
                <select
                  value={newRequest.type}
                  onChange={(e) => setNewRequest({ ...newRequest, type: e.target.value as LeaveRequest['type'] })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="vacation">Congés payés</option>
                  <option value="sick">Arrêt maladie</option>
                  <option value="personal">Congé personnel</option>
                  <option value="maternity">Congé maternité</option>
                  <option value="paternity">Congé paternité</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date de Début
                  </label>
                  <input
                    type="date"
                    value={newRequest.startDate}
                    onChange={(e) => setNewRequest({ ...newRequest, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date de Fin
                  </label>
                  <input
                    type="date"
                    value={newRequest.endDate}
                    onChange={(e) => setNewRequest({ ...newRequest, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {newRequest.startDate && newRequest.endDate && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    Durée: {calculateDays(newRequest.startDate, newRequest.endDate)} jour(s)
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Motif
                </label>
                <textarea
                  value={newRequest.reason}
                  onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Motif de la demande..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  // Handle create request
                  setShowCreateModal(false);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Créer la Demande
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;