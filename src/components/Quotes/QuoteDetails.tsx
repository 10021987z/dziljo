import React from 'react';
import { X, Edit, Send, Download, Eye, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Quote } from '../../hooks/useQuotes';

interface QuoteDetailsProps {
  quote: Quote;
  onClose: () => void;
  onUpdate: (id: number, updates: Partial<Quote>) => void;
}

const QuoteDetails: React.FC<QuoteDetailsProps> = ({ quote, onClose, onUpdate }) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed': return <CheckCircle className="w-4 h-4" />;
      case 'expired': return <AlertTriangle className="w-4 h-4" />;
      case 'sent': return <Send className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleApprove = () => {
    onUpdate(quote.id, { status: 'approved' });
  };

  const handleSend = () => {
    onUpdate(quote.id, { status: 'sent' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{quote.title}</h1>
              <p className="text-white/80">Devis #{quote.number}</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(quote.status)}`}>
                {getStatusIcon(quote.status)}
                <span className="ml-1">{quote.status}</span>
              </span>
              <button
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* Client Info */}
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-slate-900 mb-3">Informations Client</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Entreprise:</span>
                    <p className="text-slate-900 font-medium">{quote.client.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Email:</span>
                    <p className="text-slate-900">{quote.client.email}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Contact:</span>
                    <p className="text-slate-900">{quote.contact.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Email contact:</span>
                    <p className="text-slate-900">{quote.contact.email}</p>
                  </div>
                </div>
              </div>

              {/* Quote Items */}
              <div>
                <h3 className="font-medium text-slate-900 mb-3">Articles</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left py-2 px-3 text-sm font-medium text-slate-700">Description</th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-slate-700">Qté</th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-slate-700">Prix unitaire</th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-slate-700">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quote.items.map((item) => (
                        <tr key={item.id} className="border-b border-slate-200">
                          <td className="py-2 px-3 text-sm">{item.description}</td>
                          <td className="py-2 px-3 text-sm">{item.quantity}</td>
                          <td className="py-2 px-3 text-sm">€{item.unitPrice.toFixed(2)}</td>
                          <td className="py-2 px-3 text-sm font-medium">€{item.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="mt-4 bg-slate-100 rounded-lg p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Sous-total:</span>
                      <span>€{quote.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TVA:</span>
                      <span>€{quote.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t border-slate-300 pt-2">
                      <span>Total TTC:</span>
                      <span>€{quote.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Quote Info */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-medium text-slate-900 mb-3">Informations</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-slate-600">Créé le:</span>
                    <p className="text-slate-900">{quote.createdDate}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Valide jusqu'au:</span>
                    <p className="text-slate-900">{quote.validUntil}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Assigné à:</span>
                    <p className="text-slate-900">{quote.assignedTo}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Marge:</span>
                    <p className="text-slate-900">{quote.marginPercent}%</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                {quote.status === 'draft' && (
                  <button
                    onClick={handleApprove}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approuver
                  </button>
                )}
                
                {quote.status === 'approved' && (
                  <button
                    onClick={handleSend}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer
                  </button>
                )}

                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger PDF
                </button>

                <button className="w-full bg-slate-600 text-white py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center">
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </button>
              </div>

              {/* Notes */}
              {quote.notes && (
                <div>
                  <h3 className="font-medium text-slate-900 mb-2">Notes</h3>
                  <div className="bg-slate-50 rounded p-3">
                    <p className="text-sm text-slate-700">{quote.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteDetails;