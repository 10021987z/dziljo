import React from 'react';
import { Users, TrendingUp, Settings, Home, UserPlus, FileText, Calendar, BarChart3, Contact as FileContract, Receipt, ClipboardList, Building2, CreditCard } from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule }) => {
  const modules = [
    { id: 'dashboard', name: 'Tableau de Bord', icon: Home },
    { id: 'pricing', name: 'Tarification', icon: CreditCard },
    { 
      id: 'rh', 
      name: 'Ressources Humaines', 
      icon: Users,
      shortcut: 'Alt+1'
    },
    { 
      id: 'commercial', 
      name: 'Commercial', 
      icon: TrendingUp,
      shortcut: 'Alt+2'
    },
    { 
      id: 'analytical', 
      name: 'Comptabilité Analytique', 
      icon: BarChart3,
      shortcut: 'Alt+3'
    },
    { 
      id: 'admin', 
      name: 'Administration', 
      icon: Settings,
      shortcut: 'Alt+4'
    }
  ];

  // Keyboard shortcuts for module navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && !e.shiftKey && !e.ctrlKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            setActiveModule('rh');
            break;
          case '2':
            e.preventDefault();
            setActiveModule('commercial');
            break;
          case '3':
            e.preventDefault();
            setActiveModule('analytical');
            break;
          case '4':
            e.preventDefault();
            setActiveModule('admin');
            break;
          case '0':
            e.preventDefault();
            setActiveModule('dashboard');
            break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveModule]);

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
        {/* Dashboard */}
        <button
          onClick={() => setActiveModule('dashboard')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
            activeModule === 'dashboard'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
          title="Alt+0"
        >
          <div className="flex items-center">
            <Home className="w-5 h-5 mr-3" />
            Tableau de Bord
          </div>
          <span className="text-xs opacity-50">Alt+0</span>
        </button>

        {modules.map((module) => (
          <div key={module.id}>
            <button
              onClick={() => setActiveModule(module.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                activeModule === module.id || isSubItemActive(module.id)
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              title={module.shortcut}
            >
              <div className="flex items-center">
                <module.icon className="w-5 h-5 mr-3" />
                {module.name}
              </div>
              {module.shortcut && (
                <span className="text-xs opacity-50">{module.shortcut}</span>
              )}
            </button>
          </div>
        ))}
      </nav>

      {/* Keyboard shortcuts help */}
      <div className="mt-8 pt-4 border-t border-slate-700">
        <button
          onClick={() => {
            const event = new KeyboardEvent('keydown', { key: 'F1' });
            window.dispatchEvent(event);
          }}
          className="w-full text-left text-xs text-slate-400 hover:text-slate-300 transition-colors"
        >
          <span className="flex items-center">
            <span className="mr-2">⌨️</span>
            Raccourcis clavier (F1)
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;