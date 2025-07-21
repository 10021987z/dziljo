// Provider Firebase pour l'application
import React, { createContext, useContext, ReactNode } from 'react';
import { useFirebaseAuth, useFirebaseNotifications } from '../../hooks/useFirebase';

interface FirebaseContextType {
  user: any;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  notifications: any[];
  notificationsLoading: boolean;
  unreadCount: number;
  markNotificationAsRead: (id: string) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

interface FirebaseProviderProps {
  children: ReactNode;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const auth = useFirebaseAuth();
  const notifications = useFirebaseNotifications(auth.user?.uid);

  const value: FirebaseContextType = {
    ...auth,
    notifications: notifications.notifications,
    notificationsLoading: notifications.loading,
    unreadCount: notifications.unreadCount,
    markNotificationAsRead: notifications.markAsRead
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export default FirebaseProvider;