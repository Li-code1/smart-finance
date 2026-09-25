import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface AuthContextType {
  user: User | null;
  logado: boolean;
  carregando: boolean;
  login: (email: string, senha: string) => Promise<string | null>;
  cadastrar: (email: string, senha: string) => Promise<string | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Recupera a sessão já existente (usuário continua logado ao recarregar a página)
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCarregando(false);
    });

    // Escuta login/logout/expiração de token em tempo real
    const { data: listener } = supabase.auth.onAuthStateChange((_event, novaSessao) => {
      setSession(novaSessao);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const login = async (email: string, senha: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    return error ? traduzirErro(error.message) : null;
  };

  const cadastrar = async (email: string, senha: string) => {
    const { error } = await supabase.auth.signUp({ email, password: senha });
    return error ? traduzirErro(error.message) : null;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const value = useMemo(() => ({
    user: session?.user ?? null,
    logado: !!session,
    carregando,
    login,
    cadastrar,
    logout,
  }), [session, carregando]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Mensagens mais amigáveis para os erros mais comuns do Supabase Auth
function traduzirErro(mensagem: string): string {
  const mapa: Record<string, string> = {
    'Invalid login credentials': 'E-mail ou senha inválidos.',
    'User already registered': 'Este e-mail já possui cadastro. Tente fazer login.',
    'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres.',
    'Email not confirmed': 'Confirme seu e-mail antes de entrar (verifique sua caixa de entrada).',
  };
  return mapa[mensagem] ?? mensagem;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
};
