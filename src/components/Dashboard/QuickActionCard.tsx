import React from 'react';
import { Zap, UserPlus, FileText, DollarSign, Calendar, TrendingUp, Target, Users, Building2, BarChart3, Settings, Phone, Mail, Video, Award, Clock, CheckCircle } from 'lucide-react';

interface QuickActionCardProps {
  onOpenQuickActions: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ onOpenQuickActions }) => {
  const quickActions = [
    { 
      icon: UserPlus, 
      title: 'Ajouter un Employé', 
      color: 'bg-purple-500',
      description: 'Nouveau dossier RH',
      shortcut: 'Ctrl+Shift+E'
    },
    { 
      icon: TrendingUp, 
      title: 'Nouvelle Opportunité', 
      color: 'bg-green-500',
      description: 'Pipeline commercial',
      shortcut: 'Ctrl+Shift+O'
    },
    { 
      icon: FileText, 
      title: 'Générer un Contrat', 
      color: 'bg-blue-500',
      description: 'Contrat client',
      shortcut: 'Ctrl+Shift+C'
    },
    { 
      icon: DollarSign, 
      title: 'Créer une Facture', 
      color: 'bg-orange-500',
      description: 'Facturation',
      shortcut: 'Ctrl+Shift+I'
    },
    { 
      icon: Calendar, 
      title: 'Planifier un RDV', 
      color: 'bg-red-500',
      description: 'Agenda commercial',
      shortcut: 'Ctrl+Shift+M'
    },
    { 
      icon: BarChart3, 
      title: 'Créer un Rapport', 
      color: 'bg-indigo-500',
      description: 'Analytics',
      shortcut: 'Ctrl+Shift+R'
    }
  ];

  const recentActivities = [
    { icon: CheckCircle, text: 'Sophie Martin ajoutée', time: '2h', color: 'text-green-600' },
    { icon: FileText, text: 'Contrat TechCorp signé', time: '4h', color: 'text-blue-600' },
    { icon: Calendar, text: 'RDV planifié avec Digital Innov', time: '1j', color: 'text-purple-600' },
    { icon: Award, text: 'Objectif mensuel atteint', time: '2j', color: 'text-yellow-600' }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center">
          <Zap className="w-5 h-5 mr-2 text-indigo-600" />
          Actions Rapides
        </h3>
        <button
          onClick={onOpenQuickActions}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
        >
          Voir toutes
          <Zap className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {quickActions.map((action, index) => (
          <button 
            key={index} 
            className="flex flex-col items-center p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-all group border border-slate-200 hover:border-slate-300"
            onClick={onOpenQuickActions}
            title={action.shortcut}
          >
            <div className={`w-10 h-10 ${action.color} rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-center">
              <p className="font-medium text-slate-900 text-sm mb-1">{action.title}</p>
              <p className="text-xs text-slate-500">{action.description}</p>
              <p className="text-xs text-blue-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {action.shortcut}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Recent Activities */}
      <div>
        <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          Activités Récentes
        </h4>
        <div className="space-y-2">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors">
              <div className="flex items-center">
                <activity.icon className={`w-4 h-4 mr-3 ${activity.color}`} />
                <span className="text-sm text-slate-700">{activity.text}</span>
              </div>
              <span className="text-xs text-slate-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <button
          onClick={onOpenQuickActions}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center font-medium"
        >
          <Zap className="w-5 h-5 mr-2" />
          Ouvrir le Centre d'Actions (Alt+A)
        </button>
      </div>
    </div>
  );
};

export default QuickActionCard;