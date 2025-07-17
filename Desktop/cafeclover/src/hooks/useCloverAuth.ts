import { useState, useEffect } from 'react';
import { CLOVER_CONFIG } from '../config/clover';

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  merchantId: string | null;
  loading: boolean;
  error: string | null;
}

export const useCloverAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    accessToken: null,
    merchantId: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    // Check for existing auth token in localStorage
    const token = localStorage.getItem('clover_access_token');
    const merchantId = localStorage.getItem('clover_merchant_id');
    
    if (token && merchantId) {
      setAuthState({
        isAuthenticated: true,
        accessToken: token,
        merchantId,
        loading: false,
        error: null
      });
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const initiateAuth = () => {
    const authUrl = `${CLOVER_CONFIG.API_BASE_URL}/oauth/authorize?` +
      `client_id=${CLOVER_CONFIG.APP_ID}&` +
      `redirect_uri=${encodeURIComponent(CLOVER_CONFIG.REDIRECT_URI)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(CLOVER_CONFIG.SCOPES)}`;
    
    window.location.href = authUrl;
  };

  const handleAuthCallback = async (code: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Exchange code for access token
      const response = await fetch(`${CLOVER_CONFIG.API_BASE_URL}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: CLOVER_CONFIG.APP_ID,
          client_secret: CLOVER_CONFIG.APP_SECRET,
          code,
          grant_type: 'authorization_code',
          redirect_uri: CLOVER_CONFIG.REDIRECT_URI
        })
      });

      const data = await response.json();
      
      if (response.ok && data.access_token) {
        localStorage.setItem('clover_access_token', data.access_token);
        localStorage.setItem('clover_merchant_id', data.merchant_id);
        
        setAuthState({
          isAuthenticated: true,
          accessToken: data.access_token,
          merchantId: data.merchant_id,
          loading: false,
          error: null
        });
      } else {
        throw new Error(data.error_description || 'Authentication failed');
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  };

  const logout = () => {
    localStorage.removeItem('clover_access_token');
    localStorage.removeItem('clover_merchant_id');
    setAuthState({
      isAuthenticated: false,
      accessToken: null,
      merchantId: null,
      loading: false,
      error: null
    });
  };

  return {
    ...authState,
    initiateAuth,
    handleAuthCallback,
    logout
  };
};