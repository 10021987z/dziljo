import React from 'react';
import { Users, TrendingUp, Settings, Home, UserPlus, FileText, Calendar, BarChart3, Contact as FileContract, Receipt, ClipboardList, Building2 } from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule }) => {
  const modules = [
    { id: 'dashboard', name: 'Tableau de Bord', icon: Home },
    { 
      id: 'rh', 
      name: 'Ressources Humaines', 
      icon: Users,
      subItems: [
        { id: 'recruitment', name: 'Recrutement', icon: UserPlus },
        { id: 'employees', name: 'Dossiers Personnel', icon: FileText },
        { id: 'documents', name: 'Documents RH', icon: FileContract }
      ]
    },
    { 
      id: 'commercial', 
      name: 'Commercial', 
      icon: TrendingUp,
      subItems: [
        { id: 'leads', name: 'Prospection', icon: Building2 },
        { id: 'opportunities', name: 'Opportunités', icon: BarChart3 },
        { id: 'calendar', name: 'Agenda', icon: Calendar }
      ]
    },
    { 
      id: 'analytical', 
      name: 'Comptabilité Analytique', 
      icon: BarChart3
    },
    { 
      id: 'admin', 
      name: 'Administration', 
      icon: Settings,
      subItems: [
        { id: 'contracts', name: 'Contrats', icon: FileContract },
        { id: 'invoicing', name: 'Facturation', icon: Receipt },
        { id: 'reports', name: 'Comptes Rendus', icon: ClipboardList }
      ]
    }
  ];

  const isSubItemActive = (moduleId: string) => {
    return modules.some(module => 
      module.subItems?.some(subItem => subItem.id === activeModule) && 
      module.id === moduleId
    );
  };

  return (
    <div className="bg-slate-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-400">dziljo</h1>
        <p className="text-sm text-slate-400">Gestion PME Intégrée</p>
      </div>
      
      <nav className="space-y-2">
        {modules.map((module) => (
          <div key={module.id}>
            <button
              onClick={() => setActiveModule(module.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                activeModule === module.id || isSubItemActive(module.id)
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <module.icon className="w-5 h-5 mr-3" />
              {module.name}
            </button>
            
            {module.subItems && (activeModule === module.id || isSubItemActive(module.id)) && (
              <div className="ml-4 mt-2 space-y-1">
                {module.subItems.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => setActiveModule(subItem.id)}
                    className={`w-full flex items-center px-4 py-2 text-sm rounded transition-colors duration-200 ${
                      activeModule === subItem.id
                        ? 'text-blue-400 bg-slate-800'
                        : 'text-slate-400 hover:text-blue-400 hover:bg-slate-800'
                    }`}
                  >
                    <subItem.icon className="w-4 h-4 mr-3" />
                    {subItem.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;