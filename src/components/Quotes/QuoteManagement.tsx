import React, { useState } from 'react';
import { FileText, Plus, Search, Filter, Eye, Edit, Send, Download, Copy, Trash2, Clock, CheckCircle, AlertTriangle, DollarSign, TrendingUp, Users, Calendar } from 'lucide-react';
import { useQuotes, useQuoteStats } from '../../hooks/useQuotes';
import QuoteWizard from './QuoteWizard';
import QuoteDetails from './QuoteDetails';
import QuoteTemplateLibrary from './QuoteTemplateLibrary';

const QuoteManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('quotes');
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { quotes, loading, createQuote, updateQuote, sendQuote } = useQuotes();
  const { stats } = useQuoteStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending-approval': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'sent': return 'bg-purple-100 text-purple-800';
      case 'viewed': return 'bg-indigo-100 text-indigo-800';
      case 'signed': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'pending-approval': return 'En attente d\'approbation';
      case 'approved': return 'Approuvé';
      case 'sent': return 'Envoyé';
      case 'viewed': return 'Consulté';
      case 'signed': return 'Signé';
      case 'expired': return 'Expiré';
      case 'rejected': return 'Refusé';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="w-4 h-4" />;
      case 'pending-approval': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'sent': return <Send className="w-4 h-4" />;
      case 'viewed': return <Eye className="w-4 h-4" />;
      case 'signed': return <CheckCircle className="w-4 h-4" />;
      case 'expired': return <AlertTriangle className="w-4 h-4" />;
      case 'rejected': return <AlertTriangle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || quote.status === filterStatus;
    const matchesAssignee = !filterAssignee || quote.assignedTo === filterAssignee;
    
    return matchesSearch && matchesStatus && matchesAssignee;
  });

  const handleCreateQuote = (quoteData: any) => {
    createQuote(quoteData);
    setShowWizard(false);
  };

  const handleSendQuote = async (id: number) => {
    try {
      await sendQuote(id);
      // Show success notification
      const successElement = document.createElement('div');
      successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
      successElement.textContent = '✅ Devis envoyé avec succès !';
      document.body.appendChild(successElement);
      setTimeout(() => document.body.removeChild(successElement), 3000);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du devis:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Devis Intelligents</h2>
          <p className="text-slate-600">Créez, gérez et suivez vos devis avec intelligence artificielle</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowTemplateLibrary(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-purple-700 transition-colors"
          >
            <FileText className="w-4 h-4 mr-2" />
            Modèles
          </button>
          <button 
            onClick={() => setShowWizard(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Devis
          </button>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Devis</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">{stats.totalQuotes}</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Valeur Totale</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">€{stats.totalValue.toLocaleString()}</p>
              </div>
              <div className="bg-green-500 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Taux d'Acceptation</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">{stats.acceptanceRate.toFixed(1)}%</p>
              </div>
              <div className="bg-purple-500 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Délai Moyen</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">{stats.averageTimeToSign}j</p>
              </div>
              <div className="bg-orange-500 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'quotes', name: 'Tous les Devis', icon: FileText },
            { id: 'pending', name: 'En Attente', icon: Clock },
            { id: 'signed', name: 'Signés', icon: CheckCircle },
            { id: 'analytics', name: 'Analytics', icon: TrendingUp }
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
                placeholder="Rechercher devis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="draft">Brouillon</option>
              <option value="pending-approval">En attente d'approbation</option>
              <option value="approved">Approuvé</option>
              <option value="sent">Envoyé</option>
              <option value="signed">Signé</option>
              <option value="expired">Expiré</option>
            </select>

            <select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les assignés</option>
              <option value="Sophie Martin">Sophie Martin</option>
              <option value="Thomas Dubois">Thomas Dubois</option>
              <option value="Pierre Rousseau">Pierre Rousseau</option>
            </select>
          </div>
        </div>

        {/* Quotes List */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Devis</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Client</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Statut</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Montant</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Marge</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Expiration</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Assigné à</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotes.map((quote) => (
                <tr key={quote.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-slate-900">{quote.title}</p>
                      <p className="text-sm text-slate-500">#{quote.number}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-slate-900">{quote.client.name}</p>
                      <p className="text-sm text-slate-500">{quote.contact.name}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded flex items-center w-fit ${getStatusColor(quote.status)}`}>
                      {getStatusIcon(quote.status)}
                      <span className="ml-1">{getStatusText(quote.status)}</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 font-medium text-slate-900">
                    €{quote.total.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`font-medium ${
                      quote.marginPercent >= 30 ? 'text-green-600' : 
                      quote.marginPercent >= 20 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {quote.marginPercent.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-700">{quote.expiryDate}</td>
                  <td className="py-4 px-4 text-slate-700">{quote.assignedTo}</td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedQuote(quote)}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                        title="Voir les détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-slate-400 hover:text-green-600 transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {quote.status === 'approved' && (
                        <button 
                          onClick={() => handleSendQuote(quote.id)}
                          className="p-2 text-slate-400 hover:text-purple-600 transition-colors"
                          title="Envoyer"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        className="p-2 text-slate-400 hover:text-orange-600 transition-colors"
                        title="Télécharger PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                        title="Dupliquer"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredQuotes.length === 0 && !loading && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Aucun devis trouvé</h3>
            <p className="text-slate-500 mb-6">Créez votre premier devis ou modifiez vos filtres</p>
            <button
              onClick={() => setShowWizard(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Créer un devis
            </button>
          </div>
        )}
      </div>

      {/* Quote Wizard Modal */}
      <QuoteWizard
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        onSave={handleCreateQuote}
      />

      {/* Quote Details Modal */}
      {selectedQuote && (
        <QuoteDetails
          quote={selectedQuote}
          onClose={() => setSelectedQuote(null)}
          onUpdate={updateQuote}
        />
      )}

      {/* Template Library Modal */}
      <QuoteTemplateLibrary
        isOpen={showTemplateLibrary}
        onClose={() => setShowTemplateLibrary(false)}
        onSelectTemplate={(template) => {
          setShowTemplateLibrary(false);
          setShowWizard(true);
        }}
      />
    </div>
  );
};

export default QuoteManagement;