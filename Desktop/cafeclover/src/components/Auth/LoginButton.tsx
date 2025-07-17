import { useCloverAuth } from '../../hooks/useCloverAuth';

export const LoginButton = () => {
  const { initiateAuth, loading } = useCloverAuth();

  return (
    <div className="login-container">
      <h1>Cafe CMS - Clover Integration</h1>
      <p>Connect your Clover POS system to manage your cafe data</p>
      <button 
        onClick={initiateAuth}
        disabled={loading}
        className="login-button"
      >
        {loading ? 'Loading...' : 'Connect with Clover'}
      </button>
    </div>
  );
};