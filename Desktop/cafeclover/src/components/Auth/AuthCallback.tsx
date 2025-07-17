import { useEffect } from 'react';
import { useCloverAuth } from '../../hooks/useCloverAuth';

export const AuthCallback = () => {
  const { handleAuthCallback } = useCloverAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      console.error('Auth error:', error);
      // Redirect to main page with error
      window.location.href = '/?error=' + encodeURIComponent(error);
    } else if (code) {
      handleAuthCallback(code).then(() => {
        // Redirect to main page after successful auth
        window.location.href = '/';
      });
    }
  }, [handleAuthCallback]);

  return (
    <div className="auth-callback">
      <h2>Processing authentication...</h2>
      <p>Please wait while we authenticate with Clover.</p>
    </div>
  );
};