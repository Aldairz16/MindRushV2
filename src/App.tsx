import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Navigation } from './components/Navigation';
import { SystemDiagnostic } from './components/SystemDiagnostic';

const AppContent: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);

  // Check if we're on diagnostic route
  if (window.location.hash === '#diagnostic') {
    return <SystemDiagnostic />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Cargando MindRush...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {!user ? (
        <Login />
      ) : (
        <div className="flex flex-col lg:flex-row h-screen">
          <Navigation 
            user={user} 
            onLogout={logout}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
          <main className="flex-1 overflow-y-auto min-h-0">
            <Dashboard user={user} activeSection={activeSection} onSectionChange={setActiveSection} />
          </main>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;