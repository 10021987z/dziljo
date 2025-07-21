import React from 'react';
import { Zap, UserPlus, FileText, DollarSign, Calendar, TrendingUp } from 'lucide-react';

interface QuickActionCardProps {
  onOpenQuickActions: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ onOpenQuickActions }) => {
  const quickActions = [
    { icon: UserPlus, title: 'Ajouter un Employé', color: 'bg-blue-500' },
    { icon: TrendingUp, title: 'Nouvelle Opportunité', color: 'bg-green-500' },
    { icon: FileText, title: 'Générer un Contrat', color: 'bg-purple-500' },
    { icon: DollarSign, title: 'Créer une Facture', color: 'bg-orange-500' },
    { icon: Calendar, title: 'Planifier un RDV', color: 'bg-red-500' },
    { icon: Zap, title: 'Plus d\'actions', color: 'bg-indigo-500' }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Zap className="w-5 h-5 mr-2 text-indigo-600" />
        Actions Rapides
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {quickActions.slice(0, 5).map((action, index) => (
          <button 
            key={index} 
            className="flex items-center p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors group"
            onClick={onOpenQuickActions}
          >
            <div className={`w-8 h-8 ${action.color} rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform`}>
              <action.icon className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900 text-sm">{action.title}</p>
            </div>
          </button>
        ))}
        <button 
          className="flex items-center p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors group border border-indigo-200"
          onClick={onOpenQuickActions}
        >
          <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <p className="font-medium text-indigo-900 text-sm">Toutes les actions</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default QuickActionCard;