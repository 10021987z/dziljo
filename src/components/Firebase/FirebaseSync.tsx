// Composant de synchronisation Firebase
import React, { useState, useEffect } from 'react';
import { Cloud, CloudOff, RefreshCw, CheckCircle, AlertCircle, Upload, Download } from 'lucide-react';
import FirebaseService from '../../services/firebaseService';
import { useFirebase } from './FirebaseProvider';

interface SyncStatus {
  isOnline: boolean;
  lastSync: Date | null;
  pendingUploads: number;
  pendingDownloads: number;
  errors: string[];
}

const FirebaseSync: React.FC = () => {
  const { isAuthenticated } = useFirebase();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    lastSync: null,
    pendingUploads: 0,
    pendingDownloads: 0,
    errors: []
  });
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true }));
      if (isAuthenticated) {
        performSync();
      }
    };

    const handleOffline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isAuthenticated]);

  const performSync = async () => {
    if (!isAuthenticated || !syncStatus.isOnline) return;

    setIsSyncing(true);
    try {
      // Simuler la synchronisation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSyncStatus(prev => ({
        ...prev,
        lastSync: new Date(),
        pendingUploads: 0,
        pendingDownloads: 0,
        errors: []
      }));
    } catch (error) {
      setSyncStatus(prev => ({
        ...prev,
        errors: [...prev.errors, error instanceof Error ? error.message : 'Erreur de synchronisation']
      }));
    } finally {
      setIsSyncing(false);
    }
  };

  const clearErrors = () => {
    setSyncStatus(prev => ({ ...prev, errors: [] }));
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-3">
        <div className="flex items-center space-x-3">
          {/* Statut de connexion */}
          <div className="flex items-center space-x-2">
            {syncStatus.isOnline ? (
              <Cloud className="w-5 h-5 text-green-600" />
            ) : (
              <CloudOff className="w-5 h-5 text-red-600" />
            )}
            <span className={`text-sm font-medium ${
              syncStatus.isOnline ? 'text-green-600' : 'text-red-600'
            }`}>
              {syncStatus.isOnline ? 'En ligne' : 'Hors ligne'}
            </span>
          </div>

          {/* Bouton de synchronisation */}
          {syncStatus.isOnline && (
            <button
              onClick={performSync}
              disabled={isSyncing}
              className="p-1 text-slate-400 hover:text-blue-600 transition-colors disabled:opacity-50"
              title="Synchroniser"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
          )}

          {/* Indicateurs de statut */}
          <div className="flex items-center space-x-1">
            {syncStatus.pendingUploads > 0 && (
              <div className="flex items-center text-orange-600">
                <Upload className="w-3 h-3 mr-1" />
                <span className="text-xs">{syncStatus.pendingUploads}</span>
              </div>
            )}
            
            {syncStatus.pendingDownloads > 0 && (
              <div className="flex items-center text-blue-600">
                <Download className="w-3 h-3 mr-1" />
                <span className="text-xs">{syncStatus.pendingDownloads}</span>
              </div>
            )}

            {syncStatus.errors.length > 0 && (
              <button
                onClick={clearErrors}
                className="flex items-center text-red-600 hover:text-red-700"
                title="Erreurs de synchronisation"
              >
                <AlertCircle className="w-3 h-3 mr-1" />
                <span className="text-xs">{syncStatus.errors.length}</span>
              </button>
            )}

            {syncStatus.lastSync && syncStatus.errors.length === 0 && (
              <CheckCircle className="w-3 h-3 text-green-600" title="Synchronisé" />
            )}
          </div>
        </div>

        {/* Dernière synchronisation */}
        {syncStatus.lastSync && (
          <div className="mt-2 text-xs text-slate-500">
            Dernière sync: {syncStatus.lastSync.toLocaleTimeString()}
          </div>
        )}

        {/* Erreurs */}
        {syncStatus.errors.length > 0 && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
            <div className="text-xs text-red-800">
              {syncStatus.errors.slice(0, 2).map((error, index) => (
                <div key={index}>{error}</div>
              ))}
              {syncStatus.errors.length > 2 && (
                <div>... et {syncStatus.errors.length - 2} autres erreurs</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FirebaseSync;