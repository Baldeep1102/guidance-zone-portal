import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authApi, type AuthUser } from '@/api/auth';
import { setAccessToken } from '@/api/client';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { name: string; email: string; password: string; phone?: string }) => Promise<string>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await authApi.refresh();
      setAccessToken(data.accessToken);
      setUser(data.user);
    } catch {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  // Try to restore session on mount
  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const { data } = await authApi.login({ email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const signup = async (signupData: { name: string; email: string; password: string; phone?: string }) => {
    const { data } = await authApi.signup(signupData);
    return data.message;
  };

  const googleLogin = async (idToken: string) => {
    const { data } = await authApi.googleLogin(idToken);
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    // Clear refresh cookie by making a request or just let it expire
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        googleLogin,
        logout,
        refreshUser,
        isAdmin: user?.role === 'ADMIN',
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
