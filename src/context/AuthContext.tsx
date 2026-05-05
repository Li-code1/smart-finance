import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';

interface AuthContextType {
  logado: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [logado, setLogado] = useState(false);

  const login = (email: string, pass: string) => {
    if (email && pass) {
      setLogado(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setLogado(false);
  };

  const value = useMemo(() => ({
    logado,
    login,
    logout
  }), [logado]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
};