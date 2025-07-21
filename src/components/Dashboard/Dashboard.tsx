import React, { useState } from 'react';
import { Users, TrendingUp, FileText, DollarSign, Calendar, Clock, Target, Award } from 'lucide-react';
import QuickActionCard from './QuickActionCard';
import QuickActions from '../Layout/QuickActions';

const Dashboard: React.FC = () => {
  const [showQuickActions, setShowQuickActions] = useState(false);

  const stats = [
    { title: 'Employés Actifs', value: '47', change: '+3', icon: Users, color: 'bg-blue-500' },
    { title: 'Opportunités Ouvertes', value: '23', change: '+5', icon: Target, color: 'bg-green-500' },
    { title: 'CA Mensuel', value: '€125,430', change: '+12%', icon: DollarSign, color: 'bg-orange-500' },
    { title: 'Taux de Conversion', value: '68%', change: '+4%', icon: Award, color: 'bg-purple-500' }
  ];

  const recentActivities = [
    { type: 'Recrutement', message: 'Nouveau candidat pour le poste de Développeur', time: '2h' },
    { type: 'Commercial', message: 'Opportunité signée avec TechCorp', time: '4h' },
    { type: 'RH', message: 'Contrat généré pour Marie Dubois', time: '6h' },
    { type: 'Administration', message: 'Facture envoyée à Digital Solutions', time: '1j' }
  ];

  const upcomingEvents = [
    { title: 'Entretien - Développeur Senior', time: '14:30', type: 'RH' },
    { title: 'Présentation client - ABC Corp', time: '16:00', type: 'Commercial' },
    { title: 'Réunion équipe', time: '17:30', type: 'Admin' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Bienvenue sur dziljo</h1>
        <p className="text-blue-100">Votre solution intégrée pour la gestion d'entreprise</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                <div className="flex items-center mt-2">
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <span className="ml-2 text-sm font-medium text-green-600">{stat.change}</span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-slate-600" />
            Activités Récentes
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{activity.message}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      {activity.type}
                    </span>
                    <span className="text-xs text-slate-500 ml-2">Il y a {activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-slate-600" />
            Événements à Venir
          </h3>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="text-center">
                  <div className="text-lg font-bold text-slate-900">{event.time}</div>
                  <div className="text-xs text-slate-500">Aujourd'hui</div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{event.title}</p>
                  <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">
                    {event.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActionCard onOpenQuickActions={() => setShowQuickActions(true)} />

      {/* Quick Actions Modal */}
      <QuickActions 
        isOpen={showQuickActions} 
        onClose={() => setShowQuickActions(false)}
        activeModule="dashboard"
      />
    </div>
  );
};

export default Dashboard;