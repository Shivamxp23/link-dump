import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import YouTubeThumbnailExtractor from "./components/YouTubeThumbnailExtractor";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'viewer' | 'admin'>('viewer');

  useEffect(() => {
    const authStatus = localStorage.getItem('arte-auth');
    const role = localStorage.getItem('arte-role') as 'viewer' | 'admin';
    if (authStatus === 'true' && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  const handleLogin = (role: 'viewer' | 'admin') => {
    setIsAuthenticated(true);
    setUserRole(role);
    localStorage.setItem('arte-auth', 'true');
    localStorage.setItem('arte-role', role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('viewer');
    localStorage.removeItem('arte-auth');
    localStorage.removeItem('arte-role');
  };

  return (
    <>
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} userRole={userRole} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </>
  );
}

export default App;