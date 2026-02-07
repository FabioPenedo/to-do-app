import { useEffect, useState } from 'react';
import { sessionStore, tokenStore } from '../lib/info.store';
import { Session } from '../lib/info.store';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verifica se tem token armazenado ao montar o componente
    const token = tokenStore.get();
    const userSession = sessionStore.get();

    if (token && userSession) {
      setIsAuthenticated(true);
      setSession(userSession);
    } else {
      setIsAuthenticated(false);
      setSession(null);
    }

    setIsLoading(false);
  }, []);

  const logout = () => {
    tokenStore.clear();
    sessionStore.clear();
    setIsAuthenticated(false);
    setSession(null);
  };

  return {
    isAuthenticated,
    session,
    isLoading,
    logout,
  };
}
