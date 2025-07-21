import React, { useState } from 'react';
import { X, Edit, Send, Download, Copy, CheckCircle, Clock, AlertTriangle, Eye, FileText, User, Mail, Phone, MapPin, Calendar, DollarSign, TrendingUp, Signature } from 'lucide-react';

interface QuoteDetailsProps {
  quote: any;
  onClose: () => void;
  onUpdate: (id: number, data: any) => void;
}

const QuoteDetails: React.FC<QuoteDetailsProps> = ({ quote, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('details');

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

  const handleSendQuote = () => {
    // Logic to send quote
    console.log('Sending quote:', quote.id);
  };

  const handleApproveQuote = () => {
    // Logic to approve quote
    onUpdate(quote.id, { status: 'approved' });
  };

  const handleRejectQuote = () => {
    // Logic to reject quote
    onUpdate(quote.id, { status: 'rejected' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{quote.title}</h3>
                <div className="flex items-center space-x-3 mt-2">
                  <span className="text-sm text-slate-600">#{quote.number}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded flex items-center ${getStatusColor(quote.status)}`}>
                    {getStatusIcon(quote.status)}
                    <span className="ml-1">{getStatusText(quote.status)}</span>
                  </span>
                  <span className="text-sm text-slate-600">€{quote.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center">
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </button>
              {quote.status === 'approved' && (
                <button 
                  onClick={handleSendQuote}
                  className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer
                </button>
              )}
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mt-6">
            {[
              { id: 'details', name: 'Détails', icon: FileText },
              { id: 'workflow', name: 'Workflow', icon: TrendingUp },
              { id: 'signature', name: 'Signature', icon: Signature },
              { id: 'analytics', name: 'Analytics', icon: BarChart3 }
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
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Client Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Informations Client
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-slate-600">Entreprise:</span>
                      <p className="text-slate-900 font-medium">{quote.client.name}</p>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-slate-500" />
                      <span className="text-slate-900">{quote.client.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-slate-500" />
                      <span className="text-slate-900">{quote.client.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-slate-500" />
                      <span className="text-slate-900">{quote.client.address}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                    Résumé Financier
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Sous-total HT:</span>
                      <span className="font-medium">€{quote.subtotal.toLocaleString()}</span>
                    </div>
                    {quote.discountAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Remise:</span>
                        <span className="font-medium text-red-600">-€{quote.discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-600">TVA:</span>
                      <span className="font-medium">€{quote.taxAmount.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-slate-200 pt-2">
                      <div className="flex justify-between">
                        <span className="font-bold text-slate-900">Total TTC:</span>
                        <span className="font-bold text-slate-900 text-lg">€{quote.total.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Marge:</span>
                      <span className={`font-medium ${
                        quote.marginPercent >= 30 ? 'text-green-600' : 
                        quote.marginPercent >= 20 ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {quote.marginPercent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote Lines */}
              <div>
                <h4 className="font-medium text-slate-900 mb-4">Lignes de Devis</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Produit/Service</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Quantité</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Prix Unitaire</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Remise</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quote.lines.map((line: any, index: number) => (
                        <tr key={index} className="border-b border-slate-200">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-slate-900">{line.productName}</p>
                              <p className="text-sm text-slate-600">{line.description}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-700">{line.quantity}</td>
                          <td className="py-3 px-4 text-slate-700">€{line.unitPrice.toLocaleString()}</td>
                          <td className="py-3 px-4 text-slate-700">{line.discount}%</td>
                          <td className="py-3 px-4 font-medium text-slate-900">€{line.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Conditions */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">Conditions Commerciales</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Paiement:</span>
                    <p className="text-slate-900">{quote.conditions.paymentTerms}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Livraison:</span>
                    <p className="text-slate-900">{quote.conditions.deliveryTerms}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Garantie:</span>
                    <p className="text-slate-900">{quote.conditions.warranty}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Validité:</span>
                    <p className="text-slate-900">{quote.validityDays} jours</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {quote.notes && (
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Notes</h4>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-700">{quote.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'workflow' && (
            <div className="space-y-6">
              <h4 className="font-medium text-slate-900">Workflow d'Approbation</h4>
              
              {quote.status === 'pending-approval' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-yellow-900">Approbation Requise</h5>
                      <p className="text-sm text-yellow-700">Ce devis nécessite une approbation avant envoi</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleApproveQuote}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Approuver
                      </button>
                      <button
                        onClick={handleRejectQuote}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Refuser
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {quote.workflow?.map((step: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
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
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        step.status === 'completed' ? 'bg-green-100 text-green-800' :
                        step.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {step.status === 'completed' ? 'Terminé' :
                         step.status === 'in-progress' ? 'En cours' : 'En attente'}
                      </span>
                      {step.completedDate && (
                        <p className="text-xs text-slate-500 mt-1">{step.completedDate}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'signature' && (
            <div className="space-y-6">
              <h4 className="font-medium text-slate-900">Signature Électronique</h4>
              
              {quote.status === 'signed' ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                    <h5 className="font-medium text-green-900">Devis Signé</h5>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-green-700">Signé par:</span>
                      <p className="text-green-900 font-medium">{quote.signatureData?.signedBy}</p>
                    </div>
                    <div>
                      <span className="text-green-700">Date de signature:</span>
                      <p className="text-green-900">{quote.signatureData?.signedDate}</p>
                    </div>
                    <div>
                      <span className="text-green-700">Adresse IP:</span>
                      <p className="text-green-900">{quote.signatureData?.ipAddress}</p>
                    </div>
                  </div>
                </div>
              ) : quote.status === 'sent' || quote.status === 'viewed' ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Clock className="w-6 h-6 text-blue-600 mr-3" />
                    <h5 className="font-medium text-blue-900">En Attente de Signature</h5>
                  </div>
                  <p className="text-sm text-blue-700">
                    Le devis a été envoyé au client et est en attente de signature électronique.
                  </p>
                  {quote.viewedDate && (
                    <p className="text-sm text-blue-700 mt-2">
                      Consulté le {quote.viewedDate}
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Signature className="w-6 h-6 text-slate-600 mr-3" />
                    <h5 className="font-medium text-slate-900">Signature Non Initialisée</h5>
                  </div>
                  <p className="text-sm text-slate-600">
                    La signature électronique sera disponible une fois le devis envoyé au client.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h4 className="font-medium text-slate-900">Analytics & Insights</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h5 className="font-medium text-slate-900 mb-3">Métriques de Performance</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Probabilité de signature:</span>
                      <span className="font-medium text-blue-600">{quote.insights?.signatureProbability || 0}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Temps moyen de signature:</span>
                      <span className="font-medium text-slate-900">{quote.insights?.averageTimeToSign || 0} jours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Devis similaires:</span>
                      <span className="font-medium text-slate-900">{quote.insights?.similarQuotes || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h5 className="font-medium text-slate-900 mb-3">Recommandations IA</h5>
                  <div className="space-y-2">
                    {quote.insights?.recommendations?.length > 0 ? (
                      quote.insights.recommendations.map((rec: string, index: number) => (
                        <p key={index} className="text-sm text-slate-700">{rec}</p>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">Aucune recommandation disponible</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4">
          <div className="flex justify-between">
            <div className="flex space-x-2">
              <button className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors flex items-center">
                <Download className="w-4 h-4 mr-2" />
                PDF
              </button>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
                <Copy className="w-4 h-4 mr-2" />
                Dupliquer
              </button>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteDetails;