import React, { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import HR from './components/HR/HR';
import Commercial from './components/Commercial/Commercial';
import Administration from './components/Admin/Administration';
import FloatingActionButton from './components/Layout/FloatingActionButton';
import FirebaseSync from './components/Firebase/FirebaseSync';

function App() {
  const [activeModule, setActiveModule] = useState('dashboard');

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'rh':
      case 'recruitment':
      case 'employees':
      case 'documents':
        return <HR />;
      case 'commercial':
      case 'leads':
      case 'opportunities':
      case 'calendar':
        return <Commercial />;
      case 'admin':
      case 'contracts':
      case 'invoicing':
      case 'reports':
      case 'admin-users':
      case 'integrations':
        return <Administration />;
      default:
        return (
          <div className="p-6">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Module en Développement
              </h2>
              <p className="text-slate-600">
                Ce module sera bientôt disponible dans dziljo.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeModule={activeModule} />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
        <FloatingActionButton activeModule={activeModule} />
      </div>
      <FirebaseSync />
    </div>
  );
}

export default App;