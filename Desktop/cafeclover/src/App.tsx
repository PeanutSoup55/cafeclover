import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useCloverAuth } from './hooks/useCloverAuth';
import { LoginButton } from './components/Auth/LoginButton';
import { AuthCallback } from './components/Auth/AuthCallback';
import { Dashboard } from './components/Dashboard/Dashboard';
import './App.css';

function App() {
  const { isAuthenticated, loading, logout } = useCloverAuth();

  if (loading) {
    return <div className="app-loading">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          {isAuthenticated && (
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          )}
        </header>
        
        <main className="app-main">
          <Routes>
            <Route 
              path="/auth/callback" 
              element={<AuthCallback />} 
            />
            <Route 
              path="/" 
              element={
                isAuthenticated ? <Dashboard /> : <LoginButton />
              } 
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;