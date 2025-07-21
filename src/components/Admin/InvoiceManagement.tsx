import React, { useState } from 'react';
import { Plus, Edit, Eye, Download, Upload, Calendar, TrendingUp, Users, DollarSign, FileText, Settings as SettingsIcon, CheckCircle } from 'lucide-react';
import Settings from './Settings';

const InvoiceManagement: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  
  // Placeholder component for demonstration
  return (
    <div className="p-6 space-y-6">
      {showSettings ? (
        <Settings module="invoicing" />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Gestion de la Facturation</h2>
              <p className="text-slate-600">Créez, gérez et suivez vos factures et paiements</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowSettings(true)}
                className="bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-slate-700 transition-colors"
              >
                <SettingsIcon className="w-4 h-4 mr-2" />
                Paramètres
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Facture
              </button>
            </div>
          </div>

          {/* Placeholder content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Factures Totales</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">128</p>
                </div>
                <div className="bg-blue-500 p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">En Attente</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">24</p>
                </div>
                <div className="bg-yellow-500 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Payées</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">96</p>
                </div>
                <div className="bg-green-500 p-3 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Montant Total</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">€156,890</p>
                </div>
                <div className="bg-purple-500 p-3 rounded-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Cliquez sur "Paramètres" pour configurer la facturation</h3>
              <p className="text-slate-500 mb-6">Configurez vos préférences de facturation, modèles, et intégrations</p>
              <button 
                onClick={() => setShowSettings(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Configurer les Paramètres
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InvoiceManagement;